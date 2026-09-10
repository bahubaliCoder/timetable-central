import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Moon,
  Sun,
  Download,
  Sliders,
  Search,
  X,
  Clock,
  Percent,
  AlertCircle,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { PRESET_SCHEDULES, CLASS_TYPES } from '../data/mockData';

export const Navbar = () => {
  const {
    presetId,
    switchPreset,
    activePresetInfo,
    classes,
    settings,
    setSettings,
    updateTimetableHours,
    conflictCount,
    filters,
    setFilters,
    setActiveModal,
    setSelectedClassForEdit,
  } = useSchedule();

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddClassClick = () => {
    setSelectedClassForEdit(null);
    setActiveModal('addClass');
  };

  // Compute attendance percentage
  const totalAttended = (classes || []).reduce((sum, c) => sum + (c.attended || 0), 0);
  const totalHeld = (classes || []).reduce((sum, c) => sum + (c.totalHeld || 0), 0);
  const overallPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : 100;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Program Switcher */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  TimeTable Central
                </span>
                {conflictCount > 0 && (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
                    title={`${conflictCount} conflicting class slot(s)`}
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {conflictCount} conflict{conflictCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Minimal Preset Selector */}
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <select
                  value={presetId}
                  onChange={(e) => switchPreset(e.target.value)}
                  className="bg-transparent font-medium hover:text-slate-800 dark:hover:text-slate-200 focus:outline-none cursor-pointer pr-4"
                >
                  {Object.keys(PRESET_SCHEDULES).map((id) => (
                    <option key={id} value={id} className="dark:bg-slate-800">
                      {PRESET_SCHEDULES[id].title} ({PRESET_SCHEDULES[id].section})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search and Type Filter */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search classes, rooms, professors..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((f) => ({ ...f, searchQuery: e.target.value }))}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100/80 dark:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 transition-all"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters((f) => ({ ...f, searchQuery: '' }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Type Filter pills */}
            <div className="flex items-center space-x-1 ml-2 shrink-0">
              <button
                onClick={() => setFilters((f) => ({ ...f, selectedType: 'all' }))}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  filters.selectedType === 'all'
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                All
              </button>
              {CLASS_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      selectedType: f.selectedType === type ? 'all' : type,
                    }))
                  }
                  className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                    filters.selectedType === type
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-semibold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Attendance Pill */}
            <button
              onClick={() => setActiveModal('attendance')}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-800"
              title="Attendance tracker and safe bunks"
            >
              <Percent className="w-3.5 h-3.5 text-brand-500" />
              <span>{overallPct}%</span>
            </button>

            {/* Schedule Hours & View Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-800"
                title="Customize timetable hours and days"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Hours</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-40 text-xs space-y-3">
                  <div className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                    Timetable Configuration
                  </div>

                  {/* Start Hour */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Start Time:</span>
                    <select
                      value={settings.startHour}
                      onChange={(e) => updateTimetableHours(Number(e.target.value), settings.endHour)}
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <option value={7}>7:00 AM</option>
                      <option value={8}>8:00 AM</option>
                      <option value={9}>9:00 AM</option>
                      <option value={10}>10:00 AM</option>
                    </select>
                  </div>

                  {/* End Hour */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">End Time:</span>
                    <select
                      value={settings.endHour}
                      onChange={(e) => updateTimetableHours(settings.startHour, Number(e.target.value))}
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <option value={16}>4:00 PM</option>
                      <option value={17}>5:00 PM</option>
                      <option value={18}>6:00 PM</option>
                      <option value={19}>7:00 PM</option>
                      <option value={20}>8:00 PM</option>
                      <option value={21}>9:00 PM</option>
                    </select>
                  </div>

                  {/* Weekend Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Show Weekends:</span>
                    <input
                      type="checkbox"
                      checked={settings.showWeekends}
                      onChange={(e) => setSettings((s) => ({ ...s, showWeekends: e.target.checked }))}
                      className="w-4 h-4 text-brand-600 rounded"
                    />
                  </div>

                  {/* 12h vs 24h */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Time Format:</span>
                    <button
                      onClick={() =>
                        setSettings((s) => ({ ...s, timeFormat: s.timeFormat === '12h' ? '24h' : '12h' }))
                      }
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-brand-600 dark:text-brand-400"
                    >
                      {settings.timeFormat.toUpperCase()}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Export / Print */}
            <button
              onClick={() => setActiveModal('export')}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print schedule or download iCal"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setSettings((s) => ({ ...s, darkMode: !s.darkMode }))}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Add Class Button */}
            <button
              onClick={handleAddClassClick}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
