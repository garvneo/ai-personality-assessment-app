import os
import logging
from dotenv import load_dotenv

# Set up basic logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from a .env file
load_dotenv()
logger.info(".env file loaded successfully.")

class Config:
    # API key for OpenRouter service
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    if OPENROUTER_API_KEY:
        logger.info("OPENROUTER_API_KEY loaded from environment.")
    else:
        logger.warning("OPENROUTER_API_KEY not found in environment.")

    # Database connection URI for SQLAlchemy
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/personality_db"
    )
    logger.info(f"SQLALCHEMY_DATABASE_URI set to: {SQLALCHEMY_DATABASE_URI}")

    # Disable SQLAlchemy event system to save resources
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Redis connection URL
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    logger.info(f"REDIS_URL set to: {REDIS_URL}")

    # Secret key for session management and security
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
    if SECRET_KEY != "supersecret":
        logger.info("SECRET_KEY loaded from environment.")
    else:
        logger.warning("Using default SECRET_KEY. Set SECRET_KEY in environment for better security.")
