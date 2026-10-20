import type { Lesson, LevelNumber, LevelPart, LessonVideoPart, VocabItem, ClassDocument, OverlayEvent } from '../types/index.ts';

import { generateAllLessons } from './curriculumData.ts';

const STORAGE_KEY = 'globium_english_lessons_v1';
const LEGACY_STORAGE_KEY = 'global_english_academy_lessons_v1';

// In-memory fallback if localStorage is unavailable
let inMemoryLessons: Lesson[] | null = null;

export function getStoredLessons(): Lesson[] {
  if (typeof window === 'undefined') {
    if (!inMemoryLessons) {
      inMemoryLessons = generateAllLessons();
    }
    return inMemoryLessons;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let changed = false;
        parsed.forEach((l: Lesson) => {
          if (l.lessonNumber === 2 && l.part === 'A' && (l.title === 'Personal Information & Age' || !l.title)) {
            l.title = 'Introducing Another Person';
            l.topic = 'Introducing others, third-person details & pronouns';
            l.grammarFocus = 'He/She/They is/are, Possessives (his/her)';
            l.speakingGoal = 'Introduce friends, colleagues and family members';
            changed = true;
          }
        });
        if (changed) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          } catch {}
        }
        return parsed;
      }
    }
  } catch {
    // ignore json or quota error, fall through
  }

  const defaults = generateAllLessons();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  } catch {
    // ignore
  }
  return defaults;
}

export function saveStoredLessons(lessons: Lesson[]): void {
  inMemoryLessons = lessons;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
    } catch {
      // storage quota or private browsing mode
    }
  }
}

export function getLessonsByLevelAndPart(
  level: LevelNumber,
  part: LevelPart,
  lessonsList: Lesson[] = getStoredLessons()
): Lesson[] {
  return lessonsList
    .filter((l) => l.level === level && l.part === part)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);
}

export function getLessonById(id: string, lessonsList: Lesson[] = getStoredLessons()): Lesson | undefined {
  return lessonsList.find((l) => l.id === id);
}

export function updateLesson(
  id: string,
  updater: (prev: Lesson) => Lesson,
  lessonsList: Lesson[] = getStoredLessons()
): Lesson[] {
  const updated = lessonsList.map((l) => {
    if (l.id === id) {
      return updater(l);
    }
    return l;
  });
  saveStoredLessons(updated);
  return updated;
}

export function addVideoPartToLesson(
  lessonId: string,
  newVideo: Omit<LessonVideoPart, 'id' | 'partNumber' | 'label'>,
  lessonsList: Lesson[] = getStoredLessons()
): Lesson[] {
  return updateLesson(
    lessonId,
    (lesson) => {
      const partNum = lesson.videos.length + 1;
      const partLabel = `${lesson.level}${lesson.part} Lesson ${
        lesson.lessonNumber < 10 ? '0' + lesson.lessonNumber : lesson.lessonNumber
      }   ${partNum}/${partNum}`;

      const videoEntry: LessonVideoPart = {
        id: `${lessonId}-v${Date.now()}`,
        partNumber: partNum,
        label: partLabel,
        src: newVideo.src,
        title: newVideo.title || `Parte ${partNum}`,
        events: newVideo.events || [],
      };

      // update labels of existing videos to reflect new total
      const updatedExisting = lesson.videos.map((v) => ({
        ...v,
        label: `${lesson.level}${lesson.part} Lesson ${
          lesson.lessonNumber < 10 ? '0' + lesson.lessonNumber : lesson.lessonNumber
        }   ${v.partNumber}/${partNum}`,
      }));

      return {
        ...lesson,
        videos: [...updatedExisting, videoEntry],
      };
    },
    lessonsList
  );
}

export function deleteVideoPartFromLesson(
  lessonId: string,
  videoPartId: string,
  lessonsList: Lesson[] = getStoredLessons()
): Lesson[] {
  return updateLesson(
    lessonId,
    (lesson) => {
      const remainingVideos = lesson.videos.filter((v) => v.id !== videoPartId);
      const totalParts = remainingVideos.length;
      const renumbered = remainingVideos.map((v, idx) => ({
        ...v,
        partNumber: idx + 1,
        label: `${lesson.level}${lesson.part} Lesson ${
          lesson.lessonNumber < 10 ? '0' + lesson.lessonNumber : lesson.lessonNumber
        }   ${idx + 1}/${totalParts}`,
      }));

      return {
        ...lesson,
        videos: renumbered,
      };
    },
    lessonsList
  );
}

export function addVocabToLesson(

  lessonId: string,
  vocab: Omit<VocabItem, 'id'>,
  lessonsList: Lesson[] = getStoredLessons()
): Lesson[] {
  const newItem: VocabItem = {
    ...vocab,
    id: `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  };

  return updateLesson(
    lessonId,
    (lesson) => ({
      ...lesson,
      vocabList: [newItem, ...lesson.vocabList],
    }),
    lessonsList
  );
}

export function addDocumentToLesson(
  lessonId: string,
  doc: Omit<ClassDocument, 'id' | 'addedAt'>,
  lessonsList: Lesson[] = getStoredLessons()
): Lesson[] {
  const newDoc: ClassDocument = {
    ...doc,
    id: `doc_${Date.now()}`,
    addedAt: new Date().toISOString().split('T')[0],
  };

  return updateLesson(
    lessonId,
    (lesson) => ({
      ...lesson,
      documents: [newDoc, ...lesson.documents],
    }),
    lessonsList
  );
}

export function addOverlayToVideoPart(
  lessonId: string,
  videoPartId: string,
  event: Omit<OverlayEvent, 'id'>,
  lessonsList: Lesson[] = getStoredLessons()
): Lesson[] {
  const newEvt: OverlayEvent = {
    ...event,
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  };

  return updateLesson(
    lessonId,
    (lesson) => ({
      ...lesson,
      videos: lesson.videos.map((v) => {
        if (v.id === videoPartId) {
          return {
            ...v,
            events: [...v.events, newEvt],
          };
        }
        return v;
      }),
    }),
    lessonsList
  );
}

export function removeVocabItem(
  lessonId: string,
  vocabId: string,
  lessonsList: Lesson[] = getStoredLessons()
): Lesson[] {
  return updateLesson(
    lessonId,
    (lesson) => ({
      ...lesson,
      vocabList: lesson.vocabList.filter((v) => v.id !== vocabId),
    }),
    lessonsList
  );
}

export function resetAllLessonsToDefault(): Lesson[] {
  const defaults = generateAllLessons();
  saveStoredLessons(defaults);
  return defaults;
}
