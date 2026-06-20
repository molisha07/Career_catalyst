"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, FileSearch, Sliders, Award, Mic, MessageCircle, Briefcase, Zap } from "lucide-react";

export default function LandingPage() {
  const features = [
    { icon: FileSearch, title: "AI Resume Scoring", desc: "Instantly parse your PDF resume, match ATS standards, and detect missing keywords." },
    { icon: Sliders, title: "Skill Gap Analysis", desc: "Compare your competencies against specific job requirements and chart learning roadmaps." },
    { icon: Award, title: "Career Assessments", desc: "Take multi-category tests in logical reasoning, aptitude, and tech core domains." },
    { icon: Mic, title: "AI Mock Interviews", desc: "Practice real-time interactive HR or Technical questions with score evaluations." },
    { icon: MessageCircle, title: "AI Career Chat Mentor", desc: "Receive targeted, RAG-augmented answers on internship matching or interview preparation." },
    { icon: Briefcase, title: "Jobs & Placements Portal", desc: "Find remote internships or full-time placement openings with direct match percentage analysis." }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-500/5 rounded-full blur-[120px]" />

      {/* Header */}
      <header className="h-20 max-w-7xl mx-auto w-full px-6 flex items-center justify-between z-10 border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-red-500 flex items-center justify-center font-bold text-white shadow-md shadow-red-500/20">
            CC
          </div>
          <span className="font-semibold text-xl tracking-wide bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Career Catalyst
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
            Sign In
          </Link>
          <Link href="/register" className="btn-primary text-xs tracking-wide">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto z-10 py-16">
        <div className="inline-flex items-center gap-2 p-1.5 px-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold tracking-wide mb-6">
          <Zap size={14} /> AI-Powered Career Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-sans mb-6 text-slate-900">
          Elevate Your Career with <br />
          <span className="bg-gradient-to-r from-red-600 via-red-500 to-black bg-clip-text text-transparent neon-glow">
            AI-Driven Intelligence
          </span>
        </h1>

        <p className="text-slate-600 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
          Career Catalyst helps you analyze resume strength, detect skill gaps, receive dynamic learning roadmaps, attempt career assessments, and practice interactive mock interviews.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/register" className="btn-primary text-sm flex items-center gap-2 px-6 py-3">
            Start Free Profile Analysis <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="p-3 px-6 text-sm font-medium rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-800 hover:text-black shadow-sm transition">
            Recruiter Login
          </Link>
        </div>

        {/* Feature Grid */}
        <section className="w-full">
          <h3 className="text-xs uppercase font-bold text-red-600 tracking-widest mb-10">Advanced Intelligent Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-card rounded-2xl p-6 border border-slate-200">
                  <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-600">
                    <Icon size={20} />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">{f.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-slate-200 bg-white flex items-center justify-center text-xs text-slate-500 z-10 px-6">
        © 2026 Career Catalyst. Built with Next.js 15 & FastAPI. All rights reserved.
      </footer>
    </div>
  );
}
