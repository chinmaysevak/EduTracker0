// ============================================
// Dashboard - Professional Design
// ============================================

import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen,
  CalendarCheck,
  ClipboardList,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Quote,
  Target,
  Award,
  Pencil,
  Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { ModuleType } from '@/types';
import { 
  useSubjects, 
  useAttendance, 
  useTimetable, 
  useStudyTasks, 
  useCourseProgress 
} from '@/hooks/useData';

interface DashboardProps {
  onNavigate: (module: ModuleType) => void;
  dailyQuote: { text: string; author: string };
}

const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Dashboard({ onNavigate, dailyQuote }: DashboardProps) {
  const { subjects } = useSubjects();
  const { getOverallAttendance, calculateSubjectAttendance } = useAttendance();
  const { getWeekSchedule, getTodayClasses, updateClass } = useTimetable();
  const { getPendingTasks, getOverdueTasks } = useStudyTasks();
  const { getOverallProgress } = useCourseProgress();

  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [editingSlot, setEditingSlot] = useState<{ dayName: string; index: number; subject: string; startTime: string; endTime: string } | null>(null);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const weekSchedule = getWeekSchedule();
  const todayClasses = getTodayClasses();

  const openEditTime = (dayName: string, index: number, subject: string, startTime: string, endTime: string) => {
    setEditingSlot({ dayName, index, subject, startTime, endTime });
    setEditStartTime(startTime);
    setEditEndTime(endTime);
  };

  const saveEditTime = () => {
    if (!editingSlot) return;
    updateClass(editingSlot.dayName, editingSlot.index, { startTime: editStartTime, endTime: editEndTime });
    setEditingSlot(null);
  };

  const overallAttendance = getOverallAttendance();
  const overallProgress = getOverallProgress();
  const pendingTasksCount = getPendingTasks().length;
  const overdueTasksCount = getOverdueTasks().length;

  const navigateDay = (direction: 'prev' | 'next') => {
    setSelectedDay(prev => {
      if (direction === 'prev') return prev === 0 ? 6 : prev - 1;
      return prev === 6 ? 0 : prev + 1;
    });
  };

  const isToday = (dayIndex: number) => dayIndex === new Date().getDay();

  const handlePrintSchedule = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let html = '<!DOCTYPE html><html><head><title>Weekly Schedule - EduTrack</title><style>body{font-family:system-ui,sans-serif;padding:24px;max-width:600px;margin:0 auto;} h1{font-size:20px;margin-bottom:16px;} .day{margin-bottom:20px;border:1px solid #e5e7eb;border-radius:12px;padding:12px;} .day h2{font-size:14px;margin:0 0 8px 0;color:#6b7280;} .class{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f3f4f6;} .class:last-child{border-bottom:0;} .time{font-size:12px;color:#6b7280;}</style></head><body><h1>Weekly Schedule – EduTrack</h1>';
    weekSchedule.forEach((daySchedule, idx) => {
      html += `<div class="day"><h2>${days[idx]}</h2>`;
      if (daySchedule.classes.length === 0) {
        html += '<p class="time">No classes</p>';
      } else {
        daySchedule.classes.forEach((cls: { subject: string; startTime: string; endTime: string }) => {
          html += `<div class="class"><span>${cls.subject}</span><span class="time">${cls.startTime} – ${cls.endTime}</span></div>`;
        });
      }
      html += '</div>';
    });
    html += '</body></html>';
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); win.close(); }, 300);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section with Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <Card className="lg:col-span-2 card-professional overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold">
                  {(() => {
                    const name = typeof window !== 'undefined' ? localStorage.getItem('edu-tracker-user-name') || '' : '';
                    const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';
                    return name ? `${greeting}, ${name}` : greeting;
                  })()}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  You have {todayClasses.length} classes today and {pendingTasksCount} tasks pending
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white">
                <Award className="w-6 h-6" />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button className="btn-primary rounded-lg" onClick={() => onNavigate('attendance')}>
                <CalendarCheck className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
              <Button variant="outline" className="rounded-lg" onClick={() => onNavigate('planner')}>
                <ClipboardList className="w-4 h-4 mr-2" />
                View Tasks
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Quote Card */}
        <Card className="card-professional bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Quote className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Daily Inspiration</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed italic">
              "{dailyQuote.text}"
            </p>
            <p className="text-xs text-muted-foreground mt-3">— {dailyQuote.author}</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-professional hover-lift cursor-pointer" onClick={() => onNavigate('attendance')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className={`text-xs font-medium ${overallAttendance.percentage >= 75 ? 'text-emerald-600' : overallAttendance.percentage >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                {overallAttendance.percentage}%
              </span>
            </div>
            <p className="text-2xl font-semibold">{overallAttendance.present}</p>
            <p className="text-sm text-muted-foreground">Classes Present</p>
            <Progress value={overallAttendance.percentage} className="h-1.5 mt-3" />
          </CardContent>
        </Card>

        <Card className="card-professional hover-lift cursor-pointer" onClick={() => onNavigate('planner')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              {overdueTasksCount > 0 && (
                <span className="text-xs font-medium text-red-600">{overdueTasksCount} overdue</span>
              )}
            </div>
            <p className="text-2xl font-semibold">{pendingTasksCount}</p>
            <p className="text-sm text-muted-foreground">Pending Tasks</p>
          </CardContent>
        </Card>

        <Card className="card-professional hover-lift cursor-pointer" onClick={() => onNavigate('progress')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-semibold">{overallProgress}%</p>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <Progress value={overallProgress} className="h-1.5 mt-3" />
          </CardContent>
        </Card>

        <Card className="card-professional hover-lift cursor-pointer" onClick={() => onNavigate('attendance')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-semibold">{todayClasses.length}</p>
            <p className="text-sm text-muted-foreground">Today's Classes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <Card className="lg:col-span-2 card-professional">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Weekly Schedule</h3>
                  <p className="text-sm text-muted-foreground">{weekSchedule[selectedDay]?.day}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-8 rounded-lg gap-1.5" onClick={handlePrintSchedule} title="Print schedule">
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Print</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigateDay('prev')} className="h-8 w-8">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigateDay('next')} className="h-8 w-8">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4 gap-1 overflow-x-auto pb-1">
              {shortDays.map((day, index) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(index)}
                  className={`flex flex-col items-center p-2 rounded-xl min-w-[52px] max-w-[60px] transition-all flex-shrink-0 ${
                    selectedDay === index 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'hover:bg-muted'
                  } ${isToday(index) ? 'ring-1 ring-border' : ''}`}
                >
                  <span className="text-xs font-medium truncate">{day}</span>
                  <span className="text-lg font-semibold mt-0.5">
                    {weekSchedule[index]?.classes.length || 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {weekSchedule[selectedDay]?.classes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No classes on {weekSchedule[selectedDay]?.day}</p>
                </div>
              ) : (
                weekSchedule[selectedDay]?.classes.map((cls, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="w-1 h-8 bg-primary/30 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{cls.subject}</p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-md">
                      {cls.startTime} - {cls.endTime}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => openEditTime(weekSchedule[selectedDay].day, idx, cls.subject, cls.startTime, cls.endTime)}
                      title="Edit time"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit time dialog */}
        <Dialog open={!!editingSlot} onOpenChange={(open) => !open && setEditingSlot(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit class time</DialogTitle>
            </DialogHeader>
            {editingSlot && (
              <>
                <p className="text-sm text-muted-foreground">{editingSlot.subject} — {editingSlot.dayName}</p>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-start">Start time</Label>
                      <Input
                        id="edit-start"
                        type="time"
                        value={editStartTime}
                        onChange={(e) => setEditStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-end">End time</Label>
                      <Input
                        id="edit-end"
                        type="time"
                        value={editEndTime}
                        onChange={(e) => setEditEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingSlot(null)}>Cancel</Button>
                  <Button onClick={saveEditTime}>Save</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Quick Actions & Subjects */}
        <div className="space-y-6">
          <Card className="card-professional">
            <CardHeader className="pb-3">
              <h3 className="font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-1.5 rounded-xl" onClick={() => onNavigate('attendance')}>
                  <CalendarCheck className="w-4 h-4" />
                  <span className="text-xs">Attendance</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-1.5 rounded-xl" onClick={() => onNavigate('planner')}>
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-xs">Add Task</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-1.5 rounded-xl" onClick={() => onNavigate('learning-hub')}>
                  <PlayCircle className="w-4 h-4" />
                  <span className="text-xs">Learning</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-1.5 rounded-xl" onClick={() => onNavigate('materials')}>
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs">Materials</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Subjects</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onNavigate('attendance')}>
                  View All <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {subjects.slice(0, 5).map(subject => {
                  const stats = calculateSubjectAttendance(subject.id);
                  return (
                    <div 
                      key={subject.id} 
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => onNavigate('attendance')}
                    >
                      <div 
                        className="w-2 h-10 rounded-full" 
                        style={{ backgroundColor: subject.color || '#666' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{subject.name}</p>
                        <p className="text-xs text-muted-foreground">{stats.present}/{stats.total} classes</p>
                      </div>
                      <span className={`text-sm font-semibold ${
                        stats.percentage >= 75 ? 'text-emerald-600' : 
                        stats.percentage >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {stats.percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
