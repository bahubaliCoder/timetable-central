import React from 'react';
import { Search, Filter, X, Users, MapPin, Tag } from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { CLASS_TYPES, DAYS_OF_WEEK } from '../data/mockData';

export const FilterBar = () => {
  const { classes, filteredClasses, filters, setFilters, settings } = useSchedule();

  // Extract unique instructors and rooms from current classes
  const uniqueInstructors = Array.from(new Set((classes || []).map((c) => c?.instructor))).filter(Boolean).sort();
  const uniqueRooms = Array.from(new Set((classes || []).map((c) => c?.room))).filter(Boolean).sort();

  const daysToDisplay = settings.showWeekends ? DAYS_OF_WEEK : DAYS_OF_WEEK.slice(0, 5);

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.selectedDay !== 'all' ||
    filters.selectedType !== 'all' ||
    filters.selectedInstructor !== 'all' ||
    filters.selectedRoom !== 'all';

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      selectedDay: 'all',
      selectedType: 'all',
      selectedInstructor: 'all',
      selectedRoom: 'all',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800/80 mb-6 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search course code, subject, professor, room..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((f) => ({ ...f, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((f) => ({ ...f, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter dropdowns & chips */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Day Selector */}
          <select
            value={filters.selectedDay}
            onChange={(e) => setFilters((f) => ({ ...f, selectedDay: e.target.value }))}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Days</option>
            {daysToDisplay.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          {/* Type Selector */}
          <select
            value={filters.selectedType}
            onChange={(e) => setFilters((f) => ({ ...f, selectedType: e.target.value }))}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Types</option>
            {CLASS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Instructor Selector */}
          <select
            value={filters.selectedInstructor}
            onChange={(e) => setFilters((f) => ({ ...f, selectedInstructor: e.target.value }))}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 max-w-[150px] truncate"
          >
            <option value="all">All Faculty</option>
            {uniqueInstructors.map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>

          {/* Room Selector */}
          <select
            value={filters.selectedRoom}
            onChange={(e) => setFilters((f) => ({ ...f, selectedRoom: e.target.value }))}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 max-w-[140px] truncate"
          >
            <option value="all">All Rooms</option>
            {uniqueRooms.map((rm) => (
              <option key={rm} value={rm}>
                {rm}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-2.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Count badge */}
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-auto lg:ml-2">
            Showing <strong className="text-slate-800 dark:text-slate-100">{filteredClasses.length}</strong> of {classes.length} classes
          </span>

        </div>

      </div>
    </div>
  );
};
