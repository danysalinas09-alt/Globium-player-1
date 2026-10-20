import React, { useState } from 'react';
import {
  BookOpen,
  Film,
  Type,
  Upload,
  Play,
  Search,
  Sparkles,
  GraduationCap,
  RotateCcw,
  Download,
  Share2,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import type { LevelNumber, LevelPart, Lesson } from '../types/index.ts';
import { LEVEL_METADATA } from '../utils/curriculumData.ts';
import { GlobiumLogo } from './GlobiumLogo.tsx';


interface HomePageProps {
  selectedLevel: LevelNumber;
  setSelectedLevel: (lvl: LevelNumber) => void;
  selectedPart: LevelPart;
  setSelectedPart: (part: LevelPart) => void;
  lessons: Lesson[];
  onOpenPlayer: (lessonId: string) => void;
  onOpenUploadModal: (level?: LevelNumber, part?: LevelPart, lessonNum?: number) => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  selectedLevel,
  setSelectedLevel,
  selectedPart,
  setSelectedPart,
  lessons,
  onOpenPlayer,
  onOpenUploadModal,
  onResetData,
  onExportData,
  onImportData,
}) => {
  // Current view: 'level-selection' (landing page) or 'level-curriculum' (lessons grid)
  const [currentView, setCurrentView] = useState<'level-selection' | 'level-curriculum'>('level-selection');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hasVideos' | 'hasVocab'>('all');

  const currentLevelInfo = LEVEL_METADATA[selectedLevel];

  // Filter lessons for current level and part
  const levelPartLessons = lessons
    .filter((l) => l.level === selectedLevel && l.part === selectedPart)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  // Apply search and filter
  const displayedLessons = levelPartLessons.filter((les) => {
    const matchesSearch =
      searchQuery === '' ||
      les.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      les.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      les.grammarFocus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      les.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'hasVideos') return les.videos.length > 0;
    if (filterType === 'hasVocab') return les.vocabList.length > 0;
    return true;
  });

  const handleSelectLevel = (lvl: LevelNumber, part: LevelPart = 'A') => {
    setSelectedLevel(lvl);
    setSelectedPart(part);
    setCurrentView('level-curriculum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      {/* TOP HEADER */}
      <header className="bg-[#4a0414] border-b border-[#831843] sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentView('level-selection')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <GlobiumLogo
              variant="horizontal"
              size="md"
              theme="dark"
              showTagline={true}
              className="group-hover:opacity-95 transition"
            />
            <span className="hidden sm:inline-flex bg-[#fb7185] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow">
              13 Levels
            </span>
          </div>


          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {currentView === 'level-curriculum' && (
              <button
                onClick={() => setCurrentView('level-selection')}
                className="bg-black/30 hover:bg-black/50 text-rose-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-rose-900/60 transition"
              >
                <Layers className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Change Level</span>
              </button>
            )}

            <button
              onClick={() => onOpenUploadModal(selectedLevel, selectedPart, selectedPart === 'A' ? 1 : 17)}
              className="bg-[#e11d48] hover:bg-[#f43f5e] text-white px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Materials</span>
            </button>

            <button
              onClick={onExportData}
              className="bg-black/30 hover:bg-black/50 text-rose-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-rose-900/60 transition"
              title="Backup curriculum to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Backup</span>
            </button>

            <label className="bg-black/30 hover:bg-black/50 text-rose-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-rose-900/60 transition cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Import</span>
              <input type="file" accept=".json" onChange={onImportData} className="hidden" />
            </label>

            <button
              onClick={onResetData}
              className="p-2 text-rose-300 hover:text-white hover:bg-white/10 rounded-xl transition"
              title="Reset default curriculum"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* VIEW 1: HOME PAGE FOR SELECTING THE LEVEL (1 to 13) */}
      {currentView === 'level-selection' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full flex flex-col gap-8">
          {/* Hero Welcome Banner */}
          <div className="bg-gradient-to-r from-[#4a0414] via-[#63051b] to-[#1e0710] border-2 border-[#831843] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl relative z-10">
              <div className="inline-flex items-center gap-2 bg-black/40 text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-900/70 mb-3">
                <GraduationCap className="w-4 h-4 text-rose-400" />
                <span>COMPREHENSIVE ACADEMIC CURRICULUM · 13 LEVELS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Home: Select Your English Level
              </h2>
              <p className="text-sm sm:text-base text-rose-200 mt-2">
                Choose one of the <strong>13 English levels</strong> to enter its interactive learning classroom. Each level is divided into <strong>Part A (Lessons 01 to 15)</strong> and <strong>Part B (Lessons 17 to 31)</strong> with teaching materials, video overlay badges, vocabulary flashcards, and live whiteboard.
              </p>
            </div>
          </div>

          {/* 13 Levels Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-rose-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                13 English Levels Catalog
              </h3>
              <span className="text-xs text-slate-400">
                13 Levels Available · 30 Lessons per Level (15 Part A + 15 Part B)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 13 }, (_, i) => (i + 1) as LevelNumber).map((lvl) => {
                const meta = LEVEL_METADATA[lvl];
                return (
                  <div
                    key={lvl}
                    className="bg-[#141a29] hover:bg-[#192236] border border-slate-800 hover:border-[#fb7185] rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 group"
                  >
                    <div>
                      {/* Level Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-10 h-10 rounded-xl bg-[#4a0414] text-white flex items-center justify-center font-black text-sm border-2 border-[#831843] group-hover:border-[#fb7185] transition shadow">
                            {lvl < 10 ? '0' + lvl : lvl}
                          </span>
                          <div>
                            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                              LEVEL {lvl}
                            </span>
                            <h4 className="text-base font-bold text-white group-hover:text-rose-200 transition">
                              {meta.name}
                            </h4>
                          </div>
                        </div>

                        <span className="text-[11px] font-black bg-[#2e0914] text-rose-300 px-2.5 py-1 rounded-lg border border-rose-900/60">
                          {meta.cefr}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {meta.description}
                      </p>

                      {/* Themes preview */}
                      <div className="space-y-1.5 text-[11px] bg-[#0b0f19] p-3 rounded-xl border border-slate-800 mb-4">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-rose-400 font-bold">Part A (Less. 01 - 15):</span>
                          <span className="truncate max-w-[170px] text-slate-400 text-right">{meta.partATheme}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-blue-400 font-bold">Part B (Less. 17 - 31):</span>
                          <span className="truncate max-w-[170px] text-slate-400 text-right">{meta.partBTheme}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons for Part A & Part B */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleSelectLevel(lvl, 'A')}
                        className="py-2.5 px-3 bg-[#4a0414] hover:bg-[#e11d48] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <span>Part A (1-15)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleSelectLevel(lvl, 'B')}
                        className="py-2.5 px-3 bg-[#002147] hover:bg-[#1d4ed8] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <span>Part B (17-31)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* VIEW 2: LEVEL CURRICULUM (Lessons 1-15 in Part A, Lessons 17-31 in Part B) */}
      {currentView === 'level-curriculum' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full flex flex-col gap-6">
          {/* Navigation back and Level Title */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('level-selection')}
              className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-2 bg-[#1e0710] hover:bg-[#340c1c] px-3.5 py-2 rounded-xl border border-rose-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Level Selection</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Current level:</span>
              <span className="text-xs font-bold bg-[#4a0414] text-rose-200 px-3 py-1 rounded-lg border border-rose-900">
                Level {selectedLevel} · {currentLevelInfo.cefr}
              </span>
            </div>
          </div>

          {/* LEVEL SUMMARY & PART TOGGLE */}
          <div className="bg-gradient-to-r from-[#4a0414] via-[#63051b] to-[#2e0914] border-2 border-[#831843] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2.5 py-1 rounded-md text-xs font-black bg-black/40 text-rose-300 uppercase tracking-wider border border-rose-900/80">
                    {currentLevelInfo.cefr}
                  </span>
                  <span className="text-xs text-rose-200 font-semibold">
                    {selectedPart === 'A' ? 'Lessons 01 to 15 (Part A)' : 'Lessons 17 to 31 (Part B)'}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Level {selectedLevel} - {currentLevelInfo.name} ({selectedLevel}{selectedPart})
                </h2>
                <p className="text-sm text-rose-200 mt-1 max-w-2xl">
                  {currentLevelInfo.description}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-rose-300">
                  <GraduationCap className="w-4 h-4 text-rose-400" />
                  <span>
                    Core Focus: <strong>{selectedPart === 'A' ? currentLevelInfo.partATheme : currentLevelInfo.partBTheme}</strong>
                  </span>
                </div>
              </div>

              {/* Part A / Part B Toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#140409] p-1.5 rounded-2xl border border-rose-900">
                <button
                  onClick={() => setSelectedPart('A')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                    selectedPart === 'A'
                      ? 'bg-[#e11d48] text-white shadow-lg'
                      : 'text-rose-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Part A (Lessons 01 - 15)
                </button>
                <button
                  onClick={() => setSelectedPart('B')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                    selectedPart === 'B'
                      ? 'bg-[#002147] text-white shadow-lg'
                      : 'text-rose-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Part B (Lessons 17 - 31)
                </button>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="bg-[#141a29] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in the 15 lessons of Level ${selectedLevel}${selectedPart} (${selectedPart === 'A' ? '1 to 15' : '17 to 31'})...`}
                className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">Filter:</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  filterType === 'all'
                    ? 'bg-rose-950 text-rose-300 border border-rose-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({levelPartLessons.length})
              </button>
              <button
                onClick={() => setFilterType('hasVideos')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  filterType === 'hasVideos'
                    ? 'bg-rose-950 text-rose-300 border border-rose-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                With Videos
              </button>
              <button
                onClick={() => setFilterType('hasVocab')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  filterType === 'hasVocab'
                    ? 'bg-rose-950 text-rose-300 border border-rose-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                With Vocabulary
              </button>
            </div>
          </div>

          {/* 15 LESSONS GRID */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-rose-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-400" />
                {selectedPart === 'A'
                  ? `Level ${selectedLevel} Part A (Lessons 01 to 15)`
                  : `Level ${selectedLevel} Part B (Lessons 17 to 31)`}
              </h3>
              <span className="text-xs text-slate-400">
                Showing {displayedLessons.length} lessons
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedLessons.map((lesson) => {
                const totalEvents = lesson.videos.reduce(
                  (acc, v) => acc + (v.events?.length || 0),
                  0
                );

                return (
                  <div
                    key={lesson.id}
                    className="bg-[#141a29] hover:bg-[#192236] border border-slate-800 hover:border-[#fb7185]/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden"
                  >
                    {/* Top indicator badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#4a0414] text-rose-300 flex items-center justify-center font-black text-xs border border-rose-900 shadow">
                          {lesson.lessonNumber < 10 ? '0' + lesson.lessonNumber : lesson.lessonNumber}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {lesson.level}{lesson.part} · Lesson {lesson.lessonNumber}
                        </span>
                      </div>

                      {lesson.isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                          <CheckCircle className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>

                    {/* Title & Topic */}
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-rose-200 transition line-clamp-1">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {lesson.topic}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="text-[10px] bg-slate-800/80 text-rose-300 px-2 py-0.5 rounded font-medium border border-slate-700">
                          Grammar: {lesson.grammarFocus}
                        </span>
                      </div>
                    </div>

                    {/* Resource counts & metrics */}
                    <div className="my-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5" title="Video parts">
                        <Film className="w-3.5 h-3.5 text-rose-400" />
                        <strong>{lesson.videos.length}</strong> parts
                      </span>
                      <span className="flex items-center gap-1.5" title="Vocabulary cards">
                        <Type className="w-3.5 h-3.5 text-amber-400" />
                        <strong>{lesson.vocabList.length}</strong> words
                      </span>
                      <span className="flex items-center gap-1.5" title="Interactive overlays">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <strong>{totalEvents}</strong> overlays
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onOpenPlayer(lesson.id)}
                        className="flex-1 py-2.5 bg-[#4a0414] hover:bg-[#e11d48] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md group-hover:bg-[#e11d48]"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Enter Classroom</span>
                      </button>

                      <button
                        onClick={() =>
                          onOpenUploadModal(
                            lesson.level,
                            lesson.part,
                            lesson.lessonNumber
                          )
                        }
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition border border-slate-700"
                        title="Upload/manage material for this lesson"
                        aria-label={`Upload material to Lesson ${lesson.lessonNumber}`}
                      >
                        <Upload className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="bg-[#080b12] border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400">
        <p>GLOBIUM English &copy; 2026 · Open your world · 13 Levels · Part A (Lessons 01 to 15) · Part B (Lessons 17 to 31)</p>
      </footer>

    </div>
  );
};
