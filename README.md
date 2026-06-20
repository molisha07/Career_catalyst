# Career Catalyst – AI-Powered Career Platform

**Career Catalyst** is a production-ready, full-stack career development and placement recommendation engine. It enables students to calculate ATS resume scores, identify technical skill gaps, review step-by-step study roadmaps, complete quantitative assessments, practice AI-driven mock interviews, and apply for remote internships or full-time corporate roles.

The application automatically supports a **Dual-Database architecture** (zero-configuration SQLite locally, scalable PostgreSQL in Docker/Production) and a **Dual AI Evaluation engine** (glowing cloud OpenAI/LangChain integrations, falling back to a robust built-in local semantic keyword analyzer if no active API key is provided).

---

## 🚀 Get Started (Choose Your Run Profile)

### Profile A: Local Zero-Configuration Launch (10 Seconds)
Perfect for instant testing on your local machine without requiring external databases or tools.

1. **Start the FastAPI Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m app.main
   ```
   *The backend will automatically start at `http://localhost:8000`. On startup, it instantly compiles all database tables and seeds them with original candidate records and placement openings.*

2. **Start the Next.js 15 Client**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend client will automatically start at `http://localhost:3000` with visual dark layouts and auto-refresh mechanisms.*

---

### Profile B: Full Multi-Container Compose Launch
Perfect for production-grade testing under isolated environments mimicking cloud services.

1. **Spin up containers**:
   From the workspace root directory:
   ```bash
   docker-compose up --build
   ```
   This orchestrates:
   * **Database Container**: Isolated PostgreSQL service.
   * **Backend Container**: FastAPI server connected to PG.
   * **Frontend Container**: Next.js client with volume mapping.

---

## 🔑 Pre-Seeded Accounts for Testing

On database initialization, the system automatically seeds the database with the original dataset from your static files. You can log in using these credentials instantly:

### Student Accounts
| Email | Password | CGPA | Branch |
| :--- | :--- | :--- | :--- |
| **molisha@somaiya.edu** | `molisha123` | 7.9 | Artificial Intelligence & Data Science |
| **harshi@somaiya.edu** | `harshi123` | 8.0 | Computer Science |
| **krisha@somaiya.edu** | `krisha123` | 8.8 | Electronics |
| **krish@somaiya.edu** | `password123` | 5.5 | Information Technology |

### Recruiter Accounts
| Email | Password | Linked Corporate Entity | Designation |
| :--- | :--- | :--- | :--- |
| **recruiter.google@google.com** | `recruitergoogle` | GOOGLE | Lead Recruiter |
| **recruiter.amazon@amazon.com** | `recruiteramazon` | AMAZON | Talent Advisor |

---

## 🛠️ System Architecture & API Gateway

```
CC (Workspace root)
├── backend/
│   ├── app/
│   │   ├── ai/               # AI & ML Engines (Resume, Mock Interview, Skill Gap, RAG Chat)
│   │   ├── auth/             # Password & JWT token logic
│   │   ├── routers/          # API Controllers (students, jobs, assessments, interviews, etc.)
│   │   ├── database.py       # Session maker & connection engines
│   │   ├── models.py         # SQLAlchemy DB schemas
│   │   ├── schemas.py        # Pydantic request models
│   │   └── main.py           # FastAPI server entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js 15 routing (Landing, Login, Register, Dashboards)
│   │   ├── components/       # Visual subpage modules (Assessments, Mock Interviews, Skill Gap)
│   │   └── utils/            # Centered fetch communication client
│   └── package.json
```

### Core API Endpoints Index
* **Authentication**:
  * `POST /api/auth/signup` - Creates credentials, automatically registers profiles.
  * `POST /api/auth/login` - Returns JWT bearer token.
  * `GET /api/auth/me` - Verifies token validity and user context.
* **Student Operations**:
  * `GET /api/students/profile` - Fetches academic CGPA, semester, branch.
  * `PUT /api/students/profile` - Updates fields, auto-recalculating profile completeness.
  * `POST /api/students/resume/analyze` - Parses PDF resumes, returns ATS reports.
  * `GET /api/students/skill-gap` - Returns required skills vs student skills, course suggestions, and roadmaps.
* **Testing & Assessments**:
  * `GET /api/assessments/questions` - Pulls questions per category (Aptitude, Logical, Tech).
  * `POST /api/assessments/submit` - Evaluates choices, returns scorecard analysis.
* **AI Interactive mock rounds**:
  * `GET /api/interviews/questions` - Renders custom HR or Technical prompts.
  * `POST /api/interviews/submit` - Scores typed answers, yields correctness and communication grids.
* **RAG Career Chatbot**:
  * `POST /api/chats/message` - Searches local guidelines vector space and generates mentor advice.

---

## 🧪 Verifications & Tests

To execute tests and verify API operations:
1. Ensure packages in `backend/requirements.txt` are active.
2. Spin up FastAPI locally or via containers.
3. Test JWT schemas and API controllers by visiting the interactive Swagger UI:
   `http://localhost:8000/docs`
