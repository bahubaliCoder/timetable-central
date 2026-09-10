import React, { useState } from 'react';
import {
  Users,
  School,
  BookOpen,
  DoorOpen,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAdmin } from '../context/AdminContext';

export const DashboardPage = () => {
  const {
    teachers,
    subjects,
    rooms,
    classes,
    timetables,
    days,
    periods,
    notifications,
    institutionConflicts,
    setActivePage,
    setActiveClassId,
  } = useAdmin();

  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date().getDate());

  // Count active timetable slots
  let totalScheduledSlots = 0;
  Object.values(timetables).forEach((slots) => {
    if (Array.isArray(slots)) totalScheduledSlots += slots.length;
  });

  // Calculate Class Distribution by Day for BarChart
  const classDistributionData = days.map((day) => {
    let count = 0;
    Object.values(timetables).forEach((slots) => {
      if (Array.isArray(slots)) {
        count += slots.filter((s) => s.day === day).length;
      }
    });
    return {
      day: day.slice(0, 3),
      fullDay: day,
      classes: count,
    };
  });

  // Subject Allocation Breakdown for PieChart
  const subjectTypeCounts = { Core: 0, Lab: 0, Elective: 0 };
  subjects.forEach((s) => {
    const t = s.type || 'Core';
    if (subjectTypeCounts[t] !== undefined) {
      subjectTypeCounts[t] += s.credits || 3;
    } else {
      subjectTypeCounts.Core += s.credits || 3;
    }
  });

  const pieData = [
    { name: 'Core Theory', value: subjectTypeCounts.Core, color: '#3b82f6' },
    { name: 'Practical Labs', value: subjectTypeCounts.Lab, color: '#8b5cf6' },
    { name: 'Electives & Seminars', value: subjectTypeCounts.Elective, color: '#06b6d4' },
  ];

  // Today's classes sample
  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const sampleDay = days.includes(todayDayName) ? todayDayName : 'Monday';

  // Gather today's classes across all programs
  const todaySlots = [];
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s]));
  const teacherMap = Object.fromEntries(teachers.map((t) => [t.id, t]));
  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r]));
  const classMap = Object.fromEntries(classes.map((c) => [c.id, c]));

  Object.entries(timetables).forEach(([classId, slots]) => {
    if (Array.isArray(slots)) {
      slots
        .filter((s) => s.day === sampleDay)
        .forEach((s) => {
          const period = periods.find((p) => p.id === s.periodId);
          todaySlots.push({
            ...s,
            className: classMap[classId]?.name || 'Class',
            classCode: classMap[classId]?.code || 'Code',
            subject: subjectMap[s.subjectId],
            teacher: teacherMap[s.teacherId],
            room: roomMap[s.roomId],
            period,
          });
        });
    }
  });

  todaySlots.sort((a, b) => (a.period?.startTime || '').localeCompare(b.period?.startTime || ''));

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Institutional Command Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Academic Schedule & Timetable Portal
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
            Create, manage, and optimize class schedules, room allocations, and faculty assignments across all campus departments.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActivePage('timetable')}
            className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Open Timetable Manager</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Classes */}
        <div
          onClick={() => setActivePage('classes')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm cursor-pointer hover:border-blue-300 dark:hover:border-blue-800 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {classes.length}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Active Classes & Sections
          </div>
        </div>

        {/* Total Teachers */}
        <div
          onClick={() => setActivePage('teachers')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm cursor-pointer hover:border-purple-300 dark:hover:border-purple-800 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {teachers.length}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Faculty Members
          </div>
        </div>

        {/* Total Subjects */}
        <div
          onClick={() => setActivePage('subjects')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm cursor-pointer hover:border-cyan-300 dark:hover:border-cyan-800 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {subjects.length}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Subject Catalog
          </div>
        </div>

        {/* Total Rooms */}
        <div
          onClick={() => setActivePage('rooms')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-800 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DoorOpen className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {rooms.length}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Classrooms & Labs
          </div>
        </div>

        {/* Total Scheduled Periods */}
        <div
          onClick={() => setActivePage('timetable')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {totalScheduledSlots}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Active Scheduled Slots
          </div>
        </div>

      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Weekly Class Distribution */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                Weekly Class Load Distribution
              </h3>
              <p className="text-xs text-slate-400">
                Total scheduled periods across active days of the week.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
              {days.length} Days Active
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="classes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Subject Allocation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
              Curriculum Allocation
            </h3>
            <p className="text-xs text-slate-400">
              Credit distribution between theory, labs, and electives.
            </p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{item.value} Credits</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Today's Schedule & Interactive Mini Calendar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Today's Campus Class Schedule ({sampleDay})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Live chronological sequence of active lectures and laboratories.
              </p>
            </div>

            <button
              onClick={() => setActivePage('timetable')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
            >
              <span>Full Grid</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {todaySlots.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No classes scheduled for {sampleDay}. Perfect time for campus maintenance or student revision.
              </div>
            ) : (
              todaySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm"
                      style={{ backgroundColor: slot.subject?.color || '#3b82f6' }}
                    >
                      {slot.subject?.code || 'SUB'}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                          {slot.subject?.name}
                        </h4>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {slot.classCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {slot.teacher?.name} • Room: <strong>{slot.room?.name}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 self-start sm:self-auto bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {slot.period?.name}: {slot.period?.startTime} - {slot.period?.endTime}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mini Calendar & Activity Panel */}
        <div className="space-y-6">
          {/* Calendar Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                September 2026
              </span>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Term 1</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="font-bold text-[10px] text-slate-400 py-1">
                  {d}
                </span>
              ))}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
                const isSelected = selectedCalendarDate === d;
                const isToday = d === 10;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedCalendarDate(d)}
                    className={`py-1.5 rounded-lg font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isToday
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Audit Activity Stream */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-3 flex items-center justify-between">
              <span>Recent Activity Audit</span>
              <span className="text-[10px] font-normal text-slate-400">Live Logs</span>
            </h3>

            <div className="space-y-2.5">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="flex items-start space-x-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</div>
                    <div className="text-[11px] text-slate-400">{n.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
