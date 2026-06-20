"use client";
import React from "react";
import {
  LayoutDashboard,
  FileSearch,
  Sliders,
  Award,
  Mic,
  MessageCircle,
  Briefcase,
  TrendingUp,
  UserCheck,
  Search,
  Calendar,
  Building
} from "lucide-react";

export type PageName = 
  // Student pages
  | "dashboard" 
  | "resume" 
  | "skill-gap" 
  | "assessment" 
  | "mock-interview" 
  | "chatbot" 
  | "jobs" 
  | "analytics"
  // Recruiter pages
  | "recruiter-dashboard" 
  | "recruiter-jobs" 
  | "recruiter-applicants" 
  | "recruiter-search" 
  | "recruiter-interviews" 
  | "recruiter-company" 
  | "recruiter-analytics";

interface SidebarProps {
  activePage: PageName;
  setActivePage: (page: PageName) => void;
  role: string;
}

export default function Sidebar({ activePage, setActivePage, role }: SidebarProps) {
  const studentItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "resume", label: "Resume Center", icon: FileSearch },
    { id: "skill-gap", label: "Skill Gap Analysis", icon: Sliders },
    { id: "assessment", label: "Career Assessment", icon: Award },
    { id: "mock-interview", label: "AI Mock Interview", icon: Mic },
    { id: "chatbot", label: "AI Career Mentor", icon: MessageCircle },
    { id: "jobs", label: "Opportunities Portal", icon: Briefcase },
    { id: "analytics", label: "Student Analytics", icon: TrendingUp },
  ];

  const recruiterItems = [
    { id: "recruiter-dashboard", label: "Hiring Dashboard", icon: LayoutDashboard },
    { id: "recruiter-jobs", label: "Opportunities HMS", icon: Briefcase },
    { id: "recruiter-applicants", label: "Hiring Pipeline (ATS)", icon: UserCheck },
    { id: "recruiter-search", label: "Talent Discovery", icon: Search },
    { id: "recruiter-interviews", label: "Interview Panel", icon: Calendar },
    { id: "recruiter-company", label: "Company Profile", icon: Building },
    { id: "recruiter-analytics", label: "Hiring Analytics", icon: TrendingUp },
  ];

  const isRecruiter = role.toLowerCase() === "recruiter";
  const items = isRecruiter ? recruiterItems : studentItems;

  return (
    <aside className="w-64 border-r border-slate-200 bg-white hidden md:flex flex-col h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-3 mb-2 block font-sans">
          {isRecruiter ? "Hiring Console Navigation" : "Student Portal Navigation"}
        </span>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as PageName)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition duration-150 text-left font-sans ${
                isActive
                  ? "bg-red-500/10 text-red-600 border-l-2 border-red-500 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon size={18} className={isActive ? "text-red-500" : "text-slate-400"} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 mb-2">
        <div className="px-3 text-xs text-slate-500 flex items-center gap-2 font-sans">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Active Account Role: <strong className="capitalize text-slate-700 font-semibold">{role}</strong>
        </div>
      </div>
    </aside>
  );
}
