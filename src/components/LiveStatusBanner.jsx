import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  Zap,
  RotateCcw,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { formatTimeDisplay, timeToMinutes } from '../utils/timeHelpers';

export const LiveStatusBanner = () => {
  const {
    liveStatus,
    currentTime,
    isSimulatedTime,
    setSimulatedDayAndTime,
    resetToRealTime,
    markAttendance,
    settings,
  } = useSchedule();

  const [showSimControls, setShowSimControls] = useState(false);

  const {
    currentDay,
    currentClass,
    nextClass,
    minutesRemainingInCurrent,
    minutesUntilNext,
  } = liveStatus;

  // Format current live clock display
  const timeStr = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: settings.timeFormat === '12h',
  });

  // Calculate percentage of ongoing class completed
  let progressPct = 0;
  if (currentClass) {
    const startM = timeToMinutes(currentClass.startTime);
    const endM = timeToMinutes(currentClass.endTime);
    const totalDuration = endM - startM;
    const elapsed = totalDuration - minutesRemainingInCurrent;
    progressPct = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-indigo-900/40 relative overflow-hidden mb-6">
      {/* Subtle background glow effect */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Current Time & Live Clock Header */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <Clock className="w-4 h-4 text-brand-300 animate-pulse" />
            <span className="font-bold text-sm tracking-wide">{currentDay}, {timeStr}</span>
          </div>

          {isSimulatedTime ? (
            <div className="flex items-center space-x-2 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulated Demo Mode</span>
              <button
                onClick={resetToRealTime}
                className="ml-1 text-amber-200 hover:text-white underline flex items-center gap-1"
                title="Return to real computer time"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span>
              Live Sync
            </span>
          )}

          {/* Quick Simulation Toggle */}
          <button
            onClick={() => setShowSimControls(!showSimControls)}
            className="text-xs text-indigo-300 hover:text-white underline ml-auto sm:ml-2"
          >
            {showSimControls ? 'Hide Time Travel' : 'Test Different Times'}
          </button>
        </div>

        {/* Status Indicators Container */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: CURRENT CLASS */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Ongoing Class
              </span>
              {currentClass && (
                <span className="text-emerald-400 font-bold">
                  {minutesRemainingInCurrent}m remaining
                </span>
              )}
            </div>

            {currentClass ? (
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">
                      {currentClass.code}: {currentClass.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-400" />
                        {currentClass.room}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-brand-400" />
                        {currentClass.instructor}
                      </span>
                    </div>
                  </div>

                  {/* Attendance fast actions */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => markAttendance(currentClass.id, 'attended')}
                      className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                      title="Mark Present"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => markAttendance(currentClass.id, 'missed')}
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                      title="Mark Absent"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="py-2 text-sm text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>No active class right now. Free study period!</span>
              </div>
            )}
          </div>

          {/* Card 2: UP NEXT */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1.5">
              <span>Up Next</span>
              {nextClass && minutesUntilNext !== null && (
                <span className="text-brand-300 font-medium">in {minutesUntilNext} mins</span>
              )}
            </div>

            {nextClass ? (
              <div>
                <h4 className="font-bold text-white text-base leading-tight">
                  {nextClass.code}: {nextClass.title}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-brand-300">
                    <Clock className="w-3.5 h-3.5" />
                    {nextClass.day}, {formatTimeDisplay(nextClass.startTime, settings.timeFormat === '24h')}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {nextClass.room}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-2 text-sm text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All classes completed for the current cycle!</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Expandable Demo Time Travel Bar */}
      {showSimControls && (
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-300 font-semibold mr-1">Time Travel Demo:</span>
          <button
            onClick={() => setSimulatedDayAndTime('Monday', 9, 15)}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Mon 9:15 AM (In CS401)
          </button>
          <button
            onClick={() => setSimulatedDayAndTime('Monday', 14, 30)}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Mon 2:30 PM (DSA Lab)
          </button>
          <button
            onClick={() => setSimulatedDayAndTime('Wednesday', 9, 45)}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Wed 9:45 AM (Networks)
          </button>
          <button
            onClick={() => setSimulatedDayAndTime('Friday', 14, 15)}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Fri 2:15 PM (Discrete Math)
          </button>
          <button
            onClick={() => setSimulatedDayAndTime('Sunday', 12, 0)}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Sunday 12:00 PM (Weekend Free)
          </button>
        </div>
      )}
    </div>
  );
};
