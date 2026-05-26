import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Zap, Brain } from 'lucide-react';
import { Mood, Language } from '../types';
import { getTranslation } from '../services/translations';

interface MoodModalProps {
  onSelect: (mood: Mood) => void;
  language: Language;
}

export const MoodModal: React.FC<MoodModalProps> = ({ onSelect, language }) => {
  const t = getTranslation(language);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}
        className="border/20 p-8 rounded-[32px] max-w-md w-full shadow-2xl backdrop-blur-md border transition-all duration-1000"
      >
        <h2 className="text-2xl font-black text-white mb-2 text-center">{t.moodCheckTitle}</h2>
        <p className="text-white/60 text-center mb-8 text-sm">{t.moodCheckDesc}</p>
        
        <div className="grid gap-4">
          <button
            onClick={() => onSelect('tired')}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group text-left"
          >
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-white text-base">{t.moodTiredTitle}</p>
              <p className="text-xs text-white/40">{t.moodTiredDesc}</p>
            </div>
          </button>

          <button
            onClick={() => onSelect('normal')}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group text-left"
          >
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-white text-base">{t.moodNormalTitle}</p>
              <p className="text-xs text-white/40">{t.moodNormalDesc}</p>
            </div>
          </button>

          <button
            onClick={() => onSelect('energetic')}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group text-left"
          >
            <div className="p-3 bg-orange-500/20 text-orange-400 rounded-xl group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-white text-base">{t.moodEnergeticTitle}</p>
              <p className="text-xs text-white/40">{t.moodEnergeticDesc}</p>
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
