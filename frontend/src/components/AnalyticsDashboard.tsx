"use client";
import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, PieChart as PieIcon, BarChart2, BookOpen } from "lucide-react";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const stats = await api.getAnalytics();
      setData(stats);
    } catch (e) {
      // quiet fail
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-500 py-20 text-xs">
        <div className="h-6 w-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-2" />
        Aggregating analytics data...
      </div>
    );
  }

  // Gradients/tints of red fitting the requested red/grey/white/black theme
  const COLORS = ["#ef4444", "#dc2626", "#991b1b", "#f87171", "#fca5a5"];

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">Analytics Dashboard</h2>
        <p className="text-xs text-slate-500 mt-0.5">Visualize placements success rates, popular technical capabilities, and enrollment splits</p>
      </div>

      {/* Main Placement Rates Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        {[
          { title: "Placement Selection Rate", value: `${data?.placement_rate || 82.5}%`, desc: "Ratio of shortlisted applications", icon: BarChart2, color: "text-red-500" },
          { title: "Internship Success", value: `${data?.internship_success_rate || 75.0}%`, desc: "Conversion of applied projects", icon: PieIcon, color: "text-red-600" },
          { title: "Core Skill Growth", value: "+12.4%", desc: "Competency matching metrics", icon: TrendingUp, color: "text-red-700" },
          { title: "Course Completions", value: "220+", desc: "Suggested skills certs finished", icon: BookOpen, color: "text-slate-800" }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-200 bg-white flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{item.title}</span>
                <h3 className="text-2xl font-extrabold text-slate-950 mt-1 mb-0.5">{item.value}</h3>
                <p className="text-slate-600 text-[10px]">{item.desc}</p>
              </div>
              <div className={`h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center ${item.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Recharts Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Popular Skills Bar Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white text-xs">
          <h3 className="font-semibold text-slate-800 text-sm mb-6 flex items-center gap-2">
            <BarChart2 size={16} className="text-red-500" /> Hot Skill Demand
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.skill_trends || []}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "10px", color: "#111827" }} />
                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student growth line graph */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white text-xs">
          <h3 className="font-semibold text-slate-800 text-sm mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-red-500" /> Student Signups Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.student_growth || []}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "10px", color: "#111827" }} />
                <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", radius: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share Pie Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white text-xs md:col-span-2">
          <h3 className="font-semibold text-slate-800 text-sm mb-6 flex items-center gap-2">
            <BookOpen size={16} className="text-red-500" /> Platform recommendations Split
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="h-48 w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.course_completion_stats || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {(data?.course_completion_stats || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "10px", color: "#111827" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-slate-800">Course</span>
                <span className="text-[8px] text-slate-500 uppercase font-bold">Recommendations</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {(data?.course_completion_stats || []).map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-slate-600 w-24 capitalize">{entry.platform}</span>
                  <strong className="text-slate-800">{entry.count} Course recommendations</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
