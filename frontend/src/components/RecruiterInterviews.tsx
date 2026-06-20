"use client";
import React, { useState, useEffect } from "react";
import { Calendar, User, Video, Edit, CheckCircle, FileText, XCircle, Clock } from "lucide-react";

export default function RecruiterInterviews() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Notes Feedback state
  const [activeInterview, setActiveInterview] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("completed");
  const [score, setScore] = useState("80");

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/interviews/history", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      setInterviews(data);
    } catch (e) {
      // fallback mock interviews
      const mock = [
        {
          id: 501,
          student_id: 4,
          job_id: 1,
          recruiter_id: 1,
          type: "technical",
          status: "scheduled",
          interview_date: "2026-05-31T14:00:00",
          location: "https://meet.google.com/abc-defg-hij",
          notes: "",
          feedback: "",
          performance_score: null,
          student: { name: "Molisha", branch: "Artificial Intelligence And Data Science" },
          job: { title: "SOFTWARE ENGINEER" }
        }
      ];
      setInterviews(mock);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFeedback = (interview: any) => {
    setActiveInterview(interview);
    setFeedback(interview.feedback || "");
    setNotes(interview.notes || "");
    setStatus(interview.status || "completed");
    setScore(String(interview.performance_score || 80));
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInterview) return;

    try {
      const res = await fetch(`http://localhost:8000/api/interviews/${activeInterview.id}/feedback`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          feedback,
          notes,
          status,
          performance_score: parseFloat(score)
        })
      });

      if (res.ok) {
        setActiveInterview(null);
        fetchInterviews();
        alert("Interview feedback recorded successfully!");
      }
    } catch (err) {
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800 text-xs">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">Corporate Interview Panel</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage scheduled corporate slots, launch video meeting channels, record qualitative recruiter feedback, and add grading scores</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center text-slate-500 py-20 text-xs">
          <div className="h-6 w-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-2" />
          Mapping interview grids...
        </div>
      ) : interviews.length === 0 ? (
        <p className="text-slate-400 text-center py-12 text-xs italic bg-white border border-slate-200 rounded-2xl">No corporate interviews scheduled yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                  <span className={`p-1 px-2.5 rounded-lg border font-bold text-[8px] uppercase tracking-wider ${
                    item.status === 'scheduled' 
                      ? 'bg-blue-50 border-blue-100 text-blue-500' 
                      : item.status === 'selected' 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-500'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-slate-400 text-[10px] font-semibold flex items-center gap-1">
                    <Clock size={12} /> {new Date(item.interview_date).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-snug">{item.student?.name}</h4>
                    <span className="text-[9px] text-slate-450 font-semibold">{item.student?.branch}</span>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-red-500 uppercase tracking-wide mb-2">{item.job?.title}</div>

                <div className="flex items-center gap-2 py-2 p-3 bg-slate-50 border border-slate-200 rounded-xl mt-3 text-slate-600 font-semibold">
                  <Video size={14} className="text-slate-400" />
                  <a
                    href={item.location} target="_blank" rel="noopener noreferrer"
                    className="hover:underline text-red-500 line-clamp-1"
                  >
                    {item.location || 'Meeting link not assigned'}
                  </a>
                </div>

                {item.feedback && (
                  <div className="mt-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <strong className="text-[9px] uppercase font-bold text-red-500 block mb-1">Feedback recorded:</strong>
                    <p className="text-slate-650 leading-relaxed font-semibold">{item.feedback}</p>
                    {item.performance_score && <span className="inline-block mt-2 font-bold text-[9px] bg-red-500 text-white p-0.5 px-2 rounded-lg">Score: {item.performance_score}%</span>}
                  </div>
                )}
              </div>

              {item.status === "scheduled" && (
                <button
                  onClick={() => handleOpenFeedback(item)}
                  className="p-2.5 w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition"
                >
                  <Edit size={14} /> Record Feedback & Grade
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Record Feedback Modal */}
      {activeInterview && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-6 z-50 text-xs">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Record Performance Grade</h3>
            
            <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4 text-slate-800">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 uppercase text-[9px] font-bold">Interviewing Candidate:</span>
                <div className="font-bold text-slate-900 text-sm leading-snug">{activeInterview.student?.name}</div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-650 font-semibold">Qualitative Feedback</label>
                <textarea
                  required value={feedback} onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Record summary of answers, technical depth, behavioral skills..." rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-650 font-semibold">Private Hiring Notes</label>
                <textarea
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes for recruiter team coordination..." rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-650 font-semibold">Hiring Decision</label>
                  <select
                    value={status} onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                  >
                    <option value="completed">Completed / Under Review</option>
                    <option value="selected">Selected / Hire</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-650 font-semibold">Performance Score (0-100)</label>
                  <input
                    type="number" required min="0" max="100" value={score} onChange={(e) => setScore(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                <button
                  type="button" onClick={() => setActiveInterview(null)}
                  className="p-2.5 px-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-650"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary p-2.5 px-6 rounded-xl font-semibold"
                >
                  Record Evaluation Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
