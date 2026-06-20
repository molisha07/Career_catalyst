"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../utils/api";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.signup({ email, password, role });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[100px]" />

      <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-slate-200 shadow-xl relative z-10 bg-white">
        <div className="flex flex-col items-center mb-6">
          <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center font-bold text-white mb-3 shadow-md shadow-red-500/20">
            CC
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Get Started</h2>
          <p className="text-xs text-slate-500 mt-1">Create an intelligent Career Catalyst profile</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 mb-5 text-center font-semibold">
            {error}
          </div>
        )}

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
              role === "student"
                ? "bg-red-500 text-white shadow-sm shadow-red-500/10"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            I am a Student
          </button>
          <button
            type="button"
            onClick={() => setRole("recruiter")}
            className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
              role === "recruiter"
                ? "bg-red-500 text-white shadow-sm shadow-red-500/10"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            I am a Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-800">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@somaiya.edu"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 rounded-xl text-sm font-semibold tracking-wide mt-4 disabled:opacity-50 transition"
          >
            {loading ? "Registering account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-red-500 font-semibold hover:underline">
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
