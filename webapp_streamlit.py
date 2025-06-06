import os
import streamlit as st
import streamlit.components.v1 as components
from dotenv import load_dotenv
import google.generativeai as genai

from ui import (
    setup_page,
    render_header,
    render_input_section,
    render_output,
    render_footer,
)

# --- Load API Key ---
load_dotenv()
api_key = os.getenv("api")
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.0-flash")

# --- Prompt Templates ---
TEMPLATES = {
    "text": "Elaborate the prompt for a text generation model with full context, structure, and desired tone. Always be specific and avoid ambiguity.",
    "image": "Expand the prompt with rich visual cues, including style, environment, lighting, and perspective. Always be specific and avoid ambiguity.",
    "video": "Enhance the prompt for a video generation AI with scene flow, camera angles, emotional tone, and pacing. Always be specific and avoid ambiguity.",
    "code": "Turn this into a complete coding prompt with language, function, input/output format, constraints, and examples. Always be specific and avoid ambiguity.",
}

# --- Prompt Enhancement ---
def enhance_prompt(user_prompt, target_model="text"):
    instruction = (
        f"You are a world-class AI prompt engineer. "
        f"Your task is to take vague user prompts and rewrite them in detailed, structured form, suitable for {target_model}-based generation.\n\n"
        f"User Prompt: {user_prompt}\n\n"
        f"{TEMPLATES.get(target_model, '')}\n"
        f"Enhanced Prompt:"
    )
    response = model.generate_content(instruction)
    return response.text.strip()

# --- Main App ---
def main():
    setup_page()
    render_header()
    user_input, target_type = render_input_section()

    # Load last state
    last_input = st.session_state.get("last_input", "")
    last_target = st.session_state.get("last_target", "text")

    # Retry button
    if "retry_trigger" in st.session_state:
        st.session_state["last_input"] = last_input
        st.session_state["last_target"] = last_target
        improved = enhance_prompt(last_input, last_target)
        st.session_state["last_output"] = improved
        render_output(improved)
        del st.session_state["retry_trigger"]
        return

    # Dislike feedback
    if "dislike_trigger" in st.session_state:
        feedback = st.session_state["dislike_trigger"]
        st.info(f"📩 Feedback received: {feedback}")
        updated_input = f"{last_input}\n\nUser feedback: {feedback}"
        improved = enhance_prompt(updated_input, last_target)
        st.session_state["last_output"] = improved
        render_output(improved)
        del st.session_state["dislike_trigger"]
        return

    # Main Enhance Button
    if st.button("🔁 Enhance Prompt"):
        if not user_input.strip():
            st.warning("Please enter a prompt.")
            return

        with st.spinner("Thinking like a pro..."):
            improved = enhance_prompt(user_input, target_type.lower())
        st.session_state["last_input"] = user_input
        st.session_state["last_target"] = target_type.lower()
        st.session_state["last_output"] = improved
        render_output(improved)

    render_footer()

    # JS Listener for postMessage
    components.html(
        """
        <script>
        window.addEventListener('message', (event) => {
            if (event.data.type === 'retry') {
                const streamlitFrame = window.parent.document.querySelector('iframe');
                streamlitFrame.contentWindow.postMessage({ type: 'streamlit:setComponentValue', value: 'retry_trigger' }, '*');
                window.parent.postMessage({ isStreamlitMessage: true, type: 'streamlit:setComponentValue', key: 'retry_trigger', value: true }, '*');
            }
            if (event.data.type === 'dislike') {
                const feedback = event.data.feedback || "No feedback provided.";
                window.parent.postMessage({ isStreamlitMessage: true, type: 'streamlit:setComponentValue', key: 'dislike_trigger', value: feedback }, '*');
            }
        });
        </script>
        """,
        height=0,
    )

if __name__ == "__main__":
    main()
