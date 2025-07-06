from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

# Configure with correct model name
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use the most reliable model for this task
model = genai.GenerativeModel('gemini-1.5-flash')  # The correct stable model name

def generate_quiz(content):
    try:
        prompt = f"""Generate atleast 10 quiz questions from this content in EXACTLY this JSON format:
        {{
            "questions": [
                {{
                    "question": "question text",
                    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
                    "answer": "A)",
                    "explanation": "brief explanation"
                }}
            ]
        }}
        Content: {content[:2000]}
        """
        
        response = model.generate_content(prompt)
        
        # Extract JSON from response
        import json
        import re
        json_str = re.search(r'\{.*\}', response.text, re.DOTALL).group()
        data = json.loads(json_str)
        return data.get('questions', [])
    
    except Exception as e:
        print(f"Error: {str(e)}")
        # Fallback questions
        return [
            {
                "question": "What is the capital of France?",
                "options": ["A) London", "B) Paris", "C) Berlin", "D) Madrid"],
                "answer": "B)",
                "explanation": "Paris has been France's capital since 508 AD"
            }
        ]

@app.route('/generate_quiz', methods=['POST'])
def handle_generate():
    try:
        content = request.json.get('content')
        if not content or len(content) < 20:
            return jsonify({"error": "Content too short (min 20 chars)"}), 400
            
        quiz = generate_quiz(content)
        if not quiz:
            return jsonify({"error": "Failed to generate quiz"}), 500
            
        return jsonify({"questions": quiz})
        
    except Exception as e:
        print(f"Server Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)