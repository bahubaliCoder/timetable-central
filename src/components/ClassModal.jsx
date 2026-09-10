import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Copy,
  Clock,
  AlertTriangle,
  Palette,
  Check,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { DAYS_OF_WEEK, CLASS_TYPES, COLOR_PALETTE } from '../data/mockData';
import { doClassesOverlap, timeToMinutes } from '../utils/timeHelpers';

export const ClassModal = () => {
  const {
    activeModal,
    setActiveModal,
    selectedClassForEdit,
    classes,
    addClass,
    updateClass,
    deleteClass,
    duplicateClass,
  } = useSchedule();

  const isEditing = activeModal === 'editClass';
  const isOpen = activeModal === 'addClass' || isEditing;

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    instructor: '',
    room: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    type: 'Lecture',
    color: '#6366f1',
    notes: '',
  });

  const [duplicateTargetDay, setDuplicateTargetDay] = useState('Wednesday');

  useEffect(() => {
    if (selectedClassForEdit) {
      setFormData({
        code: selectedClassForEdit.code || '',
        title: selectedClassForEdit.title || '',
        instructor: selectedClassForEdit.instructor || '',
        room: selectedClassForEdit.room || '',
        day: selectedClassForEdit.day || 'Monday',
        startTime: selectedClassForEdit.startTime || '09:00',
        endTime: selectedClassForEdit.endTime || '10:30',
        type: selectedClassForEdit.type || 'Lecture',
        color: selectedClassForEdit.color || '#6366f1',
        notes: selectedClassForEdit.notes || '',
      });
    } else {
      setFormData({
        code: '',
        title: '',
        instructor: '',
        room: '',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        type: 'Lecture',
        color: '#6366f1',
        notes: '',
      });
    }
  }, [selectedClassForEdit, activeModal]);

  if (!isOpen) return null;

  // Real-time conflict preview
  const currentTempClass = {
    id: selectedClassForEdit?.id || 'temp',
    ...formData,
  };
  const conflictingClasses = (classes || []).filter((c) => doClassesOverlap(currentTempClass, c));

  // Quick Duration Setter helper
  const setDurationMinutes = (minutes) => {
    const startM = timeToMinutes(formData.startTime);
    const endM = startM + minutes;
    const hh = String(Math.floor(endM / 60) % 24).padStart(2, '0');
    const mm = String(endM % 60).padStart(2, '0');
    setFormData({ ...formData, endTime: `${hh}:${mm}` });
  };

  // Quick Nudge Helper
  const nudgeTime = (field, deltaMinutes) => {
    const currentM = timeToMinutes(formData[field]);
    const newM = Math.max(0, Math.min(23 * 60 + 45, currentM + deltaMinutes));
    const hh = String(Math.floor(newM / 60) % 24).padStart(2, '0');
    const mm = String(newM % 60).padStart(2, '0');
    setFormData({ ...formData, [field]: `${hh}:${mm}` });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.title || !formData.startTime || !formData.endTime) {
      return;
    }

    if (isEditing && selectedClassForEdit?.id) {
      updateClass(selectedClassForEdit.id, formData);
    } else {
      addClass(formData);
    }

    setActiveModal(null);
  };

  const handleDelete = () => {
    if (selectedClassForEdit?.id) {
      deleteClass(selectedClassForEdit.id);
      setActiveModal(null);
    }
  };

  const handleDuplicateToDay = () => {
    if (selectedClassForEdit?.id) {
      duplicateClass(selectedClassForEdit.id, duplicateTargetDay);
      setActiveModal(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {isEditing ? 'Edit Class Details & Timing' : 'Schedule New Class'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing ? 'Modify times, rooms, or duplicate to another day.' : 'Add lecture, lab, or tutorial to the timetable.'}
            </p>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Conflict Alert Banner */}
        {conflictingClasses.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 p-3 px-5 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Time Conflict Detected: </strong>
              Overlaps with {conflictingClasses.map((c) => `${c.code} (${c.startTime}-${c.endTime})`).join(', ')}.
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
          
          {/* Course Code & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CS401"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Class Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {CLASS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Course Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Data Structures & Algorithms"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Day & Timing Configuration */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-600" /> Day & Schedule Times
              </span>

              {/* Quick Duration Buttons */}
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setDurationMinutes(45)}
                  className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  45m
                </button>
                <button
                  type="button"
                  onClick={() => setDurationMinutes(60)}
                  className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  1 hr
                </button>
                <button
                  type="button"
                  onClick={() => setDurationMinutes(90)}
                  className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  1.5 hrs
                </button>
                <button
                  type="button"
                  onClick={() => setDurationMinutes(120)}
                  className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  2 hrs
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Day */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Day of Week
                </label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-medium text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span>Start Time</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => nudgeTime('startTime', -15)}
                      className="text-[10px] px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300"
                    >
                      -15
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeTime('startTime', 15)}
                      className="text-[10px] px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300"
                    >
                      +15
                    </button>
                  </div>
                </div>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500 font-semibold"
                />
              </div>

              {/* End Time */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span>End Time</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => nudgeTime('endTime', -15)}
                      className="text-[10px] px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300"
                    >
                      -15
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeTime('endTime', 15)}
                      className="text-[10px] px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300"
                    >
                      +15
                    </button>
                  </div>
                </div>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Instructor & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Instructor / Professor
              </label>
              <input
                type="text"
                placeholder="e.g. Prof. Alan Turing"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Room / Hall
              </label>
              <input
                type="text"
                placeholder="e.g. Hall 101"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Color Palette Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span>Color Tag</span>
            </label>
            <div className="flex items-center space-x-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setFormData({ ...formData, color: c })}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center border border-white/40 shadow-sm"
                  style={{ backgroundColor: c }}
                >
                  {formData.color === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Duplicate to another day tool (when editing) */}
          {isEditing && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                <Copy className="w-3.5 h-3.5 text-brand-600" />
                <span>Repeat on:</span>
                <select
                  value={duplicateTargetDay}
                  onChange={(e) => setDuplicateTargetDay(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-semibold"
                >
                  {DAYS_OF_WEEK.filter((d) => d !== formData.day).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleDuplicateToDay}
                className="px-2.5 py-1 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded font-semibold hover:bg-brand-100 transition-colors"
              >
                Duplicate
              </button>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-sm transition-all"
              >
                {isEditing ? 'Save Changes' : 'Schedule Class'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
