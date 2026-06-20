"use client";
import React, { useState, useEffect, useRef } from "react";
import { api } from "../utils/api";
import { MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";

export default function ChatMentor() {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hello! I am your AI Career Mentor. I can give you advice on optimizing your resume, matching certifications to cover skill gaps, sharing interview templates, or finding placement eligibility criteria. What is on your mind?" }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    // Add user message
    const userMsg = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await api.sendMessage(messageText, chatHistory);
      
      setMessages(prev => [...prev, { role: "assistant", content: response.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "I am having trouble connecting to the mentor node right now. Please try again." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">AI Career Mentor</h2>
        <p className="text-xs text-slate-500 mt-0.5">RAG-supported AI mentor providing placement guides, resume audits, and mock templates</p>
      </div>

      <div className="glass-card rounded-3xl border border-slate-200 bg-white h-[calc(100vh-16rem)] flex flex-col overflow-hidden text-xs relative shadow-sm">
        {/* Glow Header */}
        <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center px-4 justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-red-500" />
            <strong className="font-bold text-slate-800">Career Catalyst Advisor</strong>
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold tracking-wider flex items-center gap-1">
            <Sparkles size={12} className="text-red-500" /> RAG Enhanced
          </span>
        </div>

        {/* Chat History Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((m, idx) => {
            const isBot = m.role === "assistant";
            return (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                {/* Speaker Icon */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                  isBot 
                    ? 'bg-red-50 text-red-500 border border-red-100' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {isBot ? <Bot size={16} /> : <User size={16} />}
                </div>

                {/* Message Bubble */}
                <div className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap font-medium ${
                  isBot 
                    ? 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-xs' 
                    : 'bg-red-500 text-white rounded-tr-none shadow-xs'
                }`}>
                  {m.content}
                </div>
              </div>
            );
          })}
          
          {sending && (
            <div className="flex gap-3 mr-auto items-center text-slate-400">
              <div className="h-8 w-8 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="flex gap-1.5 items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-150" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-300" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Pills */}
        <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] text-slate-400 mr-2 font-bold uppercase tracking-wider">Quick Prompts:</span>
          {[
            "How do I optimize my resume for ATS?",
            "What are the placement eligibility criteria?",
            "How should I structure behavioral answers?",
            "Do internships improve placement chances?"
          ].map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pill)}
              className="p-1 px-3 border border-slate-200 hover:border-red-500/30 hover:text-red-500 bg-white text-slate-500 rounded-full text-[9px] font-semibold transition shadow-xs"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Message Input Panel */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
          <input
            type="text"
            value={input}
            disabled={sending}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask anything about resumes, skill gap, assessments, placement statistics..."
            className="flex-1 bg-white border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 outline-none focus:border-red-500 transition shadow-xs"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={sending || !input.trim()}
            className="btn-primary p-3 rounded-xl flex items-center justify-center disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
