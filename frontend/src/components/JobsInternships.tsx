"use client";
import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { Briefcase, MapPin, DollarSign, Award, CheckCircle, Search, Sparkles } from "lucide-react";

export default function JobsInternships() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "placement" | "internship">("all");
  const [loading, setLoading] = useState(true);
  
  const [applications, setApplications] = useState<Record<number, boolean>>({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchJobsAndApplications();
  }, [filterType, search]);

  const fetchJobsAndApplications = async () => {
    setLoading(true);
    try {
      const recommendations = await api.getJobRecommendations();
      
      let filtered = recommendations;
      if (filterType === "placement") {
        filtered = recommendations.filter((r: any) => r.job.is_placement);
      } else if (filterType === "internship") {
        filtered = recommendations.filter((r: any) => r.job.is_internship);
      }
      
      if (search) {
        const sLower = search.toLowerCase();
        filtered = filtered.filter((r: any) => 
          r.job.title.toLowerCase().includes(sLower) || 
          r.company_name.toLowerCase().includes(sLower) ||
          r.required_skills.toLowerCase().includes(sLower)
        );
      }
      
      setJobs(filtered);

      const apps = await api.getStudentApplications();
      const appMap: Record<number, boolean> = {};
      apps.forEach((a: any) => {
        appMap[a.job_id] = true;
      });
      setApplications(appMap);
    } catch (e) {
      // quiet fail
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: number) => {
    try {
      await api.applyJob(jobId);
      setApplications(prev => ({ ...prev, [jobId]: true }));
      setSuccessMsg("Application submitted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchJobsAndApplications();
    } catch (err: any) {
      alert(err.message || "Failed to apply.");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-sans">Opportunities Portal</h2>
          <p className="text-xs text-slate-500 mt-0.5">Explore paid internships and corporate placement openings graded by profile match metrics</p>
        </div>
        
        {successMsg && (
          <div className="p-2 px-4 rounded-xl bg-success/15 border border-success/20 text-success text-[10px] font-semibold flex items-center gap-1.5 animate-bounce">
            <CheckCircle size={14} /> {successMsg}
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 text-xs shadow-sm">
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-250 w-full sm:w-auto">
          {(["all", "placement", "internship"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`py-1.5 px-4 rounded-lg capitalize font-bold text-[10px] transition ${
                filterType === t 
                  ? "bg-red-500 text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t === "all" ? "All Options" : t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, company, or skills..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white placeholder-slate-400 transition shadow-xs"
          />
        </div>
      </div>

      {/* Opportunities List Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center text-slate-500 py-20 text-xs">
          <div className="h-6 w-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-2" />
          Mapping placement options...
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-slate-400 text-center py-12 text-xs italic">No matching openings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {jobs.map((item, idx) => {
            const j = item.job;
            const applied = applications[j.id];
            return (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-200 bg-white flex flex-col justify-between gap-5 relative shadow-sm">
                
                {/* Score badge top right */}
                <span className="absolute top-6 right-6 p-1 px-3 rounded-lg bg-red-50 border border-red-100 text-red-500 font-bold text-[9px] uppercase flex items-center gap-1 shadow-xs">
                  <Sparkles size={11} /> {item.match_score}% Match
                </span>

                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    {j.is_placement ? "Placement Opening" : "Internship Project"}
                  </span>
                  
                  <h3 className="font-bold text-slate-900 text-sm mt-1 leading-snug">{j.title}</h3>
                  <strong className="text-red-600 font-semibold tracking-wide mt-0.5 block">{item.company_name}</strong>

                  {/* Badges info */}
                  <div className="flex flex-wrap gap-4 items-center text-slate-650 py-3 border-y border-slate-200 my-4 text-[10px]">
                    <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> {j.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={13} className="text-slate-400" /> {j.salary || 'Unpaid'}</span>
                    <span className="flex items-center gap-1"><Award size={13} className="text-slate-400" /> CGPA: {j.eligibility_cgpa}+</span>
                  </div>

                  <p className="text-slate-600 leading-relaxed line-clamp-3 mb-4 font-medium">{j.description}</p>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 text-[9px] uppercase font-bold">Required Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {j.required_skills.split(",").map((s: string, sIdx: number) => (
                        <span key={sIdx} className="p-0.5 px-2 bg-slate-50 border border-slate-200 rounded text-[9px] uppercase font-bold text-slate-500">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-200">
                  <span className={`text-[9px] font-bold uppercase ${item.is_eligible ? 'text-success' : 'text-danger'}`}>
                    {item.is_eligible ? 'Eligible to Apply' : 'Ineligible: CGPA Gap'}
                  </span>
                  
                  <button
                    disabled={applied || !item.is_eligible}
                    onClick={() => handleApply(j.id)}
                    className={`btn-primary py-2 px-5 text-xs font-semibold ${
                      applied 
                        ? 'bg-gradient-to-r from-slate-100 to-slate-100 border border-slate-200 text-slate-400 font-bold shadow-none' 
                        : ''
                    }`}
                  >
                    {applied ? "Applied" : "Apply Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
