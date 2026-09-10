import React from 'react';
import { X, ShieldCheck, UserCheck, GraduationCap, Building2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { INITIAL_USERS } from '../data/institutionalData';

export const LoginModal = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, addNotification } = useAdmin();

  if (!isOpen) return null;

  const handleSelectUser = (user) => {
    setCurrentUser(user);
    addNotification('Account Switched', `Logged in as ${user.name} (${user.role}).`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Institutional Sign In
              </h3>
              <p className="text-xs text-slate-400">
                Switch role or authenticate as administrator
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Quick Selection */}
        <div className="p-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Role to Authenticate:
          </div>

          {INITIAL_USERS.map((u) => {
            const isSelected = currentUser.id === u.id;
            const isStudent = u.role === 'Student';
            return (
              <div
                key={u.id}
                onClick={() => handleSelectUser(u)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? isStudent
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                      : 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 ring-2 ring-purple-500/20'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shadow-sm"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm ${
                        isStudent ? 'bg-emerald-600' : 'bg-purple-600'
                      }`}
                    >
                      {isStudent ? <GraduationCap className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {u.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{u.department}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    isStudent
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  }`}
                >
                  {u.role}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Time Table Central • Unified Institutional Access Gateway
          </p>
        </div>

      </div>
    </div>
  );
};
