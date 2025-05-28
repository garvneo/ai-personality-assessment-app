from . import db
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Candidate(db.Model):
    """
    Represents a candidate taking the personality assessment.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    session_id = db.Column(db.String(256), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    responses = db.relationship('Response', backref='candidate', lazy=True)

    def __init__(self, name, session_id):
        self.name = name
        self.session_id = session_id
        logger.info(f"Created Candidate: name={name}, session_id={session_id}")

class Response(db.Model):
    """
    Stores a candidate's response to a question.
    """
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'), nullable=False)
    question = db.Column(db.Text)
    answer = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, candidate_id, question, answer):
        self.candidate_id = candidate_id
        self.question = question
        self.answer = answer
        logger.info(f"Response created for candidate_id={candidate_id}")

class TraitScore(db.Model):
    """
    Stores the calculated trait score for a candidate.
    """
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'), nullable=False)
    trait = db.Column(db.String(50))
    score = db.Column(db.Float)

    def __init__(self, candidate_id, trait, score):
        self.candidate_id = candidate_id
        self.trait = trait
        self.score = score
        logger.info(f"TraitScore created: candidate_id={candidate_id}, trait={trait}, score={score}")
