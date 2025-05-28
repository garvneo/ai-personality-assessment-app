import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from redis import Redis

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize extensions (without app context)
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
redis_client = Redis.from_url("redis://localhost:6379/0")
ma = Marshmallow()

def create_app():
    """
    Application factory function.
    Creates and configures the Flask app instance.
    """
    from .config import Config
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Flask extensions with the app
    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)  # Enable database migrations

    # Enable Cross-Origin Resource Sharing
    CORS(app)

    # Register blueprints
    from .routes import main
    app.register_blueprint(main)

    logger.info("Flask app created and configured successfully.")

    return app
