import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth
from ..ai import interview_engine

router = APIRouter(prefix="/interviews", tags=["Mock Interviews"])

@router.get("/questions")
def get_mock_questions(type: str = "technical", current_user: models.User = Depends(auth.require_role(["student"])), db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        
    role = student.preferred_role or "software engineer"
    questions = interview_engine.generate_questions(role=role, interview_type=type)
    return {
        "preferred_role": role,
        "type": type,
        "questions": questions
    }

@router.post("/submit", response_model=schemas.InterviewResponse)
def submit_interview_answers(
    payload: schemas.InterviewSubmit,
    type: str = "technical",
    current_user: models.User = Depends(auth.require_role(["student"])),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        
    role = student.preferred_role or "software engineer"
    
    # Analyze responses
    eval_result = interview_engine.evaluate_answers(
        questions_json=payload.questions,
        answers_json=payload.answers,
        role=role,
        interview_type=type
    )
    
    interview = models.Interview(
        student_id=student.id,
        type=type,
        status="completed",
        questions=payload.questions,
        answers=payload.answers,
        feedback=eval_result["feedback"],
        confidence_score=eval_result["confidence_score"],
        performance_score=eval_result["performance_score"]
    )
    db.add(interview)
    
    # Notify Student
    notif = models.Notification(
        user_id=current_user.id,
        title="Mock Interview Evaluation Ready",
        message=f"Your mock interview for {type.capitalize()} is graded. Score: {eval_result['performance_score']}%.",
        type="interview"
    )
    db.add(notif)
    db.commit()
    db.refresh(interview)
    
    return interview

@router.get("/history", response_model=List[schemas.InterviewResponse])
def get_interview_history(current_user: models.User = Depends(auth.require_role(["student", "recruiter"])), db: Session = Depends(get_db)):
    if current_user.role == "student":
        student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        return db.query(models.Interview).filter(models.Interview.student_id == student.id).order_by(models.Interview.interview_date.desc()).all()
    else:
        recruiter = db.query(models.Recruiter).filter(models.Recruiter.user_id == current_user.id).first()
        if not recruiter:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recruiter profile not found")
        return db.query(models.Interview).filter(models.Interview.recruiter_id == recruiter.id).order_by(models.Interview.interview_date.desc()).all()

@router.post("/schedule", response_model=schemas.InterviewResponse)
def schedule_interview(
    payload: schemas.InterviewSchedule,
    current_user: models.User = Depends(auth.require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    recruiter = db.query(models.Recruiter).filter(models.Recruiter.user_id == current_user.id).first()
    if not recruiter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recruiter profile not found")
        
    interview = models.Interview(
        student_id=payload.student_id,
        job_id=payload.job_id,
        recruiter_id=recruiter.id,
        type=payload.type,
        status="scheduled",
        interview_date=payload.interview_date,
        location=payload.location
    )
    db.add(interview)
    
    # Update application status to interview_scheduled
    app = db.query(models.Application).filter(
        models.Application.student_id == payload.student_id,
        models.Application.job_id == payload.job_id
    ).first()
    if app:
        app.status = "interview_scheduled"
        
    # Notify Student
    student = db.query(models.Student).filter(models.Student.id == payload.student_id).first()
    if student:
        notif = models.Notification(
            user_id=student.user_id,
            title="Interview Scheduled",
            message=f"An interview of type {payload.type.capitalize()} has been scheduled on {payload.interview_date.strftime('%Y-%m-%d %H:%M')}.",
            type="interview"
        )
        db.add(notif)
        
    db.commit()
    db.refresh(interview)
    return interview

@router.put("/{interview_id}/feedback", response_model=schemas.InterviewResponse)
def submit_recruiter_feedback(
    interview_id: int,
    payload: schemas.InterviewFeedbackUpdate,
    current_user: models.User = Depends(auth.require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    recruiter = db.query(models.Recruiter).filter(models.Recruiter.user_id == current_user.id).first()
    if not recruiter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recruiter profile not found")
        
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview not found")
        
    if current_user.role != "admin" and interview.recruiter_id != recruiter.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to grade this interview")
        
    interview.feedback = payload.feedback
    if payload.notes:
        interview.notes = payload.notes
    interview.status = payload.status
    if payload.performance_score is not None:
        interview.performance_score = payload.performance_score
        
    if payload.status in ["selected", "rejected"]:
        app = db.query(models.Application).filter(
            models.Application.student_id == interview.student_id,
            models.Application.job_id == interview.job_id
        ).first()
        if app:
            app.status = payload.status
            
    db.commit()
    db.refresh(interview)
    return interview

@router.get("/upcoming", response_model=List[schemas.InterviewResponse])
def get_upcoming_interviews(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "student":
        student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
        if not student:
            return []
        return db.query(models.Interview).filter(
            models.Interview.student_id == student.id,
            models.Interview.status == "scheduled"
        ).order_by(models.Interview.interview_date.asc()).all()
    elif current_user.role == "recruiter":
        recruiter = db.query(models.Recruiter).filter(models.Recruiter.user_id == current_user.id).first()
        if not recruiter:
            return []
        return db.query(models.Interview).filter(
            models.Interview.recruiter_id == recruiter.id,
            models.Interview.status == "scheduled"
        ).order_by(models.Interview.interview_date.asc()).all()
    return []
