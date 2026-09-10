import React, { useState } from 'react';
import {
  DoorOpen,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Check,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { DAYS_OF_WEEK } from '../data/mockData';
import { timeToMinutes, formatTimeDisplay } from '../utils/timeHelpers';

export const FreeRoomFinder = () => {
  const { classes, campusRooms, currentTime, settings } = useSchedule();

  const currentDayIndex = currentTime.getDay();
  const defaultDay = DAYS_OF_WEEK[currentDayIndex === 0 ? 6 : currentDayIndex - 1];

  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [selectedBuilding, setSelectedBuilding] = useState('all');

  const targetMinutes = timeToMinutes(selectedTime);

  // Find unique buildings
  const buildings = Array.from(new Set(campusRooms.map((r) => r.building))).sort();

  // Evaluate status of each room at selectedDay & selectedTime
  const roomsWithStatus = campusRooms.map((room) => {
    // Find if any class occupies this room on selectedDay around selectedTime
    const occupyingClass = classes.find((c) => {
      if (c.day !== selectedDay) return false;
      // Match room name loosely or strictly
      if (!c.room.toLowerCase().includes(room.name.toLowerCase()) && !room.name.toLowerCase().includes(c.room.toLowerCase())) {
        return false;
      }
      const startM = timeToMinutes(c.startTime);
      const endM = timeToMinutes(c.endTime);
      return targetMinutes >= startM && targetMinutes < endM;
    });

    return {
      ...room,
      isOccupied: Boolean(occupyingClass),
      occupyingClass,
    };
  });

  const filteredRooms = roomsWithStatus.filter((room) => {
    if (selectedBuilding !== 'all' && room.building !== selectedBuilding) return false;
    return true;
  });

  const freeRoomsCount = filteredRooms.filter((r) => !r.isOccupied).length;

  return (
    <div className="space-y-6">
      
      {/* Header info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-brand-600" />
            <span>Campus Free Room Finder</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Need an empty classroom for team discussions, club meetings, or quiet study? Check live room availability across campus.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{freeRoomsCount} of {filteredRooms.length} Rooms Available</span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center gap-4">
        
        {/* Day selection */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Select Day
          </label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
          >
            {DAYS_OF_WEEK.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Time selection */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Time Slot
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
          >
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="13:00">01:00 PM</option>
            <option value="14:00">02:00 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="16:00">04:00 PM</option>
            <option value="17:00">05:00 PM</option>
          </select>
        </div>

        {/* Building selection */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Campus Building
          </label>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Buildings</option>
            {buildings.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          return (
            <div
              key={room.id}
              className={`rounded-2xl p-5 border transition-all shadow-sm flex flex-col justify-between ${
                room.isOccupied
                  ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      room.isOccupied
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                    }`}
                  >
                    {room.isOccupied ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Occupied</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Available Now</span>
                      </>
                    )}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    <span>Cap: {room.capacity}</span>
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-1">
                  {room.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{room.building}</span>
                </p>

                {/* If occupied, show who is in there */}
                {room.isOccupied && room.occupyingClass && (
                  <div className="bg-white dark:bg-slate-800/80 rounded-xl p-3 border border-rose-200 dark:border-rose-900/50 text-xs mb-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {room.occupyingClass.code}: {room.occupyingClass.title}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {room.occupyingClass.instructor} • {room.occupyingClass.startTime} - {room.occupyingClass.endTime}
                    </div>
                  </div>
                )}

                {/* Facilities tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {room.facilities.map((fac) => (
                    <span
                      key={fac}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              {!room.isOccupied && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ready for Walk-In / Study Session
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
