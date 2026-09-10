import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_TEACHERS,
  INITIAL_SUBJECTS,
  INITIAL_ROOMS,
  INITIAL_CLASSES,
  INITIAL_PERIODS,
  INITIAL_DAYS,
  INITIAL_TIMETABLES,
  INITIAL_SESSIONS,
  INITIAL_USERS,
} from '../data/institutionalData';
import { findTimetableConflicts } from '../utils/conflictChecker';

const AdminContext = createContext();

const STORAGE_PREFIX = 'ttc_inst_v1_';

export const AdminProvider = ({ children }) => {
  // 1. Navigation & Role State
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_PREFIX + 'dark') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_PREFIX + 'dark', darkMode);
  }, [darkMode]);

  // Active User / Role
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'Super Admin' || parsed.role === 'Admin') {
          return INITIAL_USERS[0];
        }
        return parsed;
      }
      return INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const isAdmin = currentUser.role === 'Admin' || currentUser.role === 'Super Admin';
  const isFaculty = isAdmin || currentUser.role === 'Faculty';
  const isStudent = currentUser.role === 'Student';

  const login = (identifier, password, selectedRole) => {
    const idClean = identifier.trim().toLowerCase();
    const user = INITIAL_USERS.find((u) => {
      const matchRole = !selectedRole || u.role.toLowerCase() === selectedRole.toLowerCase();
      const matchId =
        u.email.toLowerCase() === idClean ||
        u.username?.toLowerCase() === idClean ||
        u.studentId?.toLowerCase() === idClean;
      return matchRole && matchId;
    });

    if (!user) {
      return { success: false, error: 'User ID or Email not found.' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Invalid password. Please check and try again.' };
    }

    setCurrentUser(user);
    localStorage.setItem(STORAGE_PREFIX + 'user', JSON.stringify(user));
    addNotification('Authentication Successful', `Welcome, ${user.name} (${user.role}).`, 'success');
    return { success: true, user };
  };

  const logout = () => {
    const studentUser = INITIAL_USERS.find((u) => u.role === 'Student') || INITIAL_USERS[1];
    setCurrentUser(studentUser);
    localStorage.setItem(STORAGE_PREFIX + 'user', JSON.stringify(studentUser));
    addNotification('Logged Out', 'You have logged out of your session.', 'info');
  };

  const updateUserProfile = (updatedFields) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem(STORAGE_PREFIX + 'user', JSON.stringify(updated));
      return updated;
    });
  };

  const switchRole = (newRole) => {
    const userTemplate = INITIAL_USERS.find((u) => u.role === newRole) || {
      ...currentUser,
      role: newRole,
    };
    setCurrentUser(userTemplate);
    localStorage.setItem(STORAGE_PREFIX + 'user', JSON.stringify(userTemplate));
  };

  // 2. Academic Sessions
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'sessions');
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });
  const [activeSession, setActiveSession] = useState(sessions[0] || '2026-2027 Academic Year (Term 1)');

  // 3. Institutional Database Entities with LocalStorage Persistence
  const [teachers, setTeachers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'teachers');
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'subjects');
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'rooms');
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  const [classes, setClasses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'classes');
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [days, setDays] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'days');
      return saved ? JSON.parse(saved) : INITIAL_DAYS;
    } catch {
      return INITIAL_DAYS;
    }
  });

  const [periods, setPeriods] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'periods');
      return saved ? JSON.parse(saved) : INITIAL_PERIODS;
    } catch {
      return INITIAL_PERIODS;
    }
  });

  const [timetables, setTimetables] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'timetables');
      return saved ? JSON.parse(saved) : INITIAL_TIMETABLES;
    } catch {
      return INITIAL_TIMETABLES;
    }
  });

  // Active Timetable Class selection
  const [activeClassId, setActiveClassId] = useState(() => {
    return classes[0]?.id || 'cls-1';
  });

  // Timetable view layout: 'grid' | 'weekly' | 'faculty' | 'room'
  const [timetableLayout, setTimetableLayout] = useState('grid');

  // Auto-Save Status
  const [autoSaveStatus, setAutoSaveStatus] = useState('All changes saved');

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Timetable Published',
      message: 'B.Tech CS Section A timetable published for 2026-2027 Term 1.',
      time: '10 mins ago',
      type: 'success',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Faculty Assignment Update',
      message: 'Prof. Alan Turing assigned to CS401 Lab in Lab CS-3.',
      time: '1 hour ago',
      type: 'info',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Room Maintenance Notice',
      message: 'Systems Lab 2 projector firmware updated successfully.',
      time: 'Yesterday',
      type: 'warning',
      unread: false,
    },
  ]);

  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      type,
      unread: true,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'days', JSON.stringify(days));
  }, [days]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'periods', JSON.stringify(periods));
  }, [periods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'timetables', JSON.stringify(timetables));
    setAutoSaveStatus('Draft saved');
    const timer = setTimeout(() => setAutoSaveStatus('All changes saved'), 1200);
    return () => clearTimeout(timer);
  }, [timetables]);

  // Computed Conflicts across the entire institution
  const institutionConflicts = useMemo(() => {
    return findTimetableConflicts(timetables, classes, teachers, rooms, subjects);
  }, [timetables, classes, teachers, rooms, subjects]);

  // Current class timetable slots
  const currentClassSlots = useMemo(() => {
    return timetables[activeClassId] || [];
  }, [timetables, activeClassId]);

  // Active Class Info
  const activeClassInfo = useMemo(() => {
    return classes.find((c) => c.id === activeClassId) || classes[0];
  }, [classes, activeClassId]);

  // CRUD Actions for Teachers
  const addTeacher = (teacher) => {
    const newT = { ...teacher, id: 't-' + Date.now() };
    setTeachers((prev) => [...prev, newT]);
    addNotification('Teacher Added', `${newT.name} was added to ${newT.department}.`, 'success');
  };

  const updateTeacher = (id, updated) => {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    addNotification('Teacher Updated', `Details updated for ${updated.name || 'Teacher'}.`, 'info');
  };

  const deleteTeacher = (id) => {
    const t = teachers.find((x) => x.id === id);
    setTeachers((prev) => prev.filter((x) => x.id !== id));
    addNotification('Teacher Removed', `${t?.name || 'Teacher'} removed from faculty directory.`, 'warning');
  };

  // CRUD Actions for Subjects
  const addSubject = (subject) => {
    const newSub = { ...subject, id: 'sub-' + Date.now() };
    setSubjects((prev) => [...prev, newSub]);
    addNotification('Subject Added', `${newSub.code}: ${newSub.name} added.`, 'success');
  };

  const updateSubject = (id, updated) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    addNotification('Subject Updated', `Subject ${updated.code || ''} updated.`, 'info');
  };

  const deleteSubject = (id) => {
    const s = subjects.find((x) => x.id === id);
    setSubjects((prev) => prev.filter((x) => x.id !== id));
    addNotification('Subject Removed', `${s?.code || 'Subject'} removed from catalog.`, 'warning');
  };

  // CRUD Actions for Rooms
  const addRoom = (room) => {
    const newRm = { ...room, id: 'rm-' + Date.now() };
    setRooms((prev) => [...prev, newRm]);
    addNotification('Room Added', `${newRm.name} (${newRm.building}) added.`, 'success');
  };

  const updateRoom = (id, updated) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
    addNotification('Room Updated', `${updated.name || 'Room'} details modified.`, 'info');
  };

  const deleteRoom = (id) => {
    const r = rooms.find((x) => x.id === id);
    setRooms((prev) => prev.filter((x) => x.id !== id));
    addNotification('Room Removed', `${r?.name || 'Room'} deleted.`, 'warning');
  };

  // CRUD Actions for Classes
  const addClass = (cls) => {
    const newC = { ...cls, id: 'cls-' + Date.now() };
    setClasses((prev) => [...prev, newC]);
    // Initialize empty timetable array
    setTimetables((prev) => ({ ...prev, [newC.id]: [] }));
    addNotification('Class Created', `${newC.name} (${newC.code}) created.`, 'success');
    return newC;
  };

  const updateClass = (id, updated) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    addNotification('Class Updated', `${updated.name || 'Class'} details saved.`, 'info');
  };

  const deleteClass = (id) => {
    const c = classes.find((x) => x.id === id);
    setClasses((prev) => prev.filter((x) => x.id !== id));
    setTimetables((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (activeClassId === id) {
      setActiveClassId(classes[0]?.id || '');
    }
    addNotification('Class Deleted', `${c?.name || 'Class'} and its timetable were deleted.`, 'warning');
  };

  // Dynamic Day Management
  const addDay = (dayName) => {
    if (!dayName || days.includes(dayName)) return;
    setDays((prev) => [...prev, dayName]);
    addNotification('Day Added', `${dayName} added to the timetable schedule.`, 'info');
  };

  const deleteDay = (dayName) => {
    setDays((prev) => prev.filter((d) => d !== dayName));
    // Remove slots on that day
    setTimetables((prev) => {
      const updated = {};
      Object.entries(prev).forEach(([cId, slots]) => {
        updated[cId] = (slots || []).filter((s) => s.day !== dayName);
      });
      return updated;
    });
    addNotification('Day Removed', `${dayName} removed from schedule.`, 'warning');
  };

  // Dynamic Period Management
  const addPeriod = (periodData) => {
    const newP = {
      ...periodData,
      id: 'p-' + Date.now(),
    };
    setPeriods((prev) => [...prev, newP]);
    addNotification('Period Added', `${newP.name} (${newP.startTime}-${newP.endTime}) added.`, 'info');
  };

  const updatePeriod = (id, updated) => {
    setPeriods((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    addNotification('Period Updated', `${updated.name || 'Period'} updated.`, 'info');
  };

  const deletePeriod = (id) => {
    const p = periods.find((x) => x.id === id);
    setPeriods((prev) => prev.filter((x) => x.id !== id));
    // Remove slots referencing this period
    setTimetables((prev) => {
      const updated = {};
      Object.entries(prev).forEach(([cId, slots]) => {
        updated[cId] = (slots || []).filter((s) => s.periodId !== id);
      });
      return updated;
    });
    addNotification('Period Deleted', `${p?.name || 'Period'} removed.`, 'warning');
  };

  // Timetable Slot Actions
  const saveSlot = (classId, slotData) => {
    setTimetables((prev) => {
      const existingSlots = prev[classId] || [];
      if (slotData.id) {
        // Update
        return {
          ...prev,
          [classId]: existingSlots.map((s) => (s.id === slotData.id ? { ...s, ...slotData } : s)),
        };
      } else {
        // Add new
        const newSlot = {
          ...slotData,
          id: 'slot-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        };
        return {
          ...prev,
          [classId]: [...existingSlots, newSlot],
        };
      }
    });
  };

  const deleteSlot = (classId, slotId) => {
    setTimetables((prev) => ({
      ...prev,
      [classId]: (prev[classId] || []).filter((s) => s.id !== slotId),
    }));
  };

  const duplicateTimetable = (sourceClassId, targetClassId) => {
    const sourceSlots = timetables[sourceClassId] || [];
    const cloned = sourceSlots.map((s) => ({
      ...s,
      id: 'slot-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    }));
    setTimetables((prev) => ({
      ...prev,
      [targetClassId]: cloned,
    }));
    const targetClass = classes.find((c) => c.id === targetClassId);
    addNotification('Timetable Duplicated', `Schedule copied to ${targetClass?.code || 'target class'}.`, 'success');
  };

  // Reset to Demo Presets
  const resetToDemoPreset = (presetName) => {
    setTeachers(INITIAL_TEACHERS);
    setSubjects(INITIAL_SUBJECTS);
    setRooms(INITIAL_ROOMS);
    setClasses(INITIAL_CLASSES);
    setPeriods(INITIAL_PERIODS);
    setDays(INITIAL_DAYS);
    setTimetables(INITIAL_TIMETABLES);
    addNotification('System Reset', 'All records reset to institutional demo data.', 'info');
  };

  return (
    <AdminContext.Provider
      value={{
        activePage,
        setActivePage,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        darkMode,
        setDarkMode,
        currentUser,
        setCurrentUser,
        updateUserProfile,
        isAdmin,
        isFaculty,
        isStudent,
        login,
        logout,
        switchRole,
        sessions,
        activeSession,
        setActiveSession,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        rooms,
        addRoom,
        updateRoom,
        deleteRoom,
        classes,
        addClass,
        updateClass,
        deleteClass,
        days,
        addDay,
        deleteDay,
        periods,
        addPeriod,
        updatePeriod,
        deletePeriod,
        timetables,
        activeClassId,
        setActiveClassId,
        activeClassInfo,
        currentClassSlots,
        saveSlot,
        deleteSlot,
        duplicateTimetable,
        timetableLayout,
        setTimetableLayout,
        autoSaveStatus,
        institutionConflicts,
        notifications,
        addNotification,
        markAllNotificationsRead,
        resetToDemoPreset,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
