import os
import json
from typing import Dict, Any, List

# Predefined Course Database for dynamic match recommendations
COURSE_CATALOG = [
    {"title": "Python for Everybody Specialization", "platform": "Coursera", "is_paid": True, "skills": ["python"], "link": "https://www.coursera.org/specializations/python"},
    {"title": "Introduction to Computer Science and Programming Using Python", "platform": "edX", "is_paid": False, "skills": ["python", "algorithms"], "link": "https://www.edx.org/course/introduction-to-computer-science-and-programming-using-python"},
    {"title": "The Complete 2026 Web Development Bootcamp", "platform": "Udemy", "is_paid": True, "skills": ["html", "css", "javascript", "react", "node.js"], "link": "https://www.udemy.com/course/the-complete-web-development-bootcamp/"},
    {"title": "React - The Complete Guide 2026", "platform": "Udemy", "is_paid": True, "skills": ["react", "javascript"], "link": "https://www.udemy.com/course/react-the-complete-guide-incarnation/"},
    {"title": "Modern JavaScript From The Beginning", "platform": "YouTube", "is_paid": False, "skills": ["javascript"], "link": "https://www.youtube.com/watch?v=IPiUDh4z52c"},
    {"title": "Node.js Developer Course", "platform": "Udemy", "is_paid": True, "skills": ["node.js"], "link": "https://www.udemy.com/course/the-complete-nodejs-developer-course-2/"},
    {"title": "Machine Learning Specialization by Andrew Ng", "platform": "Coursera", "is_paid": True, "skills": ["machine learning", "python", "scikit-learn", "numpy"], "link": "https://www.coursera.org/specializations/machine-learning-introduction"},
    {"title": "Deep Learning Specialization", "platform": "Coursera", "is_paid": True, "skills": ["deep learning", "tensorflow", "pytorch"], "link": "https://www.coursera.org/specializations/deep-learning"},
    {"title": "Applied Data Science with Python Specialization", "platform": "Coursera", "is_paid": True, "skills": ["data analysis", "pandas", "numpy", "python"], "link": "https://www.coursera.org/specializations/data-science-python"},
    {"title": "Introduction to Databases & SQL", "platform": "YouTube", "is_paid": False, "skills": ["sql"], "link": "https://www.youtube.com/watch?v=HXV3zeQKqGY"},
    {"title": "AWS Certified Cloud Practitioner Bootcamp", "platform": "YouTube", "is_paid": False, "skills": ["aws", "cloud"], "link": "https://www.youtube.com/watch?v=SOTamWGuDKc"},
    {"title": "Docker & Kubernetes: The Practical Guide", "platform": "Udemy", "is_paid": True, "skills": ["docker", "kubernetes"], "link": "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/"},
    {"title": "Git and GitHub Complete Masterclass", "platform": "YouTube", "is_paid": False, "skills": ["git"], "link": "https://www.youtube.com/watch?v=apGV9Ad7XYY"},
    {"title": "Figma UI/UX Design Essentials", "platform": "Udemy", "is_paid": True, "skills": ["figma", "wireframing", "ui/ux"], "link": "https://www.udemy.com/course/figma-ui-ux-design-essentials/"},
    {"title": "NPTEL: Data Structures and Algorithms in Python", "platform": "NPTEL", "is_paid": False, "skills": ["data structures", "algorithms"], "link": "https://nptel.ac.in/courses/106/106/106106145/"}
]

ROLE_REQUIREMENTS = {
    "software engineer": {
        "skills": ["python", "javascript", "react", "sql", "git", "docker", "data structures", "algorithms"],
        "certifications": ["AWS Certified Developer", "Oracle Java Certified Professional", "Scrum Alliance CSM"]
    },
    "data scientist": {
        "skills": ["python", "machine learning", "deep learning", "pandas", "numpy", "scikit-learn", "sql"],
        "certifications": ["Google Data Analytics Professional Certificate", "IBM Data Science Professional", "TensorFlow Developer Certificate"]
    },
    "ui/ux designer": {
        "skills": ["figma", "wireframing", "prototyping", "user research", "interaction design", "css", "html"],
        "certifications": ["Google UX Design Certificate", "Interaction Design Foundation Certified Member"]
    },
    "cloud computing engineer": {
        "skills": ["aws", "docker", "kubernetes", "linux", "terraform", "ci/cd", "python"],
        "certifications": ["AWS Certified Solutions Architect", "Google Cloud Associate Cloud Engineer", "Certified Kubernetes Administrator (CKA)"]
    }
}

def analyze_skill_gap(student_skills_raw: str, preferred_role: str = "software engineer") -> Dict[str, Any]:
    """
    Analyzes which required skills are missing from a student's skills,
    and returns missing skills, certifications, recommendations and roadmaps.
    """
    role_key = preferred_role.lower()
    if role_key not in ROLE_REQUIREMENTS:
        role_key = "software engineer"
        
    req_data = ROLE_REQUIREMENTS[role_key]
    required_skills = req_data["skills"]
    required_certs = req_data["certifications"]
    
    # Parse student skills
    student_skills = []
    if student_skills_raw:
        student_skills = [s.strip().lower() for s in student_skills_raw.split(",") if s.strip()]
        
    missing_skills = []
    for skill in required_skills:
        if skill not in student_skills:
            missing_skills.append(skill)
            
    # Get course recommendations for missing skills
    recommended_courses = []
    matched_skill_names = set()
    
    for course in COURSE_CATALOG:
        match_overlap = [s for s in course["skills"] if s in missing_skills]
        if match_overlap:
            # Map course info
            recommended_courses.append({
                "course_title": course["title"],
                "platform": course["platform"],
                "is_paid": course["is_paid"],
                "link": course["link"],
                "matched_skills": ", ".join(match_overlap)
            })
            for s in match_overlap:
                matched_skill_names.add(s)
                
    # Generate Roadmap weeks based on missing skills
    roadmap = []
    if not missing_skills:
        roadmap.append({
            "week": "Week 1-4",
            "topic": "Advanced Mastery & Portfolio building",
            "description": "You already possess the core skills! Build complex production-ready projects, contribute to Open Source, or practice system design."
        })
    else:
        for idx, skill in enumerate(missing_skills):
            roadmap.append({
                "week": f"Week {idx*2 + 1} - Week {idx*2 + 2}",
                "topic": f"Mastering {skill.capitalize()}",
                "description": f"Focus on understanding standard patterns, practical exercises, and building mini-apps utilizing {skill}."
            })
            
    return {
        "missing_skills": missing_skills,
        "recommended_certifications": required_certs,
        "courses": recommended_courses,
        "learning_roadmap": roadmap
    }
