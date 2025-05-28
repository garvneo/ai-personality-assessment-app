import logging
from flask import Blueprint, request, jsonify, send_file
from . import db, redis_client
from .models import Candidate, Response, TraitScore
from .schemas import CandidateSchema, ResponseSchema, TraitScoreSchema
from .personality_engine import analyze_response
import uuid
import asyncio
from .openrouter_client import query_openrouter
from .utils import *
from flask_jwt_extended import jwt_required, get_jwt
from .utils import generate_feedback_pdf

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

main = Blueprint('main', __name__)

@main.route("/start", methods=["POST"])
def start_assessment():
    """
    Starts a new assessment session for a candidate.
    """
    data = request.json
    session_id = str(uuid.uuid4())
    candidate = Candidate(name=data["name"], session_id=session_id)
    db.session.add(candidate)
    db.session.commit()
    redis_client.set(session_id, candidate.id)
    logger.info(f"Started assessment for candidate '{data['name']}' with session_id '{session_id}'")
    return jsonify({"session_id": session_id})

@main.route("/submit", methods=["POST"])
def submit_response():
    """
    Submits a candidate's response and analyzes it for personality traits.
    """
    data = request.json
    session_id = data["session_id"]
    question = data["question"]
    answer = data["answer"]
    candidate_id = redis_client.get(session_id)

    if not candidate_id:
        logger.warning(f"Invalid session_id '{session_id}' in submit_response")
        return jsonify({"error": "Invalid session"}), 404

    response = Response(
        candidate_id=int(candidate_id),
        question=question,
        answer=answer
    )
    db.session.add(response)
    db.session.commit()
    logger.info(f"Stored response for candidate_id '{candidate_id}'")

    # Analyze response asynchronously
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    analysis = loop.run_until_complete(analyze_response(answer))

    if "error" not in analysis:
        for trait, score in analysis.get("BigFive", {}).items():
            ts = TraitScore(candidate_id=int(candidate_id), trait=trait, score=score)
            db.session.add(ts)
        db.session.commit()
        logger.info(f"Stored trait scores for candidate_id '{candidate_id}'")
    else:
        logger.error(f"Analysis error: {analysis['error']}")

    return jsonify({"analysis": analysis})

@main.route("/profile/<session_id>", methods=["GET"])
def get_profile(session_id):
    """
    Retrieves the personality profile for a candidate.
    """
    candidate_id = redis_client.get(session_id)
    if not candidate_id:
        logger.warning(f"Invalid session_id '{session_id}' in get_profile")
        return jsonify({"error": "Invalid session"}), 404

    scores = TraitScore.query.filter_by(candidate_id=int(candidate_id)).all()
    schema = TraitScoreSchema(many=True)
    logger.info(f"Fetched profile for candidate_id '{candidate_id}'")
    return jsonify(schema.dump(scores))

@main.route("/generate-question", methods=["POST"])
def generate_question():
    """
    Generates the next behavioral question for a candidate.
    """
    data = request.json
    session_id = data["session_id"]
    candidate_id = redis_client.get(session_id)

    if not candidate_id:
        logger.warning(f"Invalid session_id '{session_id}' in generate_question")
        return jsonify({"error": "Invalid session"}), 404

    past_responses = Response.query.filter_by(candidate_id=int(candidate_id)).all()
    context = " | ".join([r.answer for r in past_responses])

    prompt = (
        f"Given the candidate's past responses: '{context}', "
        f"generate the next best behavioral question to assess traits like leadership, teamwork, or conflict resolution. "
        f"Respond ONLY with the question text, no explanations."
    )

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    next_question = loop.run_until_complete(query_openrouter(prompt))

    logger.info(f"Generated question for candidate_id '{candidate_id}'")
    return jsonify({"next_question": next_question.strip()})

@main.route("/recruiter/candidates", methods=["GET"])
@jwt_required()
def list_candidates():
    """
    Lists all candidates for recruiters.
    """
    claims = get_jwt()
    if claims.get("role") != "recruiter":
        logger.warning("Unauthorized access attempt to list_candidates")
        return jsonify({"error": "Unauthorized"}), 403

    candidates = Candidate.query.all()
    schema = CandidateSchema(many=True)
    logger.info("Recruiter fetched candidate list")
    return jsonify(schema.dump(candidates))

@main.route("/recruiter/compare", methods=["POST"])
def compare_candidates():
    """
    Compares trait scores for a list of candidate IDs.
    """
    data = request.json
    candidate_ids = data["candidate_ids"]  # list of IDs

    comparison = {}
    for cid in candidate_ids:
        scores = TraitScore.query.filter_by(candidate_id=cid).all()
        score_dict = {s.trait: s.score for s in scores}
        comparison[cid] = score_dict

    logger.info(f"Compared candidates: {candidate_ids}")
    return jsonify(comparison)

@main.route("/recruiter/trends", methods=["GET"])
def trends():
    """
    Shows average trait scores across all candidates.
    """
    traits = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"]
    trends = {}

    for trait in traits:
        avg = db.session.query(db.func.avg(TraitScore.score)) \
            .filter(TraitScore.trait == trait).scalar()
        trends[trait] = round(avg, 2) if avg else None

    logger.info("Fetched trait trends")
    return jsonify(trends)

@main.route("/candidate/feedback/<session_id>", methods=["GET"])
@jwt_required()
def candidate_feedback(session_id):
    """
    Generates feedback summary for a candidate.
    """
    claims = get_jwt()
    if claims.get("role") != "candidate":
        logger.warning("Unauthorized access attempt to candidate_feedback")
        return jsonify({"error": "Unauthorized"}), 403    
    candidate_id = redis_client.get(session_id)
    if not candidate_id:
        logger.warning(f"Invalid session_id '{session_id}' in candidate_feedback")
        return jsonify({"error": "Invalid session"}), 404

    scores = TraitScore.query.filter_by(candidate_id=int(candidate_id)).all()
    summary_input = {s.trait: s.score for s in scores}

    prompt = (
        f"Based on the following personality trait scores: {summary_input}, "
        f"generate a short natural-language summary of the candidate's strengths, weaknesses, and career fit. "
        f"Respond in 4-5 sentences."
    )

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    feedback = loop.run_until_complete(query_openrouter(prompt))

    logger.info(f"Generated feedback for candidate_id '{candidate_id}'")
    return jsonify({
        "feedback_summary": feedback.strip(),
        "scores": summary_input
    })

@main.route("/candidate/feedback-pdf/<session_id>", methods=["GET"])
def download_feedback_pdf(session_id):
    """
    Generates and downloads a PDF feedback report for a candidate.
    """
    candidate_id = redis_client.get(session_id)
    if not candidate_id:
        logger.warning(f"Invalid session_id '{session_id}' in download_feedback_pdf")
        return jsonify({"error": "Invalid session"}), 404

    candidate = Candidate.query.get(int(candidate_id))
    scores = TraitScore.query.filter_by(candidate_id=int(candidate_id)).all()
    score_dict = {s.trait: s.score for s in scores}

    prompt = (
        f"Based on the following personality trait scores: {score_dict}, "
        f"generate a short natural-language summary of the candidate's strengths, weaknesses, and career fit. "
        f"Respond in 4-5 sentences."
    )

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    feedback = loop.run_until_complete(query_openrouter(prompt))

    pdf_buffer = generate_feedback_pdf(candidate.name, feedback.strip(), score_dict)

    logger.info(f"Generated PDF feedback for candidate_id '{candidate_id}'")
    return send_file(pdf_buffer, as_attachment=True, download_name="feedback_report.pdf", mimetype='application/pdf')

@main.route("/login", methods=["POST"])
def login():
    """
    Authenticates a user and returns a JWT token.
    """
    data = request.json
    username = data["username"]
    password = data["password"]
    role = data["role"]  # 'recruiter' or 'candidate'

    # NOTE: Replace this with real DB check!
    if username == "recruiter" and password == "recruiterpass" and role == "recruiter":
        token = generate_token(identity=username, role=role)
    elif username == "candidate" and password == "candidatepass" and role == "candidate":
        token = generate_token(identity=username, role=role)
    else:
        logger.warning(f"Failed login attempt for username '{username}' and role '{role}'")
        return jsonify({"error": "Invalid credentials"}), 401

    logger.info(f"User '{username}' logged in as '{role}'")
    return jsonify({"access_token": token})
