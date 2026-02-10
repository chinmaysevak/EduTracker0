import type { Subject, StudyTask } from '@/types';

// ============================================
// Attendance Predictive Math
// ============================================
export const calculateAttendanceSafeZone = (
    present: number,
    total: number,
    targetPercentage: number = 75
): { status: 'safe' | 'risk' | 'critical'; message: string; classesToAttend?: number; classesToMiss?: number } => {
    if (total === 0) return { status: 'safe', message: 'No classes yet' };

    const currentPercentage = (present / total) * 100;

    if (currentPercentage >= targetPercentage) {
        // How many can I miss?
        // (present) / (total + x) >= 0.75
        // present >= 0.75 * (total + x)
        // present / 0.75 >= total + x
        // (present / 0.75) - total >= x
        const safeToMiss = Math.floor((present / (targetPercentage / 100)) - total);

        return {
            status: 'safe',
            message: safeToMiss > 0
                ? `You can miss ${safeToMiss} classes safely`
                : 'You are safe, but keep attending',
            classesToMiss: safeToMiss
        };
    } else {
        // How many must I attend?
        // (present + x) / (total + x) >= 0.75
        // present + x >= 0.75 * total + 0.75 * x
        // x - 0.75 * x >= 0.75 * total - present
        // 0.25 * x >= 0.75 * total - present
        // x >= (0.75 * total - present) / 0.25
        const needed = Math.ceil(((targetPercentage / 100) * total - present) / (1 - (targetPercentage / 100)));

        return {
            status: currentPercentage < 60 ? 'critical' : 'risk',
            message: `You must attend ${needed} more classes to reach ${targetPercentage}%`,
            classesToAttend: needed
        };
    }
};

// ============================================
// Subject Priority Engine
// ============================================
export const calculateSubjectPriority = (
    subject: Subject,
    tasks: StudyTask[]
): number => {
    let score = 50; // Base score

    // 1. Difficulty Weight (20%)
    const difficulty = subject.difficulty || 3;
    score += (difficulty - 3) * 10;

    // 2. Exam Urgency (40%)
    if (subject.examDate) {
        const daysUntilExam = Math.ceil((new Date(subject.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysUntilExam <= 1) score += 40;
        else if (daysUntilExam <= 3) score += 30;
        else if (daysUntilExam <= 7) score += 20;
        else if (daysUntilExam <= 14) score += 10;
    }

    // 3. Task Load (20%)
    const pendingTasks = tasks.filter(t => t.subjectId === subject.id && t.status === 'pending');
    score += Math.min(pendingTasks.length * 5, 20);

    // 4. Topics Remaining (conceptual - using total topics if available)
    // Ideally we need 'completed topics' data, but we'll use a placeholder logic if we track syllabus later

    return Math.min(100, Math.max(0, score));
};

// ============================================
// Exam Readiness Score
// ============================================
export const calculateExamReadiness = (
    subject: Subject,
    attendancePercentage: number,
    assignmentsCompleted: number,
    totalAssignments: number
): { score: number; label: string; color: string } => {
    // Weighted Average
    // Attendance: 30%
    // Assignments/Tasks: 40%
    // Difficulty Adjustment: 30%

    let score = 0;

    // Attendance Part (Max 30)
    score += Math.min(attendancePercentage, 100) * 0.3;

    // Assignments Part (Max 40)
    const assignmentScore = totalAssignments > 0 ? (assignmentsCompleted / totalAssignments) * 100 : 50; // Default to 50 if no tasks
    score += assignmentScore * 0.4;

    // Difficulty Part (Inverse: Harder subject starts with lower readiness) (Max 30)
    // Difficulty 1 (Easy) -> +30
    // Difficulty 5 (Hard) -> +0
    const difficulty = subject.difficulty || 3;
    const difficultyBonus = (5 - difficulty) * 7.5; // Scale 1-5 to 0-30 range
    score += difficultyBonus;

    // Normalize
    score = Math.round(score);

    if (score >= 90) return { score, label: 'Exam Ready', color: 'text-emerald-500' };
    if (score >= 70) return { score, label: 'Good', color: 'text-blue-500' };
    if (score >= 40) return { score, label: 'Moderate', color: 'text-amber-500' };
    return { score, label: 'Not Ready', color: 'text-red-500' };
};

// ============================================
// Focus XP Calculator
// ============================================
export const calculateFocusXP = (minutes: number): number => {
    // Base: 10 XP per minute
    // Bonus: +50 XP for completing > 25 mins
    // Bonus: +100 XP for completing > 50 mins

    let xp = minutes * 10;
    if (minutes >= 25) xp += 50;
    if (minutes >= 50) xp += 100;

    return xp;
};
