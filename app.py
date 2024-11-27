from flask import Flask, render_template, request, jsonify
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate_recipe', methods=['POST'])
def generate_recipe():
    user_input = request.json.get('message')
    
    try:
        client = openai.OpenAI()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful chef. Provide recipes in the following format: TITLE, INGREDIENTS (as a list), COOK TIME, SERVINGS, INSTRUCTIONS (as steps). Keep it concise but detailed."},
                {"role": "user", "content": f"Give me a recipe for {user_input}"}
            ]
        )
        
        return jsonify({"recipe": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)