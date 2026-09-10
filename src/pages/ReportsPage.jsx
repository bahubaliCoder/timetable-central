import React from 'react';
import {
  BarChart3,
  Download,
  Printer,
  AlertTriangle,
  CheckCircle2,
  Users,
  DoorOpen,
  FileSpreadsheet,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { exportWorkloadReportToCSV } from '../utils/exportHelpers';

export const ReportsPage = () => {
  const { teachers, rooms, timetables, periods, institutionConflicts, classes, subjects } = useAdmin();

  const handleExportWorkload = () => {
    exportWorkloadReportToCSV(teachers, timetables, subjects);
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate teacher workload stats
  const teacherStats = teachers.map((t) => {
    let count = 0;
    Object.values(timetables).forEach((slots) => {
      if (Array.isArray(slots)) {
        count += slots.filter((s) => s.teacherId === t.id).length;
      }
    });
    const maxH = t.maxHours || 18;
    const pct = Math.round((count / maxH) * 100);
    return { ...t, assigned: count, maxH, pct };
  });

  // Calculate room occupancy stats
  const totalAvailableClassSlots = 6 * periods.filter((p) => !p.isBreak).length; // 6 days * active periods
  const roomStats = rooms.map((r) => {
    let count = 0;
    Object.values(timetables).forEach((slots) => {
      if (Array.isArray(slots)) {
        count += slots.filter((s) => s.roomId === r.id).length;
      }
    });
    const pct = Math.min(100, Math.round((count / Math.max(1, totalAvailableClassSlots)) * 100));
    return { ...r, bookings: count, pct };
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Institutional Reports & Schedule Audits</span>
          </h2>
          <p className="text-xs text-slate-400">
            Workload optimization, room utilization metrics, and double-booking conflict reports.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportWorkload}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Faculty CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Institutional Conflict Audit Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                institutionConflicts.length > 0
                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-600'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
              }`}
            >
              {institutionConflicts.length > 0 ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                Institutional Schedule Clash Audit
              </h3>
              <p className="text-xs text-slate-400">
                Automatic scan across all classes for double-booked professors and classrooms.
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
              institutionConflicts.length > 0
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}
          >
            {institutionConflicts.length === 0 ? '0 Clashes Detected' : `${institutionConflicts.length} Conflict(s)`}
          </span>
        </div>

        {institutionConflicts.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col items-center gap-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1" />
            <span className="font-bold text-slate-700 dark:text-slate-200">
              Timetable Conflict Audit Passed
            </span>
            <span>No faculty or room double-bookings found across any scheduled periods.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {institutionConflicts.map((c, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900">
                    {c.type} Clash
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">{c.description}</p>
                  </div>
                </div>

                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {c.day}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Columns: Faculty Workload & Room Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Faculty Workload Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Faculty Workload Summary</span>
            </h3>
            <span className="text-xs text-slate-400">{teachers.length} Instructors</span>
          </div>

          <div className="space-y-3">
            {teacherStats.map((t) => (
              <div key={t.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">{t.name}</strong>
                    <span className="text-[11px] text-slate-400 block">{t.department} • {t.designation}</span>
                  </div>
                  <span className={`font-bold ${t.pct > 100 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    {t.assigned} / {t.maxH} hrs ({t.pct}%)
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      t.pct > 100 ? 'bg-rose-500' : t.pct >= 75 ? 'bg-purple-600' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, t.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Utilization Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-emerald-600" />
              <span>Room Utilization Rates</span>
            </h3>
            <span className="text-xs text-slate-400">{rooms.length} Rooms</span>
          </div>

          <div className="space-y-3">
            {roomStats.map((r) => (
              <div key={r.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">{r.name}</strong>
                    <span className="text-[11px] text-slate-400 block">{r.building} • {r.type}</span>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {r.bookings} periods ({r.pct}% utilized)
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
