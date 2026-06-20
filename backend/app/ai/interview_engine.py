import os
import json
import openai
from typing import Dict, Any, List

# Core bank of interview questions per role & category
INTERVIEW_QUESTIONS = {
    "software engineer": {
        "technical": [
            "Explain the difference between a list and a tuple in Python. When would you use each?",
            "What are REST APIs? What are the key HTTP methods and their idempotency?",
            "Explain how indexing works in a database and how it improves query performance."
        ],
        "behavioral": [
            "Tell me about a time you faced a difficult technical bug. How did you diagnose and resolve it?",
            "Describe a project where you had to work closely in a team. How did you resolve conflicts?",
            "How do you handle tight deadlines or competing priorities when working on multiple tasks?"
        ],
        "hr": [
            "Why do you want to join our company as a Software Engineer?",
            "Where do you see yourself in five years?",
            "What are your greatest strengths and weaknesses?"
        ]
    },
    "data scientist": {
        "technical": [
            "What is the difference between supervised and unsupervised learning?",
            "How do you handle missing or imbalanced data in a machine learning pipeline?",
            "Explain overfitting. What techniques do you use to mitigate it?"
        ],
        "behavioral": [
            "Describe a time you had to explain a complex ML model to non-technical stakeholders.",
            "Tell me about a project where your initial model failed. What did you learn?"
        ],
        "hr": [
            "Why are you passionate about Data Science?",
            "How do you stay updated with the latest trends in Artificial Intelligence?"
        ]
    }
}

def generate_questions(role: str = "software engineer", interview_type: str = "technical") -> List[str]:
    """
    Retrieves or generates mock interview questions.
    """
    role_key = role.lower()
    type_key = interview_type.lower()
    
    # Fallback keys
    if role_key not in INTERVIEW_QUESTIONS:
        role_key = "software engineer"
    if type_key not in INTERVIEW_QUESTIONS[role_key]:
        type_key = "technical"
        
    return INTERVIEW_QUESTIONS[role_key][type_key]

def evaluate_interview_locally(questions: List[str], answers: List[str]) -> Dict[str, Any]:
    """
    Performs standard length, vocabulary, and keyword matching evaluation locally.
    """
    total_score = 0
    feedback_points = []
    
    for idx, (q, a) in enumerate(zip(questions, answers)):
        word_count = len(a.split())
        score = 50  # base score
        
        # Length check
        if word_count < 15:
            score -= 20
            feedback_points.append(f"Answer {idx+1} is too brief. Try to elaborate on your points.")
        elif word_count >= 40:
            score += 20
            feedback_points.append(f"Answer {idx+1} has a detailed length, indicating good depth of knowledge.")
            
        # Keyword-based confidence triggers
        confidence_keywords = ["because", "specifically", "for example", "designed", "implemented", "resolved", "experience"]
        match_count = sum(1 for kw in confidence_keywords if kw in a.lower())
        score += min(20, match_count * 5)
        
        total_score += min(100, max(10, score))
        
    avg_score = int(total_score / len(questions)) if questions else 70
    confidence_score = min(100, int(avg_score * 0.95))
    
    if not feedback_points:
        feedback = "Overall a standard performance. Focus on articulating specific project details and utilizing structural frameworks like the STAR method (Situation, Task, Action, Result) for behavioral prompts."
    else:
        feedback = " | ".join(feedback_points[:3])
        
    return {
        "performance_score": float(avg_score),
        "confidence_score": float(confidence_score),
        "feedback": feedback
    }

def evaluate_answers(questions_json: str, answers_json: str, role: str = "software engineer", interview_type: str = "technical") -> Dict[str, Any]:
    """
    Evaluates interview response submissions using OpenAI if present, else falls back to local evaluators.
    """
    try:
        q_list = json.loads(questions_json)
        a_list = json.loads(answers_json)
    except Exception:
        return {
            "performance_score": 50.0,
            "confidence_score": 50.0,
            "feedback": "Unable to read interview history submissions."
        }
        
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return evaluate_interview_locally(q_list, a_list)
        
    try:
        openai.api_key = api_key
        prompt = f"""
        You are an expert technical interviewer and HR executive evaluating a candidate's mock interview.
        Target Role: {role}
        Interview Type: {interview_type}
        
        Evaluate the following questions and answers:
        {json.dumps([{"question": q, "answer": a} for q, a in zip(q_list, a_list)], indent=2)}
        
        Return strictly a JSON object with:
        - "performance_score": float (0-100) reflecting technical accuracy and structure.
        - "confidence_score": float (0-100) reflecting communication clarity and vocabulary.
        - "feedback": detailed text highlighting strengths and specific improvement tips.
        """
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional hiring evaluator returning strictly JSON data."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        
        result = json.loads(response.choices[0].message.content)
        return {
            "performance_score": float(result.get("performance_score", 70.0)),
            "confidence_score": float(result.get("confidence_score", 70.0)),
            "feedback": str(result.get("feedback", "Excellent response structure."))
        }
    except Exception as e:
        print(f"Error using OpenAI interview evaluator: {e}. Falling back to local evaluator.")
        return evaluate_interview_locally(q_list, a_list)
