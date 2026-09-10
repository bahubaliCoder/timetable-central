import React from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  DoorOpen,
  Plus,
  Moon,
  Sun,
  Download,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  Percent,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { PRESET_SCHEDULES } from '../data/mockData';

export const Navbar = () => {
  const {
    presetId,
    switchPreset,
    activePresetInfo,
    currentView,
    setCurrentView,
    settings,
    setSettings,
    conflictCount,
    setActiveModal,
    setSelectedClassForEdit,
  } = useSchedule();

  const handleAddClassClick = () => {
    setSelectedClassForEdit(null);
    setActiveModal('addClass');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Academic Program Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
                  TimeTable Central
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                  v2.0
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                {activePresetInfo.title} • {activePresetInfo.section}
              </div>
            </div>
          </div>

          {/* Preset Program Selector */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <GraduationCap className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={presetId}
              onChange={(e) => switchPreset(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 py-1 px-2 focus:outline-none cursor-pointer"
            >
              {Object.keys(PRESET_SCHEDULES).map((id) => (
                <option key={id} value={id} className="dark:bg-slate-800">
                  {PRESET_SCHEDULES[id].title}
                </option>
              ))}
              {presetId === 'custom' && (
                <option value="custom" className="dark:bg-slate-800">
                  Custom Imported Schedule
                </option>
              )}
            </select>
          </div>

          {/* Action Tools & Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Conflict Alert indicator (if conflicts exist) */}
            {conflictCount > 0 && (
              <button
                onClick={() => setCurrentView('weekly')}
                title={`${conflictCount} scheduling conflict(s) detected!`}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 animate-pulse-subtle"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span className="hidden sm:inline">{conflictCount} Conflicts</span>
              </button>
            )}

            {/* Attendance Tracker Trigger */}
            <button
              onClick={() => setActiveModal('attendance')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              title="Attendance Calculator & Safe Bunks"
            >
              <Percent className="w-3.5 h-3.5 text-brand-500" />
              <span className="hidden sm:inline">Attendance</span>
            </button>

            {/* Export & Sync */}
            <button
              onClick={() => setActiveModal('export')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              title="Export to Calendar (.ics), Print, or Backup"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden md:inline">Export</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setSettings((s) => ({ ...s, darkMode: !s.darkMode }))}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Primary 'Add Class' Button */}
            <button
              onClick={handleAddClassClick}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-brand-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 py-2.5 overflow-x-auto">
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentView('weekly')}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                currentView === 'weekly'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Weekly Grid</span>
            </button>

            <button
              onClick={() => setCurrentView('daily')}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                currentView === 'daily'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Daily Agenda</span>
            </button>

            <button
              onClick={() => setCurrentView('exams')}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                currentView === 'exams'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Exams & Milestones</span>
            </button>

            <button
              onClick={() => setCurrentView('rooms')}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                currentView === 'rooms'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <DoorOpen className="w-4 h-4" />
              <span>Free Rooms</span>
            </button>
          </nav>

          {/* Quick Settings: Weekend toggle & Time Format */}
          <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 ml-4 shrink-0">
            <label className="flex items-center space-x-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.showWeekends}
                onChange={(e) => setSettings((s) => ({ ...s, showWeekends: e.target.checked }))}
                className="w-3.5 h-3.5 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span>Weekends</span>
            </label>

            <button
              onClick={() =>
                setSettings((s) => ({ ...s, timeFormat: s.timeFormat === '12h' ? '24h' : '12h' }))
              }
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {settings.timeFormat.toUpperCase()}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
