import httpx
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the OpenRouter API key from environment variables
API_KEY = os.getenv("OPENROUTER_API_KEY")

async def query_openrouter(prompt):
    """
    Sends a prompt to the OpenRouter API and returns the response content.

    Args:
        prompt (str): The user's prompt to send to the API.

    Returns:
        str: The content of the response from the API.
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-4",
        "messages": [
            {"role": "system", "content": "You are a psychologist analyzing personality."},
            {"role": "user", "content": prompt}
        ]
    }

    logger.info("Sending request to OpenRouter API with prompt: %s", prompt)

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=payload,
                headers=headers
            )
            response.raise_for_status()
            logger.info("Received successful response from OpenRouter API.")
            return response.json()["choices"][0]["message"]["content"]
        except httpx.HTTPStatusError as e:
            logger.error("HTTP error occurred: %s", e)
            raise
        except Exception as e:
            logger.error("An error occurred: %s", e)
            raise
