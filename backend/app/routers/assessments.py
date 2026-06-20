import json
import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/assessments", tags=["Assessments & Testing"])

# Complete Local Question Bank
ASSESSMENTS_BANK = {
    "aptitude": [
        {"id": 1, "question": "A train covers a distance of 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less for the same journey. Find the speed of the train.", "options": ["45 km/h", "40 km/h", "50 km/h", "35 km/h"], "answer": "40 km/h"},
        {"id": 2, "question": "If 15 men can build a wall 100m long in 6 days, in how many days can 30 men build a wall 50m long?", "options": ["3 days", "1.5 days", "6 days", "2 days"], "answer": "1.5 days"},
        {"id": 3, "question": "The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What might be the weight of the new person?", "options": ["76 kg", "85 kg", "75 kg", "80 kg"], "answer": "85 kg"}
    ],
    "logical": [
        {"id": 4, "question": "Look at this series: 36, 34, 30, 28, 24, ... What number should come next?", "options": ["20", "22", "23", "26"], "answer": "22"},
        {"id": 5, "question": "SCD, TEF, UGH, ____, WKL. Find the missing term.", "options": ["CMN", "UJI", "VIJ", "IJT"], "answer": "VIJ"},
        {"id": 6, "question": "A is the father of B. C is the daughter of B. D is the brother of B. E is the son of A. What is the relation between C and E?", "options": ["Sister", "Niece", "Aunt", "Mother"], "answer": "Niece"}
    ],
    "technical": [
        {"id": 7, "question": "What is the time complexity of searching in a balanced Binary Search Tree (BST)?", "options": ["O(1)", "O(n)", "O(log n)", "O(n log n)"], "answer": "O(log n)"},
        {"id": 8, "question": "Which of the following is NOT an ACID property in Database Management Systems?", "options": ["Atomicity", "Consistency", "Isolation", "Diversity"], "answer": "Diversity"},
        {"id": 9, "question": "Which HTTP status code represents a successful resource creation?", "options": ["200 OK", "201 Created", "204 No Content", "400 Bad Request"], "answer": "201 Created"}
    ],
    "personality": [
        {"id": 10, "question": "How do you prefer to handle a complex project challenge?", "options": ["Analyze details independently", "Collaborate and brainstorm in groups", "Follow a set process strictly", "Adapt dynamically as changes arise"], "answer": "Collaborate and brainstorm in groups"},
        {"id": 11, "question": "What motivates you most when learning a new skill?", "options": ["Direct career application", "Intellectual curiosity", "Earning certifications", "Solving practical problems"], "answer": "Solving practical problems"}
    ]
}

@router.get("/questions")
def get_assessment_questions(type: str = "aptitude"):
    type_key = type.lower()
    if type_key not in ASSESSMENTS_BANK:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid assessment type requested.")
    
    questions = ASSESSMENTS_BANK[type_key]
    # Return questions excluding exact answers for client security
    secure_questions = []
    for q in questions:
        secure_questions.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        })
    return secure_questions

@router.post("/submit")
def submit_assessment(
    type: str,
    answers: Dict[int, str],  # mapping of question ID to selected option string
    current_user: models.User = Depends(auth.require_role(["student"])),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        
    type_key = type.lower()
    if type_key not in ASSESSMENTS_BANK:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid assessment type")
        
    correct_answers = ASSESSMENTS_BANK[type_key]
    score = 0
    total = len(correct_answers)
    domain_breakdown = {}
    
    for q in correct_answers:
        submitted = answers.get(str(q["id"])) or answers.get(q["id"])
        if submitted == q["answer"]:
            score += 1
            domain_breakdown[q["id"]] = "correct"
        else:
            domain_breakdown[q["id"]] = "incorrect"
            
    final_score = float(round((score / total) * 100, 1)) if total else 0.0
    
    # Generate automatic feedback
    if final_score >= 80:
        strengths = f"Excellent problem solving in {type_key}. Shows fast analytical recall and conceptual clarity."
        weaknesses = "Minor slip-ups in pacing or arithmetic detail."
    elif final_score >= 50:
        strengths = "Possesses moderate fundamental skills but needs refinement."
        weaknesses = "Lacks speed under time pressure or advanced application knowledge."
    else:
        strengths = "Shows willingness to attempt foundational categories."
        weaknesses = "Requires significant practice in analytical methodologies and basic formulas."
        
    assessment = models.Assessment(
        student_id=student.id,
        type=type_key,
        score=final_score,
        total_questions=total,
        domain_scores=json.dumps(domain_breakdown),
        strength_report=strengths,
        weakness_report=weaknesses
    )
    db.add(assessment)
    
    # Notify Student
    notif = models.Notification(
        user_id=current_user.id,
        title="Assessment Completed",
        message=f"You successfully completed your {type_key.capitalize()} Assessment with a score of {final_score}%.",
        type="alert"
    )
    db.add(notif)
    db.commit()
    db.refresh(assessment)
    
    return {
        "score": final_score,
        "total_questions": total,
        "strength_report": strengths,
        "weakness_report": weaknesses,
        "assessment_id": assessment.id
    }

@router.get("/history", response_model=List[schemas.AssessmentResponse])
def get_assessment_history(current_user: models.User = Depends(auth.require_role(["student"])), db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return db.query(models.Assessment).filter(models.Assessment.student_id == student.id).order_by(models.Assessment.completed_at.desc()).all()
