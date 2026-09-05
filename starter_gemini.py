"""
PromptWars - Gemini API Starter Client (Python)
Usage:
    pip install google-genai
    python starter_gemini.py
"""
import os
from google import genai
from google.genai import types

def get_ai_response(prompt: str, system_instruction: str = "You are an expert AI assistant for PromptWars.") -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Please set the GEMINI_API_KEY environment variable.")
        
    client = genai.Client(api_key=api_key)
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7,
        )
    )
    return response.text

if __name__ == "__main__":
    test_prompt = "Give a 1-line winning pitch for a PromptWars hackathon AI solution."
    print("Testing Gemini Client...")
    try:
        res = get_ai_response(test_prompt)
        print("Response:\n", res)
    except Exception as e:
        print(f"Error: {e}")
