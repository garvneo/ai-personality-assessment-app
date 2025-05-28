import logging
from reportlab.pdfgen import canvas
import io
from flask_jwt_extended import create_access_token
from datetime import timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_feedback_pdf(candidate_name, feedback_summary, scores):
    """
    Generates a PDF feedback report for a candidate.

    Args:
        candidate_name (str): Name of the candidate.
        feedback_summary (str): Summary of the feedback.
        scores (dict): Dictionary of trait scores.

    Returns:
        BytesIO: Buffer containing the PDF data.
    """
    logger.info("Generating feedback PDF for candidate: %s", candidate_name)
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)
    p.setFont("Helvetica", 12)

    # Write the report title and summary
    p.drawString(100, 800, f"Candidate Feedback Report: {candidate_name}")
    p.drawString(100, 780, f"Summary: {feedback_summary}")

    # Write each trait and score
    y = 760
    for trait, score in scores.items():
        p.drawString(100, y, f"{trait}: {score}")
        y -= 20

    p.showPage()
    p.save()
    buffer.seek(0)
    logger.info("PDF generation complete for candidate: %s", candidate_name)
    return buffer

def generate_token(identity, role):
    """
    Generates a JWT access token with a specified identity and role.

    Args:
        identity (str): The identity of the user.
        role (str): The role to include in the token claims.

    Returns:
        str: The generated JWT access token.
    """
    logger.info("Generating JWT token for identity: %s with role: %s", identity, role)
    expires = timedelta(days=1)
    additional_claims = {"role": role}
    token = create_access_token(identity=identity, additional_claims=additional_claims, expires_delta=expires)
    logger.info("JWT token generated for identity: %s", identity)
    return token
