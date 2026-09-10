import React from 'react';
import {
  ShieldCheck,
  Shield,
  UserCheck,
  Users,
  Check,
  X,
  AlertTriangle,
  Lock,
  Eye,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const RolesPage = () => {
  const { currentUser, switchRole, addNotification } = useAdmin();

  const roleDefinitions = [
    {
      role: 'Super Admin',
      badgeColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      description: 'Institutional Dean / Provost / Head Administrator with unrestricted control over all campus schedules, faculty workloads, system presets, and global settings.',
      icon: ShieldCheck,
    },
    {
      role: 'Admin',
      badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      description: 'Department Head / Academic Coordinator with rights to manage timetables, room assignments, faculty schedules, and export institutional reports.',
      icon: Shield,
    },
    {
      role: 'Faculty',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      description: 'Instructor / Professor with read access to class schedules, personal teaching assignments, room availability, and syllabus catalogs.',
      icon: Users,
    },
  ];

  const permissionMatrix = [
    {
      category: 'Timetable Scheduling',
      items: [
        { name: 'View All Timetables', superAdmin: true, admin: true, faculty: true },
        { name: 'Add / Edit Timetable Slots', superAdmin: true, admin: true, faculty: false },
        { name: 'Delete Timetable Slots', superAdmin: true, admin: true, faculty: false },
        { name: 'Duplicate Timetable Across Classes', superAdmin: true, admin: true, faculty: false },
        { name: 'Override Booking Conflicts', superAdmin: true, admin: false, faculty: false },
      ],
    },
    {
      category: 'Master Academic Directory',
      items: [
        { name: 'Manage Faculty Directory & Workload', superAdmin: true, admin: true, faculty: false },
        { name: 'Manage Academic Subject Catalog', superAdmin: true, admin: true, faculty: false },
        { name: 'Manage Classes, Degrees & Sections', superAdmin: true, admin: true, faculty: false },
        { name: 'Manage Campus Rooms & Labs', superAdmin: true, admin: true, faculty: false },
      ],
    },
    {
      category: 'Configuration & Security',
      items: [
        { name: 'Add/Remove Dynamic Days & Periods', superAdmin: true, admin: false, faculty: false },
        { name: 'Manage Academic Terms / Sessions', superAdmin: true, admin: true, faculty: false },
        { name: 'Export Data (CSV / Excel / PDF)', superAdmin: true, admin: true, faculty: true },
        { name: 'Reset System to Seed Data / Presets', superAdmin: true, admin: false, faculty: false },
      ],
    },
  ];

  const handleSimulate = (role) => {
    switchRole(role);
    addNotification('Role Switched', `Simulating access as ${role}.`, 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            Roles & Access Control Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review role permissions matrix, access hierarchies, and simulate user privileges in real-time.
          </p>
        </div>

        {/* Current Active Role Badge */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-4 py-2.5 rounded-2xl shadow-sm">
          <div className="text-xs text-right">
            <div className="text-slate-400 font-medium">Current Active Role</div>
            <div className="font-bold text-slate-800 dark:text-slate-100">{currentUser.name}</div>
          </div>
          <span className="px-3 py-1 text-xs font-extrabold rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* Role Cards with Simulation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {roleDefinitions.map((item) => {
          const isCurrent = currentUser.role === item.role;
          const Icon = item.icon;
          return (
            <div
              key={item.role}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-white dark:bg-slate-900 border-purple-500/50 shadow-md ring-2 ring-purple-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.role}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  {item.role} Level
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleSimulate(item.role)}
                  className={`w-full py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Active Role
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Simulate As {item.role}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Institutional Permissions Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Granular access capabilities assigned to administrative and teaching roles
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" /> Allowed
            </span>
            <span className="flex items-center gap-1.5">
              <X className="w-4 h-4 text-rose-500" /> Restricted
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-5">System Capability</th>
                <th className="py-3 px-5 text-center w-36">Super Admin</th>
                <th className="py-3 px-5 text-center w-36">Admin</th>
                <th className="py-3 px-5 text-center w-36">Faculty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {permissionMatrix.map((group) => (
                <React.Fragment key={group.category}>
                  {/* Category Header Row */}
                  <tr className="bg-slate-50/40 dark:bg-slate-800/30 font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <td colSpan={4} className="py-2.5 px-5">
                      {group.category}
                    </td>
                  </tr>

                  {/* Permissions Rows */}
                  {group.items.map((perm) => (
                    <tr key={perm.name} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-5 text-slate-700 dark:text-slate-300 font-medium">
                        {perm.name}
                      </td>
                      <td className="py-3 px-5 text-center">
                        {perm.superAdmin ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                            <X className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-5 text-center">
                        {perm.admin ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                            <X className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-5 text-center">
                        {perm.faculty ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                            <X className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
