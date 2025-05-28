import json
import logging
from .openrouter_client import query_openrouter

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def analyze_response(answer):
    """
    Analyze a candidate's answer using an LLM to estimate Big Five and MBTI scores.

    Args:
        answer (str): The candidate's answer to analyze.

    Returns:
        dict: Parsed analysis with Big Five and MBTI scores, or error message.
    """
    # Construct the prompt for the LLM
    prompt = (
        "You are an expert personality assessor based on the Big Five and MBTI models. "
        "Given the following candidate answer, analyze it carefully and provide ONLY a strict JSON object "
        "with the following structure:\n\n"
        "{\n"
        "  \"BigFive\": {\n"
        "    \"Openness\": <number between 0-100>,\n"
        "    \"Conscientiousness\": <number between 0-100>,\n"
        "    \"Extraversion\": <number between 0-100>,\n"
        "    \"Agreeableness\": <number between 0-100>,\n"
        "    \"Neuroticism\": <number between 0-100>\n"
        "  },\n"
        "  \"MBTI\": {\n"
        "    \"Introversion\": <number between 0-100>,\n"
        "    \"Extraversion\": <number between 0-100>,\n"
        "    \"Sensing\": <number between 0-100>,\n"
        "    \"Intuition\": <number between 0-100>,\n"
        "    \"Thinking\": <number between 0-100>,\n"
        "    \"Feeling\": <number between 0-100>,\n"
        "    \"Judging\": <number between 0-100>,\n"
        "    \"Perceiving\": <number between 0-100>\n"
        "  }\n"
        "}\n\n"
        "IMPORTANT RULES:\n"
        "- Respond with only valid JSON, no explanations, no markdown, no comments.\n"
        "- Ensure all keys are present, even if you estimate or default.\n"
        "- If uncertain, provide your best estimate (no nulls).\n\n"
        "Candidate Answer:\n"
        f"\"{answer}\""
    )

    logger.info("Sending prompt to LLM for analysis.")
    try:
        # Query the LLM with the constructed prompt
        result = await query_openrouter(prompt)
        logger.debug("LLM Raw Response: %s", result)
    except Exception as e:
        logger.error("Error querying LLM: %s", e)
        return {"error": "Failed to query LLM"}

    # Attempt to parse the LLM's response as JSON
    try:
        analysis = json.loads(result)
        logger.info("Successfully parsed LLM response.")
        return analysis
    except json.JSONDecodeError as e:
        logger.error("Failed to parse LLM response: %s", e)
        return {"error": "Failed to parse LLM response"}
