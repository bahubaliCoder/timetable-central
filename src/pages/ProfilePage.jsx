import React, { useState, useRef, useEffect } from 'react';
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
  Camera,
  Upload,
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import rupaliKumariImg from '../assets/rupali-kumari.png';
import raviRanjanImg from '../assets/ravi-ranjan.png';
import nadiyaZafarImg from '../assets/nadiya-zafar.png';

const PRESET_AVATARS = [
  rupaliKumariImg,
  raviRanjanImg,
  nadiyaZafarImg,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
];

export const ProfilePage = () => {
  const {
    currentUser,
    updateUserProfile,
    darkMode,
    setDarkMode,
    addNotification,
    autoSaveStatus,
    activeSession,
    isStudent,
    isFaculty,
    updateTeacher,
    teachers,
  } = useAdmin();

  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [department, setDepartment] = useState(currentUser.department || '');
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 234-5678');
  const [avatar, setAvatar] = useState(currentUser.avatar || PRESET_AVATARS[0]);

  // Student-specific fields
  const [studentId, setStudentId] = useState(currentUser.studentId || 'STU-2024-8841');
  const [semester, setSemester] = useState(currentUser.semester || 'Semester 4 (Section A)');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savedMessage, setSavedMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const fileInputRef = useRef(null);

  // Sync state when currentUser changes
  useEffect(() => {
    setName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setDepartment(currentUser.department || '');
    setPhone(currentUser.phone || '+1 (555) 234-5678');
    setAvatar(currentUser.avatar || PRESET_AVATARS[0]);
    if (currentUser.studentId) setStudentId(currentUser.studentId);
    if (currentUser.semester) setSemester(currentUser.semester);
  }, [currentUser]);

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size exceeds 2MB limit. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save personal details
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      name,
      email,
      department,
      phone,
      avatar,
      ...(isStudent ? { studentId, semester } : {}),
    };

    updateUserProfile(updated);

    // If faculty, sync with teacher directory entry
    if (isFaculty) {
      const matchTeacher = teachers.find((t) => t.email === currentUser.email || t.name === currentUser.name);
      if (matchTeacher) {
        updateTeacher(matchTeacher.id, {
          name,
          email,
          department,
          phone,
          avatar,
        });
      }
    }

    setSavedMessage('Profile & photo saved successfully!');
    addNotification('Profile Updated', 'Profile photo and credentials modified.', 'success');
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

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-blue-600" />
            {isStudent ? 'Student Account & Profile' : 'Faculty Account & Profile'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isStudent
              ? 'Manage your student credentials, profile photo, and academic registration.'
              : 'Manage your faculty credentials, profile photo, and departmental appointments.'}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isStudent
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
          }`}
        >
          {isStudent ? <GraduationCap className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
          {currentUser.role} Account
        </span>
      </div>

      {/* Account Overview Banner with Editable Photo */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl ${
          isStudent
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 shadow-emerald-500/10'
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-blue-500/10'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative group">
            <img
              src={avatar}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-950/50 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[10px] font-bold"
              title="Upload new profile picture"
            >
              <Camera className="w-5 h-5 mb-1" />
              <span>Change</span>
            </button>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-2xl font-black tracking-tight">{currentUser.name}</h3>
              <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white text-slate-900 shadow-sm">
                {currentUser.role}
              </span>
            </div>
            <p className="text-sm text-white/90 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" /> {currentUser.email}
            </p>
            <p className="text-xs text-white/80 flex items-center gap-2">
              <Building className="w-3.5 h-3.5" /> {currentUser.institution} • {currentUser.department}
            </p>
            {isStudent && (
              <p className="text-xs text-emerald-100 font-semibold flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" /> Student Roll No: {studentId} • {semester}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Edit Details & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                {isStudent ? 'Student Profile & Information' : 'Faculty Profile & Information'}
              </h3>
              {savedMessage && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {savedMessage}
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Profile Photo Upload Control */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-blue-600" />
                  Update Profile Photo
                </label>

                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={avatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500 shadow-md shrink-0"
                  />

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload From Device
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const nextPreset = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
                          setAvatar(nextPreset);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition"
                      >
                        Random Avatar
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Upload any image from your computer (max 2MB), or paste a link below.
                    </p>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <input
                    type="url"
                    placeholder="https://example.com/my-photo.jpg"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Quick Avatar Presets Selector */}
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    Quick Presets:
                  </span>
                  {PRESET_AVATARS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Preset ${i + 1}`}
                      onClick={() => setAvatar(url)}
                      className={`w-7 h-7 rounded-lg object-cover cursor-pointer ring-2 transition-all ${
                        avatar === url
                          ? 'ring-blue-600 scale-110'
                          : 'ring-transparent opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Text Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Full Name *
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
                    Email Address *
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
                    {isStudent ? 'Program / Branch' : 'Academic Department'}
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {isStudent && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                        Student ID / Roll Number
                      </label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                        Current Semester & Section
                      </label>
                      <input
                        type="text"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
                >
                  <Save className="w-4 h-4" />
                  Save Profile & Photo
                </button>
              </div>
            </form>
          </div>

          {/* Security & Password */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                Password & Account Security
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

        {/* Right 1 Column: Preferences & Session */}
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
              Active Session Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Academic Term:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{activeSession}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Active Role:</span>
                <span
                  className={`font-bold ${
                    isStudent ? 'text-emerald-600 dark:text-emerald-400' : 'text-purple-600 dark:text-purple-400'
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Platform:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">macOS / Chrome</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Security Check:</span>
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
