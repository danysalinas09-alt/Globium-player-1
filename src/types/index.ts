export type LevelNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type LevelPart = 'A' | 'B';

export interface VocabItem {
  id: string;
  word: string;
  translation: string;
  img: string;
  category?: string;
  exampleSentence?: string;
}

export interface OverlayEvent {
  id: string;
  startTime: number;
  endTime: number | null;
  pauseOnTrigger?: boolean;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  html?: string;
  type?: 'badge' | 'vocab' | 'quiz' | 'note';
  badgeNumber?: string | number;
  badgeIcon?: string; // FontAwesome icon class
  text?: string;
}

export interface LessonVideoPart {
  id: string;
  partNumber: number; // 1, 2, ...
  label: string; // e.g. "1A Lesson 01  1/2"
  src: string; // Object URL, local file, or sample URL
  title?: string;
  events: OverlayEvent[];
}

export interface ClassDocument {
  id: string;
  title: string;
  type: 'pdf' | 'worksheet' | 'link' | 'exercise';
  url: string;
  fileSize?: string;
  addedAt: string;
}

export interface Lesson {
  id: string; // e.g., "L1A-01"
  level: LevelNumber;
  part: LevelPart;
  lessonNumber: number; // 1 to 15
  title: string;
  topic: string;
  grammarFocus: string;
  speakingGoal: string;
  videos: LessonVideoPart[];
  vocabList: VocabItem[];
  documents: ClassDocument[];
  whiteboardNotes?: string;
  isCompleted?: boolean;
}

export interface LevelMetadata {
  level: LevelNumber;
  name: string;
  cefr: string; // e.g., "A1 - Breakthrough", "B1 - Threshold", etc.
  description: string;
  partATheme: string;
  partBTheme: string;
  colorHex: string;
}
