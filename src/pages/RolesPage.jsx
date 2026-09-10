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
  GraduationCap,
  Calendar,
  BookOpen,
  Camera,
  Download,
  Printer,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const RolesPage = () => {
  const { currentUser, switchRole, addNotification } = useAdmin();

  const roleDefinitions = [
    {
      role: 'Faculty',
      title: 'Faculty & Academic Staff',
      badgeColor: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      description: 'Instructors, professors, and academic department chairs with authority to create, edit, and organize class timetables, assign lecture halls/labs, manage subjects, and update faculty profiles and profile photos.',
      icon: Shield,
      highlights: [
        'Add, edit, and delete class schedule slots',
        'Upload & edit faculty profile photos',
        'Manage curriculum subjects and room allocations',
        'Duplicate timetables across sections',
        'Full conflict detection & scheduling alerts',
      ],
    },
    {
      role: 'Student',
      title: 'Enrolled Student',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      description: 'Active students who access the student portal to browse their class timetables, view lecture timings, locate rooms and labs, check professor details and office hours, and download/print clean schedule sheets.',
      icon: GraduationCap,
      highlights: [
        'Browse class and section timetables in real-time',
        'Inspect subject details, course codes, and lecture types',
        'View faculty contact information and office hours',
        'Find classroom and laboratory campus locations',
        'Export personal schedule to Excel/CSV or print',
      ],
    },
  ];

  const permissionMatrix = [
    {
      category: 'Timetable & Class Schedules',
      items: [
        { name: 'View Class Timetables & Schedules', faculty: true, student: true },
        { name: 'Schedule New Class Slot (Subject, Room, Teacher)', faculty: true, student: false },
        { name: 'Edit Existing Class Slots', faculty: true, student: false },
        { name: 'Delete / Clear Scheduled Slots', faculty: true, student: false },
        { name: 'Duplicate Timetable Between Classes', faculty: true, student: false },
        { name: 'Manage Dynamic Days & Period Timings', faculty: true, student: false },
      ],
    },
    {
      category: 'Academic Directory & Profile Photos',
      items: [
        { name: 'View Faculty Directory & Office Hours', faculty: true, student: true },
        { name: 'Upload / Edit Faculty Profile Photos', faculty: true, student: false },
        { name: 'Add / Edit / Remove Faculty Members', faculty: true, student: false },
        { name: 'Manage Subject Catalog & Credit Hours', faculty: true, student: false },
        { name: 'Manage Classes, Batches & Sections', faculty: true, student: false },
        { name: 'Manage Campus Rooms, Labs & Capacity', faculty: true, student: false },
      ],
    },
    {
      category: 'Exports & Institutional Tools',
      items: [
        { name: 'Export Timetable to CSV / Excel', faculty: true, student: true },
        { name: 'Print Clean Timetable Sheet', faculty: true, student: true },
        { name: 'View Room Utilization & Workload Reports', faculty: true, student: false },
        { name: 'Modify Academic Terms & Campus Settings', faculty: true, student: false },
      ],
    },
  ];

  const handleSimulate = (role) => {
    switchRole(role);
    addNotification('Role Switched', `Active view switched to ${role}.`, 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            Roles & Access Permissions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare access privileges between Faculty and Student roles, and simulate their experience in one click.
          </p>
        </div>

        {/* Current Active Role Badge */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-4 py-2.5 rounded-2xl shadow-sm">
          <div className="text-xs text-right">
            <div className="text-slate-400 font-medium">Current Active View</div>
            <div className="font-bold text-slate-800 dark:text-slate-100">{currentUser.name}</div>
          </div>
          <span
            className={`px-3 py-1 text-xs font-extrabold rounded-xl border flex items-center gap-1.5 ${
              currentUser.role === 'Student'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
            }`}
          >
            {currentUser.role === 'Student' ? <GraduationCap className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* Role Cards with Simulation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roleDefinitions.map((item) => {
          const isCurrent = currentUser.role === item.role;
          const Icon = item.icon;
          const isStudentRole = item.role === 'Student';

          return (
            <div
              key={item.role}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                isCurrent
                  ? isStudentRole
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-lg ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 border-purple-500 shadow-lg ring-2 ring-purple-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isStudentRole
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.role} Role
                  </span>
                </div>

                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Core Capabilities:
                  </span>
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
                      <Check
                        className={`w-4 h-4 shrink-0 ${
                          isStudentRole ? 'text-emerald-500' : 'text-purple-600'
                        }`}
                      />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleSimulate(item.role)}
                  className={`w-full py-2.5 px-4 text-xs font-bold rounded-2xl transition flex items-center justify-center gap-2 ${
                    isCurrent
                      ? isStudentRole
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      Currently Active View
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Institutional Permissions Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparison between Faculty Administrative Authority and Student Portal Capabilities
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" /> Permitted
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
                <th className="py-3 px-6">System Capability</th>
                <th className="py-3 px-6 text-center w-44">Faculty</th>
                <th className="py-3 px-6 text-center w-44">Student</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {permissionMatrix.map((group) => (
                <React.Fragment key={group.category}>
                  {/* Category Header Row */}
                  <tr className="bg-slate-50/40 dark:bg-slate-800/30 font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <td colSpan={3} className="py-2.5 px-6">
                      {group.category}
                    </td>
                  </tr>

                  {/* Permissions Rows */}
                  {group.items.map((perm) => (
                    <tr key={perm.name} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-6 text-slate-700 dark:text-slate-300 font-medium">
                        {perm.name}
                      </td>
                      <td className="py-3.5 px-6 text-center">
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
                      <td className="py-3.5 px-6 text-center">
                        {perm.student ? (
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
