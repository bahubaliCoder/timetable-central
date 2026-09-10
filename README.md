# TimeTable Central – Class Schedule & Academic Planner

> 🚀 **Live Demo**: [https://bahubalicoder.github.io/timetable-central/](https://bahubalicoder.github.io/timetable-central/)  
> 📦 **GitHub Repo**: [https://github.com/bahubaliCoder/timetable-central](https://github.com/bahubaliCoder/timetable-central)

A modern, responsive, and feature-complete web application designed for students, faculty, and academic departments to visualize, schedule, track attendance, and export university/school timetables.

Built with **React + Vite + Tailwind CSS + Lucide Icons**.

---

## Key Features

1. **Multi-View Class Schedule**:
   - **Weekly Interactive Grid**: Real-time layout showing Monday–Friday (or weekend inclusive) with customizable time slots (8:00 AM – 6:00 PM), category badges (Lecture, Lab, Tutorial, Seminar), room numbers, and professors.
   - **Daily Agenda Timeline**: Hour-by-hour linear timeline with active class highlights, progress bars, and lecture notes.
   - **Exams & Milestones**: Dedicated board for upcoming midterms, finals, practical vivas, and assignment deadlines.
   - **Free Room Finder**: Live vacancy checker for campus lecture halls, computer labs, and tutorial rooms by day and time slot.

2. **Live "Happening Now" & Up Next Banner**:
   - Live system-clock synced header showing current class, minutes remaining, location, and upcoming lecture countdown.
   - **Time Travel Demo Bar**: Simulate any day or hour (e.g. Monday 9:15 AM or Wednesday 2:30 PM) to preview live states instantaneously.

3. **Smart Conflict Detection**:
   - Automatic detection of overlapping time slots on the same day.
   - Immediate visual alerts and warnings on both the weekly schedule grid and inside the class scheduling modal.

4. **Attendance Tracker & Safe Bunks Calculator**:
   - Per-course attendance logging (Mark Attended / Missed).
   - Configurable target threshold (e.g. 75%, 80%, 85%).
   - Instantly calculates how many classes you can safely skip ("safe bunks") or how many consecutive classes you must attend to restore compliance.

5. **Calendar Export & Backup**:
   - **iCalendar (.ics)**: Download RFC-5545 standard `.ics` file for 1-click import into Google Calendar, Apple Calendar, or Outlook.
   - **Clean Print / PDF Layout**: Optimized print stylesheet for high-contrast paper prints or PDF export.
   - **JSON Export / Restore**: Full data persistence and easy transfer between devices.
   - **Multi-Major Presets**: Quick switch between Computer Science (B.Tech), Business Administration (MBA), and Pre-Med.

---

## Running the Application

In the project directory:

```bash
# Start development server
npm run dev
```

Then open `http://localhost:5174` in your browser.

To build for production:

```bash
npm run build
```

---

## Project Structure

```
timetable-central/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── context/
│   │   └── ScheduleContext.jsx   # State, local storage, conflicts, filters, presets
│   ├── data/
│   │   └── mockData.js          # CS, MBA, Pre-Med presets, rooms, colors
│   ├── utils/
│   │   └── timeHelpers.js       # Conflict detection, live clock, ICS export, attendance math
│   └── components/
│       ├── Navbar.jsx           # Top header, preset switch, theme toggle, export triggers
│       ├── LiveStatusBanner.jsx # Ongoing class countdown & time travel simulator
│       ├── StatsBar.jsx         # Summary cards (courses, weekly hours, attendance, conflicts)
│       ├── FilterBar.jsx        # Search, day, type, professor, and room filters
│       ├── WeeklyGrid.jsx       # 5/7 day interactive grid with click-to-add
│       ├── DailyAgenda.jsx      # Linear daily timeline with notes
│       ├── ExamsAndDeadlines.jsx# Exam cards, countdowns, and schedule form
│       ├── FreeRoomFinder.jsx   # Classroom occupancy status matrix
│       ├── ClassModal.jsx       # Add/Edit class modal with live conflict preview
│       ├── ClassDetailModal.jsx # Detailed class info, attendance +1/-1, notes
│       ├── AttendanceModal.jsx  # Safe bunks & target threshold calculator
│       └── ExportModal.jsx      # ICS download, print grid, and JSON backup
```
