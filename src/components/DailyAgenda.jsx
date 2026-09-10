import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Plus,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { DAYS_OF_WEEK } from '../data/mockData';
import { timeToMinutes, formatTimeDisplay } from '../utils/timeHelpers';

export const DailyAgenda = () => {
  const {
    filteredClasses,
    currentTime,
    settings,
    markAttendance,
    updateClass,
    setActiveModal,
    setSelectedClassForEdit,
  } = useSchedule();

  // Determine today's day name
  const currentDayIndex = currentTime.getDay(); // 0 is Sunday
  const todayDayName = DAYS_OF_WEEK[currentDayIndex === 0 ? 6 : currentDayIndex - 1];

  const daysToDisplay = settings.showWeekends ? DAYS_OF_WEEK : DAYS_OF_WEEK.slice(0, 5);
  const [selectedDay, setSelectedDay] = useState(todayDayName);

  // Classes on this day sorted by start time
  const dayClasses = filteredClasses
    .filter((c) => c.day === selectedDay)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // Compute total duration in hours
  const totalMinutes = dayClasses.reduce((acc, c) => {
    return acc + (timeToMinutes(c.endTime) - timeToMinutes(c.startTime));
  }, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* Day Selector Pills */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center space-x-1 sm:space-x-2">
          {daysToDisplay.map((day) => {
            const isToday = day === todayDayName;
            const isSelected = day === selectedDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`relative px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{day}</span>
                {isToday && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-amber-300' : 'bg-brand-500'
                    }`}
                  ></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Day Summary Stats */}
        <div className="hidden md:flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 pr-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
          </span>
          <span>•</span>
          <span>{totalHours} contact hrs</span>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Schedule for {selectedDay}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review lecture agendas, manage attendance, and jot down notes.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedClassForEdit({ day: selectedDay, startTime: '09:00', endTime: '10:30', type: 'Lecture' });
              setActiveModal('addClass');
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to {selectedDay}</span>
          </button>
        </div>

        {dayClasses.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-brand-500 flex items-center justify-center mx-auto mb-4 border border-brand-100 dark:border-brand-900/50">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-200">
              No classes scheduled for {selectedDay}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              You're clear for this day! Use the time for library study, working on projects, or take a well-deserved break.
            </p>
            <button
              onClick={() => {
                setSelectedClassForEdit({ day: selectedDay, startTime: '10:00', endTime: '11:30', type: 'Lecture' });
                setActiveModal('addClass');
              }}
              className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold shadow-sm hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule a Class</span>
            </button>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-8">
            {dayClasses.map((cls, idx) => {
              const durationMin = timeToMinutes(cls.endTime) - timeToMinutes(cls.startTime);
              const durationFormatted = `${Math.floor(durationMin / 60)}h ${durationMin % 60 ? `${durationMin % 60}m` : ''}`;

              return (
                <div key={cls.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow"
                    style={{ backgroundColor: cls.color || '#6366f1' }}
                  ></div>

                  {/* Main Card */}
                  <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className="font-bold text-sm px-2 py-0.5 rounded-md text-white"
                            style={{ backgroundColor: cls.color || '#6366f1' }}
                          >
                            {cls.code}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                            {cls.type}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {durationFormatted}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">
                          {cls.title}
                        </h4>
                      </div>

                      {/* Time & Room Pill */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-brand-500" />
                          <span>
                            {formatTimeDisplay(cls.startTime, settings.timeFormat === '24h')} -{' '}
                            {formatTimeDisplay(cls.endTime, settings.timeFormat === '24h')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cls.room}</span>
                        </div>
                      </div>
                    </div>

                    {/* Instructor and Notes */}
                    <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{cls.instructor}</span>
                      </div>

                      {/* Attendance Actions */}
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 text-xs">Attendance:</span>
                        <button
                          onClick={() => markAttendance(cls.id, 'attended')}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Attended</span>
                        </button>
                        <button
                          onClick={() => markAttendance(cls.id, 'missed')}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Missed</span>
                        </button>
                      </div>
                    </div>

                    {/* Notes Snippet */}
                    {cls.notes && (
                      <div className="mt-3 bg-white dark:bg-slate-900/60 rounded-lg p-2.5 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <FileText className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-700 dark:text-slate-200">Lecture Note: </strong>
                          {cls.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
