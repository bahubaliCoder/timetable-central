import React, { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, Edit2, Trash2, X, Check, Clock } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const TeachersPage = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, timetables } = useAdmin();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    phone: '',
    maxHours: 18,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  });

  const departments = Array.from(new Set(teachers.map((t) => t.department))).sort();

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      email: '',
      department: departments[0] || 'Computer Science',
      designation: 'Assistant Professor',
      phone: '',
      maxHours: 18,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTeacher(t);
    setFormData(t);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      addTeacher(formData);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this teacher from the faculty directory?')) {
      deleteTeacher(id);
    }
  };

  // Compute teacher workload across all timetables
  const getTeacherWorkload = (tId) => {
    let count = 0;
    Object.values(timetables).forEach((slots) => {
      if (Array.isArray(slots)) {
        count += slots.filter((s) => s.teacherId === tId).length;
      }
    });
    return count;
  };

  const filteredTeachers = teachers.filter((t) => {
    if (deptFilter !== 'all' && t.department !== deptFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.department.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Faculty & Instructors ({teachers.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            Manage teacher profiles, departmental appointments, and teaching workloads.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search faculty by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Teachers Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((t) => {
          const workload = getTeacherWorkload(t.id);
          const maxH = t.maxHours || 20;
          const pct = Math.min(100, Math.round((workload / maxH) * 100));

          return (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-purple-300 dark:hover:border-purple-800 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {t.name}
                      </h4>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        {t.designation}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {t.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{t.email}</span>
                  </div>
                  {t.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.phone}</span>
                    </div>
                  )}
                  <div className="pt-1 font-semibold text-slate-700 dark:text-slate-300">
                    Dept: {t.department}
                  </div>
                </div>
              </div>

              {/* Workload Progress */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-500" /> Weekly Teaching Load
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {workload} / {maxH} hrs ({pct}%)
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct > 100 ? 'bg-rose-500' : pct >= 75 ? 'bg-purple-600' : 'bg-blue-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-end space-x-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                    title="Edit Teacher"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Teacher"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Teacher Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingTeacher ? 'Edit Faculty Member' : 'Add New Faculty Member'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Alan Turing"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. turing@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Max Weekly Hours
                  </label>
                  <input
                    type="number"
                    value={formData.maxHours}
                    onChange={(e) => setFormData({ ...formData, maxHours: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
