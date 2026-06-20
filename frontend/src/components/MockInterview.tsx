"use client";
import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { Mic, MessageCircle, AlertCircle, CheckCircle, RefreshCw, BarChart2, Star } from "lucide-react";

export default function MockInterview() {
  const [interviewType, setInterviewType] = useState<string>("technical");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [interviewing, setInterviewing] = useState(false);
  
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await api.getInterviewHistory();
      setHistory(data);
    } catch (e) {
      // quiet fail
    } finally {
      setLoadingHistory(false);
    }
  };

  const startInterview = async () => {
    setInterviewing(true);
    setResult(null);
    setCurrentIndex(0);
    setAnswers([]);
    setCurrentAnswer("");
    try {
      const data = await api.getInterviewQuestions(interviewType);
      setQuestions(data.questions);
    } catch (e) {
      alert("Failed to load interview simulator.");
      setInterviewing(false);
    }
  };

  const handleNextQuestion = () => {
    setAnswers(prev => [...prev, currentAnswer]);
    setCurrentAnswer("");
    setCurrentIndex(prev => prev + 1);
  };

  const handleSubmitInterview = async () => {
    setSubmitting(true);
    const finalAnswers = [...answers, currentAnswer];
    try {
      const data = await api.submitInterview(questions, finalAnswers, interviewType);
      setResult(data);
      setInterviewing(false);
      fetchHistory();
    } catch (e) {
      alert("Failed to compile interview grades.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">AI Mock Interview</h2>
        <p className="text-xs text-slate-500 mt-0.5">Attempt interactive mock sessions and receive dynamic communication index scoring</p>
      </div>

      {!interviewing && !result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Menu Selector */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white md:col-span-2 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <Mic size={18} className="text-red-500" /> Choose Interview Session Category
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { id: "technical", title: "Technical Rounds", desc: "Role-specific engineering, database patterns, and systems logic." },
                  { id: "behavioral", title: "Behavioral Rounds", desc: "STAR answering frameworks, leadership scenarios, and team conflicts." },
                  { id: "hr", title: "HR Executive", desc: "Strengths checks, background reviews, five-year strategies." }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setInterviewType(item.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition ${
                      interviewType === item.id
                        ? "bg-red-50 border-red-500 text-slate-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-350"
                    }`}
                  >
                    <strong className="font-bold text-slate-850">{item.title}</strong>
                    <p className="text-[10px] leading-relaxed mt-1 text-slate-500">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startInterview} className="btn-primary py-3 rounded-xl font-semibold tracking-wide w-full max-w-[200px] mr-auto">
              Start Session Simulator
            </button>
          </div>

          {/* Historical evaluations */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
              <MessageCircle size={18} className="text-red-500" /> Evaluation Records
            </h3>
            {loadingHistory ? (
              <p className="text-slate-400 italic py-4">Syncing logs...</p>
            ) : history.length === 0 ? (
              <p className="text-slate-400 italic py-4">No sessions taken yet.</p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                {history.map((h, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-xs">
                    <div>
                      <h4 className="font-bold text-slate-800 capitalize">{h.type} Interview</h4>
                      <span className="text-[9px] text-slate-400 font-semibold">{new Date(h.interview_date).toLocaleDateString()}</span>
                    </div>
                    <strong className="text-red-500 font-bold text-sm">
                      {h.performance_score}%
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Simulator Panel */}
      {interviewing && questions.length > 0 && (
        <div className="max-w-2xl mx-auto w-full glass-card rounded-3xl p-8 border border-slate-200 bg-white shadow-xl flex flex-col gap-6 text-xs">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <span className="text-xs uppercase font-bold text-red-500 tracking-wider">Interactive {interviewType} Simulator</span>
            <span className="text-xs text-slate-400 font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800 leading-relaxed mb-4">
              {questions[currentQuestionIndex]}
            </p>
            
            <textarea
              required
              rows={6}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your response here. Try to detail specific project scenarios or frameworks..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 placeholder-slate-400 outline-none focus:border-red-500 focus:bg-white leading-relaxed transition"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
            <div className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
              <AlertCircle size={14} className="text-red-500" /> Focus on length and clarity.
            </div>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                disabled={!currentAnswer.trim()}
                onClick={handleNextQuestion}
                className="btn-primary py-2 px-5 text-xs font-semibold"
              >
                Submit Answer
              </button>
            ) : (
              <button
                disabled={submitting || !currentAnswer.trim()}
                onClick={handleSubmitInterview}
                className="btn-primary bg-gradient-to-r from-success to-emerald-600 py-2 px-5 text-xs font-semibold"
              >
                {submitting ? "Processing AI Feedback..." : "Finish Interview Session"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result Cards */}
      {result && (
        <div className="max-w-2xl mx-auto w-full glass-card rounded-3xl p-8 border border-slate-200 bg-white shadow-xl text-xs flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center text-center pb-4 border-b border-slate-200">
            <CheckCircle size={44} className="text-success mb-2 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900">Session Finished successfully</h3>
            <p className="text-slate-500 mt-0.5">Your communication & correctness report is ready below</p>
          </div>

          <div className="flex items-center justify-center gap-12 py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="h-20 w-20 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-lg text-red-500 bg-slate-50 shadow-xs">
                {result.performance_score}%
              </div>
              <span className="uppercase text-[9px] font-bold text-slate-400 tracking-wider">Correctness Index</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="h-20 w-20 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-lg text-success bg-slate-50 shadow-xs">
                {result.confidence_score}%
              </div>
              <span className="uppercase text-[9px] font-bold text-slate-400 tracking-wider">Confidence Metric</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
              <BarChart2 size={16} className="text-red-500" /> AI Feedback Analysis
            </h4>
            <p className="text-slate-650 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
              {result.feedback}
            </p>
          </div>

          <button onClick={() => setResult(null)} className="btn-primary py-2.5 rounded-xl font-semibold tracking-wide mt-4 w-full">
            Back to Sessions Portal
          </button>
        </div>
      )}
    </div>
  );
}
