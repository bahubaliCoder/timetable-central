import React, { useState } from 'react';
import {
  UserCheck,
  Mail,
  Building,
  Shield,
  KeyRound,
  Bell,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  Lock,
  Save,
  ShieldAlert,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const ProfilePage = () => {
  const {
    currentUser,
    setCurrentUser,
    darkMode,
    setDarkMode,
    addNotification,
    autoSaveStatus,
    activeSession,
  } = useAdmin();

  const [name, setName] = useState(currentUser.name || 'Dr. Eleanor Vance');
  const [email, setEmail] = useState(currentUser.email || 'e.vance@centraltech.edu');
  const [department, setDepartment] = useState(currentUser.department || 'Office of Academic Affairs');
  const [phone, setPhone] = useState('+1 (555) 492-8812');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savedMessage, setSavedMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // Save personal details
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name,
      email,
      department,
    };
    setCurrentUser(updated);
    setSavedMessage('Profile information saved successfully!');
    addNotification('Profile Updated', 'Account credentials and profile details modified.', 'success');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  // Change password simulation
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    setPasswordMessage('Password changed successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    addNotification('Security Alert', 'Account master password was changed.', 'info');
    setTimeout(() => setPasswordMessage(''), 3000);
  };

  const getInitials = (str) => {
    return str
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <UserCheck className="w-6 h-6 text-blue-600" />
          My Profile & Account Center
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal institutional credentials, account role, and UI preferences.
        </p>
      </div>

      {/* Account Overview Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center text-2xl sm:text-3xl font-black shrink-0 shadow-inner">
            {getInitials(currentUser.name)}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-2xl font-black tracking-tight">{currentUser.name}</h3>
              <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white text-indigo-900 shadow-sm">
                {currentUser.role}
              </span>
            </div>
            <p className="text-sm text-blue-100/90 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" /> {currentUser.email}
            </p>
            <p className="text-xs text-blue-200/80 flex items-center gap-2">
              <Building className="w-3.5 h-3.5" /> {currentUser.institution} • {currentUser.department}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Edit Form & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Personal & Faculty Information
              </h3>
              {savedMessage && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {savedMessage}
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Academic Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
                >
                  <Save className="w-4 h-4" />
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password & Security */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                Password & Institutional Security
              </h3>
              {passwordMessage && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {passwordMessage}
                </span>
              )}
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition"
                >
                  <KeyRound className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Column: Preferences & Active Session */}
        <div className="space-y-6">
          {/* Display & UI Preferences */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Sun className="w-5 h-5 text-amber-500" />
              Interface Theme & Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Color Theme
                  </div>
                  <div className="text-xs text-slate-500">
                    {darkMode ? 'Dark Mode (Night)' : 'Light Mode (Standard)'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition flex items-center gap-2 text-xs font-bold"
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
                  Toggle
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Sync Status
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">
                    {autoSaveStatus}
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
              </div>
            </div>
          </div>

          {/* Active Session Info */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Laptop className="w-5 h-5 text-indigo-600" />
              Active Institutional Session
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Academic Term:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{activeSession}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Login Role:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{currentUser.role}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Device Platform:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">macOS / Chrome Browser</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Campus IP:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">192.168.10.45 (Local)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Session Status:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
