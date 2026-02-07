// ============================================
// Edu Tracker - Type Definitions
// ============================================

// Attendance Types
export type AttendanceStatus = 'present' | 'absent' | 'cancelled' | null;

export interface ExtraClass {
  id: string;
  name: string;
  color?: string;
  startTime?: string;
  endTime?: string;
  status: AttendanceStatus;
}

export interface DailyAttendance {
  date: string; // ISO date string (YYYY-MM-DD)
  subjects: Record<string, AttendanceStatus>; // subjectId -> status
  extraClasses?: ExtraClass[]; // One-time extra classes for this day
}

export interface Subject {
  id: string;
  name: string;
  color?: string;
}

// Study Material Types
export interface StudyMaterial {
  id: string;
  subjectId: string;
  title: string;
  type: 'note' | 'pdf' | 'link';
  content: string;
  createdAt: string;
}

// YouTube Playlist Types
export interface YouTubePlaylist {
  id: string;
  name: string;
  subjectId: string;
  url: string;
  description?: string;
  addedAt: string;
}

// Study Planner Types
export type TaskStatus = 'pending' | 'completed';

export interface StudyTask {
  id: string;
  subjectId: string;
  description: string;
  targetDate: string;
  status: TaskStatus;
  createdAt: string;
}

// Course Progress Types
export interface CourseProgress {
  subjectId: string;
  totalUnits: number;
  teacherCompletedUnits: number;
  studentCompletedUnits: number;
}

// Navigation Types
export type ModuleType = 
  | 'dashboard'
  | 'attendance'
  | 'materials'
  | 'learning-hub'
  | 'planner'
  | 'progress'
  | 'settings';

// Timetable Types
export interface TimetableSlot {
  subject: string;
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  day: string;
  slots: TimetableSlot[];
}

// Notification Types
export type NotificationType = 'attendance' | 'task' | 'material' | 'progress' | 'system';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: ModuleType;
}

// Import/Export Types
export interface EduTrackerExport {
  version: string;
  exportDate: string;
  data: {
    subjects: Subject[];
    attendance: DailyAttendance[];
    materials: StudyMaterial[];
    playlists: YouTubePlaylist[];
    tasks: StudyTask[];
    progress: CourseProgress[];
    notifications: Notification[];
    timetable: Record<string, string[]>;
    customTimes: Record<string, { startTime: string; endTime: string }[]>;
  };
}
