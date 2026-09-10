import React, { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';

// Core Institutional Page Views
import { DashboardPage } from './pages/DashboardPage';
import { TimetablePage } from './pages/TimetablePage';
import { TeachersPage } from './pages/TeachersPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { ClassesPage } from './pages/ClassesPage';
import { RoomsPage } from './pages/RoomsPage';
import { ProfilePage } from './pages/ProfilePage';

const AppShell = () => {
  const { activePage, sidebarCollapsed } = useAdmin();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Render active page view
  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'timetable':
        return <TimetablePage />;
      case 'teachers':
        return <TeachersPage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'classes':
        return <ClassesPage />;
      case 'rooms':
        return <RoomsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar onOpenLoginModal={() => setLoginModalOpen(true)} />

      {/* Main Administrative App Wrapper with adaptive left padding for fixed sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Top Header */}
        <Header onOpenLoginModal={() => setLoginModalOpen(true)} />

        {/* Dynamic Page Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderActiveView()}
        </main>

        {/* Institutional Footer */}
        <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-4 px-6 no-print text-center text-xs text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <div>
              <span className="font-bold text-slate-600 dark:text-slate-300">Time Table Central</span>
              {' '}— Class Schedule Management System
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Admin & Student Portal</span>
              <span>•</span>
              <span>Conflict Detection Active</span>
              <span>•</span>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Sign In / Switch Account
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Institutional ID & Password Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <AppShell />
    </AdminProvider>
  );
}
