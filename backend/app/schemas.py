from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: str = "student"  # student, recruiter, admin

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# --- Company Schemas ---
class CompanyBase(BaseModel):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    location: Optional[str] = None
    industry: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: int

    class Config:
        from_attributes = True


# --- Recruiter Schemas ---
class RecruiterBase(BaseModel):
    name: str
    designation: Optional[str] = None

class RecruiterCreate(RecruiterBase):
    company_name: Optional[str] = None  # To associate or create a company

class RecruiterResponse(RecruiterBase):
    id: int
    user_id: int
    company_id: Optional[int] = None
    company: Optional[CompanyResponse] = None

    class Config:
        from_attributes = True


# --- Student Schemas ---
class StudentBase(BaseModel):
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    branch: Optional[str] = None
    semester: Optional[int] = None
    cgpa: Optional[float] = None
    skills: Optional[str] = None
    certifications: Optional[str] = None
    projects: Optional[str] = None
    experience: Optional[str] = None
    career_interests: Optional[str] = None
    preferred_role: Optional[str] = None
    resume_url: Optional[str] = None
    college: Optional[str] = "K. J. Somaiya College of Engineering"

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    branch: Optional[str] = None
    semester: Optional[int] = None
    cgpa: Optional[float] = None
    skills: Optional[str] = None
    certifications: Optional[str] = None
    projects: Optional[str] = None
    experience: Optional[str] = None
    career_interests: Optional[str] = None
    preferred_role: Optional[str] = None
    resume_url: Optional[str] = None
    college: Optional[str] = None

class StudentResponse(StudentBase):
    id: int
    user_id: int
    profile_completion: float

    class Config:
        from_attributes = True


# --- Job Schemas ---
class JobBase(BaseModel):
    title: str
    description: str
    work_type: str = "full-time"  # full-time, intern, part-time, remote
    location: str
    salary: Optional[str] = None
    experience_level: Optional[str] = None
    required_skills: str
    eligibility_cgpa: float = 0.0
    is_placement: bool = True
    is_internship: bool = False
    is_active: bool = True

class JobCreate(JobBase):
    company_id: Optional[int] = None  # If posting as logged-in recruiter

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    work_type: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    experience_level: Optional[str] = None
    required_skills: Optional[str] = None
    eligibility_cgpa: Optional[float] = None
    is_placement: Optional[bool] = None
    is_internship: Optional[bool] = None
    is_active: Optional[bool] = None

class JobResponse(JobBase):
    id: int
    company_id: int
    company: CompanyResponse
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# --- Application Schemas ---
class ApplicationBase(BaseModel):
    job_id: int
    resume_url: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    status: str
    feedback: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    student_id: int
    resume_url: Optional[str] = None
    status: str
    match_score: float
    applied_at: datetime.datetime
    feedback: Optional[str] = None
    job: JobResponse
    student: StudentResponse

    class Config:
        from_attributes = True


# --- Assessment Schemas ---
class AssessmentBase(BaseModel):
    type: str  # aptitude, logical, personality, technical
    score: float
    total_questions: int
    domain_scores: Optional[str] = None  # JSON string
    strength_report: Optional[str] = None
    weakness_report: Optional[str] = None

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentResponse(AssessmentBase):
    id: int
    student_id: int
    completed_at: datetime.datetime

    class Config:
        from_attributes = True


# --- Resume Report Schemas ---
class ResumeReportResponse(BaseModel):
    id: int
    student_id: int
    ats_score: float
    missing_skills: Optional[str] = None  # JSON string list
    improvement_suggestions: Optional[str] = None  # JSON string list
    strength_analysis: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# --- Course Recommendation Schemas ---
class CourseRecommendationResponse(BaseModel):
    id: int
    student_id: int
    course_title: str
    platform: str
    is_paid: bool
    link: Optional[str] = None
    matched_skills: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    is_read: bool
    type: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# --- Interview Schemas ---
class InterviewCreate(BaseModel):
    job_id: Optional[int] = None
    recruiter_id: Optional[int] = None
    type: str = "technical"  # technical, behavioral, hr

class InterviewSchedule(BaseModel):
    student_id: int
    job_id: int
    type: str = "technical"  # technical, behavioral, hr
    interview_date: datetime.datetime
    location: str  # meet url or room

class InterviewFeedbackUpdate(BaseModel):
    feedback: str
    notes: Optional[str] = None
    status: str = "completed"  # completed, under_review, selected, rejected
    performance_score: Optional[float] = None

class InterviewSubmit(BaseModel):
    questions: str  # JSON list string
    answers: str  # JSON list string

class InterviewResponse(BaseModel):
    id: int
    student_id: int
    job_id: Optional[int] = None
    recruiter_id: Optional[int] = None
    type: str
    status: str
    interview_date: datetime.datetime
    location: Optional[str] = None
    notes: Optional[str] = None
    questions: Optional[str] = None
    answers: Optional[str] = None
    feedback: Optional[str] = None
    confidence_score: Optional[float] = None
    performance_score: Optional[float] = None
    student: Optional[StudentResponse] = None
    job: Optional[JobResponse] = None

    class Config:
        from_attributes = True


# --- Saved Opportunities ---
class SavedOpportunityCreate(BaseModel):
    job_id: Optional[int] = None
    company_id: Optional[int] = None

class SavedOpportunityResponse(BaseModel):
    id: int
    student_id: int
    job_id: Optional[int] = None
    company_id: Optional[int] = None
    created_at: datetime.datetime
    job: Optional[JobResponse] = None
    company: Optional[CompanyResponse] = None

    class Config:
        from_attributes = True


# --- Recruiter Team Management ---
class TeamMemberAdd(BaseModel):
    email: EmailStr
    password: str
    name: str
    designation: Optional[str] = None


# --- Recruiter Dashboard Analytics ---
class RecruiterDashboardAnalytics(BaseModel):
    active_jobs: int
    active_internships: int
    total_applicants: int
    shortlisted_candidates: int
    interviews_scheduled: int
    hired_candidates: int
    hiring_funnel: dict  # e.g., {"applied": 5, "under_review": 2, "shortlisted": 1, ...}
    application_trends: List[dict]  # list of {date: str, count: int}
    in_demand_skills: List[dict]  # list of {skill: str, count: int}


# --- Dashboard / Analytics Analytics Schemas ---
class DashboardAnalytics(BaseModel):
    placement_rate: float
    internship_success_rate: float
    skill_trends: List[dict]  # list of {name: str, count: int}
    student_growth: List[dict]  # list of {month: str, count: int}
    course_completion_stats: List[dict]  # list of {platform: str, count: int}
