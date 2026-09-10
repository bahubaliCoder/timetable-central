import React from 'react';
import {
  Calendar,
  LayoutDashboard,
  Users,
  BookOpen,
  School,
  DoorOpen,
  BarChart3,
  Settings,
  ShieldCheck,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  X,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const Sidebar = ({ onOpenLoginModal }) => {
  const {
    activePage,
    setActivePage,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    teachers,
    subjects,
    rooms,
    classes,
    currentUser,
    isStudent,
    isAdmin,
  } = useAdmin();

  const navItems = isStudent
    ? [
        { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
        { id: 'timetable', label: 'Class Timetable', icon: Calendar, badge: 'Student' },
        { id: 'teachers', label: 'Faculty Directory', icon: Users, count: teachers.length },
        { id: 'subjects', label: 'Course Catalog', icon: BookOpen, count: subjects.length },
        { id: 'rooms', label: 'Campus Rooms', icon: DoorOpen, count: rooms.length },
        { id: 'profile', label: 'Student Profile', icon: UserCheck },
      ]
    : [
        { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
        { id: 'timetable', label: 'Timetable Manager', icon: Calendar, badge: 'Live' },
        { id: 'teachers', label: 'Faculty Directory', icon: Users, count: teachers.length },
        { id: 'subjects', label: 'Subject Catalog', icon: BookOpen, count: subjects.length },
        { id: 'classes', label: 'Classes & Sections', icon: School, count: classes.length },
        { id: 'rooms', label: 'Rooms & Labs', icon: DoorOpen, count: rooms.length },
        { id: 'profile', label: 'Admin Profile', icon: UserCheck },
      ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 flex flex-col no-print ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Branding Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="leading-tight truncate">
                <div className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Time Table</span>
                  <span className="text-blue-600 dark:text-blue-400">Central</span>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                  {isStudent ? 'Student Portal' : 'Academic Planner'}
                </div>
              </div>
            )}
          </div>

          {/* Close on mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Role Pill */}
        {!sidebarCollapsed && (
          <div className="mx-4 mt-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center space-x-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
            />
            <div className="overflow-hidden leading-tight flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {currentUser.name}
              </div>
              <span
                className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  isStudent
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                } ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}
                  />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!sidebarCollapsed && (
                  <div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-700 dark:text-purple-300">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 shrink-0 space-y-2">
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Switch Account / Sign In</span>
            </button>
            <div className="flex items-center justify-between font-medium text-[11px] text-slate-400">
              <span>Time Table Central</span>
              <span className="font-bold text-slate-500">v3.5</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
