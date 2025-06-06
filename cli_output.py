import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('api')
genai.configure(api_key = api_key)

# Define Gemini model
model = genai.GenerativeModel("gemini-2.0-flash")

# Optional templates by model type
TEMPLATES = {
    "text": "Elaborate the prompt for a text generation model with full context, structure, and desired tone. Always be specific and avoid ambiguity.",
    "image": "Expand the prompt with rich visual cues, including style, environment, lighting, and perspective. Always be specific and avoid ambiguity.",
    "video": "Enhance the prompt for a video generation AI with scene flow, camera angles, emotional tone, and pacing. Always be specific and avoid ambiguity.",
    "code": "Turn this into a complete coding prompt with language, function, input/output format, constraints, and examples. Always be specific and avoid ambiguity."
}

def enhance_prompt(user_prompt, target_model="text"):
    system_instruction = (
        f"You are a world-class AI prompt engineer. "
        f"Your task is to take vague user prompts and rewrite them in detailed, structured form, suitable for {target_model}-based generation.\n\n"
        f"User Prompt: {user_prompt}\n\n"
        f"{TEMPLATES.get(target_model, '')}\n"
        f"Enhanced Prompt:"
    )
    
    response = model.generate_content(system_instruction)
    return response.text

# Example CLI use
if __name__ == "__main__":
    raw_prompt = input("Enter your prompt: ")
    model_type = input("Target model (text/image/video/code): ").lower()
    improved = enhance_prompt(raw_prompt, model_type)
    print("\nStructured Prompt:\n", improved)
