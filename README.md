# PomoFlow

**Flow to Success** — An immersive, highly-aesthetic, and cognitive-focused task companion combining the traditional Pomodoro protocol, Ultradian biological cycles, a mood-synchronized ambient audio player, and an intelligent AI estimation assistant.

---

## 🎨 Core Features Overview

*   **Dual Productivity Protocols (Pomodoro & Ultradian)**:
    *   **Pomodoro (Default)**: Standard 25-minute focus intervals followed by 5-minute short breaks. Supports continuous cycling with a 15-minute long break automatically triggered every 4 sessions.
    *   **Ultradian Rhythm**: Designed around natural biological cognitive cycles (90 minutes of high-intensity focus) followed by a 20-minute deep recovery resting period to replenish cognitive neurotransmitters.
*   **🧠 Cognitive Mood Check-in & Audio Synced Backsound**:
    *   A pre-session **Mood Check** adapts the experience to user fatigue levels (`tired`, `normal`, `energetic`).
    *   Adapts background ambient playlists dynamically to coordinate with the checked-in state (e.g., Calming Classical piano for tired status, Lofi focus loops for normal state, and motivate-heavy upbeat beats for energetic flows).
    *   Synchronized timer state automatically triggers music playback when starting and pauses when stopping, allowing manual toggles and intuitive state resumes.
*   **💾 High-Fidelity Custom Playlist Uploader (IndexedDB)**:
    *   Users can upload their own `.mp3` files categorized by mood. Tracks are persisted directly in the browser utilizing IndexedDB and integrated seamlessly into the active audio queues.
*   **🤖 AI Cognitive Task Estimator (Gemini 1.5/2.0 API)**:
    *   Integrates with Google GenAI using structured schema output models client/server-side to analyze task titles.
    *   Generates recommended session targets, total duration, and complex cognitive logic, which can be applied instantly as custom session timer overrides.
*   **🔒 Strict Focus-Lock Interceptor**:
    *   Ensures deep work preservation by requiring dual confirmation prompts if manual timer interruptions are triggered during an active cycle.
*   **📊 Aesthetic Progress Dashboard & Canvas Exporter (cross-browser safe)**:
    *   A highly polished achievement report summarizing total focus minutes, focus streaks, completed tasks, and task list states.
    *   Includes a dynamic **PNG Canvas Exporter** utilizing custom color processors to convert cutting-edge modern CSS spaces (`oklch` / `oklab`) to stable sRGB colors, avoiding export crashes on standard browsers.
*   **🌐 Comprehensive Bilingual Translation (EN / ID)**:
    *   Offers deep system localized switches for English and Indonesian languages covering guides, descriptions, and active alerts.
*   **🌸 Dynamic Visual Architecture**:
    *   Four custom-designed high-contrast ocular modes: **Classic** (warm neutrals), **Midnight** (cool neon dark navy), **Forest** (mossy organic), and **Sakura** (sweet pastel rose). Each palette dynamically shifts typography variables and ambient accent particles.

---

## 🛠️ Technological Architecture

*   **Frontend Library**: [React 18+](https://react.dev/)
*   **Logic Model**: [TypeScript 5+](https://www.typescriptlang.org/) (Strictly-typed interfaces)
*   **CSS & Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS-variable mappings
*   **Micro-Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
*   **State Persistence**: IndexedDB (custom tracks storing) & LocalStorage (task lists & productivity metrics)
*   **AI SDK**: [@google/genai](https://www.npmjs.com/package/@google/genai) integration (structured schema output)
*   **Export Engine**: [html2canvas](https://html2canvas.hertzen.com/) with color normalization
*   **Build Protocol & Servicing**: [Vite](https://vitejs.dev/)

---

## 🚀 Getting Started & Local Setup

Follow these simple instructions to clone, build, and launch PomoFlow locally:

### 1. Prerequisites
Ensure you have Node.js (v18 or higher) and npm installed.

```bash
node -v
npm -v
```

### 2. Installation
Clone your repository, navigate to the code root directory, and run packages installation:

```bash
# Install dependencies
npm install
```

### 3. Setup Environment Variables
If utilizing the AI Cognitive Estimator, define your Google Gemini credentials by creating a local environment configuration: For standalone clients, the `GEMINI_API_KEY` is referenced.

Create a `.env` file in the project root:
```env
# Optional to override or populate keys
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
Boot the Vite server on the required local port (the environment directs default listeners):

```bash
npm run dev
```

### 5. Production Compiling
To build and optimize the application package for server deployments:

```bash
# Build the optimized output folder
npm run build

# Preview production build locally
npm run preview
```
