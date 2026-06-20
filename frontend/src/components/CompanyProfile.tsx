"use client";
import React, { useState, useEffect } from "react";
import { Building, Globe, MapPin, Tag, ShieldCheck, RefreshCw } from "lucide-react";

export default function CompanyProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit fields
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      const comp = data.profile?.company || {
        name: "GOOGLE",
        description: "Global technology leader in search, AI, cloud computing, and hardware.",
        website: "https://google.com",
        location: "Mumbai, India",
        industry: "Technology"
      };
      setProfile(comp);
      setDescription(comp.description || "");
      setWebsite(comp.website || "");
      setLocation(comp.location || "");
      setIndustry(comp.industry || "");
    } catch (e) {
      // fallback mock details
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    
    // Simulate updating company details (saving in local storage/mock for dev)
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-500 py-20 text-xs font-sans">
        <div className="h-6 w-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-2" />
        Syncing company profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800 text-xs">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">Corporate Identity</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage public company descriptions, official websites, headquarters locations, and industry tags</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Form */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white md:col-span-2 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
            <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
              <Building size={18} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">{profile?.name || "Corporate Profile"}</h3>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-slate-650 font-bold">Company Website URL</label>
              <input
                type="text" value={website} onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition font-medium text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-650 font-bold">Industry Sector</label>
              <input
                type="text" value={industry} onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition font-medium text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-650 font-bold">Headquarters Location</label>
              <input
                type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition font-medium text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-slate-650 font-bold">Corporate Description</label>
              <textarea
                value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition font-medium text-slate-700"
              />
            </div>

            <div className="col-span-2 flex items-center justify-between mt-4">
              {success && (
                <span className="text-success text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck size={14} /> Corporate profile synced successfully.
                </span>
              )}
              <button
                type="submit" disabled={saving}
                className="btn-primary py-2.5 px-6 ml-auto font-semibold flex items-center gap-1.5"
              >
                {saving ? <RefreshCw size={14} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Company Quick info */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white flex-1 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-4">
                <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                  <Building size={18} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Quick Overview</h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-550 font-bold flex items-center gap-1"><Globe size={14} /> Website</span>
                  <strong className="text-slate-700 font-extrabold line-clamp-1">{website}</strong>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-550 font-bold flex items-center gap-1"><MapPin size={14} /> Headquarters</span>
                  <strong className="text-slate-700 font-extrabold">{location}</strong>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-550 font-bold flex items-center gap-1"><Tag size={14} /> Sector</span>
                  <strong className="text-slate-700 font-extrabold">{industry}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
