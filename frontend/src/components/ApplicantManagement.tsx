"use client";
import React, { useState, useEffect } from "react";
import { User, FileText, ChevronRight, Check, X, Calendar, UserCheck, Star, ShieldAlert, Sparkles, Filter, Search } from "lucide-react";

export default function ApplicantManagement() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal schedule states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewType, setInterviewType] = useState("technical");
  const [interviewLocation, setInterviewLocation] = useState("https://meet.google.com/abc-defg-hij");

  // Detailed profile state
  const [viewingProfile, setViewingProfile] = useState<any>(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/jobs/recruiter/applicants", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      setApplicants(data);
      setFilteredApplicants(data);
    } catch (e) {
      // fallback mock applicants
      const mock = [
        {
          id: 101,
          job_id: 1,
          student_id: 4,
          resume_url: "/uploads/draft_resume.pdf",
          status: "applied",
          match_score: 82.5,
          applied_at: "2026-05-30T10:00:00",
          feedback: null,
          job: { id: 1, title: "SOFTWARE ENGINEER" },
          student: {
            id: 4,
            name: "Molisha",
            college: "K. J. Somaiya College of Engineering",
            branch: "Artificial Intelligence And Data Science",
            cgpa: 7.9,
            skills: "Machine Learning, AI, Python, Data Science",
            certifications: "Machine Learning, AI",
            projects: "AI Placement Grading Engine, ATS Parsing Engine",
            experience: "Deep Learning Research Intern at Somaiya Lab"
          }
        },
        {
          id: 102,
          job_id: 2,
          student_id: 2,
          resume_url: "/uploads/krisha_resume.pdf",
          status: "under_review",
          match_score: 91.0,
          applied_at: "2026-05-30T10:15:00",
          feedback: null,
          job: { id: 2, title: "AI DATA TRUST ENGINEER" },
          student: {
            id: 2,
            name: "Krisha",
            college: "K. J. Somaiya College of Engineering",
            branch: "Electronics",
            cgpa: 8.8,
            skills: "VLSI Technology, Verilog, UAV Technology, Machine Learning",
            certifications: "Python, VLSI Technology",
            projects: "UAV Autonomous Guidance Systems",
            experience: "Intern at Tata Consultancy Services"
          }
        }
      ];
      setApplicants(mock);
      setFilteredApplicants(mock);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = applicants;
    if (statusFilter !== "all") {
      filtered = filtered.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.student.name.toLowerCase().includes(q) || 
        a.job.title.toLowerCase().includes(q) || 
        a.student.skills.toLowerCase().includes(q)
      );
    }
    setFilteredApplicants(filtered);
  }, [searchQuery, statusFilter, applicants]);

  const updateStatus = async (appId: number, newStatus: string, feedbackText?: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/applications/${appId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          status: newStatus,
          feedback: feedbackText || `Moved to ${newStatus}`
        })
      });
      if (res.ok) {
        fetchApplicants();
      }
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleOpenSchedule = (app: any) => {
    setSelectedApplicant(app);
    setInterviewDate("");
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewDate || !selectedApplicant) return;

    try {
      const res = await fetch("http://localhost:8000/api/interviews/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          student_id: selectedApplicant.student.id,
          job_id: selectedApplicant.job.id,
          type: interviewType,
          interview_date: new Date(interviewDate).toISOString(),
          location: interviewLocation
        })
      });

      if (res.ok) {
        setShowScheduleModal(false);
        fetchApplicants();
        alert("Interview successfully scheduled and student notified!");
      }
    } catch (e) {
      alert("Failed to schedule interview");
    }
  };

  const getPipelineColumn = (stage: string, title: string, color: string) => {
    const list = applicants.filter(a => a.status.toLowerCase() === stage.toLowerCase());
    return (
      <div className="flex flex-col gap-3 min-w-[250px] bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-xs flex-1">
        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
          <span className={`text-[10px] uppercase font-black ${color} tracking-wider`}>{title}</span>
          <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold text-[9px]">{list.length}</span>
        </div>
        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
          {list.map((app, idx) => (
            <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2 hover:border-red-500 transition relative">
              
              {/* Match Grade */}
              <span className="absolute top-2 right-2 p-0.5 px-1.5 rounded bg-red-50 border border-red-100 text-[8px] font-bold text-red-500 flex items-center gap-0.5">
                <Sparkles size={8} /> {Math.round(app.match_score)}%
              </span>

              <div>
                <h4 className="font-bold text-slate-900 leading-snug">{app.student.name}</h4>
                <span className="text-[9px] text-slate-400 font-semibold">{app.student.branch}</span>
                <div className="text-[9px] font-bold text-red-500 mt-1 uppercase tracking-wide">{app.job.title}</div>
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-[9px]">
                <button
                  onClick={() => setViewingProfile(app)}
                  className="p-1 px-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold rounded"
                >
                  Profile
                </button>
                <a
                  href={app.resume_url} target="_blank" rel="noopener noreferrer"
                  className="p-1 px-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold rounded flex items-center gap-0.5"
                >
                  <FileText size={10} /> Resume
                </a>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100">
                {stage === "applied" && (
                  <button
                    onClick={() => updateStatus(app.id, "under_review")}
                    className="p-1 w-full bg-slate-100 text-slate-650 hover:bg-slate-200 rounded font-bold text-[8px] uppercase tracking-wider flex items-center justify-center"
                  >
                    Review <ChevronRight size={10} />
                  </button>
                )}
                {stage === "under_review" && (
                  <button
                    onClick={() => updateStatus(app.id, "shortlisted")}
                    className="p-1 w-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 rounded font-bold text-[8px] uppercase tracking-wider flex items-center justify-center"
                  >
                    Shortlist <ChevronRight size={10} />
                  </button>
                )}
                {stage === "shortlisted" && (
                  <button
                    onClick={() => handleOpenSchedule(app)}
                    className="p-1 w-full bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 rounded font-bold text-[8px] uppercase tracking-wider flex items-center justify-center gap-1"
                  >
                    <Calendar size={9} /> Schedule Interview
                  </button>
                )}
                {stage === "interview_scheduled" && (
                  <button
                    onClick={() => updateStatus(app.id, "selected")}
                    className="p-1 w-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 rounded font-bold text-[8px] uppercase tracking-wider flex items-center justify-center gap-0.5"
                  >
                    <Check size={10} /> Select / Hire
                  </button>
                )}
                {stage !== "selected" && stage !== "rejected" && (
                  <button
                    onClick={() => updateStatus(app.id, "rejected")}
                    className="p-1 px-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded font-bold text-[8px] flex items-center justify-center"
                    title="Reject Candidate"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">HMS Candidate Pipelines</h2>
        <p className="text-xs text-slate-500 mt-0.5">Drag-free pipeline control tracking candidates through active stages, viewing ATS profiles, and scheduling interviews</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 text-xs shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none text-slate-650 font-bold"
          >
            <option value="all">All Pipeline Stages</option>
            <option value="applied">Applied</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, job, skills..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-red-500 focus:bg-white placeholder-slate-400 transition"
          />
        </div>
      </div>

      {/* Kanban Pipeline Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {getPipelineColumn("applied", "Applied", "text-blue-500")}
        {getPipelineColumn("under_review", "Under Review", "text-slate-500")}
        {getPipelineColumn("shortlisted", "Shortlisted", "text-amber-500")}
        {getPipelineColumn("interview_scheduled", "Interview Scheduled", "text-indigo-500")}
        {getPipelineColumn("selected", "Selected / Hires", "text-emerald-500")}
        {getPipelineColumn("rejected", "Rejected", "text-rose-500")}
      </div>

      {/* Profile Detail View Modal */}
      {viewingProfile && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-6 z-50 text-xs">
          <div className="max-w-2xl w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setViewingProfile(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              Close
            </button>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
              <div className="h-10 w-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{viewingProfile.student.name}</h3>
                <span className="text-[10px] text-slate-400 font-semibold">{viewingProfile.student.college}</span>
              </div>
            </div>

            {/* AI Candidate Ranking summary */}
            <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-2xl flex flex-col gap-3 mb-6">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-red-600 uppercase text-[9px] tracking-wider flex items-center gap-1">
                  <Sparkles size={12} /> AI Candidate Ranking Report
                </h4>
                <span className="text-xs font-black text-red-500">{Math.round(viewingProfile.match_score)}% Match</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <strong className="text-slate-800 font-bold block mb-1">Strengths:</strong>
                  <p className="text-slate-650 leading-relaxed font-semibold">Semantically aligns with {viewingProfile.student.skills.split(",").slice(0,3).join(", ")}. Strong academic GPA standing.</p>
                </div>
                <div>
                  <strong className="text-slate-800 font-bold block mb-1">Hiring Recommendation:</strong>
                  <p className="text-slate-650 leading-relaxed font-semibold">Recommended for next-stage interview loop. Fits required branch discipline.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs mb-6">
              <div className="flex flex-col gap-3">
                <div>
                  <strong className="text-slate-400 uppercase text-[9px] font-bold">Branch & CGPA:</strong>
                  <p className="text-slate-850 font-bold mt-0.5">{viewingProfile.student.branch} • CGPA: {viewingProfile.student.cgpa}</p>
                </div>
                <div>
                  <strong className="text-slate-400 uppercase text-[9px] font-bold">Skills:</strong>
                  <p className="text-slate-700 font-semibold mt-0.5">{viewingProfile.student.skills}</p>
                </div>
                <div>
                  <strong className="text-slate-400 uppercase text-[9px] font-bold">Certifications:</strong>
                  <p className="text-slate-700 font-semibold mt-0.5">{viewingProfile.student.certifications || 'No certifications added'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <strong className="text-slate-400 uppercase text-[9px] font-bold">Academic Projects:</strong>
                  <p className="text-slate-700 font-medium leading-relaxed mt-0.5">{viewingProfile.student.projects || 'None'}</p>
                </div>
                <div>
                  <strong className="text-slate-400 uppercase text-[9px] font-bold">Work Experience:</strong>
                  <p className="text-slate-700 font-medium leading-relaxed mt-0.5">{viewingProfile.student.experience || 'Fresher'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <a
                href={viewingProfile.resume_url} target="_blank" rel="noopener noreferrer"
                className="p-2.5 px-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-650 text-center flex items-center justify-center gap-1.5"
              >
                <FileText size={14} /> Download Resume
              </a>
              <button
                onClick={() => { setViewingProfile(null); }}
                className="btn-primary p-2.5 px-6 rounded-xl font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && selectedApplicant && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-6 z-50 text-xs">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Schedule Interview Loop</h3>
            
            <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-4 text-slate-800">
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-400 uppercase text-[9px] font-bold">Candidate Information:</span>
                <div className="font-bold text-slate-900 text-sm leading-snug">{selectedApplicant.student.name}</div>
                <div className="text-[10px] font-bold text-red-500 uppercase tracking-wide">{selectedApplicant.job.title}</div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 font-semibold">Interview Date & Time</label>
                <input
                  type="datetime-local" required value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 font-semibold">Interview Category</label>
                <select
                  value={interviewType} onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                >
                  <option value="technical">Technical Loop</option>
                  <option value="behavioral">Behavioral Panel</option>
                  <option value="hr">HR Round</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 font-semibold">Location (Google Meet / Venue Room)</label>
                <input
                  type="text" required value={interviewLocation} onChange={(e) => setInterviewLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                <button
                  type="button" onClick={() => setShowScheduleModal(false)}
                  className="p-2.5 px-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-650"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary p-2.5 px-6 rounded-xl font-semibold"
                >
                  Send Schedule Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
