import { Language, TimerMode } from '../types';

export const TRANSLATIONS = {
  en: {
    // General / Frame
    appTitle: "PomoFlow",
    appTagline: "Flow to Success",
    today: "Today",
    sessionsToday: "Sessions Completed Today",
    version: "PomoFlow v2.0",
    
    // Header Actions
    generateReport: "Session Report",
    languageSetting: "Language",
    settingsTitle: "Settings",
    
    // Settings Sections / Titles
    themeTitle: "Theme & Color Palette",
    productivityTitle: "Focus & Flow Settings",
    cycleTitle: "Timer Mode Cycle",
    guideTitle: "Productivity Cycle Guide",
    completedTodayFooter: "Sessions Completed Today: ",
    
    // Themes definitions
    themeClassicName: "Classic",
    themeClassicDesc: "Warm neutrals & timeless tones",
    themeMidnightName: "Midnight",
    themeMidnightDesc: "Deep navy, dark blues, cool dark hues",
    themeForestName: "Forest",
    themeForestDesc: "Earthy greens, mossy tones, natural accents",
    themeSakuraName: "Sakura",
    themeSakuraDesc: "Soft pinks, petals, gentle pastels",
    
    tagCozy: "Cozy Accent",
    tagNeon: "Neon Indigo",
    tagEarthy: "Earthy Moss",
    tagBlossom: "Blossom Pink",
    
    // Cycle Descriptions
    cyclePomodoroTitle: "Pomodoro (Default)",
    cyclePomodoroDesc: "Standard 25-minute focus session with 5-minute break and 15-minute long break.",
    cycleUltradianTitle: "Ultradian Rhythm",
    cycleUltradianDesc: "90-minute focus session followed by an engineering 20-minute cognitive break.",
    
    // Switches
    focusLockTitle: "Focus Lock Mode",
    focusLockDesc: "Prevents accidental timer disruption. Requires confirmation to stop or reset active timers.",
    ambientMusicTitle: "Auto Ambient Music",
    ambientMusicDesc: "Play focus beats or calming relaxing sounds that automatically shift with active sessions.",
    
    // Guides Section
    guidePomodoroTitle: "Classic Pomodoro Cycle",
    guidePomodoroDesc: "Focus mind fully for 25 minutes followed by a short 5-minute break. After 4 completed sessions, take a longer 15-minute break to restore maximum potential.",
    guideUltradianTitle: "Ultradian Rhythm Cycle",
    guideUltradianDesc: "Our body's natural cognitive window operates in 90-minute high-focus cycles before needing a 20-minute deep recovery break to restore cognitive neurotransmitters.",
    
    // Music Player Labels
    musicMoodNormal: "Normal (Lo-Fi Study)",
    musicMoodTired: "Tired (Calming Piano)",
    musicMoodEnergetic: "Energetic (Upbeat Beats)",
    musicMoodBreak: "Breaks (Relaxing Classical)",
    playlistTitle: "Playlist",
    previousBtn: "Previous",
    nextBtn: "Next",
    
    // Timer labels
    timerModeFocus: "Focus Session",
    timerModeShortBreak: "Short Break",
    timerModeLongBreak: "Long Break",
    timerModeUltradian: "Ultradian Focus",
    timerModeUltradianBreak: "Ultradian Break",
    focusSessionProgress: "Foci Sesi",
    resetWarning: "Click again to interrupt focus!",
    sessionTracker: "Session",
    
    // Tab shortcuts
    tabFocus: "Focus",
    tabShortBreak: "S. Break",
    tabLongBreak: "L. Break",
    tabUltradian: "Ultradian",
    tabUltradianBreak: "U. Break",
    
    // Task lists
    tasksTitle: "Daily Tasks",
    taskInputPlaceholder: "What do you want to accomplish today?",
    taskAddTooltip: "Add Task",
    aiEstimate: "AI Estimate Sesi",
    aiEstimateBtn: "Estimate with AI",
    aiEstimating: "Estimating...",
    aiHeader: "AI Productivity Assistant Recommendation",
    aiOptionNormal: "Use Standard Pomodoro Timer",
    aiOptionCustom: "Use Custom AI Estimate Duration",
    tasksCountSuffix: "tasks",
    noTasksPlaceholder: "No tasks for today yet. Add a task to initiate flow.",
    estimatedRemainingText: "Estimated remaining time for all tasks:",
    minutesUnit: "minutes",
    completedUnits: "Sessions",
    startTaskTooltip: "Activate Task Focus",
    activeFocusLabel: "Active Focus:",
    minutesPerSession: "m / Session",
    
    // Mood check-in
    moodCheckTitle: "Mood Check-in",
    moodCheckDesc: "How are you feeling right now?",
    moodTiredTitle: "Tired / Fatigue",
    moodTiredDesc: "Gentle pace & soothing ambient soundscape",
    moodNormalTitle: "Normal / Focused",
    moodNormalDesc: "Steady concentration & Lo-fi chillout",
    moodEnergeticTitle: "Energetic / High",
    moodEnergeticDesc: "Fast-tempo & motivating synth beats",
    
    // Share report Card
    reportTrophyTitle: "PomoFlow Status Report",
    reportTrophyTag: "Daily Achievements",
    statsMinutesFocused: "Focused Minutes",
    statsSessionsCompleted: "Completed Sessions",
    statsStreak: "Daily Streak",
    statsTasksDone: "Tasks Completed",
    completedTasksListLabel: "Completed Tasks:",
    noCompletedTasksYet: "No completed tasks yet",
    motivationQuote: "Keep feeding your focus every day!",
    saveImageBtn: "Save Report Image",
    streakDayUnit: "Day",
    
    // Confirm Switch Modal
    confirmSwitchTitle: "Switch Running Session?",
    confirmSwitchDesc: "Do you want to stop the current timer and switch modes? Your current session progress will be lost.",
    confirmSwitchCancel: "Keep Focus / Keep Concentrating",
    confirmSwitchConfirm: "Yes, Stop & Change",
    
    // Interactive actions
    close: "Close",
    selectLabel: "Select"
  },
  id: {
    // General / Frame
    appTitle: "PomoFlow",
    appTagline: "Flow to Success",
    today: "Hari Ini",
    sessionsToday: "Sesi Selesai Hari Ini",
    version: "PomoFlow v2.0",
    
    // Header Actions
    generateReport: "Rapor Sesi",
    languageSetting: "Bahasa",
    settingsTitle: "Pengaturan",
    
    // Settings Sections / Titles
    themeTitle: "Tema & Palet Warna",
    productivityTitle: "Fokus & Kelancaran",
    cycleTitle: "Siklus Mode Timer",
    guideTitle: "Panduan Siklus Produktivitas",
    completedTodayFooter: "Sesi Hari Ini Selesai: ",
    
    // Themes definitions
    themeClassicName: "Klasik",
    themeClassicDesc: "Warna netral hangat & nuansa abadi",
    themeMidnightName: "Tengah Malam",
    themeMidnightDesc: "Biru dongker, biru tua, nuansa futuristik",
    themeForestName: "Hutan",
    themeForestDesc: "Hijau alami, warna lumut, aksen natural",
    themeSakuraName: "Sakura",
    themeSakuraDesc: "Merah muda lembut, kelopak bunga, warna pastel",
    
    tagCozy: "Cozy Accent",
    tagNeon: "Neon Indigo",
    tagEarthy: "Earthy Moss",
    tagBlossom: "Blossom Pink",
    
    // Cycle Descriptions
    cyclePomodoroTitle: "Pomodoro (Bawaan)",
    cyclePomodoroDesc: "Siklus standar 25 menit fokus, diikuti istirahat singkat 5 menit dan istirahat panjang 15 menit.",
    cycleUltradianTitle: "Ritme Ultradian",
    cycleUltradianDesc: "Siklus alami tubuh dengan 90 menit fokus penuh diikuti dengan 20 menit istirahat kognitif.",
    
    // Switches
    focusLockTitle: "Focus Lock Mode",
    focusLockDesc: "Mencegah pemberhentian timer secara tidak sengaja. Memerlukan konfirmasi untuk menghentikan timer aktif.",
    ambientMusicTitle: "Backsound Musik Otomatis",
    ambientMusicDesc: "Mainkan ketukan pemicu fokus atau musik penenang yang otomatis berganti sesuai sesi aktif.",
    
    // Guides Section
    guidePomodoroTitle: "Siklus Pomodoro Klasik",
    guidePomodoroDesc: "Memfokuskan pikiran selama 25 menit diikuti istirahat singkat 5 menit. Setelah 4 sesi fokus, lakukan istirahat panjang 15 menit agar re-charge energi maksimal.",
    guideUltradianTitle: "Siklus Ritme Ultradian",
    guideUltradianDesc: "Metode kognitif alami tubuh yang bekerja optimal dalam jendela waktu ~90 menit fokus penuh sebelum membutuhkan istirahat 20 menit untuk memulihkan neurotransmiter otak.",
    
    // Music Player Labels
    musicMoodNormal: "Biasa (Lo-Fi Study)",
    musicMoodTired: "Lelah (Calming Piano)",
    musicMoodEnergetic: "Semangat (Upbeat Beats)",
    musicMoodBreak: "Break (Relaxing Classical)",
    playlistTitle: "Daftar Putar",
    previousBtn: "Sebelumnya",
    nextBtn: "Selanjutnya",
    
    // Timer labels
    timerModeFocus: "Fokus Sesi",
    timerModeShortBreak: "Istirahat Pendek",
    timerModeLongBreak: "Istirahat Panjang",
    timerModeUltradian: "Fokus Ultradian",
    timerModeUltradianBreak: "Istirahat Ultradian",
    focusSessionProgress: "Foci Sesi",
    resetWarning: "Klik lagi untuk menghentikan fokus!",
    sessionTracker: "Sesi",
    
    // Tab shortcuts
    tabFocus: "Fokus",
    tabShortBreak: "S. Break",
    tabLongBreak: "L. Break",
    tabUltradian: "Ultradian",
    tabUltradianBreak: "U. Break",
    
    // Task lists
    tasksTitle: "Daftar Tugas Harian",
    taskInputPlaceholder: "Apa yang ingin kamu kerjakan hari ini?",
    taskAddTooltip: "Tambah Tugas",
    aiEstimate: "AI Sesi",
    aiEstimateBtn: "Estimasi dengan AI",
    aiEstimating: "Mengestimasi...",
    aiHeader: "Rekomendasi Asisten AI",
    aiOptionNormal: "Gunakan Timer Pomodoro",
    aiOptionCustom: "Gunakan Estimasi AI",
    tasksCountSuffix: "tugas",
    noTasksPlaceholder: "Belum ada tugas hari ini. Tambahkan tugas baru untuk memulai fokus.",
    estimatedRemainingText: "Estimasi sisa waktu semua tugas:",
    minutesUnit: "menit",
    completedUnits: "Sesi",
    startTaskTooltip: "Mulai Tugas Ini",
    activeFocusLabel: "Fokus Aktif:",
    minutesPerSession: "m / Sesi",
    
    // Mood check-in
    moodCheckTitle: "Mood Check-in",
    moodCheckDesc: "Bagaimana perasaanmu saat ini?",
    moodTiredTitle: "Lelah / Penat",
    moodTiredDesc: "Tempo tenang & suara alam menenangkan",
    moodNormalTitle: "Biasa / Stabil",
    moodNormalDesc: "Konsentrasi stabil & Lo-fi santai",
    moodEnergeticTitle: "Semangat / Aktif",
    moodEnergeticDesc: "Beat tempo cepat & synth pemicu motivasi",
    
    // Share report Card
    reportTrophyTitle: "PomoFlow Rapor Sesi",
    reportTrophyTag: "Pencapaian Hari Ini",
    statsMinutesFocused: "Menit Fokus",
    statsSessionsCompleted: "Sesi Selesai",
    statsStreak: "Hari Beruntun",
    statsTasksDone: "Task Selesai",
    completedTasksListLabel: "Daftar Task Selesai:",
    noCompletedTasksYet: "Belum ada task selesai",
    motivationQuote: "Ayo jadi produktif setiap hari!",
    saveImageBtn: "Simpan Gambar Rapor",
    streakDayUnit: "Hari",
    
    // Confirm Switch Modal
    confirmSwitchTitle: "Ganti Sesi yang Sedang Berjalan?",
    confirmSwitchDesc: "Apakah Anda ingin menghentikan timer saat ini dan berganti mode? Kemajuan sesi Anda yang aktif akan diatur kembali.",
    confirmSwitchCancel: "Batal (Keep Focus)",
    confirmSwitchConfirm: "Ya, Hentikan & Ganti",
    
    // Interactive actions
    close: "Tutup",
    selectLabel: "Pilih"
  }
};

export function getTranslation(lang: Language) {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
