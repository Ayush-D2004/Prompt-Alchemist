import streamlit as st
from streamlit_lottie import st_lottie
import requests
import html

# --- Load Lottie ---
def load_lottieurl(url):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

# --- Setup Page ---
def setup_page():
    st.set_page_config(page_title="AI Prompt Enhancer", layout="centered", page_icon="✨")
    
    custom_css = """
    <style>
    body {
        background: linear-gradient(135deg, #4b6cb7, #182848);
        color: white;
    }
    section.main > div {padding-top: 2rem;}
    div.stButton > button {
        border-radius: 1rem;
        background: linear-gradient(to right, #ff5f6d, #ffc371);
        color: white;
        font-weight: bold;
    }
    .stTextArea textarea,
    .stTextInput input,
    div.stSelectbox > div {
        background-color: #ffffff33;
        color: black;
        border-radius: 1rem;
    }
    .frosted {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 1rem;
        padding: 1rem;
        backdrop-filter: blur(8px);
        color: black;
        font-size: 1.1rem;
    }
    footer {
        text-align: center;
        font-size: 0.8rem;
        color: grey;
        margin-top: 3rem;
    }
    button:hover {
        background: #444 !important;
    }
    </style>
    """
    st.markdown(custom_css, unsafe_allow_html=True)

# --- Header ---
def render_header():
    st.markdown("<h1 style='text-align: center; font-size: 3rem;'>🎨 Prompt Alchemist</h1>", unsafe_allow_html=True)
    lottie_url = "https://assets4.lottiefiles.com/packages/lf20_ydo1amjm.json"
    lottie = load_lottieurl(lottie_url)
    if lottie:
        st_lottie(lottie, height=200, key="header_anim")

# --- Input Section ---
def render_input_section():
    st.markdown("### 🔤 Enter a Prompt:")
    user_input = st.text_area("Prompt", height=150, placeholder="e.g. write a bedtime story for children")
    st.markdown("### 🎯 Target Model:")
    target_type = st.selectbox("Choose the target model type", ["Text", "Image", "Video", "Code"])
    return user_input, target_type

# --- Output Rendering ---
def render_output(improved_text):
    safe_text = html.escape(improved_text)

    html_block = f"""
    <div class="frosted">
        <pre id="enhanced-text" style="white-space: pre-wrap;">{safe_text}</pre>
        <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
            <button title="Copy Prompt" style="{button_style()}" onclick="copyToClipboard()">{svg_icon('copy')}</button>
            <button title="Retry" style="{button_style()}" onclick="retryPrompt()">{svg_icon('retry')}</button>
            <button title="Like" style="{button_style()}" onclick="likePrompt(this)">{svg_icon('like')}</button>
            <button title="Dislike" style="{button_style()}" onclick="dislikePrompt()">{svg_icon('dislike')}</button>
        </div>
    </div>

    <script>
    function copyToClipboard() {{
        const text = document.getElementById("enhanced-text").innerText;
        navigator.clipboard.writeText(text).then(() => {{
            showToast("✅ Copied!");
        }});
    }}

    function retryPrompt() {{
        window.parent.postMessage({{ type: 'retry' }}, '*');
    }}

    function likePrompt(button) {{
        button.style.background = 'linear-gradient(to right, #00c9ff, #92fe9d)';
        button.innerText = '✅';
        showToast("Thanks for the feedback!");
    }}

    function dislikePrompt() {{
        const feedback = prompt("Sorry to hear that. What went wrong?");
        if (feedback) {{
            window.parent.postMessage({{ type: 'dislike', feedback: feedback }}, '*');
        }}
    }}

    function showToast(msg) {{
        const toast = document.createElement("div");
        toast.innerText = msg;
        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.right = "20px";
        toast.style.background = "#444";
        toast.style.color = "white";
        toast.style.padding = "10px 18px";
        toast.style.borderRadius = "10px";
        toast.style.zIndex = "9999";
        toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }}
    </script>
    """
    st.markdown(html_block, unsafe_allow_html=True)

# --- Icons ---
def svg_icon(icon_type):
    icons = {
        "copy": "📋",
        "retry": "🔁",
        "like": "👍",
        "dislike": "👎",
    }
    return f"<span style='font-size:1.2rem;'>{icons.get(icon_type, '?')}</span>"

# --- Button Styling ---
def button_style():
    return (
        "background: #2a2a2a; border: none; border-radius: 6px; padding: 8px; "
        "cursor: pointer; transition: background 0.3s ease; font-size: 1rem; color: #ddd;"
    )

# --- Footer ---
def render_footer():
    st.markdown("---")
    st.markdown("<footer>Built with ❤️ by Ayush | Powered by Gemini</footer>", unsafe_allow_html=True)
