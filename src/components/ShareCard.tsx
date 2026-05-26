import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Download, Trophy, Clock, CheckCircle, Flame, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { PomoStats, Task, Language } from '../types';
import { getTranslation } from '../services/translations';

interface ShareCardProps {
  stats: PomoStats;
  completedTasks: Task[];
  onClose: () => void;
  language: Language;
}

function oklabToRgb(l: number, aPart: number, bPart: number, a: number = 1): string {
  // OKLAB to LMS
  const l_ = l + 0.3963377774 * aPart + 0.2158037573 * bPart;
  const m_ = l - 0.1055613458 * aPart - 0.0638541728 * bPart;
  const s_ = l - 0.0894841775 * aPart - 1.291485548 * bPart;
  
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;
  
  // LMS to XYZ (using linear RGB conversion)
  const r_lin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g_lin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const b_lin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;
  
  // Linear RGB to Standard sRGB
  const toSRGB = (x: number) => {
    return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  };
  
  const r = Math.max(0, Math.min(255, Math.round(toSRGB(r_lin) * 255)));
  const g = Math.max(0, Math.min(255, Math.round(toSRGB(g_lin) * 255)));
  const b = Math.max(0, Math.min(255, Math.round(toSRGB(b_lin) * 255)));
  
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function oklchToRgb(l: number, c: number, h: number, a: number = 1): string {
  // Convert hue from degrees to radians
  const hRad = (h * Math.PI) / 180;
  
  const aPart = c * Math.cos(hRad);
  const bPart = c * Math.sin(hRad);
  
  return oklabToRgb(l, aPart, bPart, a);
}

function parseAndConvertColor(colorStr: string): string {
  if (!colorStr) return colorStr;
  
  // Regex to match oklch(...) and oklab(...) including nested parentheses (like var(...))
  const oklchAndOklabRegex = /(oklch|oklab)\s*\(([^)]*(?:\([^)]*\)[^)]*)*)\)/gi;
  
  return colorStr.replace(oklchAndOklabRegex, (match, type, content) => {
    try {
      // Normalize separators: replace slashes and commas with spaces, then collapse spaces
      const normalizedContent = content
        .replace(/[\/,]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
        
      const parts = normalizedContent.split(' ');
      if (parts.length < 3) {
        // Not enough parts, return a fallback gray
        return 'rgba(100, 100, 100, 1)';
      }
      
      const lPart = parts[0];
      const cOrAPart = parts[1]; // C for oklch, a for oklab
      const hOrBPart = parts[2]; // H for oklch, b for oklab
      const alphaPart = parts[3] ? parts[3] : '1';
      
      // Parse L
      let l = 0.5; // fallback
      if (lPart.endsWith('%')) {
        l = parseFloat(lPart) / 100;
      } else if (!isNaN(parseFloat(lPart))) {
        l = parseFloat(lPart);
      }
      
      // Parse second parameter (C or a)
      let param2 = 0;
      if (cOrAPart.endsWith('%')) {
        param2 = parseFloat(cOrAPart) / 100;
      } else if (!isNaN(parseFloat(cOrAPart))) {
        param2 = parseFloat(cOrAPart);
      }
      
      // Parse third parameter (H or b)
      let param3 = 0;
      if (hOrBPart.endsWith('%')) {
        param3 = parseFloat(hOrBPart) / 100;
      } else if (!isNaN(parseFloat(hOrBPart))) {
        param3 = parseFloat(hOrBPart);
      }
      
      // Parse Alpha
      let alpha = 1;
      if (alphaPart) {
        if (alphaPart.endsWith('%')) {
          alpha = parseFloat(alphaPart) / 100;
        } else if (!isNaN(parseFloat(alphaPart))) {
          alpha = parseFloat(alphaPart);
        } else if (alphaPart.includes('var(')) {
          // If it references a variable, fallback to opacity 1
          alpha = 1;
        }
      }
      
      if (type.toLowerCase() === 'oklch') {
        return oklchToRgb(l, param2, param3, alpha);
      } else {
        return oklabToRgb(l, param2, param3, alpha);
      }
    } catch (e) {
      console.warn("Error parsing color:", match, e);
      return 'rgba(100, 100, 100, 1)';
    }
  });
}

export const ShareCard: React.FC<ShareCardProps> = ({ stats, completedTasks, onClose, language }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);

  const downloadImage = async () => {
    if (!cardRef.current) return;

    // 1. Keep track of original style values to restore them later
    const originalStyles = new Map<HTMLStyleElement, string>();
    const originalLinks = new Map<HTMLLinkElement, { disabled: boolean; tempStyle?: HTMLStyleElement }>();

    try {
      // 2. Process all <style> tags in the real document
      const styleElements = Array.from(document.querySelectorAll('style'));
      for (const styleEl of styleElements) {
        if (styleEl.textContent && (styleEl.textContent.includes('oklch') || styleEl.textContent.includes('oklab'))) {
          originalStyles.set(styleEl, styleEl.textContent);
          styleEl.textContent = parseAndConvertColor(styleEl.textContent);
        }
      }

      // 3. Process all <link rel="stylesheet"> tags in the real document
      const linkElements = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
      for (const linkEl of linkElements) {
        try {
          const sheet = linkEl.sheet;
          if (sheet) {
            let cssText = '';
            try {
              const rules = sheet.cssRules;
              for (let j = 0; j < rules.length; j++) {
                cssText += rules[j].cssText + '\n';
              }
            } catch (e) {
              console.warn("Could not read cssRules directly from stylesheet:", e);
            }

            if (cssText && (cssText.includes('oklch') || cssText.includes('oklab'))) {
              const convertedCss = parseAndConvertColor(cssText);
              const tempStyle = document.createElement('style');
              tempStyle.id = 'html2canvas-temp-style';
              tempStyle.textContent = convertedCss;
              document.head.appendChild(tempStyle);

              originalLinks.set(linkEl, { disabled: linkEl.disabled, tempStyle });
              linkEl.disabled = true;
            }
          }
        } catch (e) {
          console.warn("Could not process stylesheet link:", linkEl, e);
        }
      }

      // 4. Run html2canvas
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#020617',
        scale: 2,
        onclone: (clonedDoc) => {
          // Process cloned doc style tags just in case
          const clonedStyles = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < clonedStyles.length; i++) {
            const tag = clonedStyles[i];
            if (tag.textContent) {
              tag.textContent = parseAndConvertColor(tag.textContent);
            }
          }

          // Process and modify inline colors on all elements
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            if (!el.style) continue;
            
            const computed = window.getComputedStyle(el);
            const propertiesToFix = [
              'color', 
              'backgroundColor', 
              'borderColor', 
              'borderTopColor', 
              'borderRightColor', 
              'borderBottomColor', 
              'borderLeftColor', 
              'fill', 
              'stroke'
            ];
            
            for (const prop of propertiesToFix) {
              const val = computed[prop as any];
              if (val && (val.includes('oklch') || val.includes('oklab'))) {
                const fixed = parseAndConvertColor(val);
                if (fixed !== val) {
                  (el.style as any)[prop] = fixed;
                }
              }
            }
          }
        }
      });

      // 5. Trigger download
      const link = document.createElement('a');
      link.download = `PomoFlow-Progress-${new Date().toLocaleDateString()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("html2canvas download error:", error);
    } finally {
      // 6. Restore original style tags textContents
      originalStyles.forEach((content, tag) => {
        tag.textContent = content;
      });

      // 7. Restore original link tag states & remove temp style tags
      originalLinks.forEach((state, linkEl) => {
        linkEl.disabled = state.disabled;
        if (state.tempStyle && state.tempStyle.parentNode) {
          state.tempStyle.parentNode.removeChild(state.tempStyle);
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
          title={t.close}
        >
          <X className="w-6 h-6" />
        </button>

        <div 
          ref={cardRef}
          style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}
          className="rounded-[32px] overflow-hidden shadow-2xl p-8 border mt-4 bg-slate-900"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-500/10 text-[color:var(--color-accent)] rounded-2xl mb-4 border border-white/5">
              <Trophy className="w-10 h-10 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1">{t.appTitle}</h1>
            <p className="text-[10px] text-white/40 tracking-widest uppercase font-black mb-8">{t.reportTrophyTag}</p>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center text-center border border-white/5">
                <Clock className="w-5 h-5 text-[color:var(--color-accent)] mb-2" />
                <p className="text-xl font-bold text-white leading-none mb-1">{stats.totalFocusTime}m</p>
                <p className="text-[9px] text-white/40 tracking-wider uppercase font-extrabold">{t.statsMinutesFocused}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center text-center border border-white/5">
                <CheckCircle className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-xl font-bold text-white leading-none mb-1">{stats.sessionsCompleted}</p>
                <p className="text-[9px] text-white/40 tracking-wider uppercase font-extrabold">{t.statsSessionsCompleted}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center text-center border border-white/5">
                <Flame className="w-5 h-5 text-orange-400 mb-2" />
                <p className="text-xl font-bold text-white leading-none mb-1">{stats.streak} {t.streakDayUnit}</p>
                <p className="text-[9px] text-white/40 tracking-wider uppercase font-extrabold">{t.statsStreak}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center text-center border border-white/5">
                <CheckCircle className="w-5 h-5 text-indigo-400 mb-2" />
                <p className="text-xl font-bold text-white leading-none mb-1">{stats.tasksCompleted}</p>
                <p className="text-[9px] text-white/40 tracking-wider uppercase font-extrabold">{t.statsTasksDone}</p>
              </div>
            </div>

            <div className="w-full text-left bg-white/5 rounded-2xl p-4 mb-8 border border-white/5">
              <p className="text-[10px] text-white/40 uppercase mb-3 font-extrabold tracking-wider">{t.completedTasksListLabel}</p>
              <div className="space-y-2">
                {completedTasks.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-xs text-white/80">
                    <div className="w-1.5 h-1.5 bg-[color:var(--color-accent)] rounded-full shrink-0" />
                    <span className="truncate">{t.title}</span>
                  </div>
                ))}
                {completedTasks.length > 3 && (
                  <p className="text-[10px] text-white/40 pl-3">+{completedTasks.length - 3} lainnya...</p>
                )}
                {completedTasks.length === 0 && (
                  <p className="text-xs text-white/20 italic">{t.noCompletedTasksYet}</p>
                )}
              </div>
            </div>

            <p className="text-[color:var(--color-accent)] font-bold text-xs tracking-normal">{t.motivationQuote}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button 
            onClick={downloadImage}
            style={{ backgroundColor: 'var(--color-accent)' }}
            className="flex-1 flex items-center justify-center gap-2 text-slate-950 font-black py-4 rounded-2xl shadow-xl transition-all hover:brightness-110 uppercase text-xs tracking-widest active:scale-95"
          >
            <Download className="w-5 h-5 text-slate-950" />
            {t.saveImageBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
