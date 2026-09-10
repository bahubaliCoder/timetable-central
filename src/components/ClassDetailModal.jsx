import React from 'react';
import {
  X,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  FileText,
  Percent,
  Tag,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { formatTimeDisplay, calculateAttendance } from '../utils/timeHelpers';

export const ClassDetailModal = () => {
  const {
    activeModal,
    setActiveModal,
    selectedClassForEdit,
    setSelectedClassForEdit,
    markAttendance,
    deleteClass,
    settings,
  } = useSchedule();

  if (activeModal !== 'classDetail' || !selectedClassForEdit) return null;

  const cls = selectedClassForEdit;
  const attendanceStats = calculateAttendance(
    cls.attended || 0,
    cls.totalHeld || 0,
    settings.targetAttendance
  );

  const handleEdit = () => {
    setActiveModal('editClass');
  };

  const handleDelete = () => {
    deleteClass(cls.id);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Top Header Banner with class color */}
        <div
          className="p-6 text-white relative"
          style={{
            background: `linear-gradient(135deg, ${cls.color || '#6366f1'}, ${cls.color || '#6366f1'}cc)`,
          }}
        >
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 mb-2">
            <span className="font-extrabold text-sm px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-sm">
              {cls.code}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/20">
              {cls.type}
            </span>
          </div>

          <h3 className="text-xl font-bold leading-snug">
            {cls.title}
          </h3>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4">
          
          {/* Day & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">SCHEDULE</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                <span>{cls.day}</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {formatTimeDisplay(cls.startTime, settings.timeFormat === '24h')} -{' '}
                {formatTimeDisplay(cls.endTime, settings.timeFormat === '24h')}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">LOCATION</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                <span className="truncate">{cls.room}</span>
              </div>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Instructor</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{cls.instructor}</div>
            </div>
          </div>

          {/* Attendance Section */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-brand-500" />
                Attendance Status
              </span>
              <span className="font-bold text-brand-600 dark:text-brand-400">
                {attendanceStats.percentage}% ({cls.attended || 0}/{cls.totalHeld || 0})
              </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all ${
                  attendanceStats.status === 'good'
                    ? 'bg-emerald-500'
                    : attendanceStats.status === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, attendanceStats.percentage)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {attendanceStats.status === 'good'
                  ? `Can miss ${attendanceStats.safeBunks} more classes safely.`
                  : `Need ${attendanceStats.classesNeeded} classes to reach ${settings.targetAttendance}%.`}
              </span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => markAttendance(cls.id, 'attended')}
                  className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-200 transition-colors"
                  title="Mark Present"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>+1</span>
                </button>
                <button
                  onClick={() => markAttendance(cls.id, 'missed')}
                  className="px-2 py-1 rounded bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1 hover:bg-rose-200 transition-colors"
                  title="Mark Absent"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Missed</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          {cls.notes && (
            <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300">
              <div className="font-bold flex items-center gap-1 mb-1">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Lecture Notes & Homework:</span>
              </div>
              <p>{cls.notes}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handleDelete}
              className="flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Class</span>
            </button>

            <button
              onClick={handleEdit}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
