-- Database Schema for Career Catalyst Platform
-- Compatible with PostgreSQL 15+

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'recruiter', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    website VARCHAR(255),
    logo_url VARCHAR(255),
    location VARCHAR(255),
    industry VARCHAR(255)
);

-- 3. Recruiters Table
CREATE TABLE IF NOT EXISTS recruiters (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id INT REFERENCES companies(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255)
);

-- 4. Students Table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(50),
    branch VARCHAR(255),
    semester INT,
    cgpa NUMERIC(4, 2),
    skills TEXT, -- Comma-separated
    certifications TEXT, -- Comma-separated
    projects TEXT,
    experience TEXT,
    career_interests VARCHAR(255),
    preferred_role VARCHAR(255),
    resume_url VARCHAR(255),
    profile_completion NUMERIC(5, 2) DEFAULT 0.0
);

-- 5. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    work_type VARCHAR(100) DEFAULT 'full-time',
    location VARCHAR(255) NOT NULL,
    salary VARCHAR(100),
    experience_level VARCHAR(100),
    required_skills TEXT NOT NULL,
    eligibility_cgpa NUMERIC(4, 2) DEFAULT 0.0,
    is_placement BOOLEAN DEFAULT TRUE,
    is_internship BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    resume_url VARCHAR(255),
    status VARCHAR(100) DEFAULT 'applied',
    match_score NUMERIC(5, 2) DEFAULT 0.0,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feedback TEXT
);

-- 7. Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- aptitude, logical, personality, technical
    score NUMERIC(5, 2) NOT NULL,
    total_questions INT NOT NULL,
    domain_scores TEXT, -- JSON string
    strength_report TEXT,
    weakness_report TEXT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. ResumeReports Table
CREATE TABLE IF NOT EXISTS resume_reports (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    ats_score NUMERIC(5, 2) NOT NULL,
    missing_skills TEXT, -- JSON string list
    improvement_suggestions TEXT, -- JSON string list
    strength_analysis TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. CourseRecommendations Table
CREATE TABLE IF NOT EXISTS course_recommendations (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_title VARCHAR(255) NOT NULL,
    platform VARCHAR(100) NOT NULL, -- Coursera, Udemy, NPTEL, edX, YouTube
    is_paid BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    matched_skills TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type VARCHAR(100) DEFAULT 'alert',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    job_id INT REFERENCES jobs(id) ON DELETE SET NULL,
    recruiter_id INT REFERENCES recruiters(id) ON DELETE SET NULL,
    type VARCHAR(100) DEFAULT 'technical',
    status VARCHAR(100) DEFAULT 'scheduled',
    interview_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    questions TEXT, -- JSON list
    answers TEXT, -- JSON list
    feedback TEXT,
    confidence_score NUMERIC(5, 2),
    performance_score NUMERIC(5, 2)
);
