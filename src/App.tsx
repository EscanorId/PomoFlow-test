/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Share2, Palette, Info, HelpCircle, Shield, Music, Target, CheckCircle2, AlertCircle, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

import { TimerDisplay } from './components/TimerDisplay';
import { TaskList } from './components/TaskList';
import { MusicPlayer } from './components/MusicPlayer';
import { MoodModal } from './components/MoodModal';
import { ShareCard } from './components/ShareCard';
import { SettingsModal } from './components/SettingsModal';
import { ConfirmSwitchModal } from './components/ConfirmSwitchModal';
import { TimerMode, Mood, Task, PomoStats, ThemeSet, Language, CyclePreference } from './types';
import { getTranslation } from './services/translations';

const TIMER_CONFIG = {
  FOCUS: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
  ULTRADIAN: 90 * 60,
  ULTRADIAN_BREAK: 20 * 60,
};

export default function App() {
  // State
  const [language, setLanguage] = useState<Language>('id');
  const [cyclePreference, setCyclePreference] = useState<CyclePreference>('POMODORO');
  
  const [mode, setMode] = useState<TimerMode>('FOCUS');
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.FOCUS);
  const [isActive, setIsActive] = useState(false);
  const [mood, setMood] = useState<Mood>('normal');
  const [isMoodChecked, setIsMoodChecked] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [focusLock, setFocusLock] = useState(true);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);
  const [themeSet, setThemeSet] = useState<ThemeSet>('classic');
  const [showSettings, setShowSettings] = useState(false);
  
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Switch Intercept State
  const [pendingMode, setPendingMode] = useState<TimerMode | null>(null);

  // Statistics state
  const [stats, setStats] = useState<PomoStats>({
    sessionsCompleted: 0,
    totalFocusTime: 0,
    tasksCompleted: 0,
    streak: 1
  });
  const [showShareCard, setShowShareCard] = useState(false);

  const t = getTranslation(language);

  // Fetch active task object if exists
  const activeTask = useMemo(() => {
    return tasks.find(t => t.id === activeTaskId) || null;
  }, [tasks, activeTaskId]);

  // Apply Theme & Mode to documentElement data attributes for dynamic CSS styling
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeSet);
    document.documentElement.setAttribute('data-mode', mode);
  }, [themeSet, mode]);

  // Calculate dynamic default times based on mode and selected active task
  const getDefaultDurationForMode = useCallback((targetMode: TimerMode, taskObj: Task | null) => {
    // If it's a focus mode and user selected AI Estimating option
    if (targetMode === 'FOCUS' && taskObj && taskObj.isAiEstimated) {
      return taskObj.totalDurationMinutes * 60;
    }
    return TIMER_CONFIG[targetMode];
  }, []);

  // Update timer remaining when mode, activeTask changes (only if timer is not currently ticking)
  useEffect(() => {
    if (!isActive) {
      const duration = getDefaultDurationForMode(mode, activeTask);
      setTimeLeft(duration);
    }
  }, [mode, activeTask, getDefaultDurationForMode]);

  // Sound Alarm Handler
  const playAlarm = useCallback(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log("Silent browser play back policy triggered:", e));
  }, []);

  // Timer run loop tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Alarm & statistics handle completion
  const handleTimerComplete = () => {
    setIsActive(false);
    playAlarm();
    
    // Determine completed focus minutes
    const sessionDurationMinutes = Math.round(getDefaultDurationForMode(mode, activeTask) / 60);

    // Exploding Confetti Effect
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#a855f7', '#fda4af', '#f59e0b', '#10b981']
    });

    if (mode === 'FOCUS' || mode === 'ULTRADIAN') {
      const nextSessionCount = sessionCount + 1;
      setSessionCount(nextSessionCount);
      setIsMoodChecked(false);
      
      setStats(prev => ({
        ...prev,
        sessionsCompleted: prev.sessionsCompleted + 1,
        totalFocusTime: prev.totalFocusTime + sessionDurationMinutes
      }));

      // If active task is set, increment its completed pomodoros
      if (activeTaskId) {
        setTasks(prevTasks => prevTasks.map(t => {
          if (t.id === activeTaskId) {
            return { ...t, completedPomodoros: t.completedPomodoros + 1 };
          }
          return t;
        }));
      }

      // Sesi ke-4 otomatis trigger Long Break
      if (mode === 'FOCUS') {
        if (nextSessionCount % 4 === 0) {
          setMode('LONG_BREAK');
        } else {
          setMode('SHORT_BREAK');
        }
      } else {
        // Ultradian follows up with Ultradian Break
        setMode('ULTRADIAN_BREAK');
      }
    } else {
      // Return to focus session
      if (mode === 'ULTRADIAN_BREAK') {
        setMode('ULTRADIAN');
      } else {
        setMode('FOCUS');
      }
    }
  };

  // Toggle Timer Play/Pause
  const toggleTimer = () => {
    if (!isActive && (mode === 'FOCUS' || mode === 'ULTRADIAN') && !isMoodChecked) {
      // Mood check-in before the focus session starts
      setShowMoodModal(true);
      return;
    }
    setIsActive(!isActive);
  };

  // Reset current timer
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getDefaultDurationForMode(mode, activeTask));
    setIsMoodChecked(false);
  };

  // Switch modes manually with active checking
  const handleModeSwitchRequested = (targetMode: TimerMode) => {
    if (mode === targetMode) return;

    if (isActive) {
      // Hold transition, open double-verification alert modal
      setPendingMode(targetMode);
    } else {
      // Execute change instantly
      setMode(targetMode);
      const duration = getDefaultDurationForMode(targetMode, activeTask);
      setTimeLeft(duration);
      if (targetMode === 'FOCUS' || targetMode === 'ULTRADIAN') {
        setIsMoodChecked(false);
      }
    }
  };

  // Verify and execute pending switch
  const confirmModeSwitch = () => {
    if (pendingMode) {
      setIsActive(false);
      setMode(pendingMode);
      const duration = getDefaultDurationForMode(pendingMode, activeTask);
      setTimeLeft(duration);
      setPendingMode(null);
      if (pendingMode === 'FOCUS' || pendingMode === 'ULTRADIAN') {
        setIsMoodChecked(false);
      }
    }
  };

  // Reject transition
  const cancelModeSwitch = () => {
    setPendingMode(null);
  };

  // Mood selector complete callback
  const handleMoodSelect = (selectedMood: Mood) => {
    setMood(selectedMood);
    setIsMoodChecked(true);
    setShowMoodModal(false);
    setIsActive(true);
  };

  // Task Handlers
  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || '',
      estimatedPomodoros: taskData.estimatedPomodoros || 1,
      completedPomodoros: 0,
      totalDurationMinutes: taskData.totalDurationMinutes || 25,
      isCompleted: false,
      isAiEstimated: taskData.isAiEstimated || false
    };
    
    setTasks([newTask, ...tasks]);
    // Set as active task automatically so user can focus on it immediately
    setActiveTaskId(newTask.id);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.isCompleted;
        if (nextCompleted) {
          setStats(s => ({ ...s, tasksCompleted: s.tasksCompleted + 1 }));
        } else {
          setStats(s => ({ ...s, tasksCompleted: s.tasksCompleted - 1 }));
        }
        return { ...t, isCompleted: nextCompleted };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  };

  // Language mapping helper for display tabs
  const getModeTabLabel = (m: TimerMode) => {
    switch (m) {
      case 'FOCUS': return t.tabFocus;
      case 'SHORT_BREAK': return t.tabShortBreak;
      case 'LONG_BREAK': return t.tabLongBreak;
      case 'ULTRADIAN': return t.tabUltradian;
      case 'ULTRADIAN_BREAK': return t.tabUltradianBreak;
    }
  };

  // Change Cycle Preference in Settings Modal
  const handleSetCyclePreference = (pref: CyclePreference) => {
    setCyclePreference(pref);
    
    // Auto-adjust active mode if it doesn't match the active preference sequence
    if (pref === 'POMODORO') {
      if (mode === 'ULTRADIAN' || mode === 'ULTRADIAN_BREAK') {
        setIsActive(false);
        setMode('FOCUS');
        setTimeLeft(TIMER_CONFIG.FOCUS);
        setIsMoodChecked(false);
      }
    } else if (pref === 'ULTRADIAN') {
      if (mode === 'FOCUS' || mode === 'SHORT_BREAK' || mode === 'LONG_BREAK') {
        setIsActive(false);
        setMode('ULTRADIAN');
        setTimeLeft(TIMER_CONFIG.ULTRADIAN);
        setIsMoodChecked(false);
      }
    }
  };

  // Filter tab list based on active timer mode preference
  const visibleTabs: TimerMode[] = useMemo(() => {
    if (cyclePreference === 'POMODORO') {
      return ['FOCUS', 'SHORT_BREAK', 'LONG_BREAK'];
    } else {
      return ['ULTRADIAN', 'ULTRADIAN_BREAK'];
    }
  }, [cyclePreference]);

  return (
    <div className="min-h-screen pb-24 transition-colors duration-1000 theme-active font-sans selection:bg-white/20 relative overflow-x-hidden">
      
      {/* Decorative dynamic ambient glow */}
      <div 
        style={{ backgroundColor: 'var(--color-accent)' }}
        className="absolute top-[-300px] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.12] pointer-events-none transition-colors duration-1000" 
      />

      {/* Header section */}
      <header className="p-6 flex items-center justify-between max-w-5xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-3">
          <div 
            style={{ backgroundColor: 'var(--color-accent)' }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-1000"
          >
            <span className="text-slate-950 font-black text-xl italic">P</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
              {t.appTitle}
            </h1>
            <span className="text-[9px] uppercase tracking-widest font-extrabold text-white/30 leading-none">{t.appTagline}</span>
          </div>
        </div>

        {/* Header Action Strip */}
        <div className="flex items-center gap-2">
            {/* Language Preference Switcher instead of the old Rapor Sesi */}
            <button 
                onClick={() => setLanguage(l => l === 'id' ? 'en' : 'id')}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 border border-white/5 shadow-sm active:scale-95"
                title={language === 'id' ? 'Ganti Bahasa (Change Language)' : 'Ubah ke Bahasa Indonesia'}
            >
                <Globe className="w-4 h-4 text-[color:var(--color-accent)] transition-colors duration-1000" />
                <span>{language === 'id' ? 'IND' : 'ENG'}</span>
            </button>

            {/* Custom Settings button */}
            <button 
                onClick={() => setShowSettings(true)}
                style={{ borderColor: showSettings ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)' }}
                className="p-3 bg-white/5 hover:bg-white/10 border rounded-2xl text-white transition-all duration-300 shadow-sm active:scale-95"
                title={t.settingsTitle}
            >
                <Settings className="w-5 h-5 animate-spin-slow" />
            </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-5xl mx-auto px-6 pt-4 flex flex-col items-center relative z-10 w-full">
        
        {/* Switcher Tab List above the timer circle */}
        <div 
          style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}
          className="flex p-1.5 rounded-2xl border backdrop-blur-md mb-4 gap-1 transform transition-all duration-1000 max-w-full overflow-x-auto no-scrollbar scroll-smooth"
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleModeSwitchRequested(tab)}
              style={{
                backgroundColor: mode === tab ? 'var(--color-accent)' : 'transparent',
                color: mode === tab ? '#090d16' : 'rgba(255,255,255,0.6)'
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap ${
                mode === tab 
                  ? 'shadow-lg font-black' 
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              {getModeTabLabel(tab)}
            </button>
          ))}
        </div>

        {/* Display Info Card about currently active task */}
        {activeTask && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs bg-white/5 border border-white/5 px-4 py-2 rounded-full mb-2 max-w-md text-center"
          >
            <Target className="w-4 h-4 text-[color:var(--color-accent)] shrink-0 animate-pulse" />
            <span className="text-white/40">{t.activeFocusLabel}</span>
            <span className="text-white font-bold truncate max-w-[180px]">{activeTask.title}</span>
            {activeTask.isAiEstimated && (
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full">{t.aiEstimate}</span>
            )}
          </motion.div>
        )}

        {/* Core Timer View */}
        <div className="w-full flex flex-col items-center mb-8">
            <TimerDisplay 
                timeLeft={timeLeft}
                totalTime={getDefaultDurationForMode(mode, activeTask)}
                mode={mode}
                isActive={isActive}
                onToggle={toggleTimer}
                onReset={resetTimer}
                focusLock={focusLock}
                language={language}
            />

            {/* Backsound Ambient Sound Manager */}
            <MusicPlayer 
                mood={mood} 
                mode={mode} 
                isEnabled={isMusicEnabled}
                onToggleMusic={(val) => setIsMusicEnabled(val)}
                language={language}
                isTimerActive={isActive}
            />
        </div>

        {/* Dynamic List section and active highlight selector */}
        <div className="w-full flex justify-center">
            <TaskList 
                tasks={tasks}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                activeTaskId={activeTaskId}
                onSetActiveTask={(id) => setActiveTaskId(id)}
                language={language}
            />
        </div>
      </main>

      {/* Mood Picker Modal */}
      <AnimatePresence>
        {showMoodModal && <MoodModal onSelect={handleMoodSelect} language={language} />}
      </AnimatePresence>

      {/* Global Configuration Settings Picker */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            onClose={() => setShowSettings(false)}
            themeSet={themeSet}
            onSetThemeSet={(t) => setThemeSet(t)}
            focusLock={focusLock}
            onToggleFocusLock={() => setFocusLock(!focusLock)}
            isMusicEnabled={isMusicEnabled}
            onToggleMusicEnabled={() => setIsMusicEnabled(!isMusicEnabled)}
            sessionCount={stats.sessionsCompleted}
            language={language}
            onSetLanguage={(l) => setLanguage(l)}
            cyclePreference={cyclePreference}
            onSetCyclePreference={handleSetCyclePreference}
            onOpenReport={() => setShowShareCard(true)}
          />
        )}
      </AnimatePresence>

      {/* Switching Session Action Intercept Confirm Modal */}
      <AnimatePresence>
        <ConfirmModeSwitchModalWrapper 
          pendingMode={pendingMode}
          onConfirm={confirmModeSwitch}
          onCancel={cancelModeSwitch}
          language={language}
        />
      </AnimatePresence>

      {/* Sharing Milestone Banner */}
      <AnimatePresence>
          {showShareCard && (
              <ShareCard 
                stats={stats} 
                completedTasks={tasks.filter(t => t.isCompleted)}
                onClose={() => setShowShareCard(false)} 
                language={language}
              />
          )}
      </AnimatePresence>

      {/* Dynamic bottom floating overlay trackbar status */}
      <footer className="fixed bottom-0 left-0 w-full p-4 flex justify-center pointer-events-none z-40">
          <div className="bg-black/60 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/5 text-[10px] uppercase font-black tracking-[0.25em] opacity-80 text-white flex items-center gap-3 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-[color:var(--color-accent)] animate-ping" />
              <span>{t.sessionTracker} #{sessionCount + 1}</span>
              <span className="text-white/30">•</span>
              <span className="text-[color:var(--color-accent)]">{getModeTabLabel(mode)}</span>
          </div>
      </footer>
    </div>
  );
}

// Compact helper wrapper to keep main cleanly structured
function ConfirmModeSwitchModalWrapper({ pendingMode, onConfirm, onCancel, language }: {
  pendingMode: TimerMode | null;
  onConfirm: () => void;
  onCancel: () => void;
  language: Language;
}) {
  return (
    <ConfirmSwitchModal
      isOpen={pendingMode !== null}
      onConfirm={onConfirm}
      onCancel={onCancel}
      language={language}
    />
  );
}
