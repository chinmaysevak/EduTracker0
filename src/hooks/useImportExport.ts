// ============================================
// Import/Export Hook for EduTracker
// ============================================

import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';
import { clearAllFiles } from '@/lib/db';
import * as fflate from 'fflate';
import type { EduTrackerExport, Subject, DailyAttendance, StudyMaterial, YouTubePlaylist, StudyTask, CourseProgress, Notification } from '@/types';

export function useImportExport() {
  // Get direct access to localStorage setters
  const [, setSubjects] = useLocalStorage<Subject[]>('edu-tracker-subjects', []);
  const [, setAttendanceData] = useLocalStorage<DailyAttendance[]>('edu-tracker-attendance-v2', []);
  const [, setMaterials] = useLocalStorage<StudyMaterial[]>('edu-tracker-materials', []);
  const [, setPlaylists] = useLocalStorage<YouTubePlaylist[]>('edu-tracker-playlists', []);
  const [, setTasks] = useLocalStorage<StudyTask[]>('edu-tracker-tasks', []);
  const [, setProgressData] = useLocalStorage<CourseProgress[]>('edu-tracker-progress', []);
  const [, setNotifications] = useLocalStorage<Notification[]>('edu-tracker-notifications', []);
  const [, setTimetableData] = useLocalStorage<Record<string, string[]>>('edu-tracker-timetable-data', {});
  const [, setCustomTimes] = useLocalStorage<Record<string, { startTime: string; endTime: string }[]>>('edu-tracker-timetable-times', {});

  // Get current data for export
  const getCurrentData = () => {
    const subjects = JSON.parse(localStorage.getItem('edu-tracker-subjects') || '[]');
    const attendance = JSON.parse(localStorage.getItem('edu-tracker-attendance-v2') || '[]');
    const materials = JSON.parse(localStorage.getItem('edu-tracker-materials') || '[]');
    const playlists = JSON.parse(localStorage.getItem('edu-tracker-playlists') || '[]');
    const tasks = JSON.parse(localStorage.getItem('edu-tracker-tasks') || '[]');
    const progress = JSON.parse(localStorage.getItem('edu-tracker-progress') || '[]');
    const notifications = JSON.parse(localStorage.getItem('edu-tracker-notifications') || '[]');
    const timetable = JSON.parse(localStorage.getItem('edu-tracker-timetable-data') || '{}');
    const customTimes = JSON.parse(localStorage.getItem('edu-tracker-timetable-times') || '{}');

    return {
      subjects,
      attendance,
      materials,
      playlists,
      tasks,
      progress,
      notifications,
      timetable,
      customTimes
    };
  };

  // Export all data to JSON
  const exportData = () => {
    try {
      const currentData = getCurrentData();

      const exportData: EduTrackerExport = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        data: currentData
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      // Create download link
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `edutracker-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
      return false;
    }
  };

  // Import data from JSON or ZIP file
  const importData = async (file: File, password?: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const readFile = async () => {
        try {
          let content: string;

          if (file.name.match(/\.(zip|ajbak)$/i)) {
            // Read file as ArrayBuffer
            const buffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(buffer);

            // Use fflate to unzip
            // fflate.unzip supports password option
            // Note: fflate types for unzip might need careful handling

            // We need to use callback style or promisify it
            const unzipOptions: fflate.UnzipOptions = {
              // filter?
            };
            if (password) {
              unzipOptions.password = password;
            }

            fflate.unzip(uint8Array, unzipOptions, (err, unzipped) => {
              if (err) {
                if (err.message?.includes('encrypted') || err.message?.includes('password')) {
                  reject(new Error('PASSWORD_REQUIRED'));
                } else if (err.message?.includes('data')) { // fflate generic error for bad password often
                  // If password was provided but failed
                  if (password) reject(new Error('INVALID_PASSWORD'));
                  else reject(new Error('PASSWORD_REQUIRED'));
                } else {
                  reject(err);
                }
                return;
              }

              // Parse unzipped content
              // Find json file
              const jsonFilename = Object.keys(unzipped).find(name => name.endsWith('.json') && !name.startsWith('__MACOSX'));

              if (!jsonFilename) {
                reject(new Error('No JSON data file found in the archive.'));
                return;
              }

              const jsonContent = fflate.strFromU8(unzipped[jsonFilename]);
              processImport(jsonContent, resolve, reject);
            });

          } else {
            // Assume text/json
            content = await file.text();
            processImport(content, resolve, reject);
          }
        } catch (error: any) {
          reject(error);
        }
      };

      readFile();
    });
  };

  const processImport = (content: string, resolve: (val: boolean) => void, reject: (err: any) => void) => {
    try {
      let importedData: any;
      try {
        importedData = JSON.parse(content);
      } catch (e) {
        throw new Error('Invalid JSON content in file.');
      }

      // ----------------------------------------------------------------
      // DATA MAPPING LOGIC
      // ----------------------------------------------------------------

      let dataToImport = importedData.data;

      // Handle raw migrations or different structures
      if (!dataToImport && !importedData.version) {
        // Fallback: simple check if it has known keys
        if (importedData.subjects || importedData.attendance || importedData.tasks) {
          dataToImport = importedData;
        }
      }

      if (!dataToImport) {
        throw new Error('Invalid data structure. Could not find recognizable EduTracker data.');
      }

      const data = dataToImport;

      // Import all data with validation
      if (data.subjects && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
      }

      if (data.attendance && Array.isArray(data.attendance)) {
        setAttendanceData(data.attendance);
      }

      if (data.materials && Array.isArray(data.materials)) {
        setMaterials(data.materials);
      }

      if (data.playlists && Array.isArray(data.playlists)) {
        setPlaylists(data.playlists);
      }

      if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      }

      if (data.progress && Array.isArray(data.progress)) {
        setProgressData(data.progress);
      }

      if (data.notifications && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      }

      if (data.timetable && typeof data.timetable === 'object') {
        setTimetableData(data.timetable);
      }

      if (data.customTimes && typeof data.customTimes === 'object') {
        setCustomTimes(data.customTimes);
      }

      toast.success('Data imported successfully!');
      setTimeout(() => window.location.reload(), 1500); // Reload to reflect changes
      resolve(true);

    } catch (error) {
      console.error('Process import failed:', error);
      reject(error);
      toast.error('Failed to process data');
      resolve(false);
    }
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      const keys = [
        'edu-tracker-subjects',
        'edu-tracker-attendance-v2',
        'edu-tracker-materials',
        'edu-tracker-playlists',
        'edu-tracker-tasks',
        'edu-tracker-progress',
        'edu-tracker-notifications',
        'edu-tracker-timetable-data',
        'edu-tracker-timetable-times'
      ];

      keys.forEach(key => {
        localStorage.removeItem(key);
      });

      // Clear IndexedDB files
      try {
        await clearAllFiles();
      } catch (e) {
        console.error('Failed to clear IndexedDB:', e);
      }

      // Reload the page to reset the state
      window.location.reload();

      toast.success('All data cleared successfully!');
      return true;
    } catch (error) {
      console.error('Clear data failed:', error);
      toast.error('Failed to clear data');
      return false;
    }
  };

  return {
    exportData,
    importData,
    clearAllData
  };
}
