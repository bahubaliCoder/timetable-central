/**
 * Detect conflicts across all classes' timetables.
 * Returns an array of conflict objects:
 * {
 *   type: 'teacher' | 'room',
 *   day,
 *   periodId,
 *   entityId, // teacherId or roomId
 *   classA: { classId, className, subjectName, ... },
 *   classB: { classId, className, subjectName, ... }
 * }
 */
export const findTimetableConflicts = (timetables = {}, classes = [], teachers = [], rooms = [], subjects = []) => {
  const conflicts = [];
  const teacherMap = Object.fromEntries((teachers || []).map((t) => [t.id, t]));
  const roomMap = Object.fromEntries((rooms || []).map((r) => [r.id, r]));
  const classMap = Object.fromEntries((classes || []).map((c) => [c.id, c]));
  const subjectMap = Object.fromEntries((subjects || []).map((s) => [s.id, s]));

  // Flatten all scheduled slots with classId attached
  const allSlots = [];
  Object.entries(timetables || {}).forEach(([classId, slots]) => {
    if (Array.isArray(slots)) {
      slots.forEach((slot) => {
        allSlots.push({
          ...slot,
          classId,
          className: classMap[classId]?.name || classId,
          classCode: classMap[classId]?.code || classId,
          subjectName: subjectMap[slot.subjectId]?.name || slot.subjectId,
          teacherName: teacherMap[slot.teacherId]?.name || slot.teacherId,
          roomName: roomMap[slot.roomId]?.name || slot.roomId,
        });
      });
    }
  });

  // Compare every pair
  for (let i = 0; i < allSlots.length; i++) {
    for (let j = i + 1; j < allSlots.length; j++) {
      const s1 = allSlots[i];
      const s2 = allSlots[j];

      // Must be on the same day and period
      if (s1.day === s2.day && s1.periodId === s2.periodId) {
        // Same teacher in 2 different slots
        if (s1.teacherId && s2.teacherId && s1.teacherId === s2.teacherId && s1.classId !== s2.classId) {
          conflicts.push({
            type: 'teacher',
            day: s1.day,
            periodId: s1.periodId,
            name: s1.teacherName,
            description: `${s1.teacherName} is double-booked for ${s1.classCode} and ${s2.classCode} on ${s1.day}.`,
            slotA: s1,
            slotB: s2,
          });
        }

        // Same room in 2 different slots
        if (s1.roomId && s2.roomId && s1.roomId === s2.roomId && s1.classId !== s2.classId) {
          conflicts.push({
            type: 'room',
            day: s1.day,
            periodId: s1.periodId,
            name: s1.roomName,
            description: `${s1.roomName} is double-booked for ${s1.classCode} and ${s2.classCode} on ${s1.day}.`,
            slotA: s1,
            slotB: s2,
          });
        }
      }
    }
  }

  return conflicts;
};

/**
 * Check if a single slot being added/edited has conflicts with existing schedules
 */
export const checkSlotConflict = (targetSlot, currentClassId, timetables = {}, teachers = [], rooms = []) => {
  const teacherMap = Object.fromEntries((teachers || []).map((t) => [t.id, t]));
  const roomMap = Object.fromEntries((rooms || []).map((r) => [r.id, r]));

  const warnings = [];

  Object.entries(timetables || {}).forEach(([classId, slots]) => {
    if (!Array.isArray(slots)) return;
    slots.forEach((s) => {
      // Ignore same slot when editing
      if (s.id === targetSlot.id) return;
      if (s.day === targetSlot.day && s.periodId === targetSlot.periodId) {
        // Check teacher clash
        if (targetSlot.teacherId && s.teacherId && targetSlot.teacherId === s.teacherId) {
          warnings.push({
            type: 'teacher',
            message: `${teacherMap[targetSlot.teacherId]?.name || 'Teacher'} is already scheduled in another class at this time!`,
          });
        }
        // Check room clash
        if (targetSlot.roomId && s.roomId && targetSlot.roomId === s.roomId) {
          warnings.push({
            type: 'room',
            message: `${roomMap[targetSlot.roomId]?.name || 'Room'} is already booked by another class at this time!`,
          });
        }
      }
    });
  });

  return warnings;
};
