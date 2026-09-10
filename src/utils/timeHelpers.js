/**
 * Convert time string "HH:MM" to minutes from midnight
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

/**
 * Format minutes from midnight to "HH:MM" or "hh:mm A"
 */
export const formatTimeDisplay = (timeStr, format24h = false) => {
  if (!timeStr) return '';
  if (format24h) return timeStr;
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
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
export const detectAllConflicts = (classes) => {
  const conflictMap = {};
  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const c1 = classes[i];
      const c2 = classes[j];
      if (doClassesOverlap(c1, c2)) {
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
export const getLiveClassStatus = (classes, simulatedDate = new Date()) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[simulatedDate.getDay()];
  const currentMinutes = simulatedDate.getHours() * 60 + simulatedDate.getMinutes();

  const todayClasses = classes
    .filter((c) => c.day === currentDay)
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
    const todayIndex = simulatedDate.getDay(); // 0 is Sunday
    // Search next days
    for (let offset = 1; offset <= 7; offset++) {
      const nextDayIndex = (todayIndex + offset) % 7;
      const nextDayName = dayNames[nextDayIndex];
      const nextDayClasses = classes
        .filter((c) => c.day === nextDayName)
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

      if (nextDayClasses.length > 0) {
        nextClass = nextDayClasses[0];
        minutesUntilNext = null; // Next day
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
  if (totalHeld === 0) {
    return {
      percentage: 100,
      attended,
      totalHeld,
      status: 'good',
      safeBunks: 0,
      classesNeeded: 0,
    };
  }

  const percentage = Math.round((attended / totalHeld) * 100);
  const targetFraction = targetPct / 100;

  let safeBunks = 0;
  let classesNeeded = 0;

  if (percentage >= targetPct) {
    // How many more classes can the student miss and still stay >= targetPct?
    // attended / (totalHeld + x) >= targetFraction => x <= (attended / targetFraction) - totalHeld
    safeBunks = Math.max(0, Math.floor(attended / targetFraction - totalHeld));
  } else {
    // How many consecutive classes must the student attend to reach targetPct?
    // (attended + x) / (totalHeld + x) >= targetFraction => attended + x >= targetFraction*totalHeld + targetFraction*x
    // x * (1 - targetFraction) >= targetFraction*totalHeld - attended
    // x >= (targetFraction * totalHeld - attended) / (1 - targetFraction)
    classesNeeded = Math.max(1, Math.ceil((targetFraction * totalHeld - attended) / (1 - targetFraction)));
  }

  return {
    percentage,
    attended,
    totalHeld,
    status: percentage >= targetPct ? 'good' : percentage >= targetPct - 10 ? 'warning' : 'danger',
    safeBunks,
    classesNeeded,
  };
};

/**
 * Generate iCalendar (.ics) content for all classes
 */
export const generateICS = (classes, scheduleTitle = 'TimeTable Central Schedule') => {
  const dayToRuleDay = {
    Monday: 'MO',
    Tuesday: 'TU',
    Wednesday: 'WE',
    Thursday: 'TH',
    Friday: 'FR',
    Saturday: 'SA',
    Sunday: 'SU',
  };

  // Base date for recurring events (e.g. 2026-09-07 was a Monday)
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

  classes.forEach((c) => {
    const ruleDay = dayToRuleDay[c.day] || 'MO';
    const dayNum = String(dayOffset[c.day] || 7).padStart(2, '0');
    const [startH, startM] = c.startTime.split(':');
    const [endH, endM] = c.endTime.split(':');

    const dtStart = `202609${dayNum}T${startH}${startM}00`;
    const dtEnd = `202609${dayNum}T${endH}${endM}00`;

    ics.push('BEGIN:VEVENT');
    ics.push(`UID:ttc-${c.id}-${Date.now()}@timetablecentral.app`);
    ics.push(`DTSTAMP:20260901T000000Z`);
    ics.push(`DTSTART;TZID=UTC:${dtStart}`);
    ics.push(`DTEND;TZID=UTC:${dtEnd}`);
    ics.push(`RRULE:FREQ=WEEKLY;BYDAY=${ruleDay};UNTIL=20261231T235959Z`);
    ics.push(`SUMMARY:${c.code}: ${c.title} (${c.type})`);
    ics.push(`LOCATION:${c.room}`);
    ics.push(`DESCRIPTION:Instructor: ${c.instructor}\\nNotes: ${c.notes || 'None'}`);
    ics.push('STATUS:CONFIRMED');
    ics.push('END:VEVENT');
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
};
