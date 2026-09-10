import React from 'react';
import {
  MapPin,
  User,
  AlertTriangle,
  Clock,
  Plus,
  Info,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { DAYS_OF_WEEK } from '../data/mockData';
import { timeToMinutes, formatTimeDisplay } from '../utils/timeHelpers';

const ROW_HEIGHT_PX = 72; // height for 1 hour slot in pixels

export const WeeklyGrid = () => {
  const {
    filteredClasses,
    conflictMap,
    settings,
    setActiveModal,
    setSelectedClassForEdit,
    currentTime,
  } = useSchedule();

  const days = settings.showWeekends ? DAYS_OF_WEEK : DAYS_OF_WEEK.slice(0, 5);
  const startHour = settings.startHour || 8;
  const endHour = settings.endHour || 18; // 8:00 to 18:00 (6 PM)
  const totalHours = endHour - startHour;

  const currentDayName = DAYS_OF_WEEK[currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1];

  // Hours array [8, 9, 10, ... 17]
  const hourSlots = Array.from({ length: totalHours }, (_, i) => startHour + i);

  const handleClassClick = (cls, e) => {
    e.stopPropagation();
    setSelectedClassForEdit(cls);
    setActiveModal('classDetail');
  };

  const handleCellClick = (day, hour) => {
    // Pre-fill modal with clicked day and hour
    const startHourFormatted = String(hour).padStart(2, '0') + ':00';
    const endHourFormatted = String(hour + 1).padStart(2, '0') + ':00';
    setSelectedClassForEdit({
      day,
      startTime: startHourFormatted,
      endTime: endHourFormatted,
      type: 'Lecture',
      color: '#6366f1',
    });
    setActiveModal('addClass');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 overflow-hidden timetable-print-container">
      
      {/* Timetable Header / Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Weekly Class Schedule</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({startHour}:00 - {endHour}:00)
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click any class for details, or click an empty slot to schedule a new class.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
            Lecture
          </span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
            Lab
          </span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            Tutorial
          </span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-500 inline-block"></span>
            Seminar
          </span>
        </div>
      </div>

      {/* Grid Container with horizontal scroll */}
      <div className="overflow-x-auto relative">
        <div
          className="min-w-[760px] grid"
          style={{
            gridTemplateColumns: `70px repeat(${days.length}, minmax(130px, 1fr))`,
          }}
        >
          {/* Header Row: Corner + Day Headers */}
          <div className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-800/90 backdrop-blur-sm border-b border-r border-slate-200 dark:border-slate-800 p-3 text-center text-xs font-bold text-slate-400">
            TIME
          </div>
          {days.map((day) => {
            const isToday = day === currentDayName;
            return (
              <div
                key={day}
                className={`sticky top-0 z-20 backdrop-blur-sm border-b border-r border-slate-200 dark:border-slate-800 py-3 px-2 text-center transition-colors ${
                  isToday
                    ? 'bg-brand-50/90 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-semibold'
                }`}
              >
                <div className="text-xs uppercase tracking-wider">{day.slice(0, 3)}</div>
                <div className="text-[11px] font-normal opacity-75">{day}</div>
                {isToday && (
                  <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-full text-[9px] bg-brand-500 text-white uppercase font-bold tracking-wider">
                    Today
                  </span>
                )}
              </div>
            );
          })}

          {/* Time Rows and Day Grid Columns */}
          {/* Left Column: Time labels */}
          <div className="border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 select-none">
            {hourSlots.map((hour) => (
              <div
                key={hour}
                className="border-b border-slate-200/60 dark:border-slate-800/60 text-right pr-2 pt-1.5 text-[11px] font-semibold text-slate-400"
                style={{ height: `${ROW_HEIGHT_PX}px` }}
              >
                {formatTimeDisplay(`${hour}:00`, settings.timeFormat === '24h')}
              </div>
            ))}
          </div>

          {/* Columns for each day */}
          {days.map((day) => {
            const dayClasses = filteredClasses.filter((c) => c.day === day);
            const isToday = day === currentDayName;

            return (
              <div
                key={day}
                className={`relative border-r border-slate-200/60 dark:border-slate-800/60 transition-colors ${
                  isToday ? 'bg-brand-50/20 dark:bg-brand-950/10' : ''
                }`}
                style={{ height: `${totalHours * ROW_HEIGHT_PX}px` }}
              >
                {/* Background grid lines for hours (clickable to add class) */}
                {hourSlots.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => handleCellClick(day, hour)}
                    className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-brand-500/5 cursor-pointer transition-colors group relative"
                    style={{ height: `${ROW_HEIGHT_PX}px` }}
                    title={`Click to add class on ${day} at ${hour}:00`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-brand-500 text-xs font-medium transition-opacity">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </span>
                  </div>
                ))}

                {/* Class Blocks overlay */}
                {dayClasses.map((cls) => {
                  const startMinutes = timeToMinutes(cls.startTime);
                  const endMinutes = timeToMinutes(cls.endTime);
                  const startOffsetMin = startMinutes - startHour * 60;
                  const durationMin = endMinutes - startMinutes;

                  // Top and height calculation based on pixels per minute
                  const pixelsPerMinute = ROW_HEIGHT_PX / 60;
                  const topPx = Math.max(0, startOffsetMin * pixelsPerMinute);
                  const heightPx = Math.max(28, durationMin * pixelsPerMinute - 4); // 4px margin

                  const isConflicting = Boolean(conflictMap[cls.id]);

                  return (
                    <div
                      key={cls.id}
                      onClick={(e) => handleClassClick(cls, e)}
                      style={{
                        top: `${topPx}px`,
                        height: `${heightPx}px`,
                        backgroundColor: `${cls.color || '#6366f1'}18`,
                        borderLeftColor: cls.color || '#6366f1',
                      }}
                      className={`absolute left-1 right-1 rounded-lg border-l-4 p-2 shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] overflow-hidden flex flex-col justify-between z-10 select-none ${
                        isConflicting
                          ? 'border-2 border-rose-500 ring-2 ring-rose-500/30'
                          : 'border border-slate-200/80 dark:border-slate-700/80'
                      }`}
                    >
                      {/* Top Header: Code & Type Pill */}
                      <div className="flex items-center justify-between gap-1 leading-tight">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="font-bold text-xs truncate"
                            style={{ color: cls.color || '#6366f1' }}
                          >
                            {cls.code}
                          </span>
                          {isConflicting && (
                            <AlertTriangle
                              className="w-3.5 h-3.5 text-rose-500 shrink-0"
                              title="Time conflict with another class!"
                            />
                          )}
                        </div>
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 text-white"
                          style={{ backgroundColor: cls.color || '#6366f1' }}
                        >
                          {cls.type}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="font-semibold text-[11px] sm:text-xs text-slate-800 dark:text-slate-100 line-clamp-1 mt-0.5">
                        {cls.title}
                      </div>

                      {/* Details: Room, Time, Instructor */}
                      {heightPx > 45 && (
                        <div className="flex flex-col gap-0.5 text-[10px] text-slate-600 dark:text-slate-300 mt-1">
                          <div className="flex items-center gap-1 truncate font-medium">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>
                              {formatTimeDisplay(cls.startTime, settings.timeFormat === '24h')} -{' '}
                              {formatTimeDisplay(cls.endTime, settings.timeFormat === '24h')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{cls.room}</span>
                          </div>
                          {heightPx > 70 && (
                            <div className="flex items-center gap-1 truncate">
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{cls.instructor}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
