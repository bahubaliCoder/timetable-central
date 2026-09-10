import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Award,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';

export const ExamsAndDeadlines = () => {
  const { exams, setExams, classes } = useSchedule();
  const [showAddForm, setShowAddForm] = useState(false);

  const [newExam, setNewExam] = useState({
    courseCode: '',
    courseTitle: '',
    date: '',
    time: '10:00 - 12:00',
    room: '',
    weight: '25%',
  });

  const handleAddExam = (e) => {
    e.preventDefault();
    if (!newExam.courseTitle || !newExam.date) return;

    const examItem = {
      ...newExam,
      id: 'exam-' + Date.now(),
      status: 'Upcoming',
    };
    setExams((prev) => [...prev, examItem]);
    setShowAddForm(false);
    setNewExam({
      courseCode: '',
      courseTitle: '',
      date: '',
      time: '10:00 - 12:00',
      room: '',
      weight: '25%',
    });
  };

  const handleDeleteExam = (id) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  // Days remaining calculation
  const getDaysRemaining = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today!';
    if (diffDays === 1) return 'Tomorrow!';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" />
            <span>Exams & Academic Milestones</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Keep track of your midterms, final exam schedules, practical vivas, and major project deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-brand-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : 'Schedule Exam'}</span>
        </button>
      </div>

      {/* Add Exam Form (Expandable) */}
      {showAddForm && (
        <form
          onSubmit={handleAddExam}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-brand-200 dark:border-brand-900/50 space-y-4"
        >
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Add New Exam or Milestone
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Course Code
              </label>
              <input
                type="text"
                placeholder="e.g. CS401"
                value={newExam.courseCode}
                onChange={(e) => setNewExam({ ...newExam, courseCode: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Exam / Milestone Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Midterm Theory Examination"
                value={newExam.courseTitle}
                onChange={(e) => setNewExam({ ...newExam, courseTitle: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Time Window
              </label>
              <input
                type="text"
                placeholder="e.g. 10:00 - 12:00"
                value={newExam.time}
                onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Location / Hall
              </label>
              <input
                type="text"
                placeholder="e.g. Auditorium West"
                value={newExam.room}
                onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Grade Weighting
              </label>
              <input
                type="text"
                placeholder="e.g. 30%"
                value={newExam.weight}
                onChange={(e) => setNewExam({ ...newExam, weight: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Exam cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam) => {
          const daysMsg = getDaysRemaining(exam.date);
          const isUrgent = daysMsg.includes('Today') || daysMsg.includes('Tomorrow');

          return (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    {exam.courseCode || 'Exam'}
                  </span>

                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      isUrgent
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {daysMsg}
                  </span>
                </div>

                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight mb-3">
                  {exam.courseTitle}
                </h4>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-500" />
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    <span>{exam.time}</span>
                  </div>
                  {exam.room && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      <span>{exam.room}</span>
                    </div>
                  )}
                  {exam.weight && (
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Weight: <strong>{exam.weight}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Date
                </span>
                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                  title="Remove exam"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
