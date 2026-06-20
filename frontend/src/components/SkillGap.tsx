"use client";
import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { Sliders, Award, BookOpen, ExternalLink, Calendar } from "lucide-react";

export default function SkillGap() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const data = await api.getSkillGap();
      setAnalysis(data);
    } catch (e) {
      // quiet fail
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-500 py-20 text-xs font-sans">
        <div className="h-6 w-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-2" />
        Generating skill-gap assessments...
      </div>
    );
  }

  const missingSkills = analysis?.missing_skills || [];
  const certs = analysis?.recommended_certifications || [];
  const courses = analysis?.courses || [];
  const roadmap = analysis?.learning_roadmap || [];

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">Skill Gap Analysis</h2>
        <p className="text-xs text-slate-500 mt-0.5">Determine required skills for your preferred role and get customized roadmaps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Analysis Pane */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Missing Skills and Certifications */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs shadow-sm">
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Sliders size={18} className="text-red-500" /> Missing Core Skills
              </h3>
              {missingSkills.length === 0 ? (
                <p className="text-success font-semibold">You have all core skills required for {analysis?.preferred_role}!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((s: string, idx: number) => (
                    <span key={idx} className="p-1 px-3 rounded-lg bg-red-50 border border-red-100 text-red-600 uppercase font-bold text-[9px] tracking-wider">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Award size={18} className="text-success" /> Recommended Certifications
              </h3>
              <ul className="flex flex-col gap-2 text-slate-600">
                {certs.map((c: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-1.5 leading-relaxed font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Learning Roadmap Flow */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-6 flex items-center gap-2 pb-4 border-b border-slate-200">
              <Calendar size={18} className="text-red-500" /> Dynamic Learning Roadmap
            </h3>
            
            <div className="relative border-l border-slate-200 pl-6 ml-3 flex flex-col gap-8 text-xs">
              {roadmap.map((step: any, idx: number) => (
                <div key={idx} className="relative">
                  {/* Indicator Dot */}
                  <span className="absolute left-[-31px] top-0.5 h-4 w-4 rounded-full bg-red-50 border-2 border-red-500 flex items-center justify-center font-bold text-[8px] text-red-600 shadow-sm bg-white">
                    {idx + 1}
                  </span>
                  
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{step.week}</span>
                  <h4 className="font-bold text-slate-800 text-sm mt-0.5 mb-1">{step.topic}</h4>
                  <p className="text-slate-600 leading-relaxed max-w-xl font-medium">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Learning Courses Catalog */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white flex flex-col shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 pb-4 border-b border-slate-200">
            <BookOpen size={18} className="text-red-500" /> Recommended Courses
          </h3>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] text-xs">
            {courses.length === 0 ? (
              <p className="text-slate-400 text-center py-6 italic">No specific recommendations needed.</p>
            ) : (
              courses.map((course: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition flex flex-col justify-between gap-3 shadow-xs">
                  <div>
                    <span className={`inline-block p-0.5 px-2 rounded font-bold text-[8px] mb-2 uppercase ${
                      course.is_paid 
                        ? 'bg-warning/10 text-warning border border-warning/15' 
                        : 'bg-success/10 text-success border border-success/15'
                    }`}>
                      {course.is_paid ? 'Paid' : 'Free'} • {course.platform}
                    </span>
                    <h4 className="font-bold text-slate-800 leading-snug">{course.course_title}</h4>
                    <p className="text-slate-500 text-[10px] mt-1 uppercase font-bold tracking-wider">Matches: {course.matched_skills}</p>
                  </div>
                  
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-bold hover:bg-slate-50 transition text-[10px] shadow-xs"
                  >
                    Start Course <ExternalLink size={12} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
