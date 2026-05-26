import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle, Sparkles, Loader2, Clock, CheckCircle2, Target, Zap } from 'lucide-react';
import { Task, Language } from '../types';
import { estimateTask } from '../services/geminiService';
import { getTranslation } from '../services/translations';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (task: Partial<Task>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  activeTaskId: string | null;
  onSetActiveTask: (id: string | null) => void;
  language: Language;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask,
  activeTaskId,
  onSetActiveTask,
  language
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [aiResult, setAiResult] = useState<{ pomodoros: number; totalMinutes: number; reasoning: string } | null>(null);

  const t = getTranslation(language);

  const handleManualAdd = () => {
    if (!newTaskTitle.trim()) return;
    onAddTask({
      title: newTaskTitle,
      estimatedPomodoros: 1,
      totalDurationMinutes: 25,
      isAiEstimated: false
    });
    setNewTaskTitle('');
  };

  const handleAiEstimate = async () => {
    if (!newTaskTitle.trim()) return;
    setIsEstimating(true);
    const result = await estimateTask(newTaskTitle);
    setAiResult(result);
    setIsEstimating(false);
  };

  const confirmAiTask = (useAiDuration: boolean) => {
    if (!aiResult) return;
    const durationPerSession = useAiDuration ? Math.round(aiResult.totalMinutes / aiResult.pomodoros) : 25;

    onAddTask({
      title: newTaskTitle,
      estimatedPomodoros: aiResult.pomodoros,
      totalDurationMinutes: durationPerSession,
      isAiEstimated: useAiDuration
    });
    setNewTaskTitle('');
    setAiResult(null);
  };

  const totalMinutesRemaining = tasks
    .filter(t => !t.isCompleted)
    .reduce((acc, current) => acc + current.totalDurationMinutes, 0);

  return (
    <div className="w-full max-w-xl flex flex-col gap-6">
      
      {/* Task Input Area */}
      <div 
        style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}
        className="flex flex-col gap-4 border p-5 rounded-3xl backdrop-blur-md shadow-lg transition-colors duration-1000"
      >
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>{t.tasksTitle}</span>
        </h3>
        
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t.taskInputPlaceholder}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[color:var(--color-accent)] focus:border-[color:var(--color-accent)] transition-all font-sans"
            />
            <button
              onClick={handleManualAdd}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/5 shadow-sm active:scale-95"
              title={t.taskAddTooltip}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={handleAiEstimate}
            disabled={isEstimating || !newTaskTitle.trim()}
            style={{ 
              background: 'linear-gradient(135deg, var(--color-accent) 0%, #a855f7 100%)',
              color: '#090d16'
            }}
            className="flex items-center justify-center gap-2 py-3 disabled:opacity-40 text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95 duration-1000"
          >
            {isEstimating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                {t.aiEstimating}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                {t.aiEstimateBtn}
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Suggestion Box */}
      <AnimatePresence>
        {aiResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-indigo-950/40 border border-indigo-500/30 rounded-3xl p-5 mb-2 overflow-hidden shadow-xl font-sans"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h4 className="text-indigo-200 font-bold text-sm">{t.aiHeader}</h4>
            </div>
            
            <p className="text-white/80 text-xs italic mb-4 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
              "{aiResult.reasoning}"
            </p>
            
            <div className="text-white text-xs space-y-1 mb-4">
              <p>{language === 'id' ? 'Rekomendasi Sesi' : 'Recommended Sessions'}: <span className="font-extrabold text-indigo-300">{aiResult.pomodoros} Pomodoro</span></p>
              <p>{language === 'id' ? 'Total Estimasi Waktu' : 'Total Time Estimate'}: <span className="font-extrabold text-indigo-300">{aiResult.totalMinutes} {t.minutesUnit}</span></p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => confirmAiTask(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white transition-all border border-white/5"
              >
                {t.aiOptionNormal}
              </button>
              <button
                onClick={() => confirmAiTask(true)}
                className="flex-1 bg-indigo-500 hover:bg-indigo-400 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-950 font-black transition-all shadow-md active:scale-95"
              >
                {t.aiOptionCustom}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <h3 className="text-xs uppercase font-extrabold tracking-widest text-white/40 mb-1 px-1">
        {t.today} ({tasks.length} {t.tasksCountSuffix})
      </h3>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => {
          const isActive = activeTaskId === task.id;
          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              key={task.id}
              style={{ 
                backgroundColor: 'var(--theme-card)', 
                borderColor: isActive ? 'var(--color-accent)' : 'var(--theme-border)' 
              }}
              className={`flex items-center justify-between p-4 rounded-3xl border transition-all duration-500 shadow-md ${
                task.isCompleted ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden flex-1 font-sans">
                {/* Complete checkbox */}
                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`p-1 rounded-full transition-colors shrink-0 ${
                    task.isCompleted ? 'text-emerald-400' : 'text-white/20 hover:text-white/60'
                  }`}
                  title={task.isCompleted ? (language === 'id' ? 'Belum Selesai' : 'Mark Incomplete') : (language === 'id' ? 'Tandai Selesai' : 'Mark Complete')}
                >
                  <CheckCircle className={`w-5 h-5 ${task.isCompleted ? 'fill-emerald-400/20' : ''}`} />
                </button>
                
                {/* Click to select task as actively focused */}
                <button
                  onClick={() => onSetActiveTask(isActive ? null : task.id)}
                  className="text-left overflow-hidden flex-1 group"
                  title={t.startTaskTooltip}
                >
                  <p className={`font-bold text-sm truncate transition-colors ${
                    isActive ? 'text-[color:var(--color-accent)]' : 'text-white group-hover:text-white/80'
                  } ${task.isCompleted ? 'line-through text-white/40' : ''}`}>
                    {task.title}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {/* Duration Info Pill */}
                    <div className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest text-white/40">
                      <Clock className="w-3 h-3" />
                      <span>{task.totalDurationMinutes}{t.minutesPerSession}</span>
                    </div>

                    {/* Progress Info Pill */}
                    <div className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest text-white/40">
                      <CheckCircle2 className="w-3 h-3 text-white/20" />
                      <span>{task.completedPomodoros}/{task.estimatedPomodoros} {t.completedUnits}</span>
                    </div>

                    {/* AI Label Pill */}
                    {task.isAiEstimated && (
                      <div className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded-md">
                        <Zap className="w-2.5 h-2.5" />
                        <span>{t.aiEstimate}</span>
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Set active indicator button */}
                <button
                  onClick={() => onSetActiveTask(isActive ? null : task.id)}
                  style={{
                    backgroundColor: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#090d16' : 'rgba(255,255,255,0.4)'
                  }}
                  className="p-2 rounded-xl transition-all shadow-sm"
                  title={isActive ? (language === 'id' ? 'Fokus Sedang Aktif' : 'Focus Currently Active') : t.startTaskTooltip}
                >
                  <Target className="w-4 h-4" />
                </button>

                {/* Delete button */}
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 text-white/30 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
                  title={language === 'id' ? 'Hapus' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {tasks.length === 0 && (
          <div className="text-center py-8 text-white/20 text-xs italic bg-white/[0.02] rounded-3xl border border-dashed border-white/5 font-sans">
            {t.noTasksPlaceholder}
          </div>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="mt-2 flex items-center justify-between px-3 text-white/40 text-[10px] uppercase tracking-wider font-extrabold font-sans">
          <span>{t.estimatedRemainingText}</span>
          <span className="text-white bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {totalMinutesRemaining} {t.minutesUnit}
          </span>
        </div>
      )}
    </div>
  );
};
