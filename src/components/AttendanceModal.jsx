import React from 'react';
import {
  X,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Plus,
  Minus,
  Info,
  Award,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { calculateAttendance } from '../utils/timeHelpers';

export const AttendanceModal = () => {
  const { classes, markAttendance, settings, setSettings, activeModal, setActiveModal } = useSchedule();

  if (activeModal !== 'attendance') return null;

  // Group classes by course code so multi-session courses have consolidated attendance
  const coursesMap = {};
  classes.forEach((c) => {
    // base code without suffix
    const baseCode = c.code.split('-')[0];
    if (!coursesMap[baseCode]) {
      coursesMap[baseCode] = {
        code: baseCode,
        title: c.title.replace(/Lab|Tutorial/g, '').trim(),
        color: c.color,
        attended: 0,
        totalHeld: 0,
        sampleId: c.id,
      };
    }
    coursesMap[baseCode].attended += c.attended || 0;
    coursesMap[baseCode].totalHeld += c.totalHeld || 0;
  });

  const coursesList = Object.values(coursesMap);

  // Calculate overall attendance
  const totalAttended = coursesList.reduce((sum, c) => sum + c.attended, 0);
  const totalHeld = coursesList.reduce((sum, c) => sum + c.totalHeld, 0);
  const overallPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200 dark:border-brand-800">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Attendance & Safe Bunks Calculator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track compliance with your university requirement and calculate safe skips.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aggregate Score & Target Adjustment */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                {overallPct}%
              </div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Overall Attendance
              </div>
            </div>
            <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <div>Total Classes Held: <strong>{totalHeld}</strong></div>
              <div>Classes Attended: <strong>{totalAttended}</strong></div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Target Threshold:
            </label>
            <select
              value={settings.targetAttendance}
              onChange={(e) =>
                setSettings((s) => ({ ...s, targetAttendance: Number(e.target.value) }))
              }
              className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-brand-600 dark:text-brand-400 focus:outline-none"
            >
              <option value={70}>70%</option>
              <option value={75}>75% (Standard)</option>
              <option value={80}>80%</option>
              <option value={85}>85% (Strict)</option>
              <option value={90}>90% (Distinction)</option>
            </select>
          </div>
        </div>

        {/* Course-by-course list */}
        <div className="p-5 sm:p-6 max-h-[50vh] overflow-y-auto space-y-4">
          {coursesList.map((course) => {
            const stats = calculateAttendance(
              course.attended,
              course.totalHeld,
              settings.targetAttendance
            );

            return (
              <div
                key={course.code}
                className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: course.color || '#6366f1' }}
                    ></span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {course.code}: {course.title}
                    </h4>
                  </div>

                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      stats.status === 'good'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : stats.status === 'warning'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {stats.percentage}% ({course.attended}/{course.totalHeld})
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2.5">
                  <div
                    className={`h-full transition-all duration-300 ${
                      stats.status === 'good'
                        ? 'bg-emerald-500'
                        : stats.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, stats.percentage)}%` }}
                  ></div>
                </div>

                {/* Safe Bunks / Classes Needed Insight */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    {stats.status === 'good' ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Safe to miss {stats.safeBunks} {stats.safeBunks === 1 ? 'class' : 'classes'}
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Must attend next {stats.classesNeeded} {stats.classesNeeded === 1 ? 'class' : 'classes'} to reach {settings.targetAttendance}%
                      </span>
                    )}
                  </div>

                  {/* Quick increment / decrement */}
                  <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                    <button
                      onClick={() => markAttendance(course.sampleId, 'attended')}
                      className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center gap-1"
                      title="Add attended class"
                    >
                      <Plus className="w-3 h-3" /> Attended
                    </button>
                    <button
                      onClick={() => markAttendance(course.sampleId, 'missed')}
                      className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold text-xs flex items-center gap-1"
                      title="Add missed class"
                    >
                      <Minus className="w-3 h-3" /> Missed
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
