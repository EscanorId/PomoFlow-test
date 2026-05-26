import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, SkipForward, SkipBack, ListMusic, Trash2, Upload, Coffee, Brain, Zap } from 'lucide-react';
import { Mood, TimerMode, Language } from '../types';
import { getTranslation } from '../services/translations';
import { getCustomTracks, saveCustomTrack, deleteCustomTrack, CustomTrack } from '../services/db';

interface Track {
  id?: string;
  title: string;
  artist: string;
  url: string;
  isCustom?: boolean;
  mood: Mood | 'break';
}

interface MusicPlayerProps {
  mood: Mood;
  mode: TimerMode;
  isEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
  language: Language;
  isTimerActive: boolean;
}

const TRACKS_LELAH: Track[] = [
  { title: "Gymnopédie No. 1", artist: "Erik Satie", url: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Satie_-_Gymnopedie_No_1_performed_by_Laurens_Goemaere.mp3", mood: 'tired' },
  { title: "Moonlight Sonata (1st Mov)", artist: "Ludwig v. Beethoven", url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Beethoven_-_Moonlight_Sonata_-_1st_movement.mp3", mood: 'tired' },
  { title: "Clair de Lune", artist: "Claude Debussy", url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Debussy_-_Clair_de_Lune_%28performed_by_Laurens_Goemaere%29.mp3", mood: 'tired' },
  { title: "Nocturne Op. 9 No. 2", artist: "Frédéric Chopin", url: "https://upload.wikimedia.org/wikipedia/commons/a/af/Chopin_Nocturne_Op_9_No_2_in_E_flat_major.mp3", mood: 'tired' },
  { title: "Raindrop Prelude Op. 28 No. 15", artist: "Frédéric Chopin", url: "https://upload.wikimedia.org/wikipedia/commons/3/36/Frederic_Chopin_-_Prelude_in_D-flat_major_op_28_no_15_Raindrop.mp3", mood: 'tired' },
  { title: "Gymnopédie No. 3", artist: "Erik Satie", url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Satie_-_Gymnop%C3%A9die_No._3_performed_by_Laurens_Goemaere.mp3", mood: 'tired' },
  { title: "Goldberg Variations - Aria", artist: "J.S. Bach", url: "https://upload.wikimedia.org/wikipedia/commons/7/77/J.S._Bach_Goldberg_Variations_Aria_BMV_988.mp3", mood: 'tired' },
  { title: "Prelude in E Minor Op. 28 No. 4", artist: "Frédéric Chopin", url: "https://upload.wikimedia.org/wikipedia/commons/0/01/Fr%C3%A9d%C3%A9ric_Chopin_-_Prelude_in_E_minor_Op_28_No_4.mp3", mood: 'tired' },
  { title: "Sonata No. 16 Andante", artist: "W.A. Mozart", url: "https://upload.wikimedia.org/wikipedia/commons/1/15/W.A._Mozart_-_Piano_Sonata_No._16_in_C_major%2C_K._545_-_II._Andante.mp3", mood: 'tired' },
  { title: "Waltz No. 9 'L Adieu'", artist: "Frédéric Chopin", url: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Fr%C3%A9d%C3%A9ric_Chopin_-_Waltzes%2C_Op._69%2C_No._1_-_L%27Adieu_performed_by_Olga_Gurevich.mp3", mood: 'tired' }
];

const TRACKS_BIASA: Track[] = [
  { title: "Synth Lofi Chillout 1", artist: "SoundHelix-1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", mood: 'normal' },
  { title: "Synth Lofi Chillout 2", artist: "SoundHelix-2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", mood: 'normal' },
  { title: "Synth Lofi Chillout 3", artist: "SoundHelix-3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", mood: 'normal' },
  { title: "Synth Lofi Chillout 4", artist: "SoundHelix-4", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", mood: 'normal' },
  { title: "Synth Lofi Chillout 5", artist: "SoundHelix-5", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", mood: 'normal' },
  { title: "Synth Lofi Chillout 6", artist: "SoundHelix-6", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", mood: 'normal' },
  { title: "Synth Lofi Chillout 7", artist: "SoundHelix-7", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", mood: 'normal' },
  { title: "Synth Lofi Chillout 8", artist: "SoundHelix-8", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", mood: 'normal' },
  { title: "Synth Lofi Chillout 9", artist: "SoundHelix-9", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", mood: 'normal' },
  { title: "Synth Lofi Chillout 10", artist: "SoundHelix-10", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", mood: 'normal' }
];

const TRACKS_SEMANGAT: Track[] = [
  { title: "Upbeat Techno Beats 11", artist: "SoundHelix-11", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", mood: 'energetic' },
  { title: "Upbeat Techno Beats 12", artist: "SoundHelix-12", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", mood: 'energetic' },
  { title: "Upbeat Techno Beats 13", artist: "SoundHelix-13", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", mood: 'energetic' },
  { title: "Upbeat Techno Beats 14", artist: "SoundHelix-14", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", mood: 'energetic' },
  { title: "Upbeat Techno Beats 15", artist: "SoundHelix-15", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", mood: 'energetic' },
  { title: "Upbeat Techno Beats 16", artist: "SoundHelix-16", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", mood: 'energetic' },
  { title: "Marche Slave Op. 31", artist: "P.I. Tchaikovsky", url: "https://upload.wikimedia.org/wikipedia/commons/1/14/Tchaikovsky_-_Marche_Slave%2C_Op._31.mp3", mood: 'energetic' },
  { title: "In the Hall of the Mountain King", artist: "Edvard Grieg", url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Grieg_-_In_the_Hall_of_the_Mountain_King.mp3", mood: 'energetic' },
  { title: "Ride of the Valkyries", artist: "Richard Wagner", url: "https://upload.wikimedia.org/wikipedia/commons/1/13/Wagner_-_Ride_of_the_Valkyries_-_Orchestra.mp3", mood: 'energetic' },
  { title: "Stars & Stripes Forever March", artist: "John Philip Sousa", url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Stars_and_Stripes_Forever_March.mp3", mood: 'energetic' }
];

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ mood, mode, isEnabled, onToggleMusic, language, isTimerActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [trackIndex, setTrackIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  // Custom uploaded tracks loaded from IndexedDB
  const [customTracks, setCustomTracks] = useState<CustomTrack[]>([]);
  const [customTrackList, setCustomTrackList] = useState<Track[]>([]);
  const [uploadTargetMood, setUploadTargetMood] = useState<Mood | 'break'>('normal');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const t = getTranslation(language);

  // Load custom tracks from db on mount
  useEffect(() => {
    getCustomTracks()
      .then(tracks => {
        setCustomTracks(tracks);
      })
      .catch(err => console.error("Could not load custom tracks from db:", err));
  }, []);

  // Sync custom loaded tracks and generate secure Object URLs for them
  useEffect(() => {
    const list: Track[] = customTracks.map(track => {
      const url = URL.createObjectURL(track.blob);
      return {
        id: track.id,
        title: track.title,
        artist: track.artist,
        url: url,
        isCustom: true,
        mood: track.mood
      };
    });
    setCustomTrackList(list);

    // Clean up previously created Object URLs to prevent memory leakage
    return () => {
      list.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, [customTracks]);

  // Determine current active playlist category.
  const isBreak = mode === 'SHORT_BREAK' || mode === 'LONG_BREAK' || mode === 'ULTRADIAN_BREAK';
  
  const getPlaylist = (): Track[] => {
    let baseList: Track[] = [];
    let currentMoodCategory: Mood | 'break' = 'normal';

    if (isBreak) {
      baseList = [...TRACKS_LELAH];
      currentMoodCategory = 'break';
    } else {
      currentMoodCategory = mood;
      switch (mood) {
        case 'tired':
          baseList = [...TRACKS_LELAH];
          break;
        case 'energetic':
          baseList = [...TRACKS_SEMANGAT];
          break;
        case 'normal':
        default:
          baseList = [...TRACKS_BIASA];
          break;
      }
    }

    // Filter custom tracks matching the current mood category
    const matchingCustom = customTrackList.filter(t => t.mood === currentMoodCategory);
    return [...baseList, ...matchingCustom];
  };

  const currentPlaylist = getPlaylist();
  const currentTrack = currentPlaylist[trackIndex] || currentPlaylist[0];

  // Sync track URL whenever active mood, mode, or playlist upgrades
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      const safeIndex = trackIndex < currentPlaylist.length ? trackIndex : 0;
      setTrackIndex(safeIndex);
      
      const trackToPlay = currentPlaylist[safeIndex] || currentPlaylist[0];
      if (trackToPlay) {
        audioRef.current.src = trackToPlay.url;
        audioRef.current.load();
        
        if (isEnabled && wasPlaying) {
          audioRef.current.play().catch(e => console.log("Audio play blocked on mood change:", e));
        }
      }
    }
  }, [mood, mode, customTrackList]);

  // Handle setting volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Synchronize music play/pause state with direct timer activity
  const prevTimerActive = useRef(isTimerActive);

  useEffect(() => {
    if (isTimerActive && !prevTimerActive.current) {
      // Timer transitions from inactive to active: auto-start music!
      setIsPlaying(true);
      if (!isEnabled) {
        onToggleMusic(true);
      }
    } else if (!isTimerActive && prevTimerActive.current) {
      // Timer transitions from active to inactive: pause music!
      setIsPlaying(false);
    }
    prevTimerActive.current = isTimerActive;
  }, [isTimerActive, isEnabled, onToggleMusic]);

  // Handle explicit play / pause sync and recovery
  useEffect(() => {
    if (audioRef.current) {
      if (isEnabled && isPlaying) {
        audioRef.current.play().catch(e => {
          console.log("Play action failed, autoplay policy triggered:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isEnabled]);

  const handlePlayPause = () => {
    if (!isEnabled) {
      onToggleMusic(true);
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(e => {
            console.warn("Direct play trigger blocked, retry with fallback:", e);
            // Attempt standard toggle as safe recovery fallback
            setIsPlaying(true);
          });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    const nextIndex = (trackIndex + 1) % currentPlaylist.length;
    setTrackIndex(nextIndex);
    playTrackAt(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (trackIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    setTrackIndex(prevIndex);
    playTrackAt(prevIndex);
  };

  const playTrackAt = (index: number) => {
    setTrackIndex(index);
    if (audioRef.current) {
      audioRef.current.pause();
      const track = currentPlaylist[index] || currentPlaylist[0];
      if (track) {
        audioRef.current.src = track.url;
        audioRef.current.load();
        setIsPlaying(true);
        if (isEnabled) {
          // Play directly inside the scope of the user gesture to completely avoid browser security blocks
          audioRef.current.play().catch(e => {
            console.log("User action playback rejected:", e);
          });
        }
      }
    }
  };

  // Trigger Native file picker
  const triggerUpload = (target: Mood | 'break') => {
    setUploadTargetMood(target);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
    const fileNameLower = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileNameLower.endsWith(ext)) || file.type.startsWith('audio/');

    if (!isValid) {
      alert(language === 'id'
        ? 'Format file tidak didukung! Format yang didukung: MP3, WAV, OGG, M4A, AAC'
        : 'Unsupported file format! Supported formats: MP3, WAV, OGG, M4A, AAC'
      );
      return;
    }

    try {
      const newCustomTrack: CustomTrack = {
        id: Date.now().toString(),
        title: file.name,
        artist: language === 'id' ? 'Lagu Unggahan' : 'Custom Upload',
        mood: uploadTargetMood,
        blob: file
      };

      await saveCustomTrack(newCustomTrack);
      
      const updatedList = await getCustomTracks();
      setCustomTracks(updatedList);
    } catch (err) {
      console.error("IndexedDB custom save failed:", err);
      alert(language === 'id'
        ? 'Gagal menyimpan music custom. Pastikan ruang browser cukup!'
        : 'Could not write custom audio to local browser database. Check device storage!'
      );
    }
  };

  const handleDeleteTrack = async (id: string) => {
    try {
      await deleteCustomTrack(id);
      const updatedList = await getCustomTracks();
      
      // If the currently playing track was deleted, halt or reset to index zero
      const deletingCurrentTrack = currentPlaylist[trackIndex] && currentPlaylist[trackIndex].id === id;
      if (deletingCurrentTrack) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
        setTrackIndex(0);
      }
      
      setCustomTracks(updatedList);
    } catch (err) {
      console.error("Failed to delete track:", err);
    }
  };

  const getMoodLabel = () => {
    if (isBreak) return t.musicMoodBreak;
    switch (mood) {
      case 'tired': return t.musicMoodTired;
      case 'energetic': return t.musicMoodEnergetic;
      case 'normal':
      default:
        return t.musicMoodNormal;
    }
  };

  return (
    <div 
      style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}
      className="flex flex-col gap-4 backdrop-blur-md p-5 rounded-3xl w-full max-w-md border shadow-lg transition-colors duration-1000"
    >
      {/* Hidden Native File Input Controller */}
      <input 
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,.ogg,.m4a,.aac,audio/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <audio 
        ref={audioRef} 
        loop={false} 
        onEnded={handleNext}
        onError={(e) => {
          console.warn("Audio loading failed, auto-skipping to play consecutive tracks safely:", e);
          setTimeout(() => {
            handleNext();
          }, 600);
        }}
      />
      
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-3 rounded-2xl bg-white/5 text-[color:var(--color-accent)] shrink-0 transition-colors duration-1000">
            <Music className="w-5 h-5 animate-pulse" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-white/40 uppercase font-extrabold tracking-widest">{getMoodLabel()}</p>
            <p className="text-sm text-white font-bold truncate line-clamp-1">{currentTrack ? currentTrack.title : 'No Track Selected'}</p>
            <p className="text-xs text-white/60 truncate line-clamp-1">{currentTrack ? currentTrack.artist : '---'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`p-2.5 rounded-xl transition-all ${showPlaylist ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
            title={t.playlistTitle}
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Playlist Selector Dropdown panel */}
      {showPlaylist && (
        <div className="max-h-52 overflow-y-auto bg-black/40 rounded-2xl p-2 border border-white/5 flex flex-col gap-1 text-xs">
          {currentPlaylist.map((track, i) => (
            <div 
              key={track.id || i} 
              className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-white/5 group/track transition-all"
            >
              <button
                onClick={() => playTrackAt(i)}
                style={{ color: trackIndex === i ? 'var(--color-accent)' : undefined }}
                className={`flex-1 text-left truncate flex items-center justify-between pr-2 ${
                  trackIndex === i ? 'font-semibold' : 'text-white/60 hover:text-white'
                }`}
              >
                <span className="truncate">{i + 1}. {track.title}</span>
                <span className="text-[10px] opacity-40 shrink-0 ml-2">{track.artist}</span>
              </button>

              {track.isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTrack(track.id!);
                  }}
                  className="p-1 text-white/30 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors ml-1"
                  title={language === 'id' ? 'Hapus Lagu' : 'Delete Custom Track'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          {currentPlaylist.length === 0 && (
            <div className="text-center py-4 text-white/30 italic">No tracks available</div>
          )}
        </div>
      )}

      {/* Audio Slider & Audio Control Strip */}
      <div className="flex items-center justify-between gap-4 mt-1">
        <div className="flex items-center gap-1">
          <button 
            onClick={handlePrev}
            className="p-2 text-white/60 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
            title={t.previousBtn}
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button 
            onClick={handlePlayPause}
            style={{ backgroundColor: isPlaying ? 'transparent' : 'var(--color-accent)', color: isPlaying ? 'white' : 'black' }}
            className={`p-3 rounded-full hover:scale-105 active:scale-95 transition-all ${
              isPlaying ? 'border border-white/20 text-white hover:bg-white/5' : 'shadow-md'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
          </button>
          <button 
            onClick={handleNext}
            className="p-2 text-white/60 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
            title={t.nextBtn}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 flex-1 max-w-[160px]">
          {volume === 0 ? <VolumeX className="w-4 h-4 text-white/40" /> : <Volume2 className="w-4 h-4 text-white/40" />}
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
          />
        </div>
      </div>

      {/* Custom Music Upload Grid Section */}
      <div className="border-t border-white/5 pt-3 mt-2 flex flex-col gap-2">
        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest flex items-center gap-1.5 leading-none">
          <Upload className="w-3.5 h-3.5 text-[color:var(--color-accent)] animate-bounce" />
          <span>{language === 'id' ? 'Unggah Musik Mandiri' : 'Upload Custom Music'}</span>
        </p>

        <div className="grid grid-cols-2 gap-2 mt-1">
          {/* 1. Tired Mood Profile Button */}
          <button 
            onClick={() => triggerUpload('tired')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all hover:border-[color:var(--color-accent)]/30 text-left outline-none group text-xs text-white/80"
          >
            <Coffee className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
            <div className="overflow-hidden min-w-0">
              <p className="font-extrabold truncate leading-tight">{language === 'id' ? 'Lelah' : 'Tired'}</p>
              <p className="text-[8px] text-white/30 truncate">{customTracks.filter(t => t.mood === 'tired').length} {language === 'id' ? 'Lagu' : 'Tracks'}</p>
            </div>
          </button>

          {/* 2. Normal Mood Profile Button */}
          <button 
            onClick={() => triggerUpload('normal')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all hover:border-[color:var(--color-accent)]/30 text-left outline-none group text-xs text-white/80"
          >
            <Brain className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
            <div className="overflow-hidden min-w-0">
              <p className="font-extrabold truncate leading-tight">{language === 'id' ? 'Normal' : 'Normal'}</p>
              <p className="text-[8px] text-white/30 truncate">{customTracks.filter(t => t.mood === 'normal').length} {language === 'id' ? 'Lagu' : 'Tracks'}</p>
            </div>
          </button>

          {/* 3. Energetic Mood Profile Button */}
          <button 
            onClick={() => triggerUpload('energetic')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all hover:border-[color:var(--color-accent)]/30 text-left outline-none group text-xs text-white/80"
          >
            <Zap className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform shrink-0" />
            <div className="overflow-hidden min-w-0">
              <p className="font-extrabold truncate leading-tight">{language === 'id' ? 'Semangat' : 'Energetic'}</p>
              <p className="text-[8px] text-white/30 truncate">{customTracks.filter(t => t.mood === 'energetic').length} {language === 'id' ? 'Lagu' : 'Tracks'}</p>
            </div>
          </button>

          {/* 4. Breaks Profile Button */}
          <button 
            onClick={() => triggerUpload('break')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all hover:border-[color:var(--color-accent)]/30 text-left outline-none group text-xs text-white/80"
          >
            <Music className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
            <div className="overflow-hidden min-w-0">
              <p className="font-extrabold truncate leading-tight">{language === 'id' ? 'Istirahat' : 'Breaks'}</p>
              <p className="text-[8px] text-white/30 truncate">{customTracks.filter(t => t.mood === 'break').length} {language === 'id' ? 'Lagu' : 'Tracks'}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
