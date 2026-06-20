import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from . import models, auth
from .routers import auth as auth_router, students, jobs, assessments, interviews, chats, analytics, notifications

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Career Catalyst API",
    description="Scalable backend engine for placement recommendation, resume scoring, skill-gap analysis, mock interviews, and AI mentor conversations.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Supports dynamic staging and local clients
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bind routers
app.include_router(auth_router.router, prefix="/api")
app.include_router(students.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")
app.include_router(assessments.router, prefix="/api")
app.include_router(interviews.router, prefix="/api")
app.include_router(chats.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the Career Catalyst AI Engine",
        "documentation": "/docs"
    }

# Seed Initial Data
def seed_data():
    db = SessionLocal()
    try:
        print("Seeding initial data from original database script...")
        
        # 1. Seed Companies (get-or-create)
        companies_to_seed = [
            {"name": "GOOGLE", "description": "Global technology leader in search, AI, cloud computing, and hardware.", "website": "https://google.com", "location": "Mumbai, India", "industry": "Technology"},
            {"name": "YOUTUBE", "description": "Video sharing and streaming platform owned by Google.", "website": "https://youtube.com", "location": "Bengaluru, India", "industry": "Media & Tech"},
            {"name": "TCS", "description": "Global IT services and consulting giant.", "website": "https://tcs.com", "location": "Pune, India", "industry": "IT Services"},
            {"name": "JPMORGAN", "description": "Multinational financial services firm.", "website": "https://jpmorgan.com", "location": "Remote", "industry": "Finance"},
            {"name": "AMAZON", "description": "E-commerce and cloud computing pioneer.", "website": "https://amazon.com", "location": "Mumbai, India", "industry": "E-Commerce & Tech"},
            {"name": "MICROSOFT", "description": "Leading operating systems, cloud, and productivity software enterprise.", "website": "https://microsoft.com", "location": "Bengaluru, India", "industry": "Technology"},
            {"name": "FACEBOOK", "description": "Social media and metaverse pioneer.", "website": "https://meta.com", "location": "Remote", "industry": "Social Media"},
            {"name": "ADOBE", "description": "Creative and digital experiences platform leader.", "website": "https://adobe.com", "location": "Mumbai, India", "industry": "Software"},
            {"name": "NVIDIA", "description": "GPU manufacturing and AI computing infrastructure industry leader.", "website": "https://nvidia.com", "location": "Bengaluru, India", "industry": "Hardware & AI"}
        ]
        
        company_instances = {}
        for c in companies_to_seed:
            existing_company = db.query(models.Company).filter(models.Company.name == c["name"]).first()
            if not existing_company:
                company = models.Company(**c)
                db.add(company)
                db.commit()
                db.refresh(company)
                company_instances[c["name"]] = company
            else:
                company_instances[c["name"]] = existing_company

        # 2. Seed Users & Students
        student_users = [
            {
                "email": "krish@somaiya.edu",
                "password": "password123",
                "role": "student",
                "name": "Krish",
                "cgpa": 5.5,
                "semester": 5,
                "branch": "Information Technology",
                "experience": "1 month Intern at Indeed.com",
                "skills": "HTML, CSS, JS"
            },
            {
                "email": "krisha@somaiya.edu",
                "password": "krisha123",
                "role": "student",
                "name": "Krisha",
                "cgpa": 8.8,
                "semester": 5,
                "branch": "Electronics",
                "experience": "Intern at TCS",
                "certifications": "Python, VLSI Technology",
                "skills": "VLSI Technology, Verilog, UAV Technology, Machine Learning"
            },
            {
                "email": "harshi@somaiya.edu",
                "password": "harshi123",
                "role": "student",
                "name": "Harshi",
                "cgpa": 8.0,
                "semester": 6,
                "branch": "Computer Science",
                "experience": "1 year at Axis Bank Ltd.",
                "certifications": "Java, Spring Boot",
                "skills": "Java, C++, Python, Cloud Computing, MySQL"
            },
            {
                "email": "molisha@somaiya.edu",
                "password": "molisha123",
                "role": "student",
                "name": "Molisha",
                "cgpa": 7.9,
                "semester": 6,
                "branch": "Artificial Intelligence And Data Science",
                "certifications": "Machine Learning, AI",
                "skills": "Machine Learning, AI, Python, Data Science"
            }
        ]

        for s_data in student_users:
            existing_user = db.query(models.User).filter(models.User.email == s_data["email"]).first()
            if not existing_user:
                hashed_pw = auth.get_password_hash(s_data["password"])
                user = models.User(email=s_data["email"], hashed_password=hashed_pw, role=s_data["role"])
                db.add(user)
                db.commit()
                db.refresh(user)

                student = models.Student(
                    user_id=user.id,
                    name=s_data["name"],
                    cgpa=s_data["cgpa"],
                    semester=s_data["semester"],
                    branch=s_data["branch"],
                    experience=s_data.get("experience"),
                    certifications=s_data.get("certifications"),
                    skills=s_data["skills"],
                    profile_completion=80.0
                )
                db.add(student)
                db.commit()

        # 3. Seed Recruiters (Google & Amazon Recruiters)
        recruiter_users = [
            {"email": "recruiter.google@google.com", "password": "recruitergoogle", "role": "recruiter", "name": "Google Talent", "company": "GOOGLE", "designation": "Lead Recruiter"},
            {"email": "recruiter.amazon@amazon.com", "password": "recruiteramazon", "role": "recruiter", "name": "Amazon Talent", "company": "AMAZON", "designation": "Talent Advisor"}
        ]

        for r_data in recruiter_users:
            existing_user = db.query(models.User).filter(models.User.email == r_data["email"]).first()
            if not existing_user:
                hashed_pw = auth.get_password_hash(r_data["password"])
                user = models.User(email=r_data["email"], hashed_password=hashed_pw, role=r_data["role"])
                db.add(user)
                db.commit()
                db.refresh(user)

                comp = company_instances.get(r_data["company"])
                recruiter = models.Recruiter(
                    user_id=user.id,
                    company_id=comp.id if comp else None,
                    name=r_data["name"],
                    designation=r_data["designation"]
                )
                db.add(recruiter)
                db.commit()

        # 4. Seed Jobs
        jobs_to_seed = [
            { "company_name": "YOUTUBE", "title": "SOFTWARE ENGINEER", "work_type": "full-time", "salary": "12 L.P.A", "location": "BENGALURU, INDIA", "experience_level": "0-3 YEARS", "required_skills": "PYTHON, C, C++, JAVA, JS", "eligibility_cgpa": 6.0, "is_placement": True, "is_internship": False, "description": "Join YouTube Engineering to build high-performance distributed systems, optimize video encoding, and deliver standard web experiences." },
            { "company_name": "GOOGLE", "title": "AI DATA TRUST ENGINEER", "work_type": "full-time", "salary": "17 L.P.A", "location": "MUMBAI, INDIA", "experience_level": "1-3 YEARS", "required_skills": "MACHINE LEARNING, DATA SCIENCE, JS, PYTHON, C", "eligibility_cgpa": 6.5, "is_placement": True, "is_internship": False, "description": "Ensure data models satisfy rigorous safety standards. Develop algorithms for screening training data corpora and auditing deep learning networks." },
            { "company_name": "TCS", "title": "CLOUD COMPUTING ENGINEER", "work_type": "intern", "salary": "PERFORMANCE BASED STIPEND", "location": "PUNE, INDIA", "experience_level": "FRESHERS", "required_skills": "PYTHON, C, C++, JAVA, JS, MICROSOFT OFFICE", "eligibility_cgpa": 5.5, "is_placement": False, "is_internship": True, "description": "Excellent entry-level internship to work alongside certified architects deploying standard cloud migrations on AWS." },
            { "company_name": "JPMORGAN", "title": "SOFTWARE ENGINEER", "work_type": "intern", "salary": "PERFORMANCE BASED STIPEND", "location": "REMOTE", "experience_level": "FRESHERS", "required_skills": "PYTHON, C, C++, JAVA, JS, MICROSOFT OFFICE", "eligibility_cgpa": 6.0, "is_placement": False, "is_internship": True, "description": "Internship focusing on enterprise fintech products. Support agile sprints updating dashboard user experiences." },
            { "company_name": "AMAZON", "title": "UI/UX DESIGNER", "work_type": "intern", "salary": "PERFORMANCE BASED STIPEND", "location": "MUMBAI, INDIA", "experience_level": "FRESHERS", "required_skills": "PYTHON, C, C++, JAVA, JS, MICROSOFT OFFICE", "eligibility_cgpa": 6.0, "is_placement": False, "is_internship": True, "description": "Create intuitive wireframes, study checkout user funnels, and prototype Next-gen mobile shopping views." },
            { "company_name": "MICROSOFT", "title": "SYSTEM ENGINEER", "work_type": "full-time", "salary": "20 L.P.A", "location": "BENGALURU, INDIA", "experience_level": "2-4 YEARS", "required_skills": "CLOUD COMPUTING, DATA SCIENCE, PYTHON, JS", "eligibility_cgpa": 6.0, "is_placement": True, "is_internship": False, "description": "Maintain reliability systems on Azure. Design automated monitors, cluster controllers, and cloud firewalls." },
            { "company_name": "FACEBOOK", "title": "DATA SCIENTIST", "work_type": "full-time", "salary": "18 L.P.A", "location": "REMOTE", "experience_level": "1-3 YEARS", "required_skills": "DATA ANALYSIS, MACHINE LEARNING, PYTHON, SQL", "eligibility_cgpa": 6.5, "is_placement": True, "is_internship": False, "description": "Perform regression diagnostics on user engagement models. Support product groups building targeted notification algorithms." }
        ]

        for j in jobs_to_seed:
            comp = company_instances.get(j["company_name"])
            if comp:
                existing_job = db.query(models.Job).filter(models.Job.title == j["title"], models.Job.company_id == comp.id).first()
                if not existing_job:
                    job = models.Job(
                        company_id=comp.id,
                        title=j["title"],
                        description=j["description"],
                        work_type=j["work_type"],
                        location=j["location"],
                        salary=j["salary"],
                        experience_level=j["experience_level"],
                        required_skills=j["required_skills"],
                        eligibility_cgpa=j["eligibility_cgpa"],
                        is_placement=j["is_placement"],
                        is_internship=j["is_internship"]
                    )
                    db.add(job)
                    db.commit()

        print("Initial database seeding completed successfully.")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

# Execute database seeding synchronously during startup
seed_data()

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
