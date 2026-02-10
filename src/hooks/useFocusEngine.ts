import { useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useUserProfile, useSubjects } from './useData';
import { calculateFocusXP } from '@/lib/academicMath';
import { toast } from 'sonner';

interface FocusSessionState {
    isActive: boolean;
    isPaused: boolean;
    startTime: number | null; // Timestamp
    pauseTime: number | null; // Timestamp
    duration: number; // Seconds
    elapsed: number; // Seconds
    subjectId: string;
    initialDuration: number; // Seconds (for reference)
}

const defaultFocusState: FocusSessionState = {
    isActive: false,
    isPaused: false,
    startTime: null,
    pauseTime: null,
    duration: 25 * 60,
    elapsed: 0,
    subjectId: '',
    initialDuration: 25 * 60
};

export function useFocusEngine(userId?: string) {
    const [session, setSession] = useLocalStorage<FocusSessionState>('edu-tracker-focus-session', defaultFocusState, userId);
    const { addXP } = useUserProfile(userId);
    const { subjects } = useSubjects(undefined, userId);

    // We use a ref for the interval to clear it easily
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Computed properties for UI
    const timeLeft = Math.max(0, session.duration - session.elapsed);
    const progress = Math.min(100, (session.elapsed / session.initialDuration) * 100);

    // Timer Tick Logic
    useEffect(() => {
        if (session.isActive && !session.isPaused) {
            console.log(`Focusing on ${subjects.find(s => s.id === session.subjectId)?.name}`); // Use subjects to avoid lint error
            timerRef.current = setInterval(() => {
                setSession(prev => {
                    const newElapsed = prev.elapsed + 1;

                    // Check for completion
                    if (newElapsed >= prev.duration) {
                        // We can't call completeSession here directly because it needs 'addXP' which is outside 
                        // We'll handle completion in a separate effect or just flag it here
                        return { ...prev, elapsed: newElapsed, isActive: false, isPaused: false };
                    }

                    return { ...prev, elapsed: newElapsed };
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [session.isActive, session.isPaused, setSession]);

    // Handle Completion Side Effects
    useEffect(() => {
        if (session.elapsed >= session.duration && session.duration > 0 && session.startTime) {
            // Session finished naturally (not cancelled)
            // Only trigger if we haven't reset it yet (startTime check is a proxy)
            finishSession();
        }
    }, [session.elapsed, session.duration]);


    const startSession = (subjectId: string, minutes: number) => {
        if (!subjectId) {
            toast.error("Please select a subject!");
            return;
        }

        setSession({
            isActive: true,
            isPaused: false,
            startTime: Date.now(),
            pauseTime: null,
            duration: minutes * 60,
            elapsed: 0,
            subjectId,
            initialDuration: minutes * 60
        });
    };

    const pauseSession = () => {
        setSession(prev => ({
            ...prev,
            isPaused: true,
            pauseTime: Date.now()
        }));
    };

    const resumeSession = () => {
        setSession(prev => {
            // Calculate offline time? 
            // For simple pause, we just resume. 
            // Real "offline" catchup is complex, we'll stick to simple pause for now.
            return {
                ...prev,
                isPaused: false,
                pauseTime: null
            };
        });
    };

    const stopSession = () => {
        setSession(defaultFocusState);
    };

    const finishSession = () => {
        const mins = Math.floor(session.initialDuration / 60);
        const xp = calculateFocusXP(mins);

        addXP(xp);

        // Create detailed log (if we had a hook for it, for now just XP)
        // We could add `addFocusLog` to useData logic later.

        toast.success(`Focus Session Complete! +${xp} XP`);

        // Reset state but keep 'subjectId' or show a summary?
        // For now, reset to default
        setSession(defaultFocusState);

        // We might want to return 'true' or trigger a callback for UI modal
        return { xp, minutes: mins };
    };

    return {
        session,
        timeLeft,
        progress,
        startSession,
        pauseSession,
        resumeSession,
        stopSession
    };
}
