import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Search,
  CheckCircle,
  AlertTriangle,
  Shield,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Calendar,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const Header = ({ onOpenLoginModal }) => {
  const {
    activePage,
    setMobileMenuOpen,
    darkMode,
    setDarkMode,
    currentUser,
    switchRole,
    sessions,
    activeSession,
    setActiveSession,
    autoSaveStatus,
    institutionConflicts,
    notifications,
    markAllNotificationsRead,
    setActivePage,
  } = useAdmin();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roleRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) setShowRoleMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifMenu(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter((n) => n.unread).length;

  const pageTitles = {
    dashboard: 'Administrative Overview',
    timetable: 'Class Timetable Management',
    teachers: 'Faculty & Instructor Directory',
    subjects: 'Academic Subject Catalog',
    classes: 'Classes, Degrees & Sections',
    rooms: 'Campus Rooms & Laboratories',
    reports: 'Workload & Utilization Reports',
    roles: 'Role Permissions & Access Control',
    settings: 'Institutional Configuration',
    profile: 'User Account & Preferences',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 no-print transition-colors">
      
      {/* Left: Mobile menu toggle + Page title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 capitalize leading-tight">
            {pageTitles[activePage] || 'Time Table Central'}
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
            <span>{currentUser.institution}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle className="w-3 h-3" />
              {autoSaveStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Academic Term, Role Switcher, Notifications, Theme, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        
        {/* Academic Session Selector */}
        <div className="hidden md:flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <select
            value={activeSession}
            onChange={(e) => setActiveSession(e.target.value)}
            className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            {sessions.map((s) => (
              <option key={s} value={s} className="dark:bg-slate-800">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Institutional Conflict indicator */}
        {institutionConflicts.length > 0 && (
          <button
            onClick={() => setActivePage('reports')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold animate-pulse"
            title={`${institutionConflicts.length} scheduling clash(es) detected across classes!`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">{institutionConflicts.length} Clashes</span>
          </button>
        )}

        {/* Quick Role Switcher Dropdown */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 transition-colors"
            title="Switch User Role to test permissions"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{currentUser.role}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-40 text-xs">
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Simulate User Role
              </div>
              {['Super Admin', 'Admin', 'Faculty'].map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                    currentUser.role === role
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{role}</span>
                  {currentUser.role === role && <CheckCircle className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Institutional Alerts
                </span>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Mark read
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      n.unread
                        ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/50'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Profile / Account Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 pl-1 focus:outline-none"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30 hover:ring-blue-500 transition-all"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-40 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <div className="font-bold text-slate-800 dark:text-slate-100 truncate">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
              </div>

              <button
                onClick={() => {
                  setActivePage('profile');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center space-x-2"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center space-x-2"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Academic Settings</span>
              </button>

              <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onOpenLoginModal) onOpenLoginModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch Account / Sign In</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
