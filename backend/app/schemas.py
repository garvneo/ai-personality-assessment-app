import logging
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from .models import Candidate, Response, TraitScore

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CandidateSchema(SQLAlchemyAutoSchema):
    """
    Marshmallow schema for serializing and deserializing Candidate model instances.
    """
    class Meta:
        model = Candidate
        load_instance = True

    def __init__(self, *args, **kwargs):
        logger.info("Initializing CandidateSchema")
        super().__init__(*args, **kwargs)

class ResponseSchema(SQLAlchemyAutoSchema):
    """
    Marshmallow schema for serializing and deserializing Response model instances.
    """
    class Meta:
        model = Response
        load_instance = True

    def __init__(self, *args, **kwargs):
        logger.info("Initializing ResponseSchema")
        super().__init__(*args, **kwargs)

class TraitScoreSchema(SQLAlchemyAutoSchema):
    """
    Marshmallow schema for serializing and deserializing TraitScore model instances.
    """
    class Meta:
        model = TraitScore
        load_instance = True

    def __init__(self, *args, **kwargs):
        logger.info("Initializing TraitScoreSchema")
        super().__init__(*args, **kwargs)
