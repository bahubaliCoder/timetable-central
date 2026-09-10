import React, { useState } from 'react';
import { School, Plus, Search, Edit2, Trash2, X, Calendar, Users } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const ClassesPage = () => {
  const { classes, addClass, updateClass, deleteClass, setActiveClassId, setActivePage, teachers } = useAdmin();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: 'Computer Science',
    semester: 'Semester 4',
    section: 'Section A',
    academicYear: '2026-2027',
    studentCount: 60,
    mentor: 'Prof. Alan Turing',
  });

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      code: '',
      department: 'Computer Science',
      semester: 'Semester 4',
      section: 'Section A',
      academicYear: '2026-2027',
      studentCount: 60,
      mentor: teachers[0]?.name || 'Faculty Mentor',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cls) => {
    setEditingClass(cls);
    setFormData(cls);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editingClass) {
      updateClass(editingClass.id, formData);
    } else {
      addClass(formData);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this class? All associated schedule slots will be cleared.')) {
      deleteClass(id);
    }
  };

  const handleViewSchedule = (classId) => {
    setActiveClassId(classId);
    setActivePage('timetable');
  };

  const filteredClasses = classes.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.department.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            <span>Academic Classes & Cohorts ({classes.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure programs, student cohorts, sections, and assigned faculty mentors.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search classes by degree, cohort code, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-800 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-extrabold text-xs">
                  {cls.code}
                </span>

                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {cls.studentCount} Students
                </span>
              </div>

              <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-1">
                {cls.name}
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                {cls.semester} • {cls.section} ({cls.department})
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mb-4 space-y-1">
                <div>
                  Mentor: <strong>{cls.mentor}</strong>
                </div>
                <div>
                  Academic Year: <strong>{cls.academicYear}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleViewSchedule(cls.id)}
                className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Manage Timetable</span>
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleOpenEdit(cls)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  title="Edit Class"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete Class"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Class Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingClass ? 'Edit Class & Section' : 'Add New Class Cohort'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Cohort Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-4A"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Section A"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Program / Degree Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Computer Science"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    Semester / Year
                  </label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Student Strength
                  </label>
                  <input
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Faculty Mentor
                  </label>
                  <select
                    value={formData.mentor}
                    onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
