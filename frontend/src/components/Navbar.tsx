"use client";
import React, { useEffect, useState } from "react";
import { Bell, User, LogOut, ChevronDown } from "lucide-react";
import { api } from "../utils/api";

export default function Navbar({ userEmail, userRole, onLogout }: { userEmail: string; userRole: string; onLogout: () => void }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // refresh notifications
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data.filter((n: any) => !n.is_read));
    } catch (e) {
      // quiet fail
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      // quiet fail
    }
  };

  return (
    <nav className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Brand logo */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-red-500 flex items-center justify-center font-bold text-white shadow-md shadow-red-500/20 font-sans">
          CC
        </div>
        <span className="font-semibold text-lg tracking-wide bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent font-sans">
          Career Catalyst
        </span>
      </div>

      {/* Action triggers */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 text-slate-500 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl p-3 border border-slate-200 shadow-2xl z-50 text-sm bg-white">
              <h4 className="font-semibold text-slate-800 pb-2 border-b border-slate-200 mb-2">Notifications</h4>
              {notifications.length === 0 ? (
                <p className="text-slate-400 text-xs py-3 text-center">No new notifications</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkRead(n.id)}
                      className="p-2 rounded hover:bg-slate-50 cursor-pointer transition border-l-2 border-red-500 pl-3"
                    >
                      <div className="font-medium text-slate-800 text-xs">{n.title}</div>
                      <p className="text-slate-600 text-[10px] mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
          >
            <div className="h-6 w-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs uppercase">
              {userEmail ? userEmail[0] : "S"}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-800 leading-3">{userEmail.split("@")[0]}</div>
              <span className="text-[9px] text-red-500 capitalize font-medium">{userRole}</span>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl p-1.5 border border-slate-200 shadow-2xl z-50 bg-white">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 p-2 text-red-600 hover:bg-red-500/5 rounded-lg text-xs font-semibold transition text-left border border-transparent hover:border-red-100"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
