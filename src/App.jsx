import React, { useEffect } from 'react';
import { ScheduleProvider, useSchedule } from './context/ScheduleContext';
import { Navbar } from './components/Navbar';
import { WeeklyGrid } from './components/WeeklyGrid';
import { ClassModal } from './components/ClassModal';
import { AttendanceModal } from './components/AttendanceModal';
import { ExportModal } from './components/ExportModal';

const MainContent = () => {
  const { activeModal, setActiveModal } = useSchedule();

  // Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setActiveModal]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <WeeklyGrid />
      </main>

      {/* Clean Modals */}
      <ClassModal />
      <AttendanceModal />
      <ExportModal />

      {/* Subtle, unobtrusive footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 py-4 no-print text-center text-xs text-slate-400">
        TimeTable Central • Clean Class Schedule & Academic Planner
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ScheduleProvider>
      <MainContent />
    </ScheduleProvider>
  );
}
