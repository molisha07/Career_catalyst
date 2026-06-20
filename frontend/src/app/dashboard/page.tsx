"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../utils/api";
import Navbar from "../../components/Navbar";
import Sidebar, { PageName } from "../../components/Sidebar";

// Student sub-components (views)
import StudentDashboard from "../../components/StudentDashboard";
import ResumeAnalyzer from "../../components/ResumeAnalyzer";
import SkillGap from "../../components/SkillGap";
import Assessment from "../../components/Assessment";
import MockInterview from "../../components/MockInterview";
import ChatMentor from "../../components/ChatMentor";
import JobsInternships from "../../components/JobsInternships";
import AnalyticsDashboard from "../../components/AnalyticsDashboard";
import SavedOpportunities from "../../components/SavedOpportunities";

// Recruiter sub-components (views)
import RecruiterDashboard from "../../components/RecruiterDashboard";
import JobManagement from "../../components/JobManagement";
import ApplicantManagement from "../../components/ApplicantManagement";
import TalentSearch from "../../components/TalentSearch";
import RecruiterInterviews from "../../components/RecruiterInterviews";
import CompanyProfile from "../../components/CompanyProfile";

export default function DashboardController() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<PageName>("dashboard");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUser();
  }, [router]);

  const fetchUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data);
      // Auto switch activePage to Recruiter default if they are a recruiter
      if (data.role?.toLowerCase() === "recruiter") {
        setActivePage("recruiter-dashboard");
      }
    } catch (e) {
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center text-slate-500 font-sans">
        <div className="h-10 w-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-4" />
        <span className="text-sm font-semibold tracking-wide">Syncing Portal Profile...</span>
      </div>
    );
  }

  // Render proper subpage component
  const renderActivePage = () => {
    switch (activePage) {
      // Student subpages
      case "dashboard":
        return <StudentDashboard user={user} refreshUser={fetchUser} />;
      case "resume":
        return <ResumeAnalyzer />;
      case "skill-gap":
        return <SkillGap />;
      case "assessment":
        return <Assessment />;
      case "mock-interview":
        return <MockInterview />;
      case "chatbot":
        return <ChatMentor />;
      case "jobs":
        return <JobsInternships />;
      case "analytics":
        return <AnalyticsDashboard />;

      // Recruiter subpages
      case "recruiter-dashboard":
        return <RecruiterDashboard user={user} />;
      case "recruiter-jobs":
        return <JobManagement />;
      case "recruiter-applicants":
        return <ApplicantManagement />;
      case "recruiter-search":
        return <TalentSearch />;
      case "recruiter-interviews":
        return <RecruiterInterviews />;
      case "recruiter-company":
        return <CompanyProfile />;
      case "recruiter-analytics":
        return <RecruiterDashboard user={user} />; // Re-uses dashboard stats graph panel for premium analytics view
      
      default:
        return user?.role?.toLowerCase() === "recruiter" 
          ? <RecruiterDashboard user={user} />
          : <StudentDashboard user={user} refreshUser={fetchUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col overflow-hidden text-slate-900 font-sans">
      <Navbar userEmail={user?.email || ""} userRole={user?.role || ""} onLogout={handleLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} setActivePage={setActivePage} role={user?.role || ""} />
        
        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f5f6f8]">
          <div className="max-w-7xl mx-auto w-full">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
  );
}
