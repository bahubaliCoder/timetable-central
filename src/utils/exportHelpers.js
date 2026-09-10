/**
 * Export timetable to CSV (Excel compatible)
 */
export const exportTimetableToCSV = (classInfo, slots = [], days = [], periods = [], subjects = [], teachers = [], rooms = []) => {
  const subjectMap = Object.fromEntries((subjects || []).map((s) => [s.id, s]));
  const teacherMap = Object.fromEntries((teachers || []).map((t) => [t.id, t]));
  const roomMap = Object.fromEntries((rooms || []).map((r) => [r.id, r]));

  // Header row: Day, Period 1, Period 2, ...
  const activePeriods = (periods || []).filter((p) => !p.isBreak);
  const header = ['Day', ...activePeriods.map((p) => `"${p.name} (${p.startTime}-${p.endTime})"`)];

  const rows = [];
  (days || []).forEach((day) => {
    const row = [day];
    activePeriods.forEach((period) => {
      const slot = slots.find((s) => s.day === day && s.periodId === period.id);
      if (slot) {
        const sub = subjectMap[slot.subjectId]?.code || 'Subject';
        const tea = teacherMap[slot.teacherId]?.name || '';
        const rm = roomMap[slot.roomId]?.name || '';
        row.push(`"${sub} | ${tea} | ${rm}"`);
      } else {
        row.push('"Free"');
      }
    });
    rows.push(row.join(','));
  });

  const csvContent = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Timetable_${classInfo?.code || 'Schedule'}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export Faculty Workload report to CSV
 */
export const exportWorkloadReportToCSV = (teachers = [], timetables = {}, subjects = []) => {
  const header = ['Teacher Name', 'Department', 'Designation', 'Total Periods Assigned', 'Max Weekly Hours', 'Status'];
  const rows = (teachers || []).map((t) => {
    // Count assigned slots across all timetables
    let assignedCount = 0;
    Object.values(timetables || {}).forEach((slots) => {
      if (Array.isArray(slots)) {
        assignedCount += slots.filter((s) => s.teacherId === t.id).length;
      }
    });

    const status = assignedCount > t.maxHours ? 'Overloaded' : assignedCount >= t.maxHours * 0.7 ? 'Optimal' : 'Underutilized';
    return [
      `"${t.name}"`,
      `"${t.department}"`,
      `"${t.designation}"`,
      assignedCount,
      t.maxHours,
      status,
    ].join(',');
  });

  const csvContent = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Faculty_Workload_Report_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
