from flask_cors import CORS
from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load API key
load_dotenv("api.env")

api_key = os.getenv("GEMINI_API_KEY")

print("API Key loaded:", api_key)
print("Current folder:", os.getcwd())
print("api.env exists:", os.path.exists("api.env"))

genai.configure(api_key=api_key)

# Create Gemini modelE"
model = genai.GenerativeModel("gemini-3.8-flash")

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "CareerPilot AI Backend is Running!"

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json

    branch = data.get("branch")
    semester = data.get("semester")
    skills = data.get("skills")
    goal = data.get("goal")
    hours = data.get("hours")

    prompt = f"""
You are an expert career mentor.

Student Details:
Branch: {branch}
Semester: {semester}
Current Skills: {skills}
Career Goal: {goal}
Study Hours per Week: {hours}

Generate a clear, useful response in Markdown:
1. A learning roadmap
2. Skills to learn
3. Three project ideas
4. Interview preparation tips
5. Free learning resources

Use Markdown headings, bullet points, numbered steps where useful, and bold text for key skills or milestones. Keep the structure easy to scan.
"""

    response = model.generate_content(prompt)

    return jsonify({
        "response": response.text
    })

if __name__ == "__main__":
    app.run(debug=False)
