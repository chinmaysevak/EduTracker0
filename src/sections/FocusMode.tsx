import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Play,
    Pause,
    Square,
    Clock,
    Flame,
    CheckCircle,
    Maximize2,
    X,
    AlertTriangle
} from "lucide-react";
import { useUserProfile, useSubjects } from "@/hooks/useData";
import { calculateFocusXP } from '@/lib/academicMath';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";

interface FocusModeProps {
    onExit: () => void;
}

export default function FocusMode({ onExit }: FocusModeProps) {
    const { subjects } = useSubjects();
    const { addXP } = useUserProfile();

    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 mins
    const [initialTime, setInitialTime] = useState(25 * 60);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [sessionComplete, setSessionComplete] = useState(false);
    const [earnedXP, setEarnedXP] = useState(0);

    // Timer Logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;

        if (isActive && !isPaused && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            completeSession();
        }

        return () => clearInterval(interval);
    }, [isActive, isPaused, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        if (!selectedSubject) {
            toast.error("Please select a subject first!");
            return;
        }
        setIsActive(true);
        setIsPaused(false);
    };

    const pauseTimer = () => setIsPaused(true);
    const resumeTimer = () => setIsPaused(false);

    const stopTimer = () => {
        if (window.confirm("Are you sure? You will lose progress for this session.")) {
            setIsActive(false);
            setIsPaused(false);
            setTimeLeft(initialTime);
            setIsActive(false);
        }
    };

    const completeSession = () => {
        setIsActive(false);
        setSessionComplete(true);

        // Calculate XP
        const minutesCompleted = Math.floor(initialTime / 60);
        const xp = calculateFocusXP(minutesCompleted);
        setEarnedXP(xp);

        addXP(xp);
        toast.success(`Session Complete! +${xp} XP`);
    };

    const setDuration = (minutes: number) => {
        setInitialTime(minutes * 60);
        setTimeLeft(minutes * 60);
    };

    if (sessionComplete) {
        return (
            <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
                <Card className="w-full max-w-md border-0 shadow-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white">
                    <CardContent className="p-8 text-center space-y-6">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold mb-2">Focus Master!</h2>
                            <p className="text-white/80">You stayed focused for {Math.floor(initialTime / 60)} minutes.</p>
                        </div>

                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-md border border-white/20">
                            <span className="text-sm font-medium uppercase tracking-wider opacity-70">XP Earned</span>
                            <div className="text-5xl font-black flex items-center justify-center gap-2 mt-2">
                                <Flame className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                                +{earnedXP}
                            </div>
                        </div>

                        <Button
                            className="w-full bg-white text-violet-600 hover:bg-white/90 font-bold"
                            onClick={() => {
                                setSessionComplete(false);
                                onExit();
                            }}
                        >
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 w-full max-w-lg space-y-8">
                {/* Header */}
                {!isActive && (
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">Focus Mode</h1>
                        <p className="text-muted-foreground">Eliminate distractions and boost your productivity.</p>
                    </div>
                )}

                {/* Timer Display */}
                <div className={`transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
                    <div className="relative flex items-center justify-center">
                        {/* Circular Progress (Visual only for now) */}
                        <div className="w-72 h-72 rounded-full border-8 border-muted flex items-center justify-center bg-card shadow-2xl relative overflow-hidden">
                            {isActive && (
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-violet-500/10 transition-all duration-1000 ease-linear"
                                    style={{ height: `${(timeLeft / initialTime) * 100}%` }}
                                />
                            )}
                            <div className="text-center z-10">
                                <div className="text-7xl font-mono font-bold tracking-tighter tabular-nums text-foreground">
                                    {formatTime(timeLeft)}
                                </div>
                                {isActive && (
                                    <div className="text-sm font-medium text-violet-500 animate-pulse mt-2">
                                        Focusing on {subjects.find(s => s.id === selectedSubject)?.name || 'Study'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4 items-center">
                    {!isActive && (
                        <div className="w-full space-y-4 animate-in slide-in-from-bottom-5">
                            <div className="grid grid-cols-3 gap-3">
                                {[25, 45, 60].map(mins => (
                                    <Button
                                        key={mins}
                                        variant={initialTime === mins * 60 ? "default" : "outline"}
                                        onClick={() => setDuration(mins)}
                                        className="h-12"
                                    >
                                        {mins} Min
                                    </Button>
                                ))}
                            </div>

                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select Subject to Study" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button size="lg" className="w-full h-14 text-lg gap-2 shadow-lg shadow-violet-500/20" onClick={startTimer}>
                                <Play className="w-5 h-5 fill-current" /> Start Session
                            </Button>

                            <Button variant="ghost" onClick={onExit} className="w-full">
                                <X className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                        </div>
                    )}

                    {isActive && (
                        <div className="flex gap-4 animate-in fade-in">
                            {isPaused ? (
                                <Button size="lg" onClick={resumeTimer} className="h-14 w-14 rounded-full p-0">
                                    <Play className="w-6 h-6 fill-current" />
                                </Button>
                            ) : (
                                <Button size="lg" variant="secondary" onClick={pauseTimer} className="h-14 w-14 rounded-full p-0">
                                    <Pause className="w-6 h-6 fill-current" />
                                </Button>
                            )}

                            <Button size="lg" variant="destructive" onClick={stopTimer} className="h-14 w-14 rounded-full p-0">
                                <Square className="w-5 h-5 fill-current" />
                            </Button>
                        </div>
                    )}
                </div>

                {isActive && (
                    <p className="text-center text-sm text-muted-foreground animate-pulse">
                        <Maximize2 className="w-3 h-3 inline mr-1" /> Full Screen Recommended
                    </p>
                )}
            </div>
        </div>
    );
}
