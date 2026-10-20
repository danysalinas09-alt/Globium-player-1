import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAllLessons } from './curriculumData.ts';
import {
  getLessonsByLevelAndPart,
  getLessonById,
  addVideoPartToLesson,
  addVocabToLesson,
  addOverlayToVideoPart,
  removeVocabItem,
  deleteVideoPartFromLesson,
} from './storage.ts';

import type { Lesson } from '../types/index.ts';


test('curriculum generator creates exactly 13 levels x 2 parts x 15 lessons = 390 lessons', () => {
  const lessons = generateAllLessons();
  assert.equal(lessons.length, 13 * 2 * 15);

  // Check each level has parts A and B with 15 lessons each
  for (let l = 1; l <= 13; l++) {
    const partA = lessons.filter((les) => les.level === l && les.part === 'A');
    const partB = lessons.filter((les) => les.level === l && les.part === 'B');
    assert.equal(partA.length, 15, `Level ${l} Part A must have 15 lessons`);
    assert.equal(partB.length, 15, `Level ${l} Part B must have 15 lessons`);
  }
});

test('Level 1 Part A Lesson 1 preserves user prototype videos, badges and vocabularies', () => {
  const lessons = generateAllLessons();
  const l1a01 = getLessonById('L1A-01', lessons);

  assert.ok(l1a01, 'Lesson L1A-01 must exist');
  assert.equal(l1a01.videos.length, 2, 'Must have 2 video parts (1/2 and 2/2)');
  assert.equal(l1a01.videos[0].label, '1A Lesson 01   1/2');
  assert.equal(l1a01.videos[1].label, '1A Lesson 01   2/2');

  // Verify Jessica 20 cake badge overlay on part 1
  const v1Events = l1a01.videos[0].events;
  assert.equal(v1Events.length, 1);
  assert.equal(v1Events[0].id, 'jessica_age_badge');
  assert.equal(v1Events[0].startTime, 16);
  assert.equal(v1Events[0].endTime, 18);
  assert.equal(v1Events[0].badgeNumber, 20);

  // Verify John 23 cake badge on part 2
  const v2Events = l1a01.videos[1].events;
  assert.equal(v2Events.length, 1);
  assert.equal(v2Events[0].id, 'john_age_badge');
  assert.equal(v2Events[0].startTime, 13);
  assert.equal(v2Events[0].badgeNumber, 23);

  // Verify default vocabulary items (Happy, Tired, 20, Mexican, USA, 23, Emotions)
  assert.ok(l1a01.vocabList.some((v) => v.word === 'Happy'));
  assert.ok(l1a01.vocabList.some((v) => v.word === 'Tired'));
  assert.ok(l1a01.vocabList.some((v) => v.word === 'Mexican'));
});

test('querying by level and part returns lessons in ascending order', () => {
  const lessons = generateAllLessons();
  const l5a = getLessonsByLevelAndPart(5, 'A', lessons);
  assert.equal(l5a.length, 15);
  for (let i = 0; i < 15; i++) {
    assert.equal(l5a[i].lessonNumber, i + 1);
    assert.equal(l5a[i].level, 5);
    assert.equal(l5a[i].part, 'A');
  }

  const l5b = getLessonsByLevelAndPart(5, 'B', lessons);
  assert.equal(l5b.length, 15);
  // Part B lessons run from 17 to 31
  for (let i = 0; i < 15; i++) {
    assert.equal(l5b[i].lessonNumber, 17 + i);
    assert.equal(l5b[i].level, 5);
    assert.equal(l5b[i].part, 'B');
  }
  assert.equal(l5b[0].lessonNumber, 17);
  assert.equal(l5b[14].lessonNumber, 31);
});


test('adding video part, vocabulary, and overlay events updates state immutably', () => {
  let lessons: Lesson[] = generateAllLessons();
  const testLessonId = 'L2A-03';

  // 1. Add vocabulary
  lessons = addVocabToLesson(
    testLessonId,
    {
      word: 'Subway',
      translation: 'Metro',
      category: 'Transit',
      img: 'https://example.com/subway.png',
      exampleSentence: 'Take the subway to line 2.',
    },
    lessons
  );

  const updatedLesson = getLessonById(testLessonId, lessons)!;
  assert.equal(updatedLesson.vocabList[0].word, 'Subway');
  assert.equal(updatedLesson.vocabList[0].translation, 'Metro');

  // 2. Add video part
  lessons = addVideoPartToLesson(
    testLessonId,
    {
      src: 'https://example.com/class-video-part3.mp4',
      title: 'Speaking Drill',
      events: [],
    },
    lessons
  );

  const withNewVideo = getLessonById(testLessonId, lessons)!;
  assert.equal(withNewVideo.videos.length, 3);
  assert.equal(withNewVideo.videos[2].title, 'Speaking Drill');

  // 3. Add overlay event to the new video
  const video3Id = withNewVideo.videos[2].id;
  lessons = addOverlayToVideoPart(
    testLessonId,
    video3Id,
    {
      startTime: 5,
      endTime: 8,
      x: 50,
      y: 50,
      type: 'badge',
      badgeNumber: 99,
      text: 'Special Badge',
    },
    lessons
  );

  const withOverlay = getLessonById(testLessonId, lessons)!;
  const targetVideo = withOverlay.videos.find((v) => v.id === video3Id)!;
  assert.equal(targetVideo.events.length, 1);
  assert.equal(targetVideo.events[0].badgeNumber, 99);

  // 4. Remove vocabulary
  const vocabId = withOverlay.vocabList[0].id;
  lessons = removeVocabItem(testLessonId, vocabId, lessons);
  const afterVocabRemoval = getLessonById(testLessonId, lessons)!;
  assert.ok(!afterVocabRemoval.vocabList.some((v) => v.id === vocabId));

  // 5. Delete video part and verify renumbering
  lessons = deleteVideoPartFromLesson(testLessonId, video3Id, lessons);
  const afterVideoDelete = getLessonById(testLessonId, lessons)!;
  assert.equal(afterVideoDelete.videos.length, 2);
  assert.ok(!afterVideoDelete.videos.some((v) => v.id === video3Id));
  assert.equal(afterVideoDelete.videos[0].partNumber, 1);
  assert.equal(afterVideoDelete.videos[1].partNumber, 2);
  assert.equal(afterVideoDelete.videos[0].label, '2A Lesson 03   1/2');
  assert.equal(afterVideoDelete.videos[1].label, '2A Lesson 03   2/2');
});

