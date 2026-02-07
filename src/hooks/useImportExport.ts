// ============================================
// Import/Export Hook for EduTracker
// ============================================

import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';
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

  // Import data from JSON file
  const importData = (file: File) => {
    return new Promise<boolean>((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedData: EduTrackerExport = JSON.parse(content);

          // Validate the imported data structure
          if (!importedData.version || !importedData.data) {
            throw new Error('Invalid file format');
          }

          const { data } = importedData;

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
          resolve(true);
        } catch (error) {
          console.error('Import failed:', error);
          toast.error('Failed to import data. Please check the file format.');
          resolve(false);
        }
      };

      reader.onerror = () => {
        toast.error('Failed to read the file');
        resolve(false);
      };

      reader.readAsText(file);
    });
  };

  // Clear all data
  const clearAllData = () => {
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
