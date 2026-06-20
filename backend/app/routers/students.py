import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth
from ..ai import resume_engine, skill_gap_engine

router = APIRouter(prefix="/students", tags=["Student Profiles"])

def calculate_completion(student: models.Student) -> float:
    """
    Calculates profile completion percentage.
    """
    fields = [
        student.name, student.age, student.gender, student.branch,
        student.semester, student.cgpa, student.skills, student.certifications,
        student.projects, student.experience, student.career_interests,
        student.preferred_role, student.resume_url
    ]
    filled = sum(1 for f in fields if f is not None and str(f).strip() != "")
    return float(round((filled / len(fields)) * 100))

@router.get("/profile", response_model=schemas.StudentResponse)
def get_profile(current_user: models.User = Depends(auth.require_role(["student"])), db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return student

@router.put("/profile", response_model=schemas.StudentResponse)
def update_profile(payload: schemas.StudentUpdate, current_user: models.User = Depends(auth.require_role(["student"])), db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        
    for key, val in payload.dict(exclude_unset=True).items():
        setattr(student, key, val)
        
    student.profile_completion = calculate_completion(student)
    db.commit()
    db.refresh(student)
    return student

@router.post("/resume/analyze", response_model=schemas.ResumeReportResponse)
async def upload_and_analyze_resume(file: UploadFile = File(...), current_user: models.User = Depends(auth.require_role(["student"])), db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF resumes are supported")
        
    pdf_bytes = await file.read()
    
    # Run analysis
    role = student.preferred_role or "software engineer"
    analysis_result = resume_engine.analyze_resume(pdf_bytes, preferred_role=role)
    
    # Mock upload path (saving filename as url)
    student.resume_url = f"/uploads/{file.filename}"
    student.profile_completion = calculate_completion(student)
    
    # Save Report
    report = models.ResumeReport(
        student_id=student.id,
        ats_score=analysis_result["ats_score"],
        missing_skills=analysis_result["missing_skills"],
        improvement_suggestions=analysis_result["improvement_suggestions"],
        strength_analysis=analysis_result["strength_analysis"]
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    return report

@router.get("/resume/report", response_model=schemas.ResumeReportResponse)
def get_latest_resume_report(current_user: models.User = Depends(auth.require_role(["student"])), db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        
    report = db.query(models.ResumeReport).filter(models.ResumeReport.student_id == student.id).order_by(models.ResumeReport.created_at.desc()).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No resume analysis report found. Please upload your resume first.")
    return report

@router.get("/skill-gap")
def get_skill_gap_analysis(current_user: models.User = Depends(auth.require_role(["student"])), db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        
    role = student.preferred_role or "software engineer"
    gap_result = skill_gap_engine.analyze_skill_gap(student.skills, preferred_role=role)
    
    # Save course recommendations into DB
    # Clear old recommendations
    db.query(models.CourseRecommendation).filter(models.CourseRecommendation.student_id == student.id).delete()
    
    for c in gap_result["courses"]:
        rec = models.CourseRecommendation(
            student_id=student.id,
            course_title=c["course_title"],
            platform=c["platform"],
            is_paid=c["is_paid"],
            link=c["link"],
            matched_skills=c["matched_skills"]
        )
        db.add(rec)
    db.commit()
    
    return {
        "preferred_role": role,
        "missing_skills": gap_result["missing_skills"],
        "recommended_certifications": gap_result["recommended_certifications"],
        "learning_roadmap": gap_result["learning_roadmap"],
        "courses": gap_result["courses"]
    }

@router.post("/saved-opportunities", response_model=schemas.SavedOpportunityResponse)
def save_opportunity(
    payload: schemas.SavedOpportunityCreate,
    current_user: models.User = Depends(auth.require_role(["student"])),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    
    # Check duplicate
    existing = db.query(models.SavedOpportunity).filter(
        models.SavedOpportunity.student_id == student.id,
        models.SavedOpportunity.job_id == payload.job_id,
        models.SavedOpportunity.company_id == payload.company_id
    ).first()
    if existing:
        return existing
        
    saved = models.SavedOpportunity(
        student_id=student.id,
        job_id=payload.job_id,
        company_id=payload.company_id
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return saved

@router.get("/saved-opportunities", response_model=List[schemas.SavedOpportunityResponse])
def get_saved_opportunities(
    current_user: models.User = Depends(auth.require_role(["student"])),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return db.query(models.SavedOpportunity).filter(models.SavedOpportunity.student_id == student.id).order_by(models.SavedOpportunity.created_at.desc()).all()

@router.delete("/saved-opportunities/{saved_id}")
def delete_saved_opportunity(
    saved_id: int,
    current_user: models.User = Depends(auth.require_role(["student"])),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    
    saved = db.query(models.SavedOpportunity).filter(
        models.SavedOpportunity.id == saved_id,
        models.SavedOpportunity.student_id == student.id
    ).first()
    if not saved:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved record not found")
        
    db.delete(saved)
    db.commit()
    return {"message": "Opportunity unsaved successfully"}

@router.get("/resume/history", response_model=List[schemas.ResumeReportResponse])
def get_resume_report_history(
    current_user: models.User = Depends(auth.require_role(["student"])),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return db.query(models.ResumeReport).filter(models.ResumeReport.student_id == student.id).order_by(models.ResumeReport.created_at.desc()).all()

@router.post("/resume/build", response_model=schemas.StudentResponse)
def build_resume_profile(
    payload: schemas.StudentUpdate,
    current_user: models.User = Depends(auth.require_role(["student"])),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        
    for key, val in payload.dict(exclude_unset=True).items():
        setattr(student, key, val)
        
    student.profile_completion = calculate_completion(student)
    
    skills_list = [s.strip() for s in (student.skills.split(",") if student.skills else [])]
    missing = ["git", "docker", "system design"]
    if student.preferred_role == "data scientist":
        missing = ["tensorflow", "pytorch", "tableau"]
        
    report = models.ResumeReport(
        student_id=student.id,
        ats_score=float(student.profile_completion),
        missing_skills=json.dumps(missing),
        improvement_suggestions=json.dumps(["Elaborate on academic projects", "Complete certification details"]),
        strength_analysis=f"Dynamic draft constructed for {student.preferred_role or 'software engineer'} with {len(skills_list)} skills.",
        resume_url="/uploads/draft_resume.pdf"
    )
    db.add(report)
    student.resume_url = "/uploads/draft_resume.pdf"
    db.commit()
    db.refresh(student)
    return student
