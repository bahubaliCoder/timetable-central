import React, { useState, useEffect } from 'react';
import { X, Clock, Coffee, Plus, Trash2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const DynamicPeriodModal = ({ isOpen, onClose, periodData }) => {
  const { addPeriod, updatePeriod, deletePeriod } = useAdmin();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    startTime: '15:45',
    endTime: '16:45',
    isBreak: false,
  });

  useEffect(() => {
    if (periodData) {
      setFormData({
        id: periodData.id || '',
        name: periodData.name || '',
        startTime: periodData.startTime || '08:30',
        endTime: periodData.endTime || '09:30',
        isBreak: Boolean(periodData.isBreak),
      });
    } else {
      setFormData({
        id: '',
        name: 'Period ' + Math.floor(Math.random() * 5 + 7),
        startTime: '15:45',
        endTime: '16:45',
        isBreak: false,
      });
    }
  }, [periodData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startTime || !formData.endTime) return;

    if (formData.id) {
      updatePeriod(formData.id, formData);
    } else {
      addPeriod(formData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (formData.id) {
      deletePeriod(formData.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {formData.id ? 'Edit Period Slot' : 'Add New Period'}
              </h3>
              <p className="text-xs text-slate-400">
                Configure timing or insert a campus break.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Period / Interval Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Period 7 or Morning Recess"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                End Time *
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Break Period Toggle */}
          <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isBreak}
              onChange={(e) => setFormData({ ...formData, isBreak: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                <span>Mark as Break (Lunch, Assembly, Recess)</span>
              </span>
              <p className="text-[11px] text-slate-400">
                Breaks span across all days and prevent class overlapping.
              </p>
            </div>
          </label>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {formData.id ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
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
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30 transition-all"
              >
                {formData.id ? 'Update Period' : 'Add Period'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
