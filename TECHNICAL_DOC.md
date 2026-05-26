# Technical Documentation — Code Architecture & Specifications

This document details the internal technical layout, system flow, component compositions, and memory-safe design patterns built into the **PomoFlow v2.0** engine.

---

## 🏗️ Project Architecture & Data Flow

PomoFlow is built as a highly responsive modular Single Page Application (SPA) driven by a top-down state architecture in React. Standard React states flow downstream into specialized presentation layers, modals, and player objects, while interactive event triggers cascade upward.

### Component Hierarchy Map

Below is a graphical mapping representing how components are nested under the primary entry module:

```
[src/main.tsx] 
      │
[src/App.tsx] (Global State Controller: Timer cycle, current task, language preferences, theme states)
      ├── [src/components/TimerDisplay.tsx] (Countdown layout, circular progress, control triggers)
      ├── [src/components/MusicPlayer.tsx] (Audio elements, volume controllers, IndexedDB integration)
      ├── [src/components/TaskList.tsx] (Task state visualizer, task additions, AI Estimations)
      │         └── [src/services/geminiService.ts] (Google GenAI Schema Estimator via Server-Proxy)
      ├── [src/components/MoodModal.tsx] (Physiological check-in overlay)
      ├── [src/components/SettingsModal.tsx] (User configurations: language, theme selections, focus modes)
      ├── [src/components/ConfirmSwitchModal.tsx] (Protection interceptor for active focus lock)
      └── [src/components/ShareCard.tsx] (Daily milestone visualizer & html2canvas exporter)
```

### Flow of Core Data States
1.  **State Synchronizer**: Timer defaults, theme selections, active tasks, and localized dictionary updates are controlled inside `/src/App.tsx`.
2.  **Oculus Theme Engine**: Theme sets (e.g. `midnight`, `forest`) are bound in a unified `useEffect` which sets custom attributes on `document.documentElement` (`data-theme` & `data-mode`). Global variables inside `/src/index.css` instantly re-align across DOM layers without causing forced paint flashes.
3.  **Acoustic Lifecycle Syncs**: Standard play status changes within `App.tsx` cascade directly into `MusicPlayer.tsx` through `isTimerActive` state synchronization. If the timer starts ticking, the player triggers its sound cycle.

---

## 🛠️ Codebase Breakdown & Core Logic

### 1. Unified TypeScript Domain Types (`/src/types.ts`)
To ensure total runtime consistency, PomoFlow defines standard, type-safe structures:

```typescript
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
```

### 2. Time-Safe Interval Implementation (`/src/App.tsx`)
Rather than relying on loosely structured timers, PomoFlow coordinates cycles through a strictly managed, cleanup-safe React Hook interval pattern:

```typescript
// Timer run loop tick inside App.tsx
useEffect(() => {
  let interval: NodeJS.Timeout | null = null;

  if (isActive && timeLeft > 0) {
    interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
  } else if (timeLeft === 0) {
    handleTimerComplete();
  }

  // Mandatory teardown prevents memory execution accumulation
  return () => {
    if (interval) clearInterval(interval);
  };
}, [isActive, timeLeft]);
```

### 3. Cross-Browser OKLCH/OKLAB Color Solver (`/src/components/ShareCard.tsx`)
*html2canvas* crashes or fails to render when meeting modern CSS high-definition colors like `oklch()` or `oklab()`. To solve this, a mathematical parsing converter has been architected inside `ShareCard.tsx` that executes color space transforms:

$$\text{OKLCH} \longrightarrow \text{OKLab} \longrightarrow \text{LMS Space} \longrightarrow \text{Linear RGB} \longrightarrow \text{sRGB (rgba)}$$

The exporter temporarily swaps stylesheet nodes and processes DOM cloned style attributes before committing the render:

```typescript
function oklabToRgb(l: number, aPart: number, bPart: number, a: number = 1): string {
  // Conversions from OKLAB space through LMS to standard linear sRGB components
  const l_ = l + 0.3963377774 * aPart + 0.2158037573 * bPart;
  const m_ = l - 0.1055613458 * aPart - 0.0638541728 * bPart;
  const s_ = l - 0.0894841775 * aPart - 1.291485548 * bPart;
  
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;
  
  const r_lin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g_lin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const b_lin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;
  
  const toSRGB = (x: number) => {
    return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  };
  
  const r = Math.max(0, Math.min(255, Math.round(toSRGB(r_lin) * 255)));
  const g = Math.max(0, Math.min(255, Math.round(toSRGB(g_lin) * 255)));
  const b = Math.max(0, Math.min(255, Math.round(toSRGB(b_lin) * 255)));
  
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
```

### 4. Intelligent AI Estimations with Structured Schema Output (`/src/services/geminiService.ts`)
Uses the modern `@google/genai` TypeScript SDK to fetch task complexity analysis from the lightweight `gemini-3-flash-preview` engine. Leverages constrained JSON response schemas for reliable parsing:

```typescript
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Constrains model behavior to return exact integer and string schema
const configFields = {
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      pomodoros: { type: Type.INTEGER },
      totalMinutes: { type: Type.INTEGER },
      reasoning: { type: Type.STRING }
    },
    required: ["pomodoros", "totalMinutes", "reasoning"],
  }
};
```

---

## ⚡ Code Quality & Performance Optimization Review

### Existing Strengths (As-Built Quality)

1.  **Strict Hook Dependency Cleanup**: Every audio instance or interval created is meticulously destroyed or cleared on state transitions using explicit `useEffect` teardown return blocks, avoiding background audio noise or clock-drift.
2.  **Explicit Object URL Revocation**: Standard HTML audio objects created dynamically for custom uploads in IndexedDB are properly registered and revoked (`URL.revokeObjectURL(item.url)`), preventing high browser heap degradation over long work sessions.
3.  **Memoized Selectors**: Complex aggregations such as retrieving active task properties are wrapped inside `useMemo`, preventing expensive iteration recalculations on every timer tick.

### Refactoring & Optimization Opportunities (Future Proofing)

While the implementation is highly optimized, the following enhancements could be integrated as the application scales:

1.  **State Consolidation with useReducer or Context API**:
    *   *Observation*: `/src/App.tsx` coordinates around 15 standard `useState` selectors. Spreading these states downstream through props can lead to slight prop-drilling or visual component coupling.
    *   *Solution*: Group timer loops and task configurations under a unified `useReducer` engine, or expose reactive actions using a central React Context Provider to keep modular components isolated.
2.  **Sound Preemption Preloading**:
    *   *Observation*: Alarm and background streams use hot initialization constructor sequences (`new Audio(url)`), which may cause minor lags on slow networks.
    *   *Solution*: Establish an initialization pool that pre-fetches and keeps standard audio loops hydrated in browser cache.
3.  **Progressive IndexedDB Chunking**:
    *   *Observation*: Custom tracks are loaded into memory entirety as Blob elements on mount. Large user library uploads could grow memory allocation footprints.
    *   *Solution*: Stream custom files inside specific audio nodes rather than loading all custom assets concurrently.
