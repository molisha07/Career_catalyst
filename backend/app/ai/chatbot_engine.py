import os
import openai
from typing import Dict, Any, List

# RAG Knowledge Corpus
CAREER_KNOWLEDGE_BASE = [
    {
        "topic": "resume optimization",
        "keywords": ["resume", "ats", "score", "build", "parse", "cv", "formatting"],
        "content": "To optimize your resume for ATS (Applicant Tracking Systems), use clear section headers like 'Technical Skills', 'Projects', and 'Work Experience'. Avoid tables, columns, or graphics that can confuse standard parsers. Integrate role-specific keywords (e.g., Python, React) organically. Describe project achievements using action verbs and the STAR framework (Situation, Task, Action, Result)."
    },
    {
        "topic": "placement criteria",
        "keywords": ["placement", "eligibility", "cgpa", "criteria", "semester", "company", "jobs"],
        "content": "To participate in active campus placements, students should maintain a CGPA of 6.0 or above and have no active backlogs. Typically, placements commence from the 6th semester. Top recruiters like Google, Amazon, and Microsoft look for strong core competencies in Data Structures & Algorithms, Database Management (SQL), and Cloud or Web development certifications."
    },
    {
        "topic": "mock interviews",
        "keywords": ["interview", "mock", "technical", "behavioral", "hr", "preparation", "practice"],
        "content": "Prepare for technical interviews by practicing standard coding challenges (arrays, trees, database queries) and explaining your thought process out loud. For behavioral and HR questions, structure answers using the STAR method: describe a Situation, clarify your Task, detail your Action, and highlight the successful Result."
    },
    {
        "topic": "internship guidelines",
        "keywords": ["internship", "intern", "stipend", "remote", "experience", "work"],
        "content": "Internships are crucial for freshers to build industry credibility. Students starting from the 4th semester are encouraged to apply. Internships are offered in Remote, Hybrid, or On-site formats, with stipends ranging from performance-based to fixed values. Gaining internship experience increases job placement match rates by over 50%."
    }
]

def search_context(query: str) -> str:
    """
    Simulates vector retrieval by matching keywords against the career knowledge database.
    """
    query_lower = query.lower()
    matched_doc = None
    max_matches = 0
    
    for doc in CAREER_KNOWLEDGE_BASE:
        matches = sum(1 for kw in doc["keywords"] if kw in query_lower)
        if matches > max_matches:
            max_matches = matches
            matched_doc = doc
            
    if matched_doc:
        return f"[Context retrieved from Career Catalyst Database - Topic: {matched_doc['topic'].upper()}]\n{matched_doc['content']}"
    
    return "[Context retrieved from Career Catalyst Database]\nGeneral Career Advice: Build solid projects, earn skill-based certifications, take mock assessments regularly, and tailor your resume for every application."

def generate_mentor_response(query: str, chat_history: List[dict] = []) -> str:
    """
    Generates a RAG-based AI response. If OpenAI key is present, calls ChatGPT, else returns matched context with dynamic feedback.
    """
    context = search_context(query)
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # Fallback local responder
        response = (
            f"Hello! I am your local AI Career Mentor. "
            f"Based on our knowledge database, here is some tailored guidance:\n\n"
            f"{context}\n\n"
            f"To get the most out of Career Catalyst, be sure to upload your resume in the 'Resume Analyzer' section "
            f"or attempt a quick Technical/Aptitude Assessment to let me suggest specific courses."
        )
        return response
        
    try:
        openai.api_key = api_key
        messages = [
            {"role": "system", "content": "You are a professional AI Career Mentor Chatbot for students. Synthesize responses using the provided database context."}
        ]
        
        # Add chat history (up to last 4 messages to save context limits)
        for msg in chat_history[-4:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
            
        messages.append({"role": "user", "content": f"Context Database:\n{context}\n\nUser Question:\n{query}"})
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=350
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling OpenAI chatbot: {e}. Returning context guidance.")
        return f"Based on our database: {context}"
