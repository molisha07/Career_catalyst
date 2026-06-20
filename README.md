# 🚀 Career Catalyst — AI-Powered Dual-Dashboard Career Platform

**Career Catalyst** is a comprehensive, production-ready, full-stack platform designed to bridge the gap between student career development and corporate hiring management. Built using a modern technical stack, it features a dual-dashboard architecture: an interactive career growth portal for students and a complete Hiring Management System (HMS) console for recruiters.

---

## 🌟 Key Features

### 🎓 Student Opportunities & Career Growth Portal
* **Dashboard Overview**: Dynamic tracking of profile completion percentage, ATS resume scores, placement readiness, and internship readiness metrics.
* **My Applications (Pipeline Tracking)**: A complete, structured history of all submitted applications tracking:
  - Title, company, applied date, current status, match percentage, and resume version used.
  - Visual status pipeline: `Applied ➔ Under Review ➔ Shortlisted ➔ Interview Scheduled ➔ Selected ➔ Rejected`.
  - Full support to search, filter by status, and safely withdraw applications.
* **Opportunities Center**: A comprehensive jobs and internship project finder equipped with indicators for Paid/Unpaid stipend, Hybrid/Remote models, and AI profile match percentage.
* **Saved Opportunities**: Distinct tab-based bookmarks to track saved jobs, internships, and corporate entities.
* **Resume Center**: Multi-version PDF resume uploader, dynamic profile details builder, and historical ATS suggestion reports.
* **AI Mock Interviews**: Custom role-based prompt generation with automated grading of typed responses (correctness, tone, communication skills).
* **Skill Gap Analysis**: Technical evaluation comparing student profiles against industrial requirements, rendering custom roadmaps, and course recommendations.
* **Assessment Engine**: Quantitative, logical, and technical MCQ exam dashboard generating instant scorecards.
* **AI Career Chatbot**: RAG-powered interactive career coach leveraging local resource documents.

### 🏢 Recruiter Hiring Management System (HMS)
* **Hiring Dashboard**: Visual cards showing key metrics (Active Jobs, Active Internships, Total Candidates, Shortlisted, Scheduled Interviews, Hires) and a visual hiring funnel analysis.
* **Opportunity HMS**: Full posting console to publish, edit, close (toggle active status), or permanently delete job/internship listings.
* **Candidate Tracking Kanban (ATS)**: Columns matching each application state. Allows recruiters to review complete candidate profiles (CGPA, Branch, Skills, Certifications, Projects, Experience), download active resumes, transition candidates, and trigger interview scheduling.
* **AI Candidate Ranking**: Automated analysis of resume files and profile metrics against job requirements, providing match scores, qualitative strengths, and hiring recommendations.
* **Talent Discovery engine**: Advanced multi-filter database queries searching for students by specific branches, minimum CGPA thresholds, skills keywords, and certifications.
* **Interview Panel**: Meeting scheduler linking Google Meet URLs, performance notes, quantitative grading, and feedback logs.
* **Company Profile**: Public-facing corporate profile editor to modify sectors, sizes, locations, and descriptions.

---

## 🛠️ Technology Stack & Project Structure

The project is split into a Next.js frontend and a FastAPI backend:

* **Frontend**: Next.js 15 (React), Tailwind CSS, TypeScript, Lucide Icons, HTML5 Semantic Elements.
* **Backend**: FastAPI (Python), SQLAlchemy ORM, Pydantic data validation, JWT OAuth2 Authentication.
* **Databases**: SQLite (zero-configuration local database), PostgreSQL (scalable production integration).
* **AI Engines**: LangChain & OpenAI integrations (glowing cloud evaluation with automatic local semantic fallback if no key is present).

### File Directory Structure
```
CC (Workspace Root)
├── backend/
│   ├── app/
│   │   ├── ai/               # AI & ML Engines (Resume, Mock Interview, Skill Gap, Chatbot)
│   │   ├── auth/             # JWT Authentication & Cryptography utils
│   │   ├── routers/          # API Controllers (students, jobs, assessments, interviews, etc.)
│   │   ├── database.py       # Session maker & database engines
│   │   ├── models.py         # SQLAlchemy schema models
│   │   ├── schemas.py        # Pydantic schema validation structures
│   │   └── main.py           # FastAPI entry point
│   ├── requirements.txt      # Python dependencies list
│   └── Dockerfile            # Container definition for backend
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router (Landing, Auth, Dashboards)
│   │   ├── components/       # Reusable UI dashboard panels & portals
│   │   └── utils/            # Shared Fetch API client
│   ├── tailwind.config.ts    # Styling configurations
│   ├── package.json          # Frontend packages list
│   └── Dockerfile            # Container definition for frontend
├── docker-compose.yml        # Multi-container orchestration definition
└── database_schema.sql       # Pure SQL layout fallback schema
```

---

## 🚀 Installation & Local Startup

### Option A: Local Run Profile (Zero-Configuration, ~30 Seconds)
Ideal for local testing without external database dependencies.

1. **Backend Setup**:
   ```bash
   cd backend
   # Create a virtual environment and install requirements
   python -m venv .venv
   .venv\Scripts\activate   # On Windows (use source .venv/bin/activate on Unix)
   pip install -r requirements.txt
   
   # Start the development server
   python -m app.main
   ```
   *The backend will automatically start at `http://localhost:8000`. On startup, it checks for an existing SQLite database. If none is found, it automatically compiles all tables and seeds mock student and company datasets.*

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The Next.js client will start at `http://localhost:3000`.*

---

### Option B: Docker Containerized Profile (Production-grade Orchestration)
Ideal for testing under production configurations with an isolated database.

From the workspace root directory:
```bash
docker-compose up --build
```
This command automatically spins up and links:
1. **`db`**: PostgreSQL container with isolated volume persistence.
2. **`backend`**: FastAPI container connected to PostgreSQL.
3. **`frontend`**: Next.js client served locally.

---

## 🔑 Pre-Seeded Accounts for Testing

On database compilation, the platform automatically registers the following credential profiles to let you test dashboard configurations instantly:

### Student Accounts
| Email | Password | Academic Branch | CGPA |
| :--- | :--- | :--- | :--- |
| **molisha@somaiya.edu** | `molisha123` | Artificial Intelligence & Data Science | 7.9 |
| **harshi@somaiya.edu** | `harshi123` | Computer Science | 8.0 |
| **krisha@somaiya.edu** | `krisha123` | Electronics | 8.8 |
| **krish@somaiya.edu** | `password123` | Information Technology | 5.5 |

### Recruiter Accounts
| Email | Password | Company Entity | Designation |
| :--- | :--- | :--- | :--- |
| **recruiter.google@google.com** | `recruitergoogle` | GOOGLE | Lead Recruiter |
| **recruiter.amazon@amazon.com** | `recruiteramazon` | AMAZON | Talent Advisor |

---

## 🧪 API Verification & Testing

1. **Swagger UI Doc Panel**:
   FastAPI exposes interactive Open API documentation. Visit `http://localhost:8000/docs` to test endpoints, headers, and request models directly from your browser.
2. **Next.js Production Build**:
   Verify frontend production builds by running `npm run build` inside the `frontend` folder to guarantee clean imports and routing compliance.
