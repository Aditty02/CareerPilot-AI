from flask_cors import CORS
from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load API key
genai.configure(api_key="AIzaSyAtkVQWox9lm8og53HMKRpJx08nvVBIfdU")
# Create Gemini modelE"
model = genai.GenerativeModel("gemini-2.5-flash")

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

Generate:

1. A learning roadmap
2. Skills to learn
3. Three project ideas
4. Interview preparation tips
5. Free learning resources

Use headings and bullet points.
"""

    response = model.generate_content(prompt)

    return jsonify({
        "response": response.text
    })

if __name__ == "__main__":
    app.run(debug=True)