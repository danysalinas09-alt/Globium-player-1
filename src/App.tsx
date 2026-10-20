/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type { LevelNumber, LevelPart, Lesson, OverlayEvent } from './types/index.ts';
import {
  getStoredLessons,
  getLessonById,
  getLessonsByLevelAndPart,
  addVideoPartToLesson,
  addVocabToLesson,
  addOverlayToVideoPart,
  addDocumentToLesson,
  deleteVideoPartFromLesson,
  removeVocabItem,
  resetAllLessonsToDefault,
  saveStoredLessons,
} from './utils/storage.ts';

import { HomePage } from './components/HomePage.tsx';
import { InteractivePlayer } from './components/InteractivePlayer.tsx';
import { UploadMaterialModal } from './components/UploadMaterialModal.tsx';

export default function App() {
  const [lessons, setLessons] = useState<Lesson[]>(() => getStoredLessons());
  const [selectedLevel, setSelectedLevel] = useState<LevelNumber>(1);
  const [selectedPart, setSelectedPart] = useState<LevelPart>('A');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<{
    level: LevelNumber;
    part: LevelPart;
    lessonNum: number;
  }>({
    level: 1,
    part: 'A',
    lessonNum: 1,
  });

  // Check URL query parameters for ?autostart=1 or ?lesson=L1A-01
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const lessonParam = params.get('lesson');
      const autostart = params.get('autostart');

      if (lessonParam && getLessonById(lessonParam, lessons)) {
        setActiveLessonId(lessonParam);
      } else if (autostart === '1') {
        setActiveLessonId('L1A-01');
      }
    }
  }, []);

  // Handlers for Upload Modal
  const handleOpenUploadModal = (level?: LevelNumber, part?: LevelPart, lessonNum?: number) => {
    setModalTarget({
      level: level ?? selectedLevel,
      part: part ?? selectedPart,
      lessonNum: lessonNum ?? 1,
    });
    setIsUploadModalOpen(true);
  };

  const handleAddVideo = (
    lessonId: string,
    videoData: { src: string; title: string; events: OverlayEvent[] }
  ) => {
    const updated = addVideoPartToLesson(lessonId, videoData, lessons);
    setLessons([...updated]);
  };

  const handleAddVocab = (
    lessonId: string,
    vocabData: { word: string; translation: string; img: string; category?: string; exampleSentence?: string }
  ) => {
    const updated = addVocabToLesson(lessonId, vocabData, lessons);
    setLessons([...updated]);
  };

  const handleAddOverlay = (
    lessonId: string,
    videoPartId: string,
    overlayData: Omit<OverlayEvent, 'id'>
  ) => {
    const updated = addOverlayToVideoPart(lessonId, videoPartId, overlayData, lessons);
    setLessons([...updated]);
  };

  const handleDeleteVideo = (lessonId: string, videoPartId: string) => {
    const updated = deleteVideoPartFromLesson(lessonId, videoPartId, lessons);
    setLessons([...updated]);
  };

  const handleDeleteVocab = (lessonId: string, vocabId: string) => {
    const updated = removeVocabItem(lessonId, vocabId, lessons);
    setLessons([...updated]);
  };

  const handleAddDocument = (
    lessonId: string,
    docData: { title: string; type: 'pdf' | 'worksheet' | 'link' | 'exercise'; url: string; fileSize?: string }
  ) => {
    const updated = addDocumentToLesson(lessonId, docData, lessons);
    setLessons([...updated]);
  };

  const handleResetData = () => {
    if (window.confirm('Do you want to reset all curriculum and materials back to default settings?')) {
      const defaults = resetAllLessonsToDefault();
      setLessons(defaults);
      setSelectedLevel(1);
      setSelectedPart('A');
      setActiveLessonId(null);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lessons, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `globium-english-curriculum-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            saveStoredLessons(parsed);
            setLessons(parsed);
            alert('Curriculum and class materials imported successfully!');
          }
        } catch {
          alert('Error reading the JSON file.');
        }
      };
    }
  };


  // Active lesson object
  const currentActiveLesson = activeLessonId ? getLessonById(activeLessonId, lessons) : null;
  const activeLevelPartLessons = currentActiveLesson
    ? getLessonsByLevelAndPart(currentActiveLesson.level, currentActiveLesson.part, lessons)
    : [];

  return (
    <div className="w-full min-h-screen bg-[#0b0f19] text-white">
      {/* If activeLessonId is selected, show InteractivePlayer */}
      {currentActiveLesson ? (
        <InteractivePlayer
          lesson={currentActiveLesson}
          allLessonsInLevelPart={activeLevelPartLessons}
          onSelectLesson={(newId) => setActiveLessonId(newId)}
          onExit={() => setActiveLessonId(null)}
          onOpenUploadModal={() =>
            handleOpenUploadModal(
              currentActiveLesson.level,
              currentActiveLesson.part,
              currentActiveLesson.lessonNumber
            )
          }
        />
      ) : (
        /* Otherwise, show HomePage dashboard */
        <HomePage
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          lessons={lessons}
          onOpenPlayer={(id) => setActiveLessonId(id)}
          onOpenUploadModal={handleOpenUploadModal}
          onResetData={handleResetData}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />
      )}

      {/* Upload Material Modal */}
      <UploadMaterialModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentLevel={modalTarget.level}
        currentPart={modalTarget.part}
        currentLessonNumber={modalTarget.lessonNum}
        allLessons={lessons}
        onAddVideo={handleAddVideo}
        onDeleteVideo={handleDeleteVideo}
        onAddVocab={handleAddVocab}
        onDeleteVocab={handleDeleteVocab}
        onAddOverlay={handleAddOverlay}
        onAddDocument={handleAddDocument}
      />

    </div>
  );
}
