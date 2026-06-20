"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit, XCircle, Trash2, MapPin, DollarSign, Award, CheckCircle, Sparkles } from "lucide-react";

export default function JobManagement() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workType, setWorkType] = useState("full-time");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [eligibilityCgpa, setEligibilityCgpa] = useState("6.0");
  const [isPlacement, setIsPlacement] = useState(true);
  const [isInternship, setIsInternship] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/jobs/", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      // Only show jobs associated with the recruiter's company (we'll filter client-side or use company specific)
      // Actually, we can fetch recruiter's company details to show just theirs, or show all company openings for ease
      setJobs(data);
    } catch (e) {
      // quiet fail
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      work_type: workType,
      location,
      salary,
      experience_level: experienceLevel,
      required_skills: requiredSkills,
      eligibility_cgpa: parseFloat(eligibilityCgpa),
      is_placement: isPlacement,
      is_internship: isInternship
    };

    try {
      let res;
      if (editingJob) {
        res = await fetch(`http://localhost:8000/api/jobs/${editingJob.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("http://localhost:8000/api/jobs/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setShowModal(false);
        setEditingJob(null);
        resetForm();
        fetchJobs();
      } else {
        const error = await res.json();
        alert(error.detail || "Action failed");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setTitle(job.title);
    setDescription(job.description);
    setWorkType(job.work_type);
    setLocation(job.location);
    setSalary(job.salary || "");
    setExperienceLevel(job.experience_level || "");
    setRequiredSkills(job.required_skills);
    setEligibilityCgpa(String(job.eligibility_cgpa));
    setIsPlacement(job.is_placement);
    setIsInternship(job.is_internship);
    setShowModal(true);
  };

  const handleClose = async (jobId: number) => {
    if (!confirm("Are you sure you want to close this job post?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${jobId}/close`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch (e) {
      alert("Failed to close job post");
    }
  };

  const handleDelete = async (jobId: number) => {
    if (!confirm("Are you sure you want to permanently delete this job post?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch (e) {
      alert("Failed to delete job post");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setWorkType("full-time");
    setLocation("");
    setSalary("");
    setExperienceLevel("");
    setRequiredSkills("");
    setEligibilityCgpa("6.0");
    setIsPlacement(true);
    setIsInternship(false);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-sans">Opportunities Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Post and manage corporate placements or internship projects, toggle active statuses, and configure CGPA limits</p>
        </div>
        <button
          onClick={() => { setEditingJob(null); resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold"
        >
          <Plus size={16} /> Post Opening
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center text-slate-500 py-20 text-xs">
          <div className="h-6 w-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-2" />
          Syncing job registry...
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-slate-400 text-center py-12 text-xs italic bg-white border border-slate-200 rounded-2xl">No active or closed postings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {jobs.map((j, idx) => (
            <div key={idx} className={`glass-card rounded-2xl p-6 border bg-white flex flex-col justify-between gap-5 relative shadow-sm ${!j.is_active ? 'opacity-65 border-dashed' : 'border-slate-200'}`}>
              
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <span className={`p-1 px-2.5 rounded-lg border font-bold text-[8px] uppercase tracking-wider ${
                  j.is_active 
                    ? 'bg-success/15 border-success/20 text-success' 
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}>
                  {j.is_active ? 'Active' : 'Closed'}
                </span>
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  {j.is_placement ? "Placement Opening" : "Internship Project"}
                </span>
                
                <h3 className="font-bold text-slate-900 text-sm mt-1 leading-snug">{j.title}</h3>
                <strong className="text-red-600 font-semibold tracking-wide mt-0.5 block">{j.company?.name}</strong>

                {/* Badges info */}
                <div className="flex flex-wrap gap-4 items-center text-slate-650 py-3 border-y border-slate-200 my-4 text-[10px]">
                  <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> {j.location}</span>
                  <span className="flex items-center gap-1"><DollarSign size={13} className="text-slate-400" /> {j.salary || 'Unpaid stipend'}</span>
                  <span className="flex items-center gap-1"><Award size={13} className="text-slate-400" /> CGPA: {j.eligibility_cgpa}+</span>
                </div>

                <p className="text-slate-600 leading-relaxed line-clamp-3 mb-4 font-medium">{j.description}</p>

                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">Skills Required:</span>
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
                <button
                  onClick={() => handleEdit(j)}
                  className="p-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold flex items-center gap-1 text-[10px] text-slate-600"
                >
                  <Edit size={12} /> Edit Details
                </button>
                <div className="flex items-center gap-2">
                  {j.is_active && (
                    <button
                      onClick={() => handleClose(j.id)}
                      className="p-1.5 px-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 hover:bg-yellow-500/25 font-bold flex items-center gap-1 text-[10px]"
                    >
                      <XCircle size={12} /> Close Post
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(j.id)}
                    className="p-1.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 hover:bg-red-500/25 font-bold flex items-center gap-1 text-[10px]"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-6 z-50 text-xs">
          <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 mb-6">{editingJob ? 'Edit Opening' : 'Post New Opening'}</h3>
            
            <form onSubmit={handleCreateOrUpdate} className="flex flex-col gap-4 text-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-600 font-semibold">Job / Internship Title</label>
                  <input
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Software Engineer, UI/UX Intern"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-600 font-semibold">Location</label>
                  <input
                    type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Hybrid, Remote"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-600 font-semibold">Salary / Stipend</label>
                  <input
                    type="text" value={salary} onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. 12 LPA, 15k/month"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-600 font-semibold">Work Type</label>
                  <select
                    value={workType} onChange={(e) => setWorkType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="intern">Internship</option>
                    <option value="part-time">Part Time</option>
                    <option value="remote">Remote Project</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-600 font-semibold">Eligibility Minimum CGPA</label>
                  <input
                    type="number" step="0.1" required value={eligibilityCgpa} onChange={(e) => setEligibilityCgpa(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-600 font-semibold">Required Skills (Comma Separated)</label>
                  <input
                    type="text" required value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)}
                    placeholder="Python, React, SQL"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-600 font-semibold">Job Description</label>
                  <textarea
                    required value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe roles, tasks, and company context..." rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                  />
                </div>

                {/* Opening Class Toggles */}
                <div className="flex items-center gap-6 col-span-2 py-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox" checked={isPlacement} onChange={(e) => { setIsPlacement(e.target.checked); if (e.target.checked) setIsInternship(false); }}
                      className="accent-red-500 h-4 w-4"
                    /> Placement / Full-Time
                  </label>
                  <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox" checked={isInternship} onChange={(e) => { setIsInternship(e.target.checked); if (e.target.checked) setIsPlacement(false); }}
                      className="accent-red-500 h-4 w-4"
                    /> Internship Project
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                <button
                  type="button" onClick={() => setShowModal(false)}
                  className="p-2.5 px-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary p-2.5 px-6 rounded-xl font-semibold"
                >
                  {editingJob ? 'Save Opening' : 'Post Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
