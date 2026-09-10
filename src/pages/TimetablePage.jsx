import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Copy,
  AlertTriangle,
  Download,
  Printer,
  Sliders,
  CheckCircle,
  Coffee,
  X,
  Layers,
  ChevronDown,
  BookOpen,
  School,
  GraduationCap,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ClassScheduleModal } from '../components/ClassScheduleModal';
import { DynamicPeriodModal } from '../components/DynamicPeriodModal';
import { exportTimetableToCSV } from '../utils/exportHelpers';

export const TimetablePage = () => {
  const {
    classes,
    activeClassId,
    setActiveClassId,
    activeClassInfo,
    currentClassSlots,
    days,
    addDay,
    deleteDay,
    periods,
    subjects,
    teachers,
    rooms,
    deleteSlot,
    duplicateTimetable,
    autoSaveStatus,
    institutionConflicts,
    addNotification,
    isStudent,
    isFaculty,
    institutionInfo,
  } = useAdmin();

  // Modals
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedSlotData, setSelectedSlotData] = useState(null);
  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [selectedPeriodData, setSelectedPeriodData] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateTargetClassId, setDuplicateTargetClassId] = useState(classes[1]?.id || '');
  const [showAddDayInput, setShowAddDayInput] = useState(false);
  const [newDayName, setNewDayName] = useState('Saturday');

  // Filter
  const [searchFilter, setSearchFilter] = useState('');

  // Lookup maps
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s]));
  const teacherMap = Object.fromEntries(teachers.map((t) => [t.id, t]));
  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r]));

  const handleSlotClick = (slot) => {
    setSelectedSlotData(slot);
    setScheduleModalOpen(true);
  };

  const handleEmptyCellClick = (day, periodId) => {
    setSelectedSlotData({
      day,
      periodId,
      subjectId: subjects[0]?.id || '',
      teacherId: teachers[0]?.id || '',
      roomId: rooms[0]?.id || '',
      type: 'Lecture',
    });
    setScheduleModalOpen(true);
  };

  const handleAddDaySubmit = (e) => {
    e.preventDefault();
    if (newDayName.trim()) {
      addDay(newDayName.trim());
      setNewDayName('');
      setShowAddDayInput(false);
    }
  };

  const handleDuplicateSubmit = (e) => {
    e.preventDefault();
    if (duplicateTargetClassId && duplicateTargetClassId !== activeClassId) {
      duplicateTimetable(activeClassId, duplicateTargetClassId);
      setShowDuplicateModal(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportTimetableToCSV(
      activeClassInfo,
      currentClassSlots,
      days,
      periods,
      subjects,
      teachers,
      rooms
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 no-print">
        
        {/* Class / Section Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Select Class:
          </label>
          <div className="relative">
            <select
              value={activeClassId}
              onChange={(e) => setActiveClassId(e.target.value)}
              className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-extrabold text-xs sm:text-sm rounded-2xl px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id} className="dark:bg-slate-800">
                  {cls.code} • {cls.name} ({cls.section})
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            Mentor: <strong>{activeClassInfo?.mentor || 'Faculty Mentor'}</strong> • {activeClassInfo?.studentCount || 0} Students
          </span>
        </div>

        {/* Action Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export to CSV / Excel */}
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Download CSV for Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel / CSV</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Print schedule"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* Faculty Only Tools */}
          {isFaculty && (
            <>
              {/* Duplicate Timetable */}
              <button
                onClick={() => setShowDuplicateModal(true)}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                title="Duplicate this timetable to another class or section"
              >
                <Copy className="w-3.5 h-3.5 text-blue-600" />
                <span>Duplicate Schedule</span>
              </button>

              {/* Add Period */}
              <button
                onClick={() => {
                  setSelectedPeriodData(null);
                  setPeriodModalOpen(true);
                }}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>+ Add Period</span>
              </button>

              {/* Primary Schedule Button */}
              <button
                onClick={() => {
                  setSelectedSlotData(null);
                  setScheduleModalOpen(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Slot</span>
              </button>
            </>
          )}
        </div>

      </div>

      {/* Student Portal Notice */}
      {isStudent && (
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 rounded-2xl p-3.5 px-5 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
              <strong>Student Schedule Portal</strong> — Viewing official schedule for {activeClassInfo?.name || 'your class'}. Click any class slot to view teacher, room & syllabus info.
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider hidden sm:inline">
            Read-Only Access
          </span>
        </div>
      )}

      {/* Dynamic Day & Period Configuration Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
        
        {/* Dynamic Days Manager */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-600 dark:text-slate-300">Days ({days.length}):</span>
          {days.map((day) => (
            <span
              key={day}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
            >
              <span>{day}</span>
              {isFaculty && days.length > 1 && (
                <button
                  onClick={() => deleteDay(day)}
                  className="text-slate-400 hover:text-rose-500 ml-0.5"
                  title={`Delete ${day}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}

          {isFaculty && (
            showAddDayInput ? (
              <form onSubmit={handleAddDaySubmit} className="inline-flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Day name..."
                  value={newDayName}
                  onChange={(e) => setNewDayName(e.target.value)}
                  className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 w-24"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDayInput(false)}
                  className="text-slate-400 p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowAddDayInput(true)}
                className="px-2 py-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-[11px] transition-colors"
              >
                + Add Day
              </button>
            )
          )}
        </div>

        {/* Dynamic Period Quick Overview */}
        <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
          <span>{periods.filter((p) => !p.isBreak).length} Class Periods</span>
          <span>•</span>
          <span>{periods.filter((p) => p.isBreak).length} Break Intervals</span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> {autoSaveStatus}
          </span>
        </div>

      </div>

      {/* Master Timetable Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden timetable-print-container">
        
        {/* Printable Official Institutional Header (as shown in Photo) */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="inline-flex items-center justify-center gap-2 mb-0.5">
              <span className="p-2 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <School className="w-5 h-5" />
              </span>
              <h2 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-wide uppercase">
                {institutionInfo?.name || 'GOVERNMENT ENGINEERING COLLEGE, BANKA'}
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {institutionInfo?.subName || 'Lakrikola, P.O. Manjira, Banka - 813102'}
            </p>
            <div className="pt-1">
              <span className="inline-block text-xs font-bold text-blue-700 dark:text-blue-300 underline tracking-wide uppercase">
                {institutionInfo?.academicTitle || 'TIME TABLE FOR ACADEMIC YEAR 2025-2026 (w.e.f. 01-07-2026)'}
              </span>
            </div>
          </div>

          {/* Program & Room Header Banner */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-black text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-800/60 p-3 rounded-2xl shadow-inner">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span>CLASS: <strong className="text-blue-600 dark:text-blue-400">B.TECH</strong></span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>SEMESTER: <strong className="text-purple-600 dark:text-purple-400">VI</strong></span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>BRANCH: <strong className="text-emerald-600 dark:text-emerald-400">CSE</strong></span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>ROOM NO.: <strong className="text-amber-600 dark:text-amber-400">404</strong></span>
            </div>

            <div className="flex items-center space-x-3 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Theory
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> Lab
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Elective
              </span>
            </div>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[950px]">
            
            {/* Header: Periods */}
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3.5 text-left text-xs font-extrabold text-slate-400 uppercase tracking-wider w-28 border-r border-slate-200 dark:border-slate-800">
                  Day / Period
                </th>
                {periods.map((period) => (
                  <th
                    key={period.id}
                    onClick={() => {
                      setSelectedPeriodData(period);
                      setPeriodModalOpen(true);
                    }}
                    className={`p-3 text-center border-r border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                      period.isBreak ? 'bg-amber-50/50 dark:bg-amber-950/20 w-24' : 'min-w-[140px]'
                    }`}
                    title="Click to edit period timing"
                  >
                    <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                      {period.name}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      {period.startTime} - {period.endTime}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body: Days x Periods */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {days.map((day) => (
                <tr key={day} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  
                  {/* Day Column */}
                  <td className="p-3.5 border-r border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900 font-bold text-xs text-slate-800 dark:text-slate-200">
                    <div>{day}</div>
                  </td>

                  {/* Period Slots */}
                  {periods.map((period) => {
                    // If it is a break period (e.g. Lunch)
                    if (period.isBreak) {
                      return (
                        <td
                          key={period.id}
                          className="p-2 border-r border-slate-200 dark:border-slate-800 bg-amber-50/20 dark:bg-amber-950/10 text-center"
                        >
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                            <Coffee className="w-3 h-3" />
                            <span>{period.name}</span>
                          </span>
                        </td>
                      );
                    }

                    // Look for class scheduled at day & period
                    const slot = currentClassSlots.find(
                      (s) => s.day === day && s.periodId === period.id
                    );

                    if (slot) {
                      const subject = subjectMap[slot.subjectId];
                      const teacher = teacherMap[slot.teacherId];
                      const room = roomMap[slot.roomId];
                      const subjectColor = subject?.color || '#3b82f6';
                      const displayCode = slot.displayLabel || (teacher?.shortCode ? `${subject?.shortCode || subject?.code} [${teacher?.shortCode}]` : (subject?.shortCode || subject?.code));

                      return (
                        <td
                          key={period.id}
                          className="p-1.5 border-r border-slate-200 dark:border-slate-800 align-top"
                        >
                          <div
                            onClick={() => handleSlotClick(slot)}
                            style={{
                              backgroundColor: `${subjectColor}14`,
                              borderLeftColor: subjectColor,
                            }}
                            className="group p-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 border-l-[4px] shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between h-28 relative"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className="font-black text-xs truncate"
                                  style={{ color: subjectColor }}
                                  title={displayCode}
                                >
                                  {displayCode}
                                </span>
                                <span
                                  className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded text-white shrink-0"
                                  style={{ backgroundColor: subjectColor }}
                                >
                                  {slot.type}
                                </span>
                              </div>

                              <h4 className="font-bold text-[11px] text-slate-800 dark:text-slate-100 line-clamp-1 leading-snug" title={subject?.name}>
                                {subject?.name || 'Subject'}
                              </h4>
                            </div>

                            <div className="space-y-0.5 text-[10px] text-slate-600 dark:text-slate-400 pt-1 border-t border-black/5 dark:border-white/5">
                              <div className="truncate font-semibold flex items-center justify-between">
                                <span className="truncate">👨‍🏫 {teacher?.name || 'TBD'}</span>
                                {teacher?.shortCode && (
                                  <span className="font-mono text-[9px] bg-slate-200/80 dark:bg-slate-700 px-1 rounded font-bold shrink-0 ml-1">
                                    [{teacher.shortCode}]
                                  </span>
                                )}
                              </div>
                              <div className="truncate font-medium text-slate-500">
                                🚪 {room?.name || 'TBD'}
                              </div>
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // Empty cell
                    if (isStudent) {
                      return (
                        <td
                          key={period.id}
                          className="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle"
                        >
                          <div className="h-28 rounded-2xl border border-dashed border-slate-200/60 dark:border-slate-800/80 flex items-center justify-center text-slate-300 dark:text-slate-700 text-[11px] font-medium">
                            Free Slot
                          </div>
                        </td>
                      );
                    }

                    // Faculty: Click to Schedule
                    return (
                      <td
                        key={period.id}
                        onClick={() => handleEmptyCellClick(day, period.id)}
                        className="p-2 border-r border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-blue-500/[0.04] transition-colors group relative"
                        title={`Click to schedule class on ${day} (${period.name})`}
                      >
                        <div className="h-28 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Schedule
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Official Subject, L-T-P & Faculty Allocation Reference Table (As in Photo) */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Official Subject, L-T-P & Faculty Allocation Matrix</span>
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">
              Government Engineering College, Banka • w.e.f. 01-07-2026
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-4 w-32 border-r border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                    CODE
                  </th>
                  <th className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                    SUBJECT
                  </th>
                  <th className="py-2.5 px-4 w-28 text-center border-r border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                    L - T - P
                  </th>
                  <th className="py-2.5 px-4 uppercase tracking-wider">
                    FACULTY NAME
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-200">
                {subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 font-black font-mono text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800">
                      {sub.code}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: sub.color || '#3b82f6' }}
                        />
                        <span className="font-bold text-slate-900 dark:text-slate-100">{sub.name}</span>
                        {sub.shortCode && sub.shortCode !== sub.code && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {sub.shortCode}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-black text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      {sub.ltp || '3-0-0'}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                      {sub.facultyName || 'TBD'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Duplicate Timetable Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
              Duplicate Timetable Schedule
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy the complete schedule of <strong>{activeClassInfo?.code}</strong> to another class.
            </p>

            <form onSubmit={handleDuplicateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Destination Class:
                </label>
                <select
                  value={duplicateTargetClassId}
                  onChange={(e) => setDuplicateTargetClassId(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                >
                  {classes
                    .filter((c) => c.id !== activeClassId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}: {c.name} ({c.section})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDuplicateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Confirm Copy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <ClassScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        slotData={selectedSlotData}
        classId={activeClassId}
      />

      <DynamicPeriodModal
        isOpen={periodModalOpen}
        onClose={() => setPeriodModalOpen(false)}
        periodData={selectedPeriodData}
      />

    </div>
  );
};
