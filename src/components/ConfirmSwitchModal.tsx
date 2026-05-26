import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../services/translations';

interface ConfirmSwitchModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  language: Language;
}

export const ConfirmSwitchModal: React.FC<ConfirmSwitchModalProps> = ({ isOpen, onConfirm, onCancel, language }) => {
  if (!isOpen) return null;
  const t = getTranslation(language);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}
        className="w-full max-w-md border rounded-3xl p-6 shadow-2xl space-y-5 text-center transition-colors duration-1000"
      >
        <div className="mx-auto w-12 h-12 bg-amber-500/10 text-[color:var(--color-accent)] rounded-full flex items-center justify-center border border-white/5 transition-colors duration-1000">
          <AlertCircle className="w-6 h-6 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black text-white">{t.confirmSwitchTitle}</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            {t.confirmSwitchDesc}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-2xl border border-white/5 transition-all text-xs uppercase tracking-wider"
          >
            {t.confirmSwitchCancel}
          </button>
          <button
            onClick={onConfirm}
            style={{ backgroundColor: 'var(--color-accent)' }}
            className="flex-1 text-slate-950 font-black py-3 rounded-2xl hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-wider shadow-lg"
          >
            {t.confirmSwitchConfirm}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
