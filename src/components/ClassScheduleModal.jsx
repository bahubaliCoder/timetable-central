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
        periodId: periods[0]?.id || 'p-1',
        subjectId: subjects[0]?.id || '',
        teacherId: teachers[0]?.id || '',
        roomId: rooms[0]?.id || '',
        type: 'Lecture',
      });
    }
  }, [slotData, isOpen, days, periods, subjects, teachers, rooms]);

  if (!isOpen) return null;

  // Real-time conflict preview
  const conflictWarnings = checkSlotConflict(formData, classId, timetables, teachers, rooms);

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
                Class Period / Time
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

          {/* Subject Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Subject *
            </label>
            <select
              required
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Subject --</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code}: {sub.name} ({sub.department})
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Faculty / Instructor *
            </label>
            <select
              required
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Assign Teacher --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} • {t.designation} ({t.department})
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
                required
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Room --</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type}, Cap: {r.capacity})
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
                <option value="Lab">Practical Lab</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Seminar">Seminar</option>
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
