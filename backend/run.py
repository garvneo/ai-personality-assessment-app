import logging
from app import create_app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s %(message)s'
)
logger = logging.getLogger(__name__)

# Create the Flask app using the factory pattern
app = create_app()

if __name__ == '__main__':
    logger.info("Starting the Flask application...")
    # Set debug=True only for development
    app.run(debug=True)
