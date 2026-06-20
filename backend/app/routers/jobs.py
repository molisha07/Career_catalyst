import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/jobs", tags=["Jobs & Placements"])

def calculate_job_match(student: models.Student, job: models.Job) -> float:
    """
    Algorithmic matching percentage based on required skills and CGPA.
    """
    if not student.skills or not job.required_skills:
        return 0.0
        
    student_skills = [s.strip().lower() for s in student.skills.split(",") if s.strip()]
    job_skills = [s.strip().lower() for s in job.required_skills.split(",") if s.strip()]
    
    # Skill overlap
    matched_skills = [s for s in job_skills if s in student_skills]
    skill_score = (len(matched_skills) / len(job_skills)) * 100 if job_skills else 0.0
    
    # CGPA eligibility
    cgpa_score = 100.0
    if job.eligibility_cgpa and student.cgpa:
        if student.cgpa < job.eligibility_cgpa:
            # penalize match score heavily if cgpa is not met
            cgpa_score = 40.0
            
    match_percentage = (skill_score * 0.7) + (cgpa_score * 0.3)
    return float(round(match_percentage, 1))

@router.get("/", response_model=List[schemas.JobResponse])
def get_all_jobs(
    is_internship: Optional[bool] = None,
    is_placement: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Job)
    if is_internship is not None:
        query = query.filter(models.Job.is_internship == is_internship)
    if is_placement is not None:
        query = query.filter(models.Job.is_placement == is_placement)
    if search:
        query = query.filter(models.Job.title.ilike(f"%{search}%") | models.Job.required_skills.ilike(f"%{search}%"))
        
    return query.order_by(models.Job.created_at.desc()).all()

@router.post("/", response_model=schemas.JobResponse)
def create_job(payload: schemas.JobCreate, current_user: models.User = Depends(auth.require_role(["recruiter", "admin"])), db: Session = Depends(get_db)):
    # Find recruiter profile
    recruiter = db.query(models.Recruiter).filter(models.Recruiter.user_id == current_user.id).first()
    if not recruiter or not recruiter.company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recruiter profile must be associated with a Company to post a job."
        )
        
    job = models.Job(
        company_id=recruiter.company_id,
        title=payload.title,
        description=payload.description,
        work_type=payload.work_type,
        location=payload.location,
        salary=payload.salary,
        experience_level=payload.experience_level,
        required_skills=payload.required_skills,
        eligibility_cgpa=payload.eligibility_cgpa,
        is_placement=payload.is_placement,
        is_internship=payload.is_internship
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("/recommendations")
def get_recommended_jobs(current_user: models.User = Depends(auth.require_role(["student"])), db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        
    jobs = db.query(models.Job).all()
    recommendations = []
    
    for job in jobs:
        match_score = calculate_job_match(student, job)
        eligibility = True
        if job.eligibility_cgpa and student.cgpa and student.cgpa < job.eligibility_cgpa:
            eligibility = False
            
        recommendations.append({
            "job": job,
            "company_name": job.company.name,
            "match_score": match_score,
            "is_eligible": eligibility,
            "required_skills": job.required_skills,
            "missing_skills": [s for s in [sk.strip() for sk in (job.required_skills.split(",") if job.required_skills else [])] if student.skills is None or s.lower() not in student.skills.lower()]
        })
        
    # Sort by match score
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    return recommendations

@router.post("/{job_id}/apply", response_model=schemas.ApplicationResponse)
def apply_to_job(job_id: int, current_user: models.User = Depends(auth.require_role(["student"])), db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job opening not found")
        
    # Check if already applied
    existing = db.query(models.Application).filter(models.Application.job_id == job_id, models.Application.student_id == student.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already applied for this opening.")
        
    match_score = calculate_job_match(student, job)
    
    app = models.Application(
        job_id=job.id,
        student_id=student.id,
        resume_url=student.resume_url,
        match_score=match_score,
        status="applied"
    )
    db.add(app)
    
    # Notify User / Recruiter
    notif = models.Notification(
        user_id=current_user.id,
        title="Application Submitted",
        message=f"You successfully applied for {job.title} at {job.company.name}.",
        type="alert"
    )
    db.add(notif)
    db.commit()
    db.refresh(app)
    return app

@router.get("/applications", response_model=List[schemas.ApplicationResponse])
def get_student_applications(current_user: models.User = Depends(auth.require_role(["student"])), db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return db.query(models.Application).filter(models.Application.student_id == student.id).order_by(models.Application.applied_at.desc()).all()

@router.get("/recruiter/applicants", response_model=List[schemas.ApplicationResponse])
def get_recruiter_applicants(current_user: models.User = Depends(auth.require_role(["recruiter"])), db: Session = Depends(get_db)):
    recruiter = db.query(models.Recruiter).filter(models.Recruiter.user_id == current_user.id).first()
    if not recruiter or not recruiter.company_id:
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recruiter profile not found")
         
    return db.query(models.Application).join(models.Job).filter(models.Job.company_id == recruiter.company_id).order_by(models.Application.match_score.desc()).all()

@router.put("/applications/{app_id}", response_model=schemas.ApplicationResponse)
def update_application_status(
    app_id: int,
    payload: schemas.ApplicationUpdate,
    current_user: models.User = Depends(auth.require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application record not found")
        
    app.status = payload.status
    if payload.feedback:
        app.feedback = payload.feedback
        
    # Notify Student
    student_user_id = app.student.user_id
    notif = models.Notification(
        user_id=student_user_id,
        title="Application Status Updated",
        message=f"Your application status for {app.job.title} has been updated to '{payload.status}'.",
        type="placement" if app.job.is_placement else "internship"
    )
    db.add(notif)
    db.commit()
    db.refresh(app)
    return app

@router.put("/{job_id}", response_model=schemas.JobResponse)
def update_job(
    job_id: int,
    payload: schemas.JobUpdate,
    current_user: models.User = Depends(auth.require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    recruiter = db.query(models.Recruiter).filter(models.Recruiter.user_id == current_user.id).first()
    if not recruiter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recruiter profile not found")
        
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job opening not found")
        
    if current_user.role != "admin" and job.company_id != recruiter.company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to edit this post")
        
    for key, val in payload.dict(exclude_unset=True).items():
        setattr(job, key, val)
        
    db.commit()
    db.refresh(job)
    return job

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    current_user: models.User = Depends(auth.require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    recruiter = db.query(models.Recruiter).filter(models.Recruiter.user_id == current_user.id).first()
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job opening not found")
        
    if current_user.role != "admin" and (not recruiter or job.company_id != recruiter.company_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this post")
        
    db.delete(job)
    db.commit()
    return {"message": "Job opening deleted successfully"}

@router.put("/{job_id}/close", response_model=schemas.JobResponse)
def close_job(
    job_id: int,
    current_user: models.User = Depends(auth.require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    recruiter = db.query(models.Recruiter).filter(models.Recruiter.user_id == current_user.id).first()
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job opening not found")
        
    if current_user.role != "admin" and (not recruiter or job.company_id != recruiter.company_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to close this post")
        
    job.is_active = False
    db.commit()
    db.refresh(job)
    return job

@router.get("/recruiters/analytics", response_model=schemas.RecruiterDashboardAnalytics)
def get_recruiter_analytics(
    current_user: models.User = Depends(auth.require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    recruiter = db.query(models.Recruiter).filter(models.Recruiter.user_id == current_user.id).first()
    if not recruiter or not recruiter.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recruiter company not associated")
        
    company_id = recruiter.company_id
    
    active_jobs = db.query(models.Job).filter(models.Job.company_id == company_id, models.Job.is_placement == True, models.Job.is_active == True).count()
    active_internships = db.query(models.Job).filter(models.Job.company_id == company_id, models.Job.is_internship == True, models.Job.is_active == True).count()
    
    apps_query = db.query(models.Application).join(models.Job).filter(models.Job.company_id == company_id)
    total_applicants = apps_query.count()
    
    shortlisted = apps_query.filter(models.Application.status == "shortlisted").count()
    interviews = db.query(models.Interview).join(models.Job).filter(models.Job.company_id == company_id, models.Interview.status == "scheduled").count()
    hired = apps_query.filter(models.Application.status == "selected").count()
    
    funnel = {
        "applied": apps_query.filter(models.Application.status == "applied").count(),
        "under_review": apps_query.filter(models.Application.status == "under_review").count(),
        "shortlisted": shortlisted,
        "interview_scheduled": apps_query.filter(models.Application.status == "interview_scheduled").count(),
        "selected": hired,
        "rejected": apps_query.filter(models.Application.status == "rejected").count()
    }
    
    trends = [
        {"date": "2026-05-26", "count": 2},
        {"date": "2026-05-27", "count": 4},
        {"date": "2026-05-28", "count": 3},
        {"date": "2026-05-29", "count": 6},
        {"date": "2026-05-30", "count": total_applicants}
    ]
    
    in_demand_skills = [
        {"skill": "PYTHON", "count": 8},
        {"skill": "JS", "count": 6},
        {"skill": "MACHINE LEARNING", "count": 4},
        {"skill": "REACT", "count": 3}
    ]
    
    return {
        "active_jobs": active_jobs,
        "active_internships": active_internships,
        "total_applicants": total_applicants,
        "shortlisted_candidates": shortlisted,
        "interviews_scheduled": interviews,
        "hired_candidates": hired,
        "hiring_funnel": funnel,
        "application_trends": trends,
        "in_demand_skills": in_demand_skills
    }

@router.get("/recruiters/talent-search")
def talent_search(
    skills: Optional[str] = None,
    cgpa_min: Optional[float] = None,
    branch: Optional[str] = None,
    certifications: Optional[str] = None,
    experience: Optional[str] = None,
    current_user: models.User = Depends(auth.require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    query = db.query(models.Student)
    if skills:
        for skill in [s.strip().lower() for s in skills.split(",") if s.strip()]:
            query = query.filter(models.Student.skills.ilike(f"%{skill}%"))
    if cgpa_min:
        query = query.filter(models.Student.cgpa >= cgpa_min)
    if branch:
        query = query.filter(models.Student.branch.ilike(f"%{branch}%"))
    if certifications:
        query = query.filter(models.Student.certifications.ilike(f"%{certifications}%"))
    if experience:
        query = query.filter(models.Student.experience.ilike(f"%{experience}%"))
        
    return query.all()
