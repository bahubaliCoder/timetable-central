import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  FileJson,
  Upload,
  Calendar,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { PRESET_SCHEDULES } from '../data/mockData';

export const ExportModal = () => {
  const {
    activeModal,
    setActiveModal,
    classes,
    exams,
    presetId,
    activePresetInfo,
    downloadICSFile,
    importScheduleJSON,
    switchPreset,
  } = useSchedule();

  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState(null);

  if (activeModal !== 'export') return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const backupData = {
      presetTitle: activePresetInfo.title,
      exportedAt: new Date().toISOString(),
      classes,
      exams,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;

    const res = importScheduleJSON(importJsonText);
    if (res.success) {
      setImportStatus({ success: true, message: 'Schedule imported successfully!' });
      setTimeout(() => {
        setActiveModal(null);
      }, 1200);
    } else {
      setImportStatus({ success: false, message: res.error || 'Import failed.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200 dark:border-brand-800">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Export, Sync & Backup
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transfer your schedule to mobile calendar apps or print physical sheets.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Options */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* 1. iCalendar (.ics) Sync */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-brand-600" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Export to Calendar (.ics)
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Imports directly into Google Calendar, Apple iCal, Outlook, or smartphone calendar.
              </p>
            </div>

            <button
              onClick={downloadICSFile}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors shrink-0"
            >
              Download .ics
            </button>
          </div>

          {/* 2. Print / PDF */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Printer className="w-4 h-4 text-brand-600" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Print or Save as PDF
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Formats a clean, high-contrast black-and-white grid layout for printers or PDF export.
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold transition-colors shrink-0"
            >
              Print Grid
            </button>
          </div>

          {/* 3. JSON Backup */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <FileJson className="w-4 h-4 text-brand-600" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Full JSON Backup
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Save classes, attendance records, and exams to a reusable JSON file.
              </p>
            </div>

            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold transition-colors shrink-0"
            >
              Export JSON
            </button>
          </div>

          {/* 4. JSON Import Form */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Restore or Import JSON</span>
            </h4>

            <form onSubmit={handleImportSubmit} className="space-y-2">
              <textarea
                rows={3}
                placeholder="Paste exported JSON timetable data here..."
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-brand-500"
              />

              {importStatus && (
                <div
                  className={`text-xs p-2 rounded-lg flex items-center gap-2 ${
                    importStatus.success
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  }`}
                >
                  {importStatus.success ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!importJsonText.trim()}
                  className="px-3 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors"
                >
                  Restore Timetable
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
