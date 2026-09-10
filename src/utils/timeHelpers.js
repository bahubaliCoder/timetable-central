/**
 * Convert time string "HH:MM" to minutes from midnight
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

/**
 * Format minutes from midnight to "HH:MM" or "hh:mm A"
 */
export const formatTimeDisplay = (timeStr, format24h = false) => {
  if (!timeStr || typeof timeStr !== 'string') return '';
  if (format24h) return timeStr;
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return timeStr;
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // 0 -> 12
  return `${h}:${m} ${ampm}`;
};

/**
 * Check if two time intervals on the same day overlap
 */
export const doClassesOverlap = (a, b) => {
  if (!a || !b) return false;
  if (a.id === b.id) return false;
  if (a.day !== b.day) return false;
  const startA = timeToMinutes(a.startTime);
  const endA = timeToMinutes(a.endTime);
  const startB = timeToMinutes(b.startTime);
  const endB = timeToMinutes(b.endTime);

  return Math.max(startA, startB) < Math.min(endA, endB);
};

/**
 * Return a map of classId -> conflictingClassIds
 */
export const detectAllConflicts = (classes = []) => {
  const conflictMap = {};
  if (!Array.isArray(classes)) return conflictMap;
  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const c1 = classes[i];
      const c2 = classes[j];
      if (c1 && c2 && doClassesOverlap(c1, c2)) {
        if (!conflictMap[c1.id]) conflictMap[c1.id] = [];
        if (!conflictMap[c2.id]) conflictMap[c2.id] = [];
        conflictMap[c1.id].push(c2);
        conflictMap[c2.id].push(c1);
      }
    }
  }
  return conflictMap;
};

/**
 * Given simulated or real current day and time, find:
 * - currentClass (ongoing)
 * - nextClass (upcoming today or next available)
 */
export const getLiveClassStatus = (classes = [], simulatedDate = new Date()) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const safeDate = simulatedDate instanceof Date ? simulatedDate : new Date();
  const currentDay = dayNames[safeDate.getDay()];
  const currentMinutes = safeDate.getHours() * 60 + safeDate.getMinutes();

  if (!Array.isArray(classes) || classes.length === 0) {
    return {
      currentDay,
      currentMinutes,
      currentClass: null,
      nextClass: null,
      minutesRemainingInCurrent: 0,
      minutesUntilNext: 0,
    };
  }

  const todayClasses = classes
    .filter((c) => c && c.day === currentDay)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  let currentClass = null;
  let nextClass = null;
  let minutesRemainingInCurrent = 0;
  let minutesUntilNext = 0;

  for (const c of todayClasses) {
    const start = timeToMinutes(c.startTime);
    const end = timeToMinutes(c.endTime);

    if (currentMinutes >= start && currentMinutes < end) {
      currentClass = c;
      minutesRemainingInCurrent = end - currentMinutes;
    } else if (currentMinutes < start && !nextClass) {
      nextClass = c;
      minutesUntilNext = start - currentMinutes;
    }
  }

  // If no upcoming class today, look for first class in subsequent days
  if (!currentClass && !nextClass && classes.length > 0) {
    const todayIndex = safeDate.getDay();
    for (let offset = 1; offset <= 7; offset++) {
      const nextDayIndex = (todayIndex + offset) % 7;
      const nextDayName = dayNames[nextDayIndex];
      const nextDayClasses = classes
        .filter((c) => c && c.day === nextDayName)
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

      if (nextDayClasses.length > 0) {
        nextClass = nextDayClasses[0];
        minutesUntilNext = null;
        break;
      }
    }
  }

  return {
    currentDay,
    currentMinutes,
    currentClass,
    nextClass,
    minutesRemainingInCurrent,
    minutesUntilNext,
  };
};

/**
 * Calculate attendance statistics
 */
export const calculateAttendance = (attended = 0, totalHeld = 0, targetPct = 75) => {
  if (!totalHeld || totalHeld <= 0) {
    return {
      percentage: 100,
      attended: attended || 0,
      totalHeld: 0,
      status: 'good',
      safeBunks: 0,
      classesNeeded: 0,
    };
  }

  const safeAttended = Math.max(0, attended || 0);
  const percentage = Math.round((safeAttended / totalHeld) * 100);
  const targetFraction = (targetPct || 75) / 100;

  let safeBunks = 0;
  let classesNeeded = 0;

  if (percentage >= targetPct) {
    safeBunks = Math.max(0, Math.floor(safeAttended / targetFraction - totalHeld));
  } else {
    safeBunks = 0;
    classesNeeded = Math.max(1, Math.ceil((targetFraction * totalHeld - safeAttended) / (1 - targetFraction)));
  }

  return {
    percentage,
    attended: safeAttended,
    totalHeld,
    status: percentage >= targetPct ? 'good' : percentage >= targetPct - 10 ? 'warning' : 'danger',
    safeBunks,
    classesNeeded,
  };
};

/**
 * Generate iCalendar (.ics) content for all classes
 */
export const generateICS = (classes = [], scheduleTitle = 'TimeTable Central Schedule') => {
  const dayToRuleDay = {
    Monday: 'MO',
    Tuesday: 'TU',
    Wednesday: 'WE',
    Thursday: 'TH',
    Friday: 'FR',
    Saturday: 'SA',
    Sunday: 'SU',
  };

  const dayOffset = {
    Monday: 7,
    Tuesday: 8,
    Wednesday: 9,
    Thursday: 10,
    Friday: 11,
    Saturday: 12,
    Sunday: 13,
  };

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TimeTable Central//Class Schedule//EN',
    `X-WR-CALNAME:${scheduleTitle}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  (classes || []).forEach((c) => {
    if (!c || !c.day || !c.startTime || !c.endTime) return;
    const ruleDay = dayToRuleDay[c.day] || 'MO';
    const dayNum = String(dayOffset[c.day] || 7).padStart(2, '0');
    const [startH, startM] = (c.startTime || '09:00').split(':');
    const [endH, endM] = (c.endTime || '10:00').split(':');

    const dtStart = `202609${dayNum}T${startH || '09'}${startM || '00'}00`;
    const dtEnd = `202609${dayNum}T${endH || '10'}${endM || '00'}00`;

    ics.push('BEGIN:VEVENT');
    ics.push(`UID:ttc-${c.id || Math.random()}-${Date.now()}@timetablecentral.app`);
    ics.push(`DTSTAMP:20260901T000000Z`);
    ics.push(`DTSTART;TZID=UTC:${dtStart}`);
    ics.push(`DTEND;TZID=UTC:${dtEnd}`);
    ics.push(`RRULE:FREQ=WEEKLY;BYDAY=${ruleDay};UNTIL=20261231T235959Z`);
    ics.push(`SUMMARY:${c.code || 'Class'}: ${c.title || ''} (${c.type || 'Lecture'})`);
    ics.push(`LOCATION:${c.room || 'TBD'}`);
    ics.push(`DESCRIPTION:Instructor: ${c.instructor || 'TBD'}\\nNotes: ${c.notes || 'None'}`);
    ics.push('STATUS:CONFIRMED');
    ics.push('END:VEVENT');
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
};
