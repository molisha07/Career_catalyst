"use client";
import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { Award, BookOpen, Clock, CheckCircle, RefreshCw, BarChart2, AlertTriangle } from "lucide-react";

export default function Assessment() {
  const [testType, setTestType] = useState<string>("aptitude");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionsIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [testing, setTesting] = useState(false);
  
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await api.getAssessmentHistory();
      setHistory(data);
    } catch (e) {
      // quiet fail
    } finally {
      setLoadingHistory(false);
    }
  };

  const startTest = async () => {
    setTesting(true);
    setResult(null);
    setCurrentIndex(0);
    setAnswers({});
    try {
      const data = await api.getQuestions(testType);
      setQuestions(data);
    } catch (e) {
      alert("Failed to load assessment questions.");
      setTesting(false);
    }
  };

  const handleSelectOption = (qId: number, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const data = await api.submitAssessment(testType, answers);
      setResult(data);
      setTesting(false);
      fetchHistory();
    } catch (e) {
      alert("Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">Career Assessment</h2>
        <p className="text-xs text-slate-500 mt-0.5">Test your analytical, logical, and technical capabilities and view strength dashboards</p>
      </div>

      {!testing && !result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Starter Panel */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white md:col-span-2 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <BookOpen size={18} className="text-red-500" /> Choose Assessment Type
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { id: "aptitude", title: "Aptitude Assessment", desc: "Covers arithmetic, ratios, work-time, and quantitative problems." },
                  { id: "logical", title: "Logical Reasoning", desc: "Covers series analysis, relations, analogies, and syllogisms." },
                  { id: "technical", title: "Technical Core", desc: "Covers DSA concepts, SQL statements, and networks." }
                ].map((test) => (
                  <button
                    key={test.id}
                    onClick={() => setTestType(test.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition ${
                      testType === test.id
                        ? "bg-red-50 border-red-500 text-slate-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-350"
                    }`}
                  >
                    <strong className="font-bold text-slate-850">{test.title}</strong>
                    <p className="text-[10px] leading-relaxed mt-1 text-slate-500">{test.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startTest} className="btn-primary py-3 rounded-xl font-semibold tracking-wide w-full max-w-[200px] mr-auto">
              Launch Assessment
            </button>
          </div>

          {/* Test History */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
              <Award size={18} className="text-red-500" /> Past Scorecards
            </h3>
            {loadingHistory ? (
              <p className="text-slate-400 italic py-4">Syncing logs...</p>
            ) : history.length === 0 ? (
              <p className="text-slate-400 italic py-4">No tests completed yet.</p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                {history.map((h, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-xs">
                    <div>
                      <h4 className="font-bold text-slate-850 capitalize">{h.type} Test</h4>
                      <span className="text-[9px] text-slate-400 font-semibold">{new Date(h.completed_at).toLocaleDateString()}</span>
                    </div>
                    <strong className={`font-bold text-sm ${h.score >= 70 ? 'text-success' : h.score >= 50 ? 'text-warning' : 'text-danger'}`}>
                      {h.score}%
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Testing Interface */}
      {testing && questions.length > 0 && (
        <div className="max-w-2xl mx-auto w-full glass-card rounded-3xl p-8 border border-slate-200 bg-white shadow-xl flex flex-col gap-6 text-xs">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <span className="text-xs uppercase font-bold text-red-500 tracking-wider">{testType} Assessment</span>
            <span className="text-xs text-slate-400 font-semibold">Question {currentQuestionsIndex + 1} of {questions.length}</span>
          </div>

          <div className="py-4">
            <p className="text-sm font-bold text-slate-850 leading-relaxed mb-6">
              {questions[currentQuestionsIndex].question}
            </p>

            <div className="flex flex-col gap-3">
              {questions[currentQuestionsIndex].options.map((opt: string, idx: number) => {
                const qId = questions[currentQuestionsIndex].id;
                const isSelected = answers[qId] === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(qId, opt)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition ${
                      isSelected 
                        ? 'bg-red-50 border-red-500 text-red-600 font-bold' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-350'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
            <button
              disabled={currentQuestionsIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="p-2 px-4 rounded bg-slate-100 border border-slate-200 text-slate-600 hover:text-black disabled:opacity-30 transition font-semibold"
            >
              Previous
            </button>

            {currentQuestionsIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="btn-primary py-2 px-5 text-xs font-semibold"
              >
                Next Question
              </button>
            ) : (
              <button
                disabled={submitting}
                onClick={handleSubmit}
                className="btn-primary bg-gradient-to-r from-success to-emerald-600 py-2 px-5 text-xs font-semibold"
              >
                {submitting ? "Evaluating..." : "Submit Assessment"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result Display Card */}
      {result && (
        <div className="max-w-2xl mx-auto w-full glass-card rounded-3xl p-8 border border-slate-200 bg-white shadow-xl text-xs flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center text-center pb-4 border-b border-slate-200">
            <CheckCircle size={44} className="text-success mb-2" />
            <h3 className="text-lg font-bold text-slate-900">Assessment Submitted Successfully</h3>
            <p className="text-slate-500 mt-0.5">Your automated scoring dashboard is compiled below</p>
          </div>

          <div className="flex items-center justify-center gap-6 py-4">
            <div className="h-24 w-24 rounded-full border-4 border-slate-100 flex flex-col items-center justify-center bg-slate-50">
              <span className="text-2xl font-black text-red-500 leading-none">{result.score}%</span>
              <span className="text-[8px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Accuracy</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <BarChart2 size={16} className="text-success" /> Key Strengths
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium">{result.strength_report}</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <AlertTriangle size={16} className="text-warning" /> Areas to Refine
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium">{result.weakness_report}</p>
            </div>
          </div>

          <button onClick={() => setResult(null)} className="btn-primary py-2.5 rounded-xl font-semibold tracking-wide mt-4 w-full">
            Back to Assessments Portal
          </button>
        </div>
      )}
    </div>
  );
}
