import React from 'react';
import { motion } from 'motion/react';
import { X, Palette, Shield, Info, Music, Trophy, Globe, Zap, Clock } from 'lucide-react';
import { ThemeSet, Language, CyclePreference } from '../types';
import { getTranslation } from '../services/translations';

interface SettingsModalProps {
  onClose: () => void;
  themeSet: ThemeSet;
  onSetThemeSet: (theme: ThemeSet) => void;
  focusLock: boolean;
  onToggleFocusLock: () => void;
  isMusicEnabled: boolean;
  onToggleMusicEnabled: () => void;
  sessionCount: number;
  language: Language;
  onSetLanguage: (lang: Language) => void;
  cyclePreference: CyclePreference;
  onSetCyclePreference: (pref: CyclePreference) => void;
  onOpenReport: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  themeSet,
  onSetThemeSet,
  focusLock,
  onToggleFocusLock,
  isMusicEnabled,
  onToggleMusicEnabled,
  sessionCount,
  language,
  onSetLanguage,
  cyclePreference,
  onSetCyclePreference,
  onOpenReport,
}) => {
  const t = getTranslation(language);

  const palettes = [
    {
      id: 'classic' as ThemeSet,
      name: t.themeClassicName,
      desc: t.themeClassicDesc,
      colorPreview: 'from-amber-600 to-stone-500',
      tag: t.tagCozy
    },
    {
      id: 'midnight' as ThemeSet,
      name: t.themeMidnightName,
      desc: t.themeMidnightDesc,
      colorPreview: 'from-indigo-900 to-purple-600',
      tag: t.tagNeon
    },
    {
      id: 'forest' as ThemeSet,
      name: t.themeForestName,
      desc: t.themeForestDesc,
      colorPreview: 'from-emerald-700 to-yellow-600',
      tag: t.tagEarthy
    },
    {
      id: 'sakura' as ThemeSet,
      name: t.themeSakuraName,
      desc: t.themeSakuraDesc,
      colorPreview: 'from-rose-500 to-fuchsia-600',
      tag: t.tagBlossom
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}
        className="w-full max-w-lg border rounded-[32px] shadow-2xl overflow-hidden transition-all duration-1000 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[color:var(--color-accent)] animate-pulse" />
            <h2 className="text-xl font-black text-white">{t.settingsTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all outline-none"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* 1. Language Preference Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-white/60" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-white/80">{t.languageSetting}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onSetLanguage('id')}
                style={{ 
                  borderColor: language === 'id' ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                  backgroundColor: language === 'id' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'
                }}
                className="p-4 rounded-2xl border text-center font-extrabold text-sm text-gray-200 hover:bg-white/[0.04] transition-all flex flex-col items-center gap-1.5"
              >
                <span>🇮🇩 Bahasa Indonesia</span>
                {language === 'id' && <span className="text-[10px] text-[color:var(--color-accent)] font-black uppercase tracking-widest">Aktif</span>}
              </button>

              <button
                onClick={() => onSetLanguage('en')}
                style={{ 
                  borderColor: language === 'en' ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                  backgroundColor: language === 'en' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'
                }}
                className="p-4 rounded-2xl border text-center font-extrabold text-sm text-gray-200 hover:bg-white/[0.04] transition-all flex flex-col items-center gap-1.5"
              >
                <span>🇺🇸 English</span>
                {language === 'en' && <span className="text-[10px] text-[color:var(--color-accent)] font-black uppercase tracking-widest">Active</span>}
              </button>
            </div>
          </div>

          {/* 2. Timer Mode Preference Cycle */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-white/60" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-white/80">{t.cycleTitle}</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                { id: 'POMODORO' as CyclePreference, title: t.cyclePomodoroTitle, desc: t.cyclePomodoroDesc },
                { id: 'ULTRADIAN' as CyclePreference, title: t.cycleUltradianTitle, desc: t.cycleUltradianDesc }
              ].map((cycle) => (
                <button
                  key={cycle.id}
                  onClick={() => onSetCyclePreference(cycle.id)}
                  style={{
                    borderColor: cyclePreference === cycle.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                    backgroundColor: cyclePreference === cycle.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)'
                  }}
                  className="w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-start gap-3.5 hover:bg-white/[0.04]"
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${cyclePreference === cycle.id ? 'bg-amber-500/10 text-[color:var(--color-accent)]' : 'bg-white/5 text-white/30'}`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm mb-1">{cycle.title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed">{cycle.desc}</p>
                  </div>
                  {cyclePreference === cycle.id && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[color:var(--color-accent)] rounded-bl-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Session Report Launcher inside Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-white/60" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-white/80">{t.generateReport}</h3>
            </div>
            
            <button
              onClick={() => {
                onClose();
                onOpenReport();
              }}
              style={{
                borderColor: 'var(--color-accent)',
                backgroundColor: 'rgba(245, 158, 11, 0.08)'
              }}
              className="w-full p-4 rounded-2xl border hover:bg-amber-500/15 text-white transition-all flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] rounded-xl group-hover:scale-105 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-sm text-white">{t.generateReport}</p>
                  <p className="text-[11px] text-white/50">{t.sessionsToday}: {sessionCount}</p>
                </div>
              </div>
              <span className="text-[10px] text-[color:var(--color-accent)] uppercase tracking-wider font-extrabold px-3 py-1 rounded-lg border border-amber-500/25 bg-amber-500/5 group-hover:scale-105 transition-transform">{t.selectLabel} →</span>
            </button>
          </div>

          {/* 4. Theme Selection Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-white/60" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-white/80">{t.themeTitle}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {palettes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSetThemeSet(p.id)}
                  style={{ 
                    borderColor: themeSet === p.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                    backgroundColor: themeSet === p.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)'
                  }}
                  className="w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-sm text-white group-hover:text-[color:var(--color-accent)] transition-colors">
                      {p.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed mb-3">
                    {p.desc}
                  </p>
                  
                  {/* Visual gradient pill preview */}
                  <div className={`h-2.5 w-full rounded-full bg-gradient-to-r ${p.colorPreview}`} />
                  
                  {themeSet === p.id && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-[color:var(--color-accent)] rounded-bl-xl shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Productivity Controls (Focus Lock, Music) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white/60" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-white/80">{t.productivityTitle}</h3>
            </div>
            
            <div className="space-y-3">
              {/* Focus Lock Switch */}
              <div 
                style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
                className="flex items-center justify-between p-4 rounded-2xl border hover:bg-white/[0.03] transition-all"
              >
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <p className="text-sm font-bold text-white">{t.focusLockTitle}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{t.focusLockDesc}</p>
                </div>
                <button
                  onClick={onToggleFocusLock}
                  style={{ backgroundColor: focusLock ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)' }}
                  className="w-12 h-6 rounded-full p-1 transition-all duration-300 relative flex items-center shrink-0"
                >
                  <span 
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 transform ${
                      focusLock ? 'translate-x-6' : 'translate-x-0'
                    }`} 
                  />
                </button>
              </div>

              {/* Music Enabled Switch */}
              <div 
                style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
                className="flex items-center justify-between p-4 rounded-2xl border hover:bg-white/[0.03] transition-all"
              >
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <p className="text-sm font-bold text-white">{t.ambientMusicTitle}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{t.ambientMusicDesc}</p>
                </div>
                <button
                  onClick={onToggleMusicEnabled}
                  style={{ backgroundColor: isMusicEnabled ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)' }}
                  className="w-12 h-6 rounded-full p-1 transition-all duration-300 relative flex items-center shrink-0"
                >
                  <span 
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 transform ${
                      isMusicEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`} 
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 6. Informational Guide section on Pomodoro vs Ultradian */}
          <div 
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
            className="p-5 rounded-2xl border space-y-3 font-sans"
          >
            <div className="flex items-center gap-2 text-[color:var(--color-accent)] font-bold text-sm">
              <Info className="w-4 h-4" />
              <span>{t.guideTitle}</span>
            </div>
            
            <div className="space-y-3 text-xs leading-relaxed text-white/60">
              <div>
                <p className="font-extrabold text-white mb-0.5">{t.guidePomodoroTitle}</p>
                <p>{t.guidePomodoroDesc}</p>
              </div>
              <div className="pt-2 border-t border-white/5">
                <p className="font-extrabold text-white mb-0.5">{t.guideUltradianTitle}</p>
                <p>{t.guideUltradianDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 shrink-0 text-center text-white/30 text-[10px] uppercase tracking-widest font-bold bg-black/10">
          {t.version} • {t.completedTodayFooter} {sessionCount}
        </div>
      </motion.div>
    </motion.div>
  );
};
