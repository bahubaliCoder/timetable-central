import React from 'react';
import {
  BookOpen,
  Clock,
  Percent,
  CheckCircle,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { timeToMinutes } from '../utils/timeHelpers';

export const StatsBar = () => {
  const { classes, conflictCount, activePresetInfo, setActiveModal } = useSchedule();

  // Unique course codes
  const uniqueCourses = Array.from(new Set(classes.map((c) => c.code.split('-')[0])));

  // Total weekly minutes
  const totalWeeklyMinutes = classes.reduce((sum, c) => {
    return sum + (timeToMinutes(c.endTime) - timeToMinutes(c.startTime));
  }, 0);
  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1);

  // Overall attendance
  const totalAttended = classes.reduce((sum, c) => sum + (c.attended || 0), 0);
  const totalHeld = classes.reduce((sum, c) => sum + (c.totalHeld || 0), 0);
  const overallPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : 100;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* Stat 1: Total Courses */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
            {uniqueCourses.length}
          </div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Courses Enrolled
          </div>
        </div>
      </div>

      {/* Stat 2: Weekly Hours */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
            {totalWeeklyHours} hrs
          </div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Weekly Lectures & Labs
          </div>
        </div>
      </div>

      {/* Stat 3: Attendance */}
      <div
        onClick={() => setActiveModal('attendance')}
        className="bg-white dark:bg-slate-900 rounded-xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center space-x-3 cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
        title="Click to view Attendance Calculator"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Percent className="w-5 h-5" />
        </div>
        <div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
            {overallPct}%
          </div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>Attendance</span>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">(View)</span>
          </div>
        </div>
      </div>

      {/* Stat 4: Schedule Health / Conflict Status */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center space-x-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            conflictCount > 0
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {conflictCount > 0 ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
        </div>
        <div>
          <div
            className={`text-lg sm:text-xl font-extrabold leading-tight ${
              conflictCount > 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {conflictCount > 0 ? `${conflictCount} Collision` : 'Zero Conflicts'}
          </div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {conflictCount > 0 ? 'Review overlapping slots' : 'Schedule is optimized'}
          </div>
        </div>
      </div>

    </div>
  );
};
