# Product Requirement Document (PRD) — As-Built Version

## 📂 Product Overview & Target Audience

### Product Overview
**PomoFlow** is an advanced personal productivity desktop companion that combines structured timeboxing protocols, neuro-ergonomic audio management, and artificial intelligence helper modules to help users overcome friction and enter deep focus flows. 

Unlike typical clock interfaces, PomoFlow approaches focus holistically: checking the user's fatigue, matching acoustic profiles to keep brainwave frequencies sharp, suggesting smart sub-task estimations, and offering a modular protocol configuration (Standard Pomodoro vs. Extended Ultradian).

### Target Audience
1.  **Software Engineers & Knowledge Creators**: Working in deep-knowledge intervals requiring long, continuous attention slots (Ultradian alignment).
2.  **Students & Academics**: Seeking targeted timeboxing (Pomodoro) with automated, calm resting boundaries to protect cognitive health.
3.  **ADHD & Neurodivergent Learners**: Thriving on direct, structured transitions, custom motivational feedback, visual cues, and localized, customizable background environments.

---

## 🧭 User Journeys & Core Flows

### Flow 1: Initialization & Session Onboarding
1.  **Entry & Language Preference**: The application loads in full-screen responsive layouts. The user chooses their primary language between English (`ENG`) and Indonesian (`IND`) via the global navbar switch.
2.  **Productivity Style Selection (Pomodoro vs Ultradian)**:
    *   By default, the *Classic Pomodoro* cycle is loaded.
    *   The user can access the **Productivity Settings panel** to switch mode preferences to the *Ultradian Rhythm style*, replacing standard tabs with longer endurance focus periods.
3.  **Task Addition & Setup**:
    *   The user inputs their core task into the "Daily Tasks" queue.
    *   They can proceed with standard session estimates, or select **Estimate with AI**.
    *   The system uses Gemini to dissect the task, returning recommended focused blocks (e.g., 3 standard Pomodoros) and reasoning.
    *   The user selects the task to set it as the **Active Task Focus** identifier.

### Flow 2: Adaptive Timer Run Cycle
1.  **First-Session Mood Diagnostics**:
    *   When clicking **Play** on their initial session of the day while set to the default "normal" state, the user is greeted with a **Mood Check-In Dialog**.
    *   The user selects their current physiological status:
        *   **Lelah (Tired / Fatigue)**: Set to classical calming melodies.
        *   **Biasa (Normal / Focused)**: Set to focused chill lofi beats paths.
        *   **Semangat (Energetic / High)**: Set to upbeat synth frequencies.
    *   This choice instantly triggers background ambient cues.
2.  **Ticks & Focus Synchronization**:
    *   As the timer starts counting down, the ambient music starts playing in unison (if enabled of course).
    *   The user can choose to toggle off music, skip tracks, or lower output volumes via the integrated media panel.
    *   At any point, if the timer is paused, the acoustic cue halts automatically.
    *   If the user hits play again, sound resumes from where it left off.
3.  **Active Intercept Rule (Focus-Lock Mode)**:
    *   If the user attempts to reset or change modes manually while the timer is running, a **Double-Verification Interceptor Modal** blocks the accidental operation.
    *   The user must explicitly click "Yes, Stop & Change", acknowledging they will lose active session progress, or select "Keep Focus" to stay in their state.

### Flow 3: Session Completion & Transitioning
1.  **Zero-Point Reaching**:
    *   When the countdown hits `00:00`, an acoustic chime sound effect rings.
    *   A high-vibrancy colored **Confetti Explosion** bursts across the canvas.
    *   Session progress is updated inside the global statistics accumulator.
2.  **Automated State Switching**:
    *   **Classic Pomodoro Structure**: Completing a Focus segment transition automatically redirects to the **Short Break** tab (5 minutes). If the cumulative focus count reaches an integer multiple of 4, the system transitions to the **Long Break** tab (15 minutes).
    *   **Ultradian Style**: Completing the 90-minute endurance session automatically prompts the 20-minute **Ultradian Break** rest window.
3.  **Resume**:
    *   Ending a break automatically reset the state to the subsequent **Focus** mode, waiting for the user to hit play to start the next session.

---

## 📋 Functional Specifications & System Rules

### 1. Mode Configuration Rules

| Timer Mode | ID Identifier | Duration (Minutes) | Duration (Seconds) | Automated Succeed Target Mode |
| :--- | :--- | :--- | :--- | :--- |
| **Focus Session** | `FOCUS` | 25 min (or AI custom minutes override) | 1,500s | `SHORT_BREAK` or `LONG_BREAK` (Every 4th cycle) |
| **Short Break** | `SHORT_BREAK` | 5 min | 300s | `FOCUS` |
| **Long Break** | `LONG_BREAK` | 15 min | 900s | `FOCUS` |
| **Ultradian Focus** | `ULTRADIAN` | 90 min | 5,400s | `ULTRADIAN_BREAK` |
| **Ultradian Break** | `ULTRADIAN_BREAK` | 20 min | 1,200s | `ULTRADIAN` |

### 2. Mood & Playlist Association Rules

*   **Tired Mode (`tired`)**: Focuses on lowering cortical stress.
    *   Sound Track Type: Slow, beautiful classical compositions (Beethoven's Moonlight Sonata, Chopin's Nocturne/Preludes, Debussy, and Erik Satie's calming Gymnopédies).
*   **Normal Mode (`normal`)**: Ideal for standard analytical work.
    *   Sound Track Type: Continuous steady-state binaural-adjacent lofi soundscapes (provided via reliable MP3 stream arrays).
*   **Energetic Mode (`energetic`)**: Perfect for intense crunch blocks, code writing, or overcoming initialization friction.
    *   Sound Track Type: fast-tempo synth beats and epic orchestral marches (Tchaikovsky, Wagner, and robust marches).
*   **Break Mood Category (`break`)**: Swaps playlist on rest intervals automatically to light relaxing soundscapes, signaling cognitive cool-down to the nervous system.

### 3. State Management & Offline Persistence
1.  **Task Items Management**: Stored inside browser `localStorage` as JSON arrays. Retains attributes for task completion status and AI estimation flags.
2.  **Analytical Performance Log**: Stats logs (`sessionsCompleted`, `totalFocusTime`, `tasksCompleted`, `streak`) persist inside LocalStorage, maintaining daily streaks across page updates.
3.  **Local Audio Track Storage (IndexedDB)**: Custom `.mp3` tracks uploaded by users are saved directly inside IndexedDB as standard Blobs matching custom primary keys structure. Secure dynamic Object URLs are created at runtime and properly revoked when the media instance destroys to avoid memory degradation.
