from flask import Flask, request, jsonify
import os
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from critical_topics import identify_critical_topics
from data_processor import process_user_data, analyze_topic_performance
import json

# Initialize Flask app
app = Flask(__name__)

# Configure to run on port 8000
PORT = 8000

# Allow CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "ok",
        "message": "DSA Practice Python API is running",
        "endpoints": [
            "/critical-topics",
            "/analyze-performance",
            "/recommend-problems"
        ]
    })

@app.route('/critical-topics', methods=['POST'])
def get_critical_topics():
    # Get user data from request
    data = request.json
    
    if not data or 'problems' not in data or 'solvedProblems' not in data:
        return jsonify({
            "error": "Invalid request data. Must provide problems and solvedProblems arrays."
        }), 400
    
    try:
        # Process the data with our ML algorithm
        critical_topics = identify_critical_topics(data['problems'], data['solvedProblems'])
        
        return jsonify({
            "criticalTopics": critical_topics
        })
    except Exception as e:
        return jsonify({
            "error": f"Error analyzing critical topics: {str(e)}"
        }), 500

@app.route('/analyze-performance', methods=['POST'])
def analyze_performance():
    # Get user data from request
    data = request.json
    
    if not data or 'solvedProblems' not in data:
        return jsonify({
            "error": "Invalid request data. Must provide solvedProblems array."
        }), 400
    
    try:
        # Process user performance data
        user_stats = process_user_data(data['solvedProblems'])
        topic_performance = analyze_topic_performance(data['problems'], data['solvedProblems'])
        
        return jsonify({
            "userStats": user_stats,
            "topicPerformance": topic_performance
        })
    except Exception as e:
        return jsonify({
            "error": f"Error analyzing performance: {str(e)}"
        }), 500

@app.route('/recommend-problems', methods=['POST'])
def recommend_problems():
    # Get user data from request
    data = request.json
    
    if not data or 'problems' not in data or 'solvedProblems' not in data or 'criticalTopics' not in data:
        return jsonify({
            "error": "Invalid request data. Must provide problems, solvedProblems, and criticalTopics arrays."
        }), 400
    
    try:
        # Get all problems
        all_problems = data['problems']
        
        # Get solved problem IDs
        solved_problem_ids = [sp['problemId'] for sp in data['solvedProblems']]
        
        # Filter to unsolved problems
        unsolved_problems = [p for p in all_problems if p['id'] not in solved_problem_ids]
        
        # Get critical topics
        critical_topics = [ct['name'] for ct in data['criticalTopics']]
        
        # Recommend problems from critical topics
        recommended = []
        
        for topic in critical_topics:
            # Find unsolved problems in this topic
            topic_problems = [p for p in unsolved_problems if p['topic'] == topic]
            
            # Sort by acceptance rate (higher first)
            topic_problems.sort(key=lambda x: float(x.get('acceptance', '0%').strip('%')), reverse=True)
            
            # Take up to 3 problems from each critical topic
            recommended.extend(topic_problems[:3])
        
        # Limit to 10 total recommendations
        recommended = recommended[:10]
        
        return jsonify({
            "recommendedProblems": recommended
        })
    except Exception as e:
        return jsonify({
            "error": f"Error generating recommendations: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=os.environ.get('DEBUG', 'False') == 'True')
