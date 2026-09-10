import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PRESET_SCHEDULES, DAYS_OF_WEEK } from '../data/mockData';
import { detectAllConflicts, generateICS, timeToMinutes } from '../utils/timeHelpers';

const ScheduleContext = createContext();

const STORAGE_KEY_CLASSES = 'ttc_classes_v3';
const STORAGE_KEY_PRESET = 'ttc_preset_id_v3';
const STORAGE_KEY_SETTINGS = 'ttc_settings_v3';

export const ScheduleProvider = ({ children }) => {
  // 1. Preset & Classes State
  const [presetId, setPresetId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRESET);
      return (saved && PRESET_SCHEDULES[saved]) ? saved : 'cs';
    } catch {
      return 'cs';
    }
  });

  const [classes, setClasses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLASSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Fallback to default preset classes', e);
    }
    return PRESET_SCHEDULES['cs']?.classes || [];
  });

  // 2. Schedule Grid Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          darkMode: parsed.darkMode ?? false,
          showWeekends: parsed.showWeekends ?? false,
          timeFormat: parsed.timeFormat ?? '12h',
          startHour: parsed.startHour ?? 8,
          endHour: parsed.endHour ?? 18,
          targetAttendance: parsed.targetAttendance ?? 75,
        };
      }
    } catch (e) {
      console.warn('Fallback to default settings', e);
    }
    return {
      darkMode: false,
      showWeekends: false,
      timeFormat: '12h',
      startHour: 8,
      endHour: 18,
      targetAttendance: 75,
    };
  });

  // Apply dark mode
  useEffect(() => {
    try {
      if (settings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Persist classes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
    } catch (e) {
      console.error(e);
    }
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRESET, presetId);
    } catch (e) {
      console.error(e);
    }
  }, [presetId]);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'addClass' | 'editClass' | 'classDetail' | 'attendance' | 'export' | 'scheduleSettings'
  const [selectedClassForEdit, setSelectedClassForEdit] = useState(null);

  // Search & Filter State
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedDay: 'all',
    selectedType: 'all',
  });

  // Computed Conflicts
  const conflictMap = useMemo(() => {
    return detectAllConflicts(classes || []);
  }, [classes]);

  const conflictCount = useMemo(() => {
    return Object.keys(conflictMap || {}).length;
  }, [conflictMap]);

  // Filtered Classes for Grid
  const filteredClasses = useMemo(() => {
    const safeClasses = Array.isArray(classes) ? classes : [];
    return safeClasses.filter((c) => {
      if (!c) return false;
      if (filters.searchQuery) {
        const query = (filters.searchQuery || '').toLowerCase();
        const matchTitle = (c.title || '').toLowerCase().includes(query);
        const matchCode = (c.code || '').toLowerCase().includes(query);
        const matchInstructor = (c.instructor || '').toLowerCase().includes(query);
        const matchRoom = (c.room || '').toLowerCase().includes(query);
        if (!matchTitle && !matchCode && !matchInstructor && !matchRoom) return false;
      }
      if (filters.selectedDay !== 'all' && c.day !== filters.selectedDay) {
        return false;
      }
      if (filters.selectedType !== 'all' && c.type !== filters.selectedType) {
        return false;
      }
      return true;
    });
  }, [classes, filters]);

  // Class Actions
  const addClass = (newClass) => {
    const classWithId = {
      ...newClass,
      id: 'class-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      attended: newClass.attended ?? 0,
      totalHeld: newClass.totalHeld ?? 0,
    };
    setClasses((prev) => [...(prev || []), classWithId]);
    return classWithId;
  };

  const updateClass = (id, updatedFields) => {
    setClasses((prev) =>
      (prev || []).map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteClass = (id) => {
    setClasses((prev) => (prev || []).filter((c) => c.id !== id));
    if (selectedClassForEdit?.id === id) {
      setSelectedClassForEdit(null);
      setActiveModal(null);
    }
  };

  // Duplicate a class to another day
  const duplicateClass = (classId, targetDay) => {
    const existing = classes.find((c) => c.id === classId);
    if (!existing) return;
    const duplicated = {
      ...existing,
      id: 'class-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      day: targetDay,
      attended: 0,
      totalHeld: 0,
    };
    setClasses((prev) => [...(prev || []), duplicated]);
    return duplicated;
  };

  // Adjust time (+/- minutes)
  const adjustClassTime = (classId, deltaMinutes) => {
    setClasses((prev) =>
      (prev || []).map((c) => {
        if (c.id !== classId) return c;
        const startM = Math.max(0, timeToMinutes(c.startTime) + deltaMinutes);
        const endM = Math.max(startM + 15, timeToMinutes(c.endTime) + deltaMinutes);

        const formatMin = (m) => {
          const hh = String(Math.floor(m / 60) % 24).padStart(2, '0');
          const mm = String(m % 60).padStart(2, '0');
          return `${hh}:${mm}`;
        };

        return {
          ...c,
          startTime: formatMin(startM),
          endTime: formatMin(endM),
        };
      })
    );
  };

  const updateTimetableHours = (startHour, endHour) => {
    setSettings((prev) => ({
      ...prev,
      startHour: Math.max(0, Math.min(startHour, 23)),
      endHour: Math.max(startHour + 1, Math.min(endHour, 24)),
    }));
  };

  const markAttendance = (classId, status) => {
    setClasses((prev) =>
      (prev || []).map((c) => {
        if (c.id !== classId) return c;
        const currentAttended = c.attended || 0;
        const currentTotal = c.totalHeld || 0;
        if (status === 'attended') {
          return { ...c, attended: currentAttended + 1, totalHeld: currentTotal + 1 };
        } else if (status === 'missed') {
          return { ...c, totalHeld: currentTotal + 1 };
        } else if (status === 'undo') {
          return {
            ...c,
            attended: Math.max(0, currentAttended - 1),
            totalHeld: Math.max(0, currentTotal - 1),
          };
        }
        return c;
      })
    );
  };

  const switchPreset = (id) => {
    if (PRESET_SCHEDULES[id]) {
      setPresetId(id);
      setClasses(PRESET_SCHEDULES[id].classes);
    }
  };

  const downloadICSFile = () => {
    const currentPreset = PRESET_SCHEDULES[presetId] || { title: 'TimeTable Central' };
    const icsContent = generateICS(classes, currentPreset.title);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable-${presetId}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activePresetInfo = PRESET_SCHEDULES[presetId] || {
    title: 'Academic Timetable',
    semester: 'Semester',
    section: 'Section A',
  };

  return (
    <ScheduleContext.Provider
      value={{
        presetId,
        activePresetInfo,
        classes: classes || [],
        filteredClasses: filteredClasses || [],
        conflictMap: conflictMap || {},
        conflictCount,
        filters,
        setFilters,
        settings,
        setSettings,
        updateTimetableHours,
        activeModal,
        setActiveModal,
        selectedClassForEdit,
        setSelectedClassForEdit,
        addClass,
        updateClass,
        deleteClass,
        duplicateClass,
        adjustClassTime,
        markAttendance,
        switchPreset,
        downloadICSFile,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
