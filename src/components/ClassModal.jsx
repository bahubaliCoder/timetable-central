import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Tag,
  Palette,
  Check,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { DAYS_OF_WEEK, CLASS_TYPES, COLOR_PALETTE } from '../data/mockData';
import { doClassesOverlap } from '../utils/timeHelpers';

export const ClassModal = () => {
  const {
    activeModal,
    setActiveModal,
    selectedClassForEdit,
    classes,
    addClass,
    updateClass,
    deleteClass,
    campusRooms,
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

  const conflictingClasses = classes.filter((c) => doClassesOverlap(currentTempClass, c));

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            {isEditing ? 'Edit Class Session' : 'Add New Class to Schedule'}
          </h3>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Conflict Alert Preview */}
        {conflictingClasses.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-900/60 p-3.5 px-5 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Schedule Overlap Alert: </strong>
              <span>
                This time collides with {conflictingClasses.map((c) => `${c.code} (${c.startTime}-${c.endTime})`).join(', ')}. You can still save if intentional.
              </span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Course Code */}
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
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Class Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
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
              className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Instructor */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Instructor / Professor
              </label>
              <input
                type="text"
                placeholder="e.g. Prof. Alan Turing"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Room / Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Room / Campus Location
              </label>
              <input
                type="text"
                list="room-suggestions"
                placeholder="e.g. Lecture Hall 101"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
              />
              <datalist id="room-suggestions">
                {campusRooms.map((r) => (
                  <option key={r.id} value={r.name} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Day & Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Day of Week
              </label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Color Tag Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span>Theme Tag Color</span>
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

          {/* Lecture Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Course Notes / Preparation Syllabus
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Bring scientific calculator and lab notebook..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Footer Buttons */}
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
                className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-sm shadow-brand-500/30 transition-all"
              >
                {isEditing ? 'Save Changes' : 'Add Class'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
