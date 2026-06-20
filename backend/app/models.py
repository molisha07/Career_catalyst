import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="student")  # student, recruiter, admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    recruiter_profile = relationship("Recruiter", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    location = Column(String, nullable=True)
    industry = Column(String, nullable=True)

    # Relationships
    recruiters = relationship("Recruiter", back_populates="company")
    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")


class Recruiter(Base):
    __tablename__ = "recruiters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True)
    name = Column(String, nullable=False)
    designation = Column(String, nullable=True)

    # Relationships
    user = relationship("User", back_populates="recruiter_profile")
    company = relationship("Company", back_populates="recruiters")
    interviews = relationship("Interview", back_populates="recruiter")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    branch = Column(String, nullable=True)
    semester = Column(Integer, nullable=True)
    cgpa = Column(Float, nullable=True)
    skills = Column(String, nullable=True)  # Comma-separated list
    certifications = Column(String, nullable=True)  # Comma-separated list
    projects = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    career_interests = Column(String, nullable=True)
    preferred_role = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    college = Column(String, default="K. J. Somaiya College of Engineering")
    profile_completion = Column(Float, default=0.0)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="student", cascade="all, delete-orphan")
    resume_reports = relationship("ResumeReport", back_populates="student", cascade="all, delete-orphan")
    course_recommendations = relationship("CourseRecommendation", back_populates="student", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="student", cascade="all, delete-orphan")
    saved_opportunities = relationship("SavedOpportunity", back_populates="student", cascade="all, delete-orphan")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    work_type = Column(String, default="full-time")  # full-time, intern, part-time, remote
    location = Column(String, nullable=False)
    salary = Column(String, nullable=True)
    experience_level = Column(String, nullable=True)
    required_skills = Column(String, nullable=False)  # Comma-separated list
    eligibility_cgpa = Column(Float, default=0.0)
    is_placement = Column(Boolean, default=True)
    is_internship = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    company = relationship("Company", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="job", cascade="all, delete-orphan")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    resume_url = Column(String, nullable=True)
    status = Column(String, default="applied")  # applied, shortlisted, rejected, interview_scheduled
    match_score = Column(Float, default=0.0)
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)
    feedback = Column(Text, nullable=True)

    # Relationships
    job = relationship("Job", back_populates="applications")
    student = relationship("Student", back_populates="applications")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)  # aptitude, logical, personality, technical
    score = Column(Float, nullable=False)
    total_questions = Column(Integer, nullable=False)
    domain_scores = Column(Text, nullable=True)  # JSON string
    strength_report = Column(Text, nullable=True)
    weakness_report = Column(Text, nullable=True)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="assessments")


class ResumeReport(Base):
    __tablename__ = "resume_reports"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    ats_score = Column(Float, nullable=False)
    missing_skills = Column(Text, nullable=True)  # JSON string list
    improvement_suggestions = Column(Text, nullable=True)  # JSON string list
    strength_analysis = Column(Text, nullable=True)
    resume_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="resume_reports")


class CourseRecommendation(Base):
    __tablename__ = "course_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    course_title = Column(String, nullable=False)
    platform = Column(String, nullable=False)  # Coursera, Udemy, NPTEL, edX, YouTube
    is_paid = Column(Boolean, default=False)
    link = Column(String, nullable=True)
    matched_skills = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="course_recommendations")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    type = Column(String, default="alert")  # placement, internship, interview, alert
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notifications")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True)
    recruiter_id = Column(Integer, ForeignKey("recruiters.id", ondelete="SET NULL"), nullable=True)
    type = Column(String, default="technical")  # technical, behavioral, hr
    status = Column(String, default="scheduled")  # scheduled, completed, under_review, selected, rejected
    interview_date = Column(DateTime, default=datetime.datetime.utcnow)
    location = Column(String, nullable=True)  # meeting link or room venue
    notes = Column(Text, nullable=True)  # recruiter notes
    questions = Column(Text, nullable=True)  # JSON string list
    answers = Column(Text, nullable=True)  # JSON string list
    feedback = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True)
    performance_score = Column(Float, nullable=True)

    # Relationships
    student = relationship("Student", back_populates="interviews")
    job = relationship("Job", back_populates="interviews")
    recruiter = relationship("Recruiter", back_populates="interviews")


class SavedOpportunity(Base):
    __tablename__ = "saved_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="saved_opportunities")
    job = relationship("Job")
    company = relationship("Company")
