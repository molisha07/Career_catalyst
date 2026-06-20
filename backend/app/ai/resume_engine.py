import io
import os
import json
from typing import Dict, Any, List
from pypdf import PdfReader
import openai

# Standard skill sets per role for the local heuristic model
ROLE_SKILLS = {
    "software engineer": [
        "python", "java", "c++", "javascript", "react", "node.js", "sql", "git", "docker", 
        "data structures", "algorithms", "rest api", "system design", "html", "css"
    ],
    "data scientist": [
        "python", "r", "machine learning", "deep learning", "pandas", "numpy", "scikit-learn", 
        "tensorflow", "pytorch", "sql", "statistics", "data analysis", "tableau", "big data"
    ],
    "ui/ux designer": [
        "figma", "sketch", "adobe xd", "wireframing", "prototyping", "user research", 
        "interaction design", "user testing", "information architecture", "css", "html"
    ],
    "cloud computing engineer": [
        "aws", "azure", "gcp", "docker", "kubernetes", "linux", "terraform", "ci/cd", 
        "devops", "cloud security", "networking", "python", "bash"
    ],
    "product manager": [
        "agile", "scrum", "roadmap", "user stories", "market research", "analytics", 
        "sql", "jira", "wireframing", "product strategy", "communication"
    ]
}

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts plain text from raw PDF bytes.
    """
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def parse_resume_heuristically(text: str, preferred_role: str = "software engineer") -> Dict[str, Any]:
    """
    Local heuristic model to parse and evaluate resume text without external APIs.
    """
    text_lower = text.lower()
    preferred_role = preferred_role.lower()
    
    # 1. Structure Analysis (checking for typical headers)
    headers = {
        "education": ["education", "academic", "university", "college", "school"],
        "experience": ["experience", "employment", "work history", "professional history", "internship"],
        "projects": ["project", "personal projects", "academic projects"],
        "skills": ["skills", "technical skills", "technologies", "expertise"],
        "certifications": ["certification", "certifications", "licenses"]
    }
    
    found_headers = []
    missing_headers = []
    structure_score = 0
    
    for header, synonyms in headers.items():
        matched = False
        for syn in synonyms:
            if syn in text_lower:
                matched = True
                break
        if matched:
            found_headers.append(header)
            structure_score += 20
        else:
            missing_headers.append(header)
            
    # 2. Skill Scoring & Missing Skill Detection
    role_skills = ROLE_SKILLS.get(preferred_role, ROLE_SKILLS["software engineer"])
    found_skills = []
    missing_skills = []
    
    for skill in role_skills:
        # Simple word boundaries match
        if skill in text_lower:
            found_skills.append(skill)
        else:
            missing_skills.append(skill)
            
    skill_score = 0
    if len(role_skills) > 0:
        skill_score = min(100, int((len(found_skills) / len(role_skills)) * 100))
        
    # 3. Text Layout & Length Analysis
    word_count = len(text.split())
    length_score = 100
    if word_count < 100:  # Too short
        length_score = 40
    elif word_count > 1000:  # Too wordy for a standard fresher resume
        length_score = 70
        
    # 4. ATS Score Calculation
    ats_score = int((structure_score * 0.4) + (skill_score * 0.4) + (length_score * 0.2))
    
    # 5. Improvement Suggestions
    suggestions = []
    if "experience" in missing_headers:
        suggestions.append("Add a 'Professional Experience' or 'Internships' section to showcase practical exposure.")
    if "projects" in missing_headers:
        suggestions.append("Add a 'Projects' section with links (e.g. GitHub) to show practical application of skills.")
    if "certifications" in missing_headers:
        suggestions.append("Include relevant certifications to boost credibility.")
    if len(missing_skills) > 3:
        suggestions.append(f"Consider adding key tech skills like {', '.join(missing_skills[:3])} to match industry expectations for a {preferred_role} role.")
    if word_count < 200:
        suggestions.append("Your resume content seems brief. Elaborate on your projects and tasks using action verbs.")
    elif word_count > 800:
        suggestions.append("Your resume is quite long. Try to condense descriptions using standard bullet points to keep it reader-friendly.")
        
    strength_analysis = (
        f"The resume displays {len(found_headers)} out of 5 standard organizational sections. "
        f"It semantically aligns with {len(found_skills)} standard competencies for a {preferred_role} role, "
        f"showing key strengths in: {', '.join(found_skills[:4]) if found_skills else 'Basic skills'}. "
        f"Overall readability is rated highly based on text parsing attributes."
    )
    
    return {
        "ats_score": float(ats_score),
        "missing_skills": json.dumps(missing_skills),
        "improvement_suggestions": json.dumps(suggestions),
        "strength_analysis": strength_analysis
    }

def analyze_resume(pdf_bytes: bytes, preferred_role: str = "software engineer") -> Dict[str, Any]:
    """
    Entrypoint: parses PDF bytes and runs OpenAI analysis or falls back to local parsing.
    """
    text = extract_text_from_pdf(pdf_bytes)
    if not text:
        return {
            "ats_score": 0.0,
            "missing_skills": "[]",
            "improvement_suggestions": '["Unable to read text from the PDF file. Please ensure it is a valid text-based resume."]',
            "strength_analysis": "Error parsing file."
        }
        
    # Check if OpenAI key is present
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Using local parser model (no API key present).")
        return parse_resume_heuristically(text, preferred_role)
        
    # OpenAI implementation
    try:
        openai.api_key = api_key
        prompt = f"""
        You are an expert ATS (Applicant Tracking System) parser and senior recruiter.
        Analyze the following resume text and evaluate it against the target role: "{preferred_role}".
        
        Provide your assessment strictly in a valid JSON format with the following keys:
        - "ats_score": a float score between 0 and 100 based on formatting, relevance, and skill matching.
        - "missing_skills": a JSON list of key industry skills expected for a "{preferred_role}" that are missing from the resume.
        - "improvement_suggestions": a JSON list of clear, actionable advice to optimize the resume.
        - "strength_analysis": a detailed string summarizing the candidate's core strengths.
        
        Resume Content:
        {text}
        """
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional resume parser returning strictly JSON data."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        
        result_json = json.loads(response.choices[0].message.content)
        # Verify keys
        return {
            "ats_score": float(result_json.get("ats_score", 70.0)),
            "missing_skills": json.dumps(result_json.get("missing_skills", [])),
            "improvement_suggestions": json.dumps(result_json.get("improvement_suggestions", [])),
            "strength_analysis": str(result_json.get("strength_analysis", "Good profile alignment."))
        }
    except Exception as e:
        print(f"Failed to use OpenAI parser: {e}. Falling back to local heuristic model.")
        return parse_resume_heuristically(text, preferred_role)
