import React, { useState } from 'react';
import {
  Settings,
  Calendar,
  Clock,
  Save,
  RotateCcw,
  Building,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const SettingsPage = () => {
  const {
    sessions,
    activeSession,
    setActiveSession,
    resetToDemoPreset,
    addNotification,
    days,
    periods,
  } = useAdmin();

  const [institutionName, setInstitutionName] = useState('Central Institute of Science & Technology');
  const [institutionCode, setInstitutionCode] = useState('CIST-2026');
  const [campusEmail, setCampusEmail] = useState('admin@timetablecentral.edu');
  const [defaultDuration, setDefaultDuration] = useState('50');
  const [workingDaysCount, setWorkingDaysCount] = useState('5');
  const [autoConflictDetection, setAutoConflictDetection] = useState(true);
  const [enableRoomCapacityCheck, setEnableRoomCapacityCheck] = useState(true);
  const [savedAlert, setSavedAlert] = useState(false);

  // New Session Input
  const [newSessionName, setNewSessionName] = useState('');
  const [sessionList, setSessionList] = useState(sessions);

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    setSavedAlert(true);
    addNotification('Settings Updated', 'Campus and institutional parameters saved successfully.', 'success');
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleAddSession = (e) => {
    e.preventDefault();
    if (!newSessionName.trim()) return;
    if (sessionList.includes(newSessionName.trim())) {
      alert('This academic term already exists.');
      return;
    }
    const updated = [...sessionList, newSessionName.trim()];
    setSessionList(updated);
    setNewSessionName('');
    addNotification('Academic Session Added', `Added ${newSessionName.trim()} to active terms.`, 'success');
  };

  const handleDeleteSession = (term) => {
    if (sessionList.length <= 1) {
      alert('You must maintain at least one academic session.');
      return;
    }
    const updated = sessionList.filter((s) => s !== term);
    setSessionList(updated);
    if (activeSession === term) {
      setActiveSession(updated[0]);
    }
    addNotification('Academic Session Removed', `${term} removed.`, 'warning');
  };

  const handlePresetReset = (presetType) => {
    if (window.confirm(`Are you sure you want to load the ${presetType} preset? Current custom edits will be replaced with preset institutional sample data.`)) {
      resetToDemoPreset(presetType);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-blue-600" />
            Institutional Configuration & Settings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure campus profiles, academic term calendars, default period slots, and preset demo templates.
          </p>
        </div>

        {savedAlert && (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Settings saved successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Institutional Form & Academic Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Institutional Profile */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-indigo-600" />
              Institution & Campus Identity
            </h3>

            <form onSubmit={handleSaveGeneral} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Institution / University Name
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Campus / Accreditation Code
                  </label>
                  <input
                    type="text"
                    value={institutionCode}
                    onChange={(e) => setInstitutionCode(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Administrative Contact Email
                </label>
                <input
                  type="email"
                  value={campusEmail}
                  onChange={(e) => setCampusEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
                >
                  <Save className="w-4 h-4" />
                  Save Identity Details
                </button>
              </div>
            </form>
          </div>

          {/* Academic Sessions / Terms */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Academic Terms & Sessions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Manage semesters, trimesters, and academic calendars. Switch active term to organize departmental timetables.
            </p>

            {/* Add Session Input */}
            <form onSubmit={handleAddSession} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g. 2026-2027 Term 2 (Spring)"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                Add Term
              </button>
            </form>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sessionList.map((term) => {
                const isActive = activeSession === term;
                return (
                  <div
                    key={term}
                    className="py-3 flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isActive ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      />
                      <div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {term}
                        </span>
                        {isActive && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full">
                            Active Term
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSession(term);
                            addNotification('Active Term Changed', `Switched active term to ${term}`, 'info');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                        >
                          Make Active
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteSession(term)}
                        title="Delete Session"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timetable Engine Rules */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Sliders className="w-5 h-5 text-purple-600" />
              Scheduling Engine Rules & Automated Checks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Control conflict detection sensitivity and automated validation across periods and room assignments.
            </p>

            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoConflictDetection}
                  onChange={(e) => setAutoConflictDetection(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Real-time Double Booking Detection (Teacher & Room Clashes)
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Automatically checks if a professor or room is already booked on the same day and period across all institutional classes.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableRoomCapacityCheck}
                  onChange={(e) => setEnableRoomCapacityCheck(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Room Capacity & Overcrowding Warning
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Triggers advisory notices when class student strength exceeds the assigned room seating capacity.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Presets, Periods summary & System Reset */}
        <div className="space-y-6">
          {/* Quick Schedule Parameters */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-amber-500" />
              Schedule Timings
            </h3>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Active Days / Week</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{days.length} Days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total Periods / Breaks</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{periods.length} Slots</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Standard Period Length</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">50 Minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Campus Hours</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">08:30 AM - 04:45 PM</span>
              </div>
            </div>
          </div>

          {/* Institutional Presets */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Institutional Demo Presets
            </div>
            <h4 className="text-lg font-black tracking-tight text-white mb-2">
              Load Specialized Presets
            </h4>
            <p className="text-xs text-indigo-200/80 mb-5 leading-relaxed">
              Instantly populate the system with pre-configured departments, labs, dynamic period intervals, and class timetables.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handlePresetReset('University Engineering')}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition group"
              >
                <div className="font-bold text-sm text-white group-hover:text-blue-300">
                  Engineering & CS College
                </div>
                <div className="text-[11px] text-indigo-200/70">
                  6 Departments, Lab Rooms, Semesters, and Lecture Periods
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetReset('High School K-12')}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition group"
              >
                <div className="font-bold text-sm text-white group-hover:text-purple-300">
                  Senior High School (K-12)
                </div>
                <div className="text-[11px] text-indigo-200/70">
                  Homerooms, Science, Humanities, and Recess Intervals
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetReset('Coaching & Entrance Academy')}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition group"
              >
                <div className="font-bold text-sm text-white group-hover:text-amber-300">
                  Competitive Coaching Academy
                </div>
                <div className="text-[11px] text-indigo-200/70">
                  Batch Batches, Weekend Crash Courses & Test Series
                </div>
              </button>
            </div>
          </div>

          {/* Reset All Data */}
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6">
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold text-sm mb-2">
              <ShieldAlert className="w-5 h-5" />
              Reset System Data
            </div>
            <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mb-4 leading-relaxed">
              Reset all faculty, subjects, rooms, classes, and schedules back to factory institutional defaults.
            </p>
            <button
              type="button"
              onClick={() => handlePresetReset('Default Demo')}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Factory Seed Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
