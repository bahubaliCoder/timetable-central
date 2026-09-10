import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  Clock,
  BookOpen,
  User,
  MapPin,
  Tag,
  Trash2,
  GraduationCap,
  Mail,
  Building,
  CheckCircle,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { checkSlotConflict } from '../utils/conflictChecker';

export const ClassScheduleModal = ({ isOpen, onClose, slotData, classId }) => {
  const {
    subjects,
    teachers,
    rooms,
    days,
    periods,
    timetables,
    saveSlot,
    deleteSlot,
    addNotification,
    isStudent,
    isFaculty,
  } = useAdmin();

  const [formData, setFormData] = useState({
    id: '',
    day: 'Monday',
    periodId: 'p-1',
    subjectId: '',
    teacherId: '',
    roomId: '',
    type: 'Lecture',
  });

  useEffect(() => {
    if (slotData) {
      setFormData({
        id: slotData.id || '',
        day: slotData.day || days[0] || 'Monday',
        periodId: slotData.periodId || periods[0]?.id || 'p-1',
        subjectId: slotData.subjectId || subjects[0]?.id || '',
        teacherId: slotData.teacherId || teachers[0]?.id || '',
        roomId: slotData.roomId || rooms[0]?.id || '',
        type: slotData.type || 'Lecture',
      });
    } else {
      setFormData({
        id: '',
        day: days[0] || 'Monday',
        periodId: periods.find((p) => !p.isBreak)?.id || 'p-1',
        subjectId: subjects[0]?.id || '',
        teacherId: teachers[0]?.id || '',
        roomId: rooms[0]?.id || '',
        type: 'Lecture',
      });
    }
  }, [slotData, isOpen, days, periods, subjects, teachers, rooms]);

  if (!isOpen) return null;

  // Real-time conflict preview for faculty
  const conflictWarnings = isFaculty
    ? checkSlotConflict(formData, classId, timetables, teachers, rooms)
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subjectId || !formData.teacherId || !formData.roomId) return;

    saveSlot(classId, formData);
    const sub = subjects.find((s) => s.id === formData.subjectId);
    addNotification('Schedule Saved', `${sub?.code || 'Class'} scheduled on ${formData.day}.`, 'success');
    onClose();
  };

  const handleDelete = () => {
    if (formData.id) {
      deleteSlot(classId, formData.id);
      addNotification('Slot Cleared', 'Scheduled period removed.', 'info');
      onClose();
    }
  };

  const activePeriods = periods.filter((p) => !p.isBreak);
  const currentPeriod = periods.find((p) => p.id === formData.periodId);
  const currentSubject = subjects.find((s) => s.id === formData.subjectId);
  const currentTeacher = teachers.find((t) => t.id === formData.teacherId);
  const currentRoom = rooms.find((r) => r.id === formData.roomId);

  // Student Read-Only View
  if (isStudent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{ backgroundColor: currentSubject?.color || '#3b82f6' }}
              >
                {currentSubject?.code?.substring(0, 3) || 'CLS'}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {currentSubject?.name || 'Class Session'}
                </h3>
                <p className="text-xs text-slate-400">
                  {formData.day} • {currentPeriod ? `${currentPeriod.startTime} - ${currentPeriod.endTime}` : 'Scheduled Slot'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Subject Summary */}
            <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Course & Subject Code
                </span>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {currentSubject?.code}: {currentSubject?.name}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                {formData.type}
              </span>
            </div>

            {/* Professor / Faculty Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Assigned Faculty
              </span>
              <div className="flex items-center space-x-3">
                <img
                  src={currentTeacher?.avatar}
                  alt={currentTeacher?.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {currentTeacher?.name || 'Faculty Member'}
                  </h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {currentTeacher?.designation} • {currentTeacher?.department}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" /> {currentTeacher?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Room Location Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {currentRoom?.name || 'Campus Room'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {currentRoom?.building} • Floor {currentRoom?.floor || '1'} (Cap: {currentRoom?.capacity || 40})
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {currentRoom?.type || 'Room'}
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Faculty Interactive Modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {formData.id ? 'Edit Scheduled Class Slot' : 'Schedule New Class Slot'}
            </h3>
            <p className="text-xs text-slate-400">
              Assign subject, professor, room, and time slot.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Conflict Alert */}
        {conflictWarnings.length > 0 && (
          <div className="p-3.5 px-6 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Institutional Clash Warning:</strong>
              <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                {conflictWarnings.map((w, idx) => (
                  <li key={idx}>{w.message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Day & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Day of Week
              </label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Class Period & Time
              </label>
              <select
                value={formData.periodId}
                onChange={(e) => setFormData({ ...formData, periodId: e.target.value })}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              >
                {activePeriods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.startTime} - {p.endTime})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Academic Subject *
            </label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              required
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} • {s.name} ({s.credits} Credits, {s.type})
                </option>
              ))}
            </select>
          </div>

          {/* Teacher */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Instructor / Faculty *
            </label>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              required
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Faculty...</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department} - {t.designation})
                </option>
              ))}
            </select>
          </div>

          {/* Room & Class Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Room / Laboratory *
              </label>
              <select
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                required
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Room...</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.building}, Cap: {r.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Session Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Lecture">Lecture</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Seminar">Seminar</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Project">Project</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {formData.id ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30 transition-all"
              >
                {formData.id ? 'Update Slot' : 'Schedule Slot'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
