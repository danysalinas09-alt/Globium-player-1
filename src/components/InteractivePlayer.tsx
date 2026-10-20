import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Layers,
  BookOpen,
  Type,
  PenSquare,
  LogOut,
  PlusCircle,
  X,
  ArrowLeft,
  FileVideo,
  Upload,
} from 'lucide-react';

import type { Lesson, LessonVideoPart, VocabItem, OverlayEvent, LevelNumber, LevelPart } from '../types/index.ts';
import { WhiteboardCanvas } from './WhiteboardCanvas.tsx';
import { SAMPLE_VIDEO_URL_1, SAMPLE_VIDEO_URL_2 } from '../utils/curriculumData.ts';
import { GlobiumLogo } from './GlobiumLogo.tsx';


interface InteractivePlayerProps {
  lesson: Lesson;
  allLessonsInLevelPart: Lesson[];
  onSelectLesson: (lessonId: string) => void;
  onExit: () => void;
  onOpenUploadModal: () => void;
}

export const InteractivePlayer: React.FC<InteractivePlayerProps> = ({
  lesson,
  allLessonsInLevelPart,
  onSelectLesson,
  onExit,
  onOpenUploadModal,
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoLoadError, setVideoLoadError] = useState(false);

  // Active Overlays
  const [activeOverlayIds, setActiveOverlayIds] = useState<Set<string>>(new Set());

  // Modals
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isVocabOpen, setIsVocabOpen] = useState(false);
  const [isLessonsDrawerOpen, setIsLessonsDrawerOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<VocabItem | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Current video part
  const currentVideo: LessonVideoPart | undefined = lesson.videos[currentVideoIndex] || lesson.videos[0];

  // Resolve video src: check if it starts with file:/// and error triggers, use sample
  const resolvedVideoSrc = currentVideo?.src?.startsWith('file:///') && videoLoadError
    ? (currentVideoIndex === 0 ? SAMPLE_VIDEO_URL_1 : SAMPLE_VIDEO_URL_2)
    : currentVideo?.src || SAMPLE_VIDEO_URL_1;

  // Speak word in English using browser SpeechSynthesis
  const speakWord = (word: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Sync video on video index change
  useEffect(() => {
    setVideoLoadError(false);
    setActiveOverlayIds(new Set());
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [currentVideoIndex, lesson.id]);

  // Video ended handler: pause without auto-advancing as in original prototype
  const handleEnded = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser blocked play or source error
          setIsPlaying(false);
        });
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < lesson.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    v.muted = nextMute;
  };

  // Timeline tick and overlay detection
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;

    const time = v.currentTime;
    setCurrentTime(time);

    const events = currentVideo?.events || [];
    const nextActive = new Set<string>();

    events.forEach((evt) => {
      const isCurrent = evt.endTime
        ? time >= evt.startTime && time <= evt.endTime
        : time >= evt.startTime && time <= evt.startTime + 4;

      if (isCurrent) {
        nextActive.add(evt.id);
        if (evt.pauseOnTrigger && !activeOverlayIds.has(evt.id)) {
          v.pause();
          setIsPlaying(false);
        }
      }
    });

    setActiveOverlayIds(nextActive);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleVideoFileLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && videoRef.current) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      videoRef.current.src = objectUrl;
      videoRef.current.load();
      setVideoLoadError(false);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#0f172a] text-white flex flex-row overflow-hidden select-none font-sans">
      {/* BURGUNDY SIDEBAR (matching prototype #4a0414) */}
      <aside className="w-20 bg-[#4a0414] flex flex-col items-center py-3 gap-3 z-50 shadow-2xl border-r border-[#63051b]">
        {/* Brand Icon */}
        <div className="w-full flex items-center justify-center mb-1">
          <button
            onClick={onExit}
            className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg border border-white/80 hover:scale-105 transition-all duration-200 cursor-pointer group"
            title="GLOBIUM English - Open your world (Return to Level Selector)"
            aria-label="GLOBIUM English Home"
          >
            <GlobiumLogo variant="mark" size="sm" />
          </button>
        </div>


        {/* Levels button */}
        <button
          onClick={onExit}
          className="w-full py-2 flex flex-col items-center text-[9px] font-bold uppercase tracking-wider gap-1 text-white hover:bg-white/15 transition border-l-2 border-transparent hover:border-[#fb7185]"
          title="View all levels"
          aria-label="Go to levels list"
        >
          <Layers className="w-4 h-4 text-rose-300" />
          <span>Levels</span>
        </button>

        {/* Lessons drawer trigger */}
        <button
          onClick={() => setIsLessonsDrawerOpen(!isLessonsDrawerOpen)}
          className={`w-full py-2 flex flex-col items-center text-[9px] font-bold uppercase tracking-wider gap-1 text-white transition border-l-2 ${
            isLessonsDrawerOpen ? 'bg-white/20 border-[#fb7185]' : 'border-transparent hover:bg-white/15'
          }`}
          title="View all 15 lessons"
          aria-label="Lessons menu"
        >
          <BookOpen className="w-4 h-4 text-rose-300" />
          <span>Lessons</span>
        </button>

        {/* Vocabulary button */}
        <button
          onClick={() => {
            setIsVocabOpen(true);
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }}
          className={`w-full py-2 flex flex-col items-center text-[9px] font-bold uppercase tracking-wider gap-1 text-white transition border-l-2 ${
            isVocabOpen ? 'bg-white/20 border-[#fb7185]' : 'border-transparent hover:bg-white/15'
          }`}
          title="Lesson vocabulary"
          aria-label="Open vocabulary"
        >
          <Type className="w-4 h-4 text-rose-300" />
          <span>Vocab</span>
        </button>

        {/* Whiteboard button */}
        <button
          onClick={() => {
            setIsWhiteboardOpen(true);
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }}
          className={`w-full py-2 flex flex-col items-center text-[9px] font-bold uppercase tracking-wider gap-1 text-white transition border-l-2 ${
            isWhiteboardOpen ? 'bg-white/20 border-[#fb7185]' : 'border-transparent hover:bg-white/15'
          }`}
          title="Interactive classroom whiteboard"
          aria-label="Open whiteboard"
        >
          <PenSquare className="w-4 h-4 text-rose-300" />
          <span>Board</span>
        </button>

        {/* Upload material shortcut */}
        <button
          onClick={onOpenUploadModal}
          className="w-full py-2 flex flex-col items-center text-[9px] font-bold uppercase tracking-wider gap-1 text-white hover:bg-white/15 transition border-l-2 border-transparent hover:border-[#fb7185]"
          title="Upload or delete class materials"
          aria-label="Upload material to lesson"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Upload</span>
        </button>

        <div className="flex-1" />

        {/* Exit to Home */}
        <button
          onClick={onExit}
          className="w-full py-2 flex flex-col items-center text-[9px] font-bold uppercase tracking-wider gap-1 text-rose-300 hover:text-white hover:bg-white/15 transition"
          title="Exit to main dashboard"
          aria-label="Exit"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit</span>
        </button>


      </aside>

      {/* MAIN STAGE */}
      <main className="flex-1 flex flex-col h-full bg-black relative">
        {/* VIDEO VIEWPORT */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            src={resolvedVideoSrc}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onError={() => {
              setVideoLoadError(true);
            }}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Fallback & Local File Notice (when local file:/// cannot be read directly) */}
          {videoLoadError && (
            <div className="absolute top-4 left-4 right-4 z-20 bg-[#4a0414]/95 border border-[#fb7185] rounded-xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-rose-200">
                <FileVideo className="w-5 h-5 text-rose-400 shrink-0" />
                <span>
                  The local path <code className="text-white bg-black/40 px-1 py-0.5 rounded">{currentVideo?.src}</code> requires direct file selection by browser security. Playing pedagogical sample video or:
                </span>
              </div>
              <label className="bg-[#fb7185] hover:bg-[#f43f5e] text-black font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shadow transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Select {currentVideoIndex === 0 ? 'Lesson1.mp4' : 'lesson1.2.mp4'} from PC</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoFileLocalUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* OVERLAY CONTAINER (Rendering active badges and popups at specified x,y %) */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {currentVideo?.events.map((evt) => {
              if (!activeOverlayIds.has(evt.id)) return null;

              return (
                <div
                  key={evt.id}
                  className="overlay-item"
                  style={{ left: `${evt.x}%`, top: `${evt.y}%` }}
                >
                  {evt.html ? (
                    <div dangerouslySetInnerHTML={{ __html: evt.html }} />
                  ) : (
                    <div className="cake-badge">
                      <div className="number">{evt.badgeNumber || '20'}</div>
                      <div className="sub-icon">
                        <i className={evt.badgeIcon || 'fa-solid fa-cake-candles'}></i>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* WHITEBOARD OVERLAY (TLDRAW or Native Canvas) */}
          {isWhiteboardOpen && (
            <WhiteboardCanvas onClose={() => setIsWhiteboardOpen(false)} />
          )}

          {/* VOCABULARY OVERLAY MODAL */}
          {isVocabOpen && (
            <div className="absolute inset-0 z-50 bg-[#140208]/90 backdrop-blur-md p-6 sm:p-10 flex flex-col items-center overflow-y-auto animate-fadeIn">
              <button
                onClick={() => setIsVocabOpen(false)}
                className="self-end bg-[#4a0414] hover:bg-[#fb7185] hover:text-[#4a0414] text-rose-200 border-2 border-[#fb7185] px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg transition mb-4"
                aria-label="Close vocabulary"
              >
                <X className="w-4 h-4" /> Close Vocabulary
              </button>

              <div className="text-xl sm:text-2xl font-black text-rose-200 uppercase tracking-wider mb-6 flex items-center gap-3">
                <i className="fa-solid fa-images text-[#fb7185]"></i>
                <span>CLASS VOCABULARY ({lesson.level}{lesson.part} - {lesson.title})</span>
              </div>

              {lesson.vocabList.length === 0 ? (
                <div className="text-center py-12 text-rose-300">
                  <p>No vocabulary words added to this lesson yet.</p>
                  <button
                    onClick={() => {
                      setIsVocabOpen(false);
                      onOpenUploadModal();
                    }}
                    className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                  >
                    + Add Vocabulary
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl">
                  {lesson.vocabList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setLightboxItem(item)}
                      className="bg-[#4a0414] border-2 border-[#831843] hover:border-[#fb7185] rounded-xl p-2.5 cursor-pointer flex flex-col items-center transition transform hover:-translate-y-1.5 hover:shadow-xl hover:shadow-rose-900/40 group relative"
                    >
                      <div className="w-full h-32 rounded-lg overflow-hidden bg-slate-900 mb-2 relative">
                        <img
                          src={item.img}
                          alt={item.word}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <button
                          onClick={(e) => speakWord(item.word, e)}
                          className="absolute bottom-2 right-2 p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-full transition shadow"
                          title="Listen pronunciation"
                          aria-label={`Listen pronunciation of ${item.word}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-white font-bold text-sm tracking-wide text-center">
                        {item.word}
                      </span>
                      {item.translation && (
                        <span className="text-rose-300 text-xs font-medium text-center">
                          {item.translation}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LIGHTBOX FOR VOCABULARY CARD */}
          {lightboxItem && (
            <div className="absolute inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-6 animate-fadeIn">
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-6 right-6 bg-[#4a0414] hover:bg-[#fb7185] hover:text-[#4a0414] text-rose-200 border-2 border-[#fb7185] px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg transition"
                aria-label="Back to gallery"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Gallery
              </button>


              <div className="max-w-2xl w-full flex flex-col items-center text-center">
                <img
                  src={lightboxItem.img}
                  alt={lightboxItem.word}
                  className="max-h-[60vh] max-w-full object-contain rounded-2xl border-4 border-[#fb7185] shadow-2xl shadow-rose-950/70 mb-4"
                />
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-black text-white tracking-wide">
                    {lightboxItem.word}
                  </h3>
                  <button
                    onClick={() => speakWord(lightboxItem.word)}
                    className="p-2 bg-[#831843] hover:bg-[#fb7185] hover:text-black text-white rounded-full shadow transition"
                    title="Pronounce in English"
                    aria-label={`Pronounce ${lightboxItem.word}`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                {lightboxItem.translation && (
                  <p className="text-xl text-rose-300 font-semibold mt-1">
                    {lightboxItem.translation}
                  </p>
                )}
                {lightboxItem.exampleSentence && (
                  <p className="text-sm text-slate-300 italic mt-3 bg-white/10 px-4 py-2 rounded-lg max-w-md">
                    "{lightboxItem.exampleSentence}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* LESSONS DRAWER (Quick Switch between the 15 lessons) */}
          {isLessonsDrawerOpen && (
            <div className="absolute top-0 left-0 bottom-0 w-80 bg-[#1e0710]/95 backdrop-blur-md border-r border-[#831843] z-40 flex flex-col p-4 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-rose-900/60 mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-rose-400" />
                  <span className="font-bold text-xs uppercase tracking-wider text-rose-200">
                    Level {lesson.level}{lesson.part} · {lesson.part === 'A' ? 'Lessons 01-15' : 'Lessons 17-31'}
                  </span>
                </div>
                <button
                  onClick={() => setIsLessonsDrawerOpen(false)}
                  className="p-1 text-rose-300 hover:text-white"
                  aria-label="Close lessons list"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {allLessonsInLevelPart.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onSelectLesson(l.id);
                      setIsLessonsDrawerOpen(false);
                      setCurrentVideoIndex(0);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition border flex items-center justify-between ${
                      l.id === lesson.id
                        ? 'bg-[#831843] border-[#fb7185] text-white font-bold shadow'
                        : 'bg-[#2e0914]/60 border-rose-950 text-rose-200 hover:bg-[#4a0414] hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] text-rose-400 font-bold block">
                        LESSON {l.lessonNumber < 10 ? '0' + l.lessonNumber : l.lessonNumber}
                      </span>
                      <span className="line-clamp-1">{l.title}</span>
                    </div>
                    <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded text-rose-300">
                      {l.videos.length} videos
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BURGUNDY BOTTOM CONTROL BAR (Height 52px, #4a0414) */}
        <footer className="h-14 bg-[#4a0414]/95 backdrop-blur-md border-t border-[#831843] flex items-center px-4 gap-4 z-40">
          {/* Lesson Dots for Video Parts */}
          <div className="flex items-center gap-2" title="Lesson video parts">
            {lesson.videos.map((vid, idx) => (
              <button
                key={vid.id}
                onClick={() => setCurrentVideoIndex(idx)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition shadow ${
                  idx === currentVideoIndex
                    ? 'scale-110 shadow-lg ring-2 ring-white ' + (idx === 0 ? 'bg-[#e11d48] text-white' : 'bg-[#002147] text-white')
                    : 'opacity-50 hover:opacity-90 ' + (idx === 0 ? 'bg-[#e11d48] text-white' : 'bg-[#002147] text-white')
                }`}
                title={`Part ${idx + 1}: ${vid.title || vid.label}`}
                aria-label={`Watch video part ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Playback Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-1.5 text-white">
            <button
              onClick={handlePrevVideo}
              disabled={currentVideoIndex === 0}
              className="p-1.5 hover:text-rose-300 disabled:opacity-30 transition"
              title="Previous video"
              aria-label="Previous video"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition hover:scale-105"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={handleNextVideo}
              disabled={currentVideoIndex >= lesson.videos.length - 1}
              className="p-1.5 hover:text-rose-300 disabled:opacity-30 transition"
              title="Next video"
              aria-label="Next video"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Scrubber Timeline */}
          <div className="flex-1 flex items-center gap-3">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleScrubberChange}
              className="w-full accent-[#fb7185] h-1.5 bg-black/40 rounded-lg cursor-pointer"
              aria-label="Video scrubber timeline"
            />
            <span className="text-[11px] font-mono text-rose-200/90 whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Volume / Mute */}
          <button
            onClick={toggleMute}
            className="p-1.5 text-rose-200 hover:text-white transition"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label="Toggle mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Speed Selector */}
          <select
            value={playbackSpeed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="bg-black/40 text-rose-200 border border-rose-900 rounded px-1.5 py-0.5 text-xs outline-none cursor-pointer hidden sm:block"
            aria-label="Playback speed"
          >
            <option value="0.75" className="bg-[#4a0414] text-white">0.75x</option>
            <option value="1" className="bg-[#4a0414] text-white">1.0x</option>
            <option value="1.25" className="bg-[#4a0414] text-white">1.25x</option>
            <option value="1.5" className="bg-[#4a0414] text-white">1.5x</option>
          </select>

          {/* Lesson Tag Label (e.g. 1A Lesson 01   1/2) */}
          <div className="text-sm font-bold text-white tracking-wide whitespace-nowrap px-2 py-1 bg-black/30 rounded border border-white/10 hidden md:block">
            {currentVideo?.label || `${lesson.level}${lesson.part} Lesson ${lesson.lessonNumber < 10 ? '0' + lesson.lessonNumber : lesson.lessonNumber}   ${currentVideoIndex + 1}/${lesson.videos.length}`}
          </div>
        </footer>
      </main>
    </div>
  );
};

