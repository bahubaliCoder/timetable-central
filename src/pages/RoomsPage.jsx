import React, { useState } from 'react';
import { DoorOpen, Plus, Search, Edit2, Trash2, X, Users, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const RoomsPage = () => {
  const { rooms, addRoom, updateRoom, deleteRoom, timetables, isFaculty, isStudent } = useAdmin();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    building: 'Computing Tower',
    type: 'Classroom',
    capacity: 60,
    facilities: ['Projector', 'Whiteboard'],
    status: 'Available',
  });

  const [facilitiesInput, setFacilitiesInput] = useState('Projector, Whiteboard');

  const buildings = Array.from(new Set(rooms.map((r) => r.building))).sort();

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      building: buildings[0] || 'Computing Tower',
      type: 'Classroom',
      capacity: 60,
      facilities: ['Projector', 'Whiteboard'],
      status: 'Available',
    });
    setFacilitiesInput('Projector, Whiteboard');
    setModalOpen(true);
  };

  const handleOpenEdit = (rm) => {
    setEditingRoom(rm);
    setFormData(rm);
    setFacilitiesInput((rm.facilities || []).join(', '));
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const parsedFacilities = facilitiesInput.split(',').map((f) => f.trim()).filter(Boolean);
    const roomPayload = {
      ...formData,
      facilities: parsedFacilities,
    };

    if (editingRoom) {
      updateRoom(editingRoom.id, roomPayload);
    } else {
      addRoom(roomPayload);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this room from campus inventory?')) {
      deleteRoom(id);
    }
  };

  // Calculate how many periods this room is occupied
  const getRoomOccupancyCount = (rId) => {
    let count = 0;
    Object.values(timetables).forEach((slots) => {
      if (Array.isArray(slots)) {
        count += slots.filter((s) => s.roomId === rId).length;
      }
    });
    return count;
  };

  const filteredRooms = rooms.filter((r) => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.building.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-emerald-600" />
            <span>Campus Rooms & Laboratories ({rooms.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            Monitor classrooms, computer labs, lecture theaters, and audiovisual equipment.
          </p>
        </div>

        {isFaculty && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Room / Lab</span>
          </button>
        )}
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search rooms by name, building, equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Room Types</option>
          <option value="Lecture Hall">Lecture Hall</option>
          <option value="Classroom">Classroom</option>
          <option value="Computer Lab">Computer Lab</option>
          <option value="Auditorium">Auditorium</option>
          <option value="Tutorial Room">Tutorial Room</option>
        </select>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((r) => {
          const bookedPeriods = getRoomOccupancyCount(r.id);

          return (
            <div
              key={r.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-xs">
                    {r.type}
                  </span>

                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>Cap: {r.capacity}</span>
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-1">
                  {r.name}
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  Building: <strong>{r.building}</strong>
                </p>

                {/* Facilities Pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(r.facilities || []).map((fac) => (
                    <span
                      key={fac}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Occupancy summary */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  {bookedPeriods} Weekly Bookings
                </span>

                {isFaculty && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(r)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      title="Edit Room"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Room"
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

      {/* Add / Edit Room Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingRoom ? 'Edit Room / Lab' : 'Add Campus Room or Lab'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Room Name / Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hall 101 or Physics Lab 3"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Building
                  </label>
                  <input
                    type="text"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Auditorium">Auditorium</option>
                    <option value="Tutorial Room">Tutorial Room</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Facilities / Equipment (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4K Projector, Smart Board, AC"
                  value={facilitiesInput}
                  onChange={(e) => setFacilitiesInput(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                />
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
