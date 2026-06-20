"use client";
import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    try {
      const data = await api.getResumeReport();
      setReport(data);
    } catch (e) {
      // quiet fail
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === "application/pdf") {
        setFile(selected);
        setError("");
      } else {
        setError("Only PDF resumes are supported.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.analyzeResume(file);
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Resume upload or analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const parseJsonList = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return [];
    }
  };

  const missingSkills = report ? parseJsonList(report.missing_skills) : [];
  const suggestions = report ? parseJsonList(report.improvement_suggestions) : [];

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">AI Resume Analyzer</h2>
        <p className="text-xs text-slate-500 mt-0.5">Grade your resume against ATS requirements and get missing skills metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Box */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white flex flex-col items-center justify-center text-center text-xs shadow-sm">
          <UploadCloud size={40} className="text-red-500 mb-3 animate-pulse" />
          <h3 className="font-bold text-slate-800 mb-1 text-sm">Upload Your PDF Resume</h3>
          <p className="text-slate-500 mb-4 max-w-[200px] leading-relaxed">Ensure your resume is text-based and in PDF format.</p>
          
          <label className="p-2 px-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-black cursor-pointer hover:bg-slate-100 transition mb-4 font-semibold">
            Choose PDF
            <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
          </label>

          {file && (
            <div className="flex items-center gap-1.5 text-red-500 font-semibold mb-4">
              <FileText size={16} /> {file.name}
            </div>
          )}

          {error && <p className="text-red-600 font-bold mb-4">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="btn-primary w-full py-2.5 rounded-xl font-semibold tracking-wide disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* ATS Score Sheet */}
        {report ? (
          <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white md:col-span-2 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm">Analysis Summary</h3>
              <span className="text-[10px] text-slate-400 font-semibold">Processed on {new Date(report.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Radial ATS Score display */}
              <div className="relative h-28 w-28 rounded-full border-4 border-slate-100 flex items-center justify-center bg-slate-50">
                <div className="absolute inset-0.5 rounded-full border border-red-500/10 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-red-500 leading-none">{report.ats_score}</span>
                  <span className="text-[8px] text-slate-500 mt-1 uppercase font-bold tracking-wider">ATS Score</span>
                </div>
              </div>

              <div className="flex-1 text-xs">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Strength Assessment</h4>
                <p className="text-slate-600 leading-relaxed">{report.strength_analysis}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
              {/* Missing Skills Warning */}
              <div>
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                  <AlertTriangle size={16} className="text-warning" /> Missing Industry Skills
                </h4>
                {missingSkills.length === 0 ? (
                  <p className="text-success font-semibold pl-1">All core skills identified.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map((s: string, idx: number) => (
                      <span key={idx} className="p-1 px-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 uppercase font-bold text-[9px]">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Tips */}
              <div>
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                  <Lightbulb size={16} className="text-success" /> Layout Optimization Tips
                </h4>
                <ul className="flex flex-col gap-2 list-disc list-inside text-slate-600">
                  {suggestions.slice(0, 3).map((s: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white md:col-span-2 flex flex-col items-center justify-center text-center text-xs text-slate-400 shadow-sm">
            <FileText size={36} className="text-slate-200 mb-2" />
            Upload your resume above to view ATS scores, skill-gap analysis, and layout optimizations.
          </div>
        )}
      </div>
    </div>
  );
}
