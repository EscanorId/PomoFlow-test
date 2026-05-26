import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';
import { TimerMode, Language } from '../types';
import { getTranslation } from '../services/translations';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  mode: TimerMode;
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  focusLock: boolean;
  language: Language;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  timeLeft, 
  totalTime, 
  mode, 
  isActive, 
  onToggle, 
  onReset,
  focusLock,
  language
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - (totalTime > 0 ? (timeLeft / totalTime) : 0);

  const t = getTranslation(language);

  const getModeLabel = () => {
    switch (mode) {
      case 'FOCUS': return t.timerModeFocus;
      case 'SHORT_BREAK': return t.timerModeShortBreak;
      case 'LONG_BREAK': return t.timerModeLongBreak;
      case 'ULTRADIAN': return t.timerModeUltradian;
      case 'ULTRADIAN_BREAK': return t.timerModeUltradianBreak;
      default: return t.timerModeFocus;
    }
  };

  const [confirmReset, setConfirmReset] = React.useState(false);
  const resetTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleResetClick = () => {
    if (!isActive || !focusLock) {
      onReset();
      setConfirmReset(false);
      return;
    }

    if (confirmReset) {
      onReset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-6 w-full">
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Progress Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="115"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-white/5"
            style={{ cx: '50%', cy: '50%', r: '45%' }}
          />
          <motion.circle
            cx="128"
            cy="128"
            r="115"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={722}
            initial={{ strokeDashoffset: 722 }}
            animate={{ strokeDashoffset: 722 * (1 - progress) }}
            transition={{ duration: 1, ease: "linear" }}
            className="ring-accent"
            style={{ cx: '50%', cy: '50%', r: '45%' }}
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.p 
            key={mode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2 text-white/50 transition-all duration-1000"
          >
            {getModeLabel()}
          </motion.p>
          <h2 className="text-5xl sm:text-6xl font-light font-mono tabular-nums leading-none tracking-tight">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </h2>
          {focusLock && isActive && (
            <span className="text-[9px] text-white/30 tracking-widest uppercase mt-2 font-black flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              🔒 Focus Lock
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Reset Session Control */}
        <button
          onClick={handleResetClick}
          className={`p-3.5 rounded-2xl transition-all border ${
            confirmReset 
              ? 'bg-red-500 text-white border-red-600 scale-105 shadow-lg shadow-red-500/20' 
              : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border-white/5'
          }`}
          title={t.resetWarning}
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Big Start/Stop Focus Session Button */}
        <button
          onClick={onToggle}
          style={{ backgroundColor: 'var(--color-accent)' }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl text-slate-950 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none"
        >
          {isActive ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>

        {/* Spacer to align beautifully */}
        <div className="w-12 h-1" />
      </div>

      <AnimatePresence>
        {confirmReset && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 text-red-300 text-xs bg-red-950/20 px-4 py-2.5 rounded-2xl border border-red-500/30 font-sans"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="font-semibold">{t.resetWarning}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
