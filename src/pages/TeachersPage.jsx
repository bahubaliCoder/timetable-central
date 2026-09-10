import React, { useState, useRef } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Edit2,
  Trash2,
  X,
  Check,
  Clock,
  Camera,
  Upload,
  Sparkles,
  GraduationCap,
  Shield,
  Image as ImageIcon,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
];

export const TeachersPage = () => {
  const {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    timetables,
    periods,
    subjects,
    rooms,
    days,
    setActivePage,
    isFaculty,
    isStudent,
    currentUser,
    updateUserProfile,
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    email: '',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    phone: '',
    maxHours: 18,
    status: 'Active',
    avatar: PRESET_AVATARS[0],
  });

  const departments = Array.from(new Set(teachers.map((t) => t.department))).sort();

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      shortCode: '',
      email: '',
      department: departments[0] || 'Computer Science & Engineering',
      designation: 'Assistant Professor',
      phone: '',
      maxHours: 18,
      status: 'Active',
      avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTeacher(t);
    setFormData({
      ...t,
      shortCode: t.shortCode || '',
      avatar: t.avatar || PRESET_AVATARS[0],
    });
    setModalOpen(true);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size exceeds 2MB limit. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
      // If editing own faculty profile, sync with currentUser
      if (currentUser?.email === editingTeacher.email) {
        updateUserProfile({
          name: formData.name,
          avatar: formData.avatar,
          department: formData.department,
        });
      }
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

  // Lookup maps for fast access
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s]));
  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r]));
  const periodMap = Object.fromEntries(periods.map((p) => [p.id, p]));

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

  // Compute allocated weekly time periods for a specific teacher
  const getTeacherPeriods = (tId) => {
    const list = [];
    Object.values(timetables).forEach((slots) => {
      if (Array.isArray(slots)) {
        slots
          .filter((s) => s.teacherId === tId)
          .forEach((s) => {
            const p = periodMap[s.periodId];
            const sub = subjectMap[s.subjectId];
            const rm = roomMap[s.roomId];
            list.push({
              id: s.id,
              day: s.day,
              periodName: p?.name || s.periodId,
              time: p ? `${p.startTime} - ${p.endTime}` : '',
              subjectCode: sub?.shortCode || sub?.code || 'Subject',
              subjectName: sub?.name || 'Subject',
              subjectColor: sub?.color || '#3b82f6',
              roomName: rm?.name || 'Room',
              type: s.type || 'Lecture',
              displayLabel: s.displayLabel,
            });
          });
      }
    });

    const dayOrder = Object.fromEntries((days || []).map((d, idx) => [d, idx]));
    list.sort((a, b) => {
      const dDiff = (dayOrder[a.day] ?? 99) - (dayOrder[b.day] ?? 99);
      if (dDiff !== 0) return dDiff;
      return (a.time || '').localeCompare(b.time || '');
    });
    return list;
  };

  const filteredTeachers = teachers.filter((t) => {
    if (deptFilter !== 'all' && t.department !== deptFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Faculty Directory ({teachers.length})</span>
            </h2>
            {isStudent && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Student Portal
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isFaculty
              ? 'Manage faculty profiles, editable profile photos, departmental appointments, and teaching loads.'
              : 'Browse professor profiles, contact information, departmental offices, and office hours.'}
          </p>
        </div>

        {/* Action Button: Only Faculty can Add Faculty */}
        {isFaculty && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Faculty Member</span>
          </button>
        )}
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
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((t) => {
          const workload = getTeacherWorkload(t.id);
          const maxH = t.maxHours || 20;
          const pct = Math.min(100, Math.round((workload / maxH) * 100));
          const scheduledPeriods = getTeacherPeriods(t.id);

          return (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-purple-300 dark:hover:border-purple-800 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3.5">
                    {/* Faculty Profile Photo */}
                    <div className="relative group">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/30 shadow-sm"
                      />
                      {isFaculty && (
                        <button
                          onClick={() => handleOpenEdit(t)}
                          title="Change Photo"
                          className="absolute inset-0 bg-slate-950/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {t.name}
                        </h4>
                        {t.shortCode && (
                          <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono border border-purple-200 dark:border-purple-800">
                            [{t.shortCode}]
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                        {t.designation}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {t.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{t.email}</span>
                  </div>
                  {t.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{t.phone}</span>
                    </div>
                  )}
                  <div className="pt-1 font-semibold text-slate-700 dark:text-slate-300">
                    Dept: {t.department}
                  </div>
                </div>

                {/* Allocated Teaching Periods List (from Photo) */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Assigned Periods ({scheduledPeriods.length})</span>
                    </span>
                    <button
                      onClick={() => setActivePage('timetable')}
                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Grid →
                    </button>
                  </div>

                  {scheduledPeriods.length > 0 ? (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {scheduledPeriods.map((sp, idx) => (
                        <div
                          key={sp.id || idx}
                          className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px]"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-extrabold text-slate-900 dark:text-white shrink-0">
                              {sp.day.slice(0, 3)}:
                            </span>
                            <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0 text-[10px]">
                              {sp.time}
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span
                              className="font-bold truncate"
                              style={{ color: sp.subjectColor }}
                            >
                              {sp.displayLabel || sp.subjectCode}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 shrink-0 ml-1.5 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-800">
                            {sp.roomName}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-400 text-center">
                      No schedule periods assigned yet
                    </div>
                  )}
                </div>
              </div>

              {/* Workload Progress */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-500" /> Weekly Schedule Load
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {workload} / {maxH} hrs ({pct}%)
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct > 100 ? 'bg-rose-500' : pct >= 75 ? 'bg-purple-600' : 'bg-blue-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Edit & Delete Controls (Only available for Faculty) */}
                {isFaculty && (
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 transition-colors flex items-center gap-1"
                      title="Edit Teacher Profile & Photo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Teacher"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Teacher Modal with Editable Profile Photo */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingTeacher ? 'Edit Faculty Profile & Photo' : 'Add New Faculty Member'}
                </h3>
                <p className="text-xs text-slate-400">
                  Update personal details, profile avatar, and teaching constraints
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Profile Photo Editor Section */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-purple-600" />
                  Faculty Profile Photo
                </label>

                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={formData.avatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-600 shadow-md shrink-0"
                  />

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload Image
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const nextPreset = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
                          setFormData((prev) => ({ ...prev, avatar: nextPreset }));
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition"
                      >
                        Random Avatar
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Supports PNG, JPG, or GIF (max 2MB), or paste a direct image URL below.
                    </p>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Quick Avatar Presets Selector */}
                <div className="mt-2.5 pt-2 border-t border-purple-100/60 dark:border-purple-900/30 flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    Presets:
                  </span>
                  {PRESET_AVATARS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Preset ${i + 1}`}
                      onClick={() => setFormData({ ...formData, avatar: url })}
                      className={`w-7 h-7 rounded-lg object-cover cursor-pointer ring-2 transition-all ${
                        formData.avatar === url
                          ? 'ring-purple-600 scale-110'
                          : 'ring-transparent opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
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
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
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
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Initials / Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RR, MA, NZ"
                    value={formData.shortCode || ''}
                    onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                    className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98350 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
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
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Teaching Schedule Breakdown in Modal */}
              {editingTeacher && (
                <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      Current Assigned Schedule ({getTeacherPeriods(editingTeacher.id).length} Periods)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setModalOpen(false);
                        setActivePage('timetable');
                      }}
                      className="text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:underline"
                    >
                      Open Grid to Edit →
                    </button>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {getTeacherPeriods(editingTeacher.id).map((sp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {sp.day.slice(0, 3)}: {sp.time}
                        </span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {sp.displayLabel || sp.subjectCode} ({sp.roomName})
                        </span>
                      </div>
                    ))}
                    {getTeacherPeriods(editingTeacher.id).length === 0 && (
                      <p className="text-[11px] text-slate-400">No scheduled periods currently.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-500/20"
                >
                  {editingTeacher ? 'Save Changes' : 'Add Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
