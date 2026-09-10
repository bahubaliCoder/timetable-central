import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  GraduationCap,
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  LogIn,
  KeyRound,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const LoginModal = ({ isOpen, onClose }) => {
  const { currentUser, login, logout, addNotification } = useAdmin();

  const [activeTab, setActiveTab] = useState(currentUser.role === 'Student' ? 'Student' : 'Admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTabChange = (role) => {
    setActiveTab(role);
    setError('');
    setIdentifier('');
    setPassword('');
  };

  const handleFillDemo = (role) => {
    setError('');
    if (role === 'Admin') {
      setIdentifier('admin@timetablecentral.edu');
      setPassword('admin123');
    } else {
      setIdentifier('student@timetablecentral.edu');
      setPassword('student123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(`Please enter your ${activeTab === 'Admin' ? 'Admin Email or Username' : 'Student ID or Email'}.`);
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(identifier, password, activeTab);
      setLoading(false);

      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-fade-in">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-colors ${
                activeTab === 'Admin'
                  ? 'bg-blue-600 shadow-blue-500/30'
                  : 'bg-emerald-600 shadow-emerald-500/30'
              }`}
            >
              {activeTab === 'Admin' ? <ShieldCheck className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {activeTab === 'Admin' ? 'Admin Portal Authentication' : 'Student Portal Sign In'}
              </h3>
              <p className="text-xs text-slate-400">
                Sign in with ID and password
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Admin Login vs Student Login */}
        <div className="p-2 mx-6 mt-5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center gap-1 border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => handleTabChange('Admin')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'Admin'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('Student')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'Student'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Login</span>
          </button>
        </div>

        {/* Quick Demo Autofill Notice */}
        <div className="px-6 pt-4">
          <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between gap-2 text-xs">
            <div className="leading-tight">
              <span className="font-bold text-blue-800 dark:text-blue-300 block">
                {activeTab === 'Admin' ? 'Demo Admin Credentials' : 'Demo Student Credentials'}
              </span>
              <span className="text-[11px] text-blue-600/80 dark:text-blue-400/80">
                {activeTab === 'Admin'
                  ? 'admin@timetablecentral.edu / admin123'
                  : 'student@timetablecentral.edu / student123'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleFillDemo(activeTab)}
              className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shrink-0 shadow-sm transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Fill Demo</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User ID / Email Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {activeTab === 'Admin' ? 'Admin ID or Email' : 'Student ID or Student Email'} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder={
                  activeTab === 'Admin'
                    ? 'e.g. admin@timetablecentral.edu or admin'
                    : 'e.g. student@timetablecentral.edu or STU-2024-8841'
                }
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password *
              </label>
              <span className="text-[11px] text-slate-400">
                Case sensitive
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                activeTab === 'Admin'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
              }`}
            >
              {loading ? (
                <span>Authenticating credentials...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In as {activeTab}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Current Active Session Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
            />
            <span className="text-slate-500 dark:text-slate-400">
              Active: <strong>{currentUser.name}</strong> ({currentUser.role})
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="text-rose-600 dark:text-rose-400 hover:underline font-semibold text-[11px]"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
};
