"use client";
import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { Briefcase, MapPin, DollarSign, Award, CheckCircle, Search, Sparkles, Building, Trash2 } from "lucide-react";

export default function SavedOpportunities() {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"jobs" | "companies">("jobs");

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const data = await api.getProfile(); // fallback draft
      // fetch saved opportunity endpoint
      const res = await fetch("http://localhost:8000/api/students/saved-opportunities", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const list = await res.json();
      setSaved(list);
    } catch (e) {
      // quiet fail
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (savedId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/students/saved-opportunities/${savedId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        fetchSaved();
      }
    } catch (e) {
      alert("Failed to unsave opportunity");
    }
  };

  const filteredJobs = saved.filter(s => s.job_id !== null && ((activeTab === "jobs" && s.job?.is_placement) || (activeTab === "companies" && s.job?.is_internship)));
  const savedCompanies = saved.filter(s => s.company_id !== null);

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800 text-xs">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">Saved opportunities</h2>
        <p className="text-xs text-slate-500 mt-0.5">Keep track of corporate placements, internship projects, and target companies saved for later</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-4 border border-slate-200 w-full max-w-sm">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`py-2 rounded-lg font-semibold tracking-wide transition ${
            activeTab === "jobs"
              ? "bg-red-500 text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Saved Roles
        </button>
        <button
          onClick={() => setActiveTab("companies")}
          className={`py-2 rounded-lg font-semibold tracking-wide transition ${
            activeTab === "companies"
              ? "bg-red-500 text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Saved Companies
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center text-slate-500 py-20 text-xs">
          <div className="h-6 w-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-2" />
          Syncing saved dashboard...
        </div>
      ) : activeTab === "jobs" ? (
        filteredJobs.length === 0 ? (
          <p className="text-slate-400 text-center py-12 text-xs italic bg-white border border-slate-200 rounded-2xl">No roles saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((item, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-200 bg-white flex flex-col justify-between gap-5 relative shadow-sm">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    {item.job?.is_placement ? "Placement Opening" : "Internship Project"}
                  </span>
                  
                  <h3 className="font-bold text-slate-900 text-sm mt-1 leading-snug">{item.job?.title}</h3>
                  <strong className="text-red-650 font-semibold tracking-wide mt-0.5 block">{item.job?.company?.name}</strong>

                  {/* Badges info */}
                  <div className="flex flex-wrap gap-4 items-center text-slate-600 py-3 border-y border-slate-200 my-4 text-[10px]">
                    <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> {item.job?.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={13} className="text-slate-400" /> {item.job?.salary || 'Unpaid stipend'}</span>
                    <span className="flex items-center gap-1"><Award size={13} className="text-slate-400" /> CGPA: {item.job?.eligibility_cgpa}+</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => handleUnsave(item.id)}
                    className="p-1.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 hover:bg-red-500/25 font-bold flex items-center gap-1 text-[10px]"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        savedCompanies.length === 0 ? (
          <p className="text-slate-400 text-center py-12 text-xs italic bg-white border border-slate-200 rounded-2xl">No companies saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedCompanies.map((item, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-200 bg-white flex flex-col justify-between gap-5 relative shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm">
                    <Building size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.company?.name}</h3>
                    <span className="text-[9px] text-slate-400 font-semibold">{item.company?.industry} sector • {item.company?.location}</span>
                  </div>
                </div>
                <p className="text-slate-650 leading-relaxed font-medium line-clamp-2">{item.company?.description}</p>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => handleUnsave(item.id)}
                    className="p-1.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 hover:bg-red-500/25 font-bold flex items-center gap-1 text-[10px]"
                  >
                    <Trash2 size={12} /> Remove Company
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
