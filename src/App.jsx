import React, { useEffect } from 'react';
import { ScheduleProvider, useSchedule } from './context/ScheduleContext';
import { Navbar } from './components/Navbar';
import { LiveStatusBanner } from './components/LiveStatusBanner';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { WeeklyGrid } from './components/WeeklyGrid';
import { DailyAgenda } from './components/DailyAgenda';
import { ExamsAndDeadlines } from './components/ExamsAndDeadlines';
import { FreeRoomFinder } from './components/FreeRoomFinder';
import { ClassModal } from './components/ClassModal';
import { ClassDetailModal } from './components/ClassDetailModal';
import { AttendanceModal } from './components/AttendanceModal';
import { ExportModal } from './components/ExportModal';
import { Calendar, Heart, Sparkles, HelpCircle } from 'lucide-react';

const MainContent = () => {
  const { currentView, activeModal, setActiveModal } = useSchedule();

  // Handle ESC key to close any active modal
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
    <div className="flex-1 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Real-time Status Banner */}
        <LiveStatusBanner />

        {/* Aggregate Stats Overview */}
        <StatsBar />

        {/* Filter bar is shown for weekly and daily schedule views */}
        {(currentView === 'weekly' || currentView === 'daily') && <FilterBar />}

        {/* View Switcher Output */}
        {currentView === 'weekly' && <WeeklyGrid />}
        {currentView === 'daily' && <DailyAgenda />}
        {currentView === 'exams' && <ExamsAndDeadlines />}
        {currentView === 'rooms' && <FreeRoomFinder />}
      </main>

      {/* Global Modals */}
      <ClassModal />
      <ClassDetailModal />
      <AttendanceModal />
      <ExportModal />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-6 transition-colors no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              TimeTable Central
            </span>
            <span>•</span>
            <span>Intelligent Academic Schedule & Course Planner</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>Client-side persistent • Ready for offline use</span>
          </div>
        </div>
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
