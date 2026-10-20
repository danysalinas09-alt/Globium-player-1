import React, { useState } from 'react';
import { X, Upload, Film, Image as ImageIcon, Sparkles, FileText, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import type { LevelNumber, LevelPart, Lesson, OverlayEvent } from '../types/index.ts';
import { LEVEL_METADATA } from '../utils/curriculumData.ts';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: LevelNumber;
  currentPart: LevelPart;
  currentLessonNumber: number;
  allLessons: Lesson[];
  onAddVideo: (
    lessonId: string,
    videoData: { src: string; title: string; events: OverlayEvent[] }
  ) => void;
  onDeleteVideo: (lessonId: string, videoPartId: string) => void;
  onAddVocab: (
    lessonId: string,
    vocabData: { word: string; translation: string; img: string; category?: string; exampleSentence?: string }
  ) => void;
  onDeleteVocab?: (lessonId: string, vocabId: string) => void;
  onAddOverlay: (
    lessonId: string,
    videoPartId: string,
    overlayData: Omit<OverlayEvent, 'id'>
  ) => void;
  onAddDocument: (
    lessonId: string,
    docData: { title: string; type: 'pdf' | 'worksheet' | 'link' | 'exercise'; url: string; fileSize?: string }
  ) => void;
}

type TabType = 'video' | 'vocab' | 'overlay' | 'doc';

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  currentPart,
  currentLessonNumber,
  allLessons,
  onAddVideo,
  onDeleteVideo,
  onAddVocab,
  onDeleteVocab,
  onAddOverlay,
  onAddDocument,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<LevelNumber>(currentLevel);
  const [selectedPart, setSelectedPart] = useState<LevelPart>(currentPart);
  const [selectedLessonNumber, setSelectedLessonNumber] = useState<number>(currentLessonNumber);
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [confirmDeleteVideoId, setConfirmDeleteVideoId] = useState<string | null>(null);
  const [confirmDeleteVocabId, setConfirmDeleteVocabId] = useState<string | null>(null);

  // Form states for Video
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Form states for Vocab
  const [vocabWord, setVocabWord] = useState('');
  const [vocabTranslation, setVocabTranslation] = useState('');
  const [vocabCategory, setVocabCategory] = useState('Key Vocabulary');
  const [vocabSentence, setVocabSentence] = useState('');
  const [vocabImageUrl, setVocabImageUrl] = useState('');
  const [vocabImageFile, setVocabImageFile] = useState<File | null>(null);

  // Form states for Overlay / Badges
  const [overlayStartTime, setOverlayStartTime] = useState<number>(10);
  const [overlayEndTime, setOverlayEndTime] = useState<number>(13);
  const [overlayX, setOverlayX] = useState<number>(75);
  const [overlayY, setOverlayY] = useState<number>(55);
  const [overlayBadgeNum, setOverlayBadgeNum] = useState<string>('25');
  const [overlayText, setOverlayText] = useState<string>('');
  const [overlayPause, setOverlayPause] = useState<boolean>(false);
  const [overlayTargetVideoPartIndex, setOverlayTargetVideoPartIndex] = useState<number>(0);

  // Form states for Document
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<'pdf' | 'worksheet' | 'link' | 'exercise'>('pdf');
  const [docUrl, setDocUrl] = useState('');

  if (!isOpen) return null;

  // Find target lesson
  const targetLessonId = `L${selectedLevel}${selectedPart}-${
    selectedLessonNumber < 10 ? '0' + selectedLessonNumber : selectedLessonNumber
  }`;
  const targetLesson = allLessons.find((l) => l.id === targetLessonId);

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl && !videoFile) {
      alert('Please provide a video file or enter a video URL.');
      return;
    }

    let finalSrc = videoUrl;
    if (videoFile) {
      finalSrc = URL.createObjectURL(videoFile);
    }

    onAddVideo(targetLessonId, {
      src: finalSrc,
      title: videoTitle || `Lesson ${selectedLessonNumber} Video`,
      events: [],
    });

    setVideoTitle('');
    setVideoUrl('');
    setVideoFile(null);
    showNotification(`Video added successfully to Level ${selectedLevel}${selectedPart} - Lesson ${selectedLessonNumber}!`);
  };

  const executeDeleteVideo = (videoPartId: string) => {
    onDeleteVideo(targetLessonId, videoPartId);
    setConfirmDeleteVideoId(null);
    showNotification(`Video deleted successfully from Lesson ${selectedLessonNumber}.`);
  };


  const handleVocabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vocabWord.trim()) {
      alert('Please enter the English word.');
      return;
    }

    const processSubmission = (imgSrc: string) => {
      onAddVocab(targetLessonId, {
        word: vocabWord.trim(),
        translation: vocabTranslation.trim() || 'Translation',
        category: vocabCategory.trim() || 'General',
        exampleSentence: vocabSentence.trim() || undefined,
        img: imgSrc || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80',
      });

      setVocabWord('');
      setVocabTranslation('');
      setVocabSentence('');
      setVocabImageUrl('');
      setVocabImageFile(null);
      showNotification(`Vocabulary card "${vocabWord}" added successfully!`);
    };

    if (vocabImageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        processSubmission(event.target?.result as string);
      };
      reader.readAsDataURL(vocabImageFile);
    } else {
      processSubmission(vocabImageUrl);
    }
  };

  const handleOverlaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLesson || targetLesson.videos.length === 0) {
      alert('This lesson has no videos yet. Please upload a video first.');
      return;
    }

    const targetVideo = targetLesson.videos[overlayTargetVideoPartIndex] || targetLesson.videos[0];

    const htmlContent = `
      <div class="cake-badge">
        <div class="number">${overlayBadgeNum || '20'}</div>
        <div class="sub-icon"><i class="fa-solid fa-cake-candles"></i></div>
      </div>
    `;

    onAddOverlay(targetLessonId, targetVideo.id, {
      startTime: Number(overlayStartTime),
      endTime: overlayEndTime ? Number(overlayEndTime) : null,
      x: Number(overlayX),
      y: Number(overlayY),
      pauseOnTrigger: overlayPause,
      badgeNumber: overlayBadgeNum,
      badgeIcon: 'fa-solid fa-cake-candles',
      text: overlayText,
      type: 'badge',
      html: htmlContent,
    });

    showNotification(`Interactive Overlay (Badge #${overlayBadgeNum}) configured at ${overlayStartTime}s!`);
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      alert('Please enter a document title.');
      return;
    }

    onAddDocument(targetLessonId, {
      title: docTitle.trim(),
      type: docType,
      url: docUrl.trim() || '#',
      fileSize: '1.2 MB',
    });

    setDocTitle('');
    setDocUrl('');
    showNotification(`Worksheet "${docTitle}" attached to lesson!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1e1017] border-2 border-[#831843] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="bg-[#4a0414] px-6 py-4 flex items-center justify-between border-b border-[#831843]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#831843] flex items-center justify-center text-rose-300 shadow">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide uppercase">
                GLOBIUM English · Teaching Materials
              </h2>
              <p className="text-xs text-rose-300">
                Upload MP4 videos, delete uploaded videos, add vocabulary cards, badges, and worksheets
              </p>
            </div>

          </div>
          <button
            onClick={onClose}
            className="text-rose-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Level / Part / Lesson Selector for Target */}
        <div className="bg-[#2e0914] px-6 py-3 border-b border-[#63051b] flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-rose-200">Assign materials to:</span>

          <div className="flex items-center gap-1.5 bg-[#4a0414] px-2.5 py-1 rounded-lg border border-rose-900/60">
            <label className="text-rose-300 font-medium">Level:</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value) as LevelNumber)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              {Array.from({ length: 13 }, (_, i) => i + 1).map((lvl) => (
                <option key={lvl} value={lvl} className="bg-[#4a0414] text-white">
                  Level {lvl} - {LEVEL_METADATA[lvl as LevelNumber]?.name || ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#4a0414] p-1 rounded-lg border border-rose-900/60">
            <button
              type="button"
              onClick={() => {
                setSelectedPart('A');
                if (selectedLessonNumber > 15) setSelectedLessonNumber(1);
              }}
              className={`px-2.5 py-0.5 rounded font-bold transition ${
                selectedPart === 'A' ? 'bg-[#fb7185] text-black shadow' : 'text-rose-200 hover:text-white'
              }`}
            >
              Part A (1-15)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPart('B');
                if (selectedLessonNumber < 17) setSelectedLessonNumber(17);
              }}
              className={`px-2.5 py-0.5 rounded font-bold transition ${
                selectedPart === 'B' ? 'bg-[#fb7185] text-black shadow' : 'text-rose-200 hover:text-white'
              }`}
            >
              Part B (17-31)
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-[#4a0414] px-2.5 py-1 rounded-lg border border-rose-900/60">
            <label className="text-rose-300 font-medium">Lesson:</label>
            <select
              value={selectedLessonNumber}
              onChange={(e) => setSelectedLessonNumber(Number(e.target.value))}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              {(selectedPart === 'A'
                ? Array.from({ length: 15 }, (_, i) => i + 1)
                : Array.from({ length: 15 }, (_, i) => 17 + i)
              ).map((les) => (
                <option key={les} value={les} className="bg-[#4a0414] text-white">
                  Lesson {les < 10 ? '0' + les : les} ({selectedLevel}{selectedPart})
                </option>
              ))}
            </select>
          </div>

          {targetLesson && (
            <span className="text-rose-300/80 truncate max-w-[200px] hidden md:inline">
              ({targetLesson.title})
            </span>
          )}
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="bg-emerald-900/90 border-b border-emerald-500 text-emerald-100 px-6 py-2 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-[#63051b] bg-[#140409]">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-3 px-4 text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'video'
                ? 'border-[#fb7185] text-[#fb7185] bg-[#2a0611]'
                : 'border-transparent text-rose-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-4 h-4" />
            MANAGE & UPLOAD VIDEOS
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex-1 py-3 px-4 text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'vocab'
                ? 'border-[#fb7185] text-[#fb7185] bg-[#2a0611]'
                : 'border-transparent text-rose-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            ADD VOCABULARY
          </button>
          <button
            onClick={() => setActiveTab('overlay')}
            className={`flex-1 py-3 px-4 text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'overlay'
                ? 'border-[#fb7185] text-[#fb7185] bg-[#2a0611]'
                : 'border-transparent text-rose-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            BADGES & OVERLAYS
          </button>
          <button
            onClick={() => setActiveTab('doc')}
            className={`flex-1 py-3 px-4 text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'doc'
                ? 'border-[#fb7185] text-[#fb7185] bg-[#2a0611]'
                : 'border-transparent text-rose-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            WORKSHEETS & DOCS
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: VIDEOS (UPLOAD AND DELETE) */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              {/* CURRENT UPLOADED VIDEOS LIST WITH DELETE BUTTON */}
              <div className="bg-[#140409] border border-rose-900/80 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Current Videos in Lesson {selectedLessonNumber} ({targetLesson?.videos.length || 0})
                    </span>
                  </div>
                  <span className="text-[11px] text-rose-300">
                    You can delete any uploaded video below
                  </span>
                </div>

                {!targetLesson || targetLesson.videos.length === 0 ? (
                  <div className="p-4 text-center text-xs text-rose-300/80 bg-black/20 rounded-lg border border-dashed border-rose-900">
                    No videos uploaded for this lesson yet. Upload one below!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {targetLesson.videos.map((vid, idx) => (
                      <div
                        key={vid.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#2a0611] p-3 rounded-xl border border-rose-900/60 hover:border-rose-700 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#4a0414] text-rose-300 flex items-center justify-center font-bold text-xs border border-rose-800">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              {vid.title || `Video Part ${idx + 1}`}
                            </p>
                            <p className="text-[11px] text-rose-300/80 truncate max-w-xs sm:max-w-md font-mono">
                              {vid.label} · {vid.events.length} interactive overlay(s)
                            </p>
                          </div>
                        </div>

                        {/* DELETE VIDEO BUTTON WITH INLINE CONFIRMATION */}
                        {confirmDeleteVideoId === vid.id ? (
                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => executeDeleteVideo(vid.id)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition shadow"
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteVideoId(null)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteVideoId(vid.id)}
                            className="self-end sm:self-auto px-3 py-1.5 bg-red-950/90 hover:bg-red-800 text-red-200 hover:text-white border border-red-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
                            title="Delete this uploaded video"
                            aria-label={`Delete video ${vid.title || idx + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            <span>Delete Video</span>
                          </button>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* UPLOAD NEW VIDEO FORM */}
              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div className="border-t border-rose-900/50 pt-4">
                  <h3 className="text-xs font-bold text-rose-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-rose-400" />
                    Upload / Add New Video to this Lesson
                  </h3>
                </div>

                <div className="bg-[#3b0817]/60 border border-rose-900/50 p-3.5 rounded-xl text-xs text-rose-200">
                  <p className="font-semibold text-rose-100 mb-1">
                    💡 Local & Remote Video Support:
                  </p>
                  <p>
                    Select an <strong>.mp4</strong> or <strong>.webm</strong> file from your computer (e.g., <code className="text-rose-300 font-mono">Lesson1.mp4</code>), or enter a direct video URL.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1.5">
                    Video Title (Part Description):
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder={`e.g., ${selectedLevel}${selectedPart} Lesson ${selectedLessonNumber} (Part ${(targetLesson?.videos.length || 0) + 1})`}
                    className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File picker */}
                  <div className="border-2 border-dashed border-rose-800 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-[#140409]/60 hover:border-rose-500 transition cursor-pointer">
                    <Film className="w-8 h-8 text-rose-400 mb-2" />
                    <span className="text-xs font-bold text-rose-200">Select MP4/WebM from your PC</span>
                    <span className="text-[11px] text-rose-400/80 mt-1">Instant local playback</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setVideoFile(e.target.files[0]);
                          if (!videoTitle) {
                            setVideoTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                          }
                        }
                      }}
                      className="mt-3 text-xs text-rose-300 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-rose-900 file:text-rose-100 hover:file:bg-rose-800"
                    />
                    {videoFile && (
                      <span className="mt-2 text-xs text-emerald-400 font-semibold">
                        Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    )}
                  </div>

                  {/* URL direct input */}
                  <div className="flex flex-col justify-center space-y-2 bg-[#140409]/60 border border-rose-900/60 rounded-xl p-4">
                    <label className="text-xs font-bold text-rose-200 uppercase tracking-wider">
                      Or Enter Direct Video URL:
                    </label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://.../video.mp4"
                      className="w-full bg-[#1b0710] border border-rose-900 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                    />
                    <span className="text-[11px] text-rose-300/70">
                      Or leave empty to use the selected file above.
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold rounded-xl text-sm tracking-wide shadow-lg transition mt-4"
                >
                  + Upload and Attach Video to Lesson
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: VOCABULARY */}
          {activeTab === 'vocab' && (
            <div className="space-y-6">
              {/* CURRENT VOCABULARY LIST */}
              {targetLesson && targetLesson.vocabList.length > 0 && (
                <div className="bg-[#140409] border border-rose-900/80 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Current Vocabulary Cards ({targetLesson.vocabList.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {targetLesson.vocabList.map((voc) => (
                      <div
                        key={voc.id}
                        className="bg-[#2a0611] p-2 rounded-lg border border-rose-900 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={voc.img}
                            alt={voc.word}
                            className="w-8 h-8 rounded object-cover shrink-0 bg-black/40"
                          />
                          <div className="truncate">
                            <span className="text-xs font-bold text-white block truncate">{voc.word}</span>
                            <span className="text-[10px] text-rose-300 block truncate">{voc.translation}</span>
                          </div>
                        </div>
                        {onDeleteVocab && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete vocabulary card "${voc.word}"?`)) {
                                onDeleteVocab(targetLessonId, voc.id);
                                showNotification(`Removed "${voc.word}".`);
                              }
                            }}
                            className="text-red-400 hover:text-red-200 p-1"
                            title="Delete card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ADD VOCABULARY FORM */}
              <form onSubmit={handleVocabSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1">
                      English Word *:
                    </label>
                    <input
                      type="text"
                      required
                      value={vocabWord}
                      onChange={(e) => setVocabWord(e.target.value)}
                      placeholder="e.g., Enthusiastic, Schedule, Airport..."
                      className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1">
                      Spanish Translation:
                    </label>
                    <input
                      type="text"
                      value={vocabTranslation}
                      onChange={(e) => setVocabTranslation(e.target.value)}
                      placeholder="e.g., Entusiasmado, Horario, Aeropuerto..."
                      className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1">
                      Category / Topic:
                    </label>
                    <input
                      type="text"
                      value={vocabCategory}
                      onChange={(e) => setVocabCategory(e.target.value)}
                      placeholder="e.g., Emotions, Travel, Business, Grammar"
                      className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1">
                      Example Sentence (Context):
                    </label>
                    <input
                      type="text"
                      value={vocabSentence}
                      onChange={(e) => setVocabSentence(e.target.value)}
                      placeholder="e.g., She was enthusiastic about her upcoming trip."
                      className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1.5">
                    Visual Flashcard Image:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-[#140409] border border-rose-900 rounded-lg p-3">
                      <span className="text-[11px] text-rose-300 block mb-1">Upload image file from PC:</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setVocabImageFile(e.target.files[0]);
                          }
                        }}
                        className="text-xs text-rose-200 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-rose-900 file:text-rose-100"
                      />
                    </div>
                    <div className="bg-[#140409] border border-rose-900 rounded-lg p-3">
                      <span className="text-[11px] text-rose-300 block mb-1">Or paste Image URL:</span>
                      <input
                        type="text"
                        value={vocabImageUrl}
                        onChange={(e) => setVocabImageUrl(e.target.value)}
                        placeholder="https://.../image.jpg"
                        className="w-full bg-transparent border-0 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold rounded-xl text-sm tracking-wide shadow-lg transition mt-4"
                >
                  + Add Vocabulary Card
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: INTERACTIVE OVERLAYS & BADGES */}
          {activeTab === 'overlay' && (
            <form onSubmit={handleOverlaySubmit} className="space-y-4">
              <div className="bg-[#3b0817]/60 border border-rose-900/50 p-4 rounded-xl text-xs text-rose-200">
                <p className="font-semibold text-rose-100 mb-1">
                  🎯 Interactive Overlays & Badges:
                </p>
                <p>
                  Set circular cake-badges (like the 20 or 23 badges in the player) to pop in automatically during video playback at exact seconds.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase mb-1">
                    Lesson Video:
                  </label>
                  <select
                    value={overlayTargetVideoPartIndex}
                    onChange={(e) => setOverlayTargetVideoPartIndex(Number(e.target.value))}
                    className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {targetLesson?.videos.map((v, idx) => (
                      <option key={v.id} value={idx}>
                        Part {idx + 1}: {v.title || `Video ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase mb-1">
                    Start Time (Seconds):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={overlayStartTime}
                    onChange={(e) => setOverlayStartTime(Number(e.target.value))}
                    className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase mb-1">
                    End Time (Seconds):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={overlayEndTime}
                    onChange={(e) => setOverlayEndTime(Number(e.target.value))}
                    className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase mb-1">
                    Badge Number or Text:
                  </label>
                  <input
                    type="text"
                    value={overlayBadgeNum}
                    onChange={(e) => setOverlayBadgeNum(e.target.value)}
                    placeholder="e.g., 20, 23, 100, 1A..."
                    className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase mb-1">
                    Horizontal Position X (%):
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="90"
                    value={overlayX}
                    onChange={(e) => setOverlayX(Number(e.target.value))}
                    className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase mb-1">
                    Vertical Position Y (%):
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="90"
                    value={overlayY}
                    onChange={(e) => setOverlayY(Number(e.target.value))}
                    className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="overlayPause"
                  checked={overlayPause}
                  onChange={(e) => setOverlayPause(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-0 w-4 h-4"
                />
                <label htmlFor="overlayPause" className="text-xs text-rose-200 cursor-pointer">
                  Pause video automatically when this overlay appears (for student reflection / speaking prompt)
                </label>
              </div>

              {/* Badge Preview */}
              <div className="bg-[#140409] border border-rose-900/60 p-4 rounded-xl flex items-center justify-center gap-6">
                <div className="text-xs text-rose-300 font-semibold">
                  Badge Live Preview:
                </div>
                <div className="cake-badge" style={{ width: '110px', height: '110px', border: '4px solid #fff' }}>
                  <div className="number" style={{ fontSize: '38px' }}>{overlayBadgeNum || '20'}</div>
                  <div className="sub-icon" style={{ fontSize: '20px' }}>
                    <i className="fa-solid fa-cake-candles"></i>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold rounded-xl text-sm tracking-wide shadow-lg transition mt-4"
              >
                + Configure Interactive Overlay
              </button>
            </form>
          )}

          {/* TAB 4: DOCUMENTS & WORKSHEETS */}
          {activeTab === 'doc' && (
            <form onSubmit={handleDocSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1">
                  Document / Worksheet Title *:
                </label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g., Grammar Cheat Sheet - Present Simple.pdf"
                  className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1">
                    Material Type:
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="worksheet">Exercise Worksheet</option>
                    <option value="exercise">Interactive Activity</option>
                    <option value="link">Web Resource Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1">
                    URL or Download Link:
                  </label>
                  <input
                    type="text"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    placeholder="https://... or cloud drive link"
                    className="w-full bg-[#140409] border border-rose-900 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold rounded-xl text-sm tracking-wide shadow-lg transition mt-4"
              >
                + Attach Worksheet to Lesson
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
