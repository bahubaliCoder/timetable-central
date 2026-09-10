import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PRESET_SCHEDULES, CAMPUS_ROOMS, DAYS_OF_WEEK } from '../data/mockData';
import { detectAllConflicts, getLiveClassStatus, generateICS } from '../utils/timeHelpers';

const ScheduleContext = createContext();

const STORAGE_KEY_CLASSES = 'ttc_classes_v1';
const STORAGE_KEY_PRESET = 'ttc_preset_id_v1';
const STORAGE_KEY_EXAMS = 'ttc_exams_v1';
const STORAGE_KEY_SETTINGS = 'ttc_settings_v1';

export const ScheduleProvider = ({ children }) => {
  // 1. Preset & Classes State
  const [presetId, setPresetId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_PRESET) || 'cs';
  });

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLASSES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved classes', e);
      }
    }
    return PRESET_SCHEDULES['cs'].classes;
  });

  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EXAMS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved exams', e);
      }
    }
    return PRESET_SCHEDULES['cs'].exams;
  });

  // 2. Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    return {
      darkMode: false,
      showWeekends: false,
      timeFormat: '12h',
      startHour: 8,
      endHour: 18,
      targetAttendance: 75,
      compactView: false,
    };
  });

  // Apply dark mode to document HTML element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Persist classes and exams
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXAMS, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRESET, presetId);
  }, [presetId]);

  // 3. Navigation View
  const [currentView, setCurrentView] = useState('weekly'); // 'weekly' | 'daily' | 'exams' | 'rooms'

  // 4. Modals State
  const [activeModal, setActiveModal] = useState(null); // 'addClass' | 'editClass' | 'attendance' | 'export' | 'classDetail'
  const [selectedClassForEdit, setSelectedClassForEdit] = useState(null);

  // 5. Filters State
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedDay: 'all',
    selectedType: 'all',
    selectedInstructor: 'all',
    selectedRoom: 'all',
  });

  // 6. Live Clock & Simulated Time Travel
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSimulatedTime, setIsSimulatedTime] = useState(false);
  const [simulatedOffsetMinutes, setSimulatedOffsetMinutes] = useState(0);

  // Auto-tick every 30 seconds for live status
  useEffect(() => {
    if (isSimulatedTime) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [isSimulatedTime]);

  // Time travel helper
  const setSimulatedDayAndTime = (dayName, hour, minute) => {
    const dayMap = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
    const now = new Date();
    const targetDayIndex = dayMap[dayName] ?? 1;
    const currentDayIndex = now.getDay();
    const dayDiff = targetDayIndex - currentDayIndex;

    const simDate = new Date(now);
    simDate.setDate(now.getDate() + dayDiff);
    simDate.setHours(hour, minute, 0, 0);

    setIsSimulatedTime(true);
    setCurrentTime(simDate);
  };

  const resetToRealTime = () => {
    setIsSimulatedTime(false);
    setCurrentTime(new Date());
  };

  // 7. Computed Conflicts
  const conflictMap = useMemo(() => {
    return detectAllConflicts(classes);
  }, [classes]);

  const conflictCount = useMemo(() => {
    return Object.keys(conflictMap).length;
  }, [conflictMap]);

  // 8. Live Class Status
  const liveStatus = useMemo(() => {
    return getLiveClassStatus(classes, currentTime);
  }, [classes, currentTime]);

  // 9. Filtered Classes
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(query);
        const matchCode = c.code.toLowerCase().includes(query);
        const matchInstructor = c.instructor.toLowerCase().includes(query);
        const matchRoom = c.room.toLowerCase().includes(query);
        if (!matchTitle && !matchCode && !matchInstructor && !matchRoom) return false;
      }
      // Day filter
      if (filters.selectedDay !== 'all' && c.day !== filters.selectedDay) {
        return false;
      }
      // Type filter
      if (filters.selectedType !== 'all' && c.type !== filters.selectedType) {
        return false;
      }
      // Instructor filter
      if (filters.selectedInstructor !== 'all' && c.instructor !== filters.selectedInstructor) {
        return false;
      }
      // Room filter
      if (filters.selectedRoom !== 'all' && c.room !== filters.selectedRoom) {
        return false;
      }
      return true;
    });
  }, [classes, filters]);

  // Class Management Actions
  const addClass = (newClass) => {
    const classWithId = {
      ...newClass,
      id: 'class-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      attended: newClass.attended ?? 0,
      totalHeld: newClass.totalHeld ?? 0,
    };
    setClasses((prev) => [...prev, classWithId]);
    return classWithId;
  };

  const updateClass = (id, updatedFields) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteClass = (id) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    if (selectedClassForEdit?.id === id) {
      setSelectedClassForEdit(null);
      setActiveModal(null);
    }
  };

  const markAttendance = (classId, status) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        const currentAttended = c.attended || 0;
        const currentTotal = c.totalHeld || 0;
        if (status === 'attended') {
          return {
            ...c,
            attended: currentAttended + 1,
            totalHeld: currentTotal + 1,
          };
        } else if (status === 'missed') {
          return {
            ...c,
            totalHeld: currentTotal + 1,
          };
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
      setExams(PRESET_SCHEDULES[id].exams);
    }
  };

  const importScheduleJSON = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.classes)) {
        setClasses(data.classes);
        if (Array.isArray(data.exams)) setExams(data.exams);
        if (data.presetTitle) setPresetId('custom');
        return { success: true };
      }
      throw new Error('Invalid JSON structure: missing "classes" array');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const downloadICSFile = () => {
    const currentPreset = PRESET_SCHEDULES[presetId] || { title: 'TimeTable Central' };
    const icsContent = generateICS(classes, currentPreset.title);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable-${presetId}-${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activePresetInfo = PRESET_SCHEDULES[presetId] || {
    title: 'Custom Schedule',
    semester: 'Active Semester',
    section: 'Personalized',
  };

  return (
    <ScheduleContext.Provider
      value={{
        presetId,
        activePresetInfo,
        classes,
        filteredClasses,
        exams,
        setExams,
        conflictMap,
        conflictCount,
        liveStatus,
        currentTime,
        isSimulatedTime,
        setSimulatedDayAndTime,
        resetToRealTime,
        filters,
        setFilters,
        settings,
        setSettings,
        currentView,
        setCurrentView,
        activeModal,
        setActiveModal,
        selectedClassForEdit,
        setSelectedClassForEdit,
        addClass,
        updateClass,
        deleteClass,
        markAttendance,
        switchPreset,
        importScheduleJSON,
        downloadICSFile,
        campusRooms: CAMPUS_ROOMS,
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
