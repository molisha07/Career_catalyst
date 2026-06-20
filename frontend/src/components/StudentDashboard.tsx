"use client";
import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { User, Award, Shield, CheckCircle, RefreshCw } from "lucide-react";

export default function StudentDashboard({ user, refreshUser }: { user: any; refreshUser: () => void }) {
  const profile = user?.profile || {};
  const [name, setName] = useState(profile.name || "");
  const [branch, setBranch] = useState(profile.branch || "");
  const [semester, setSemester] = useState(profile.semester || 5);
  const [cgpa, setCgpa] = useState(profile.cgpa || 7.0);
  const [skills, setSkills] = useState(profile.skills || "");
  const [certifications, setCertifications] = useState(profile.certifications || "");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setName(user.profile.name || "");
      setBranch(user.profile.branch || "");
      setSemester(user.profile.semester || 5);
      setCgpa(user.profile.cgpa || 7.0);
      setSkills(user.profile.skills || "");
      setCertifications(user.profile.certifications || "");
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await api.updateProfile({
        name,
        branch,
        semester: parseInt(semester),
        cgpa: parseFloat(cgpa),
        skills,
        certifications,
      });
      setSuccess(true);
      refreshUser();
    } catch (err) {
      alert("Failed to update profile details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome, {profile.name || user?.email.split("@")[0]}!</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your academic profile and placement matches</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold flex items-center gap-2">
            <Shield size={16} /> Profile Completion: {profile.profile_completion || 10}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Profile Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white md:col-span-2 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
            <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
              <User size={18} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Academic Details</h3>
          </div>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-600 font-semibold">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-600 font-semibold">Branch / Stream</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Computer Science"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-600 font-semibold">Current Semester</label>
              <input
                type="number"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-600 font-semibold">CGPA</label>
              <input
                type="number"
                step="0.01"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-slate-600 font-semibold">Skills (Comma Separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Python, React, SQL"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-slate-600 font-semibold">Certifications (Comma Separated)</label>
              <input
                type="text"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="AWS Solution Architect, Google Data Analyst"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between mt-4">
              {success && (
                <span className="text-success text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle size={14} /> Profile details synced successfully.
                </span>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-2 px-5 ml-auto text-xs font-semibold flex items-center gap-1.5"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Overview Stats Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white flex-1 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-4">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                <Award size={18} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Academic Standings</h3>
            </div>
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold">CGPA</span>
                <strong className="text-lg text-slate-900 font-extrabold">{profile.cgpa || "N/A"}</strong>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold">Branch</span>
                <strong className="text-slate-800 text-[10px] font-extrabold line-clamp-1">{profile.branch || "N/A"}</strong>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold">Semester</span>
                <strong className="text-slate-800 font-extrabold">{profile.semester || "N/A"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
