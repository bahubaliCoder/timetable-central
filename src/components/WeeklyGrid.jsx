import React from 'react';
import {
  MapPin,
  User,
  AlertTriangle,
  Clock,
  Plus,
  Edit2,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { DAYS_OF_WEEK } from '../data/mockData';
import { timeToMinutes, formatTimeDisplay } from '../utils/timeHelpers';

const ROW_HEIGHT_PX = 76; // Clean, spacious height per hour

export const WeeklyGrid = () => {
  const {
    filteredClasses,
    conflictMap,
    settings,
    setActiveModal,
    setSelectedClassForEdit,
    duplicateClass,
    deleteClass,
    adjustClassTime,
  } = useSchedule();

  const days = settings.showWeekends ? DAYS_OF_WEEK : DAYS_OF_WEEK.slice(0, 5);
  const startHour = settings.startHour || 8;
  const endHour = settings.endHour || 18;
  const totalHours = Math.max(1, endHour - startHour);

  // Today indicator
  const today = new Date();
  const currentDayName = DAYS_OF_WEEK[today.getDay() === 0 ? 6 : today.getDay() - 1];

  const hourSlots = Array.from({ length: totalHours }, (_, i) => startHour + i);

  const handleClassClick = (cls, e) => {
    e.stopPropagation();
    setSelectedClassForEdit(cls);
    setActiveModal('editClass');
  };

  const handleCellClick = (day, hour) => {
    const startH = String(hour).padStart(2, '0') + ':00';
    const endH = String(Math.min(23, hour + 1)).padStart(2, '0') + ':30';
    setSelectedClassForEdit({
      day,
      startTime: startH,
      endTime: endH,
      type: 'Lecture',
      color: '#6366f1',
    });
    setActiveModal('addClass');
  };

  const handleDuplicate = (cls, e) => {
    e.stopPropagation();
    // Default to next day
    const currentIndex = days.indexOf(cls.day);
    const nextDay = days[(currentIndex + 1) % days.length];
    duplicateClass(cls.id, nextDay);
  };

  const handleDelete = (cls, e) => {
    e.stopPropagation();
    if (confirm(`Remove ${cls.code}: ${cls.title}?`)) {
      deleteClass(cls.id);
    }
  };

  const handleNudgeTime = (cls, deltaMin, e) => {
    e.stopPropagation();
    adjustClassTime(cls.id, deltaMin);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden timetable-print-container">
      
      {/* Timetable Sub-header info */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {filteredClasses.length} Scheduled Sessions
          </span>
          <span>•</span>
          <span>
            {startHour}:00 - {endHour}:00 ({settings.timeFormat.toUpperCase()})
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span> Click any class to edit details or adjust timing
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span> Click empty slot to schedule
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto relative">
        <div
          className="min-w-[800px] grid select-none"
          style={{
            gridTemplateColumns: `64px repeat(${days.length}, minmax(130px, 1fr))`,
          }}
        >
          {/* Header Corner */}
          <div className="sticky top-0 z-20 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-r border-slate-200/80 dark:border-slate-800 p-2.5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Time
          </div>

          {/* Day Headers */}
          {days.map((day) => {
            const isToday = day === currentDayName;
            return (
              <div
                key={day}
                className={`sticky top-0 z-20 backdrop-blur-sm border-b border-r border-slate-200/80 dark:border-slate-800 py-3 px-2 text-center transition-colors ${
                  isToday
                    ? 'bg-brand-50/80 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-bold'
                    : 'bg-slate-50/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-semibold'
                }`}
              >
                <div className="text-xs uppercase tracking-wide">{day.slice(0, 3)}</div>
                <div className="text-[11px] font-normal opacity-70">{day}</div>
                {isToday && (
                  <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-full text-[9px] bg-brand-500 text-white uppercase font-bold tracking-wider">
                    Today
                  </span>
                )}
              </div>
            );
          })}

          {/* Left Time Column */}
          <div className="border-r border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40">
            {hourSlots.map((hour) => (
              <div
                key={hour}
                className="border-b border-slate-100 dark:border-slate-800/60 text-right pr-2 pt-1 text-[11px] font-medium text-slate-400"
                style={{ height: `${ROW_HEIGHT_PX}px` }}
              >
                {formatTimeDisplay(`${hour}:00`, settings.timeFormat === '24h')}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {days.map((day) => {
            const dayClasses = filteredClasses.filter((c) => c.day === day);
            const isToday = day === currentDayName;

            return (
              <div
                key={day}
                className={`relative border-r border-slate-200/70 dark:border-slate-800/70 ${
                  isToday ? 'bg-brand-500/[0.02]' : ''
                }`}
                style={{ height: `${totalHours * ROW_HEIGHT_PX}px` }}
              >
                {/* Empty hour cells (clickable to schedule) */}
                {hourSlots.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => handleCellClick(day, hour)}
                    className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-brand-500/[0.04] cursor-pointer transition-colors group relative"
                    style={{ height: `${ROW_HEIGHT_PX}px` }}
                    title={`Click to add class on ${day} at ${hour}:00`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-brand-600 dark:text-brand-400 text-xs font-semibold transition-opacity">
                      <Plus className="w-3.5 h-3.5 mr-1" /> + Add
                    </span>
                  </div>
                ))}

                {/* Scheduled Class Cards */}
                {dayClasses.map((cls) => {
                  const startMinutes = timeToMinutes(cls.startTime);
                  const endMinutes = timeToMinutes(cls.endTime);
                  const startOffsetMin = startMinutes - startHour * 60;
                  const durationMin = Math.max(15, endMinutes - startMinutes);

                  const pxPerMin = ROW_HEIGHT_PX / 60;
                  const topPx = Math.max(0, startOffsetMin * pxPerMin);
                  const heightPx = Math.max(34, durationMin * pxPerMin - 4);

                  const isConflicting = Boolean(conflictMap[cls.id]);
                  const classColor = cls.color || '#6366f1';

                  return (
                    <div
                      key={cls.id}
                      onClick={(e) => handleClassClick(cls, e)}
                      style={{
                        top: `${topPx}px`,
                        height: `${heightPx}px`,
                        backgroundColor: `${classColor}14`,
                        borderLeftColor: classColor,
                      }}
                      className={`group absolute left-1 right-1 rounded-xl border-l-[4px] p-2.5 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.01] overflow-hidden flex flex-col justify-between z-10 ${
                        isConflicting
                          ? 'border-2 border-rose-500 ring-2 ring-rose-500/20'
                          : 'border border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {/* Top Header: Code & Type & Quick Actions on Hover */}
                      <div className="flex items-center justify-between gap-1 leading-tight">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="font-bold text-xs truncate"
                            style={{ color: classColor }}
                          >
                            {cls.code}
                          </span>
                          {isConflicting && (
                            <AlertTriangle
                              className="w-3.5 h-3.5 text-rose-500 shrink-0"
                              title="Time overlap detected!"
                            />
                          )}
                        </div>

                        {/* Hover Quick Tools: Duplicate & Delete */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                          <button
                            onClick={(e) => handleDuplicate(cls, e)}
                            className="p-1 rounded bg-white dark:bg-slate-800 text-slate-500 hover:text-brand-600 shadow-sm"
                            title="Duplicate class to next day"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(cls, e)}
                            className="p-1 rounded bg-white dark:bg-slate-800 text-slate-500 hover:text-rose-600 shadow-sm"
                            title="Delete class"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Type badge (visible when not hovered) */}
                        <span
                          className="group-hover:hidden px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white shrink-0"
                          style={{ backgroundColor: classColor }}
                        >
                          {cls.type}
                        </span>
                      </div>

                      {/* Course Title */}
                      <div className="font-semibold text-xs text-slate-800 dark:text-slate-100 line-clamp-1 mt-0.5">
                        {cls.title}
                      </div>

                      {/* Details: Time, Room, Instructor */}
                      {heightPx > 48 && (
                        <div className="flex flex-col gap-0.5 text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                          <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200 truncate">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>
                              {formatTimeDisplay(cls.startTime, settings.timeFormat === '24h')} -{' '}
                              {formatTimeDisplay(cls.endTime, settings.timeFormat === '24h')}
                            </span>
                          </div>

                          {cls.room && (
                            <div className="flex items-center gap-1 truncate text-slate-500 dark:text-slate-400 text-[10px]">
                              <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                              <span className="truncate">{cls.room}</span>
                            </div>
                          )}

                          {heightPx > 80 && cls.instructor && (
                            <div className="flex items-center gap-1 truncate text-slate-500 dark:text-slate-400 text-[10px]">
                              <User className="w-3 h-3 shrink-0 text-slate-400" />
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
