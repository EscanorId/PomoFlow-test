export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK' | 'ULTRADIAN' | 'ULTRADIAN_BREAK';

export type Mood = 'tired' | 'normal' | 'energetic';

export type ThemeSet = 'classic' | 'midnight' | 'forest' | 'sakura';

export type Language = 'id' | 'en';

export type CyclePreference = 'POMODORO' | 'ULTRADIAN';

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  totalDurationMinutes: number;
  isCompleted: boolean;
  isAiEstimated: boolean;
}

export interface PomoStats {
  sessionsCompleted: number;
  totalFocusTime: number;
  tasksCompleted: number;
  streak: number;
}

