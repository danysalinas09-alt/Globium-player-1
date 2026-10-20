import type { LevelMetadata, LevelNumber, LevelPart, Lesson, VocabItem, LessonVideoPart } from '../types/index.ts';


export const LEVEL_METADATA: Record<LevelNumber, LevelMetadata> = {
  1: {
    level: 1,
    name: 'Beginner Foundations',
    cefr: 'A1.1 Starter',
    description: 'Bases esenciales del idioma inglés, saludos, números, información personal y oraciones afirmativas.',
    partATheme: 'Greetings, Personal Info & Verb To Be',
    partBTheme: 'Daily Objects, Family & Simple Questions',
    colorHex: '#e11d48',
  },
  2: {
    level: 2,
    name: 'Elementary Communication',
    cefr: 'A1.2 Elementary',
    description: 'Expresión de rutinas diarias, horas, descripciones de lugares y presente simple.',
    partATheme: 'Present Simple, Daily Routines & Time',
    partBTheme: 'Places in Town, Directions & Prepositions',
    colorHex: '#f43f5e',
  },
  3: {
    level: 3,
    name: 'Pre-Intermediate Exploration',
    cefr: 'A2.1 Pre-Intermediate',
    description: 'Habilidades para hablar del pasado, gustos, habilidades y planes futuros inmediatos.',
    partATheme: 'Past Simple (Regular & Irregular)',
    partBTheme: 'Countable/Uncountable Food & Going To',
    colorHex: '#fb7185',
  },
  4: {
    level: 4,
    name: 'Everyday Fluency',
    cefr: 'A2.2 Low Intermediate',
    description: 'Comparativos, superlativos, experiencias de vida y vocabulario para viajes y compras.',
    partATheme: 'Comparatives, Superlatives & Shopping',
    partBTheme: 'Present Perfect for Life Experiences',
    colorHex: '#ec4899',
  },
  5: {
    level: 5,
    name: 'Intermediate Core',
    cefr: 'B1.1 Intermediate',
    description: 'Conversaciones espontáneas, conectores de ideas, modales de obligación y consejo.',
    partATheme: 'Modals (Should, Must, Have to) & Advice',
    partBTheme: 'Past Continuous & Narrative Storytelling',
    colorHex: '#db2777',
  },
  6: {
    level: 6,
    name: 'Developing Mastery',
    cefr: 'B1.2 Intermediate Plus',
    description: 'Primer y segundo condicional, expresión de hipótesis y situaciones laborales cotidianas.',
    partATheme: 'First & Second Conditionals (If Clauses)',
    partBTheme: 'Passive Voice in News & Science',
    colorHex: '#be185d',
  },
  7: {
    level: 7,
    name: 'Upper-Intermediate Steps',
    cefr: 'B2.1 Upper-Intermediate',
    description: 'Debates, argumentación, phrasal verbs frecuentes y estilos de comunicación formal.',
    partATheme: 'Essential Phrasal Verbs & Collocations',
    partBTheme: 'Reported Speech & Indirect Questions',
    colorHex: '#9d174d',
  },
  8: {
    level: 8,
    name: 'Independent Speaker',
    cefr: 'B2.2 Upper-Intermediate High',
    description: 'Discurso fluido, vocabulario académico, condicionales mixtos y modales de deducción.',
    partATheme: 'Modals of Deduction (Must have, Might have)',
    partBTheme: 'Mixed Conditionals & Regrets (Wish / If only)',
    colorHex: '#831843',
  },
  9: {
    level: 9,
    name: 'Advanced Competence',
    cefr: 'C1.1 Advanced',
    description: 'Inglés profesional, reuniones de negocios, sutilezas culturales y metáforas idiomáticas.',
    partATheme: 'Nuanced Idioms & Professional Negotiation',
    partBTheme: 'Inversion for Emphasis & Formal Writing',
    colorHex: '#701a75',
  },
  10: {
    level: 10,
    name: 'Strategic Fluency',
    cefr: 'C1.2 Advanced Plus',
    description: 'Análisis crítico, presentaciones ejecutivas y estructuración de discursos persuasivos.',
    partATheme: 'Persuasive Rhetoric & Public Speaking',
    partBTheme: 'Academic Research & Nuanced Hedging',
    colorHex: '#581c87',
  },
  11: {
    level: 11,
    name: 'Expert Articulation',
    cefr: 'C2.1 Pre-Mastery',
    description: 'Dominio de registros estilísticos, dialectos globales, ironía y humor británico/americano.',
    partATheme: 'Stylistic Registers & Dialect Diversity',
    partBTheme: 'Complex Discourse Markers & Subtleties',
    colorHex: '#4c1d95',
  },
  12: {
    level: 12,
    name: 'Near-Native Proficiency',
    cefr: 'C2.2 Full Mastery',
    description: 'Comprensión inmediata de cualquier tipo de texto oral o escrito sin esfuerzo.',
    partATheme: 'Speed Listening, Slang & Literary Nuances',
    partBTheme: 'High-Level Debate & Spontaneous Synthesis',
    colorHex: '#3b0764',
  },
  13: {
    level: 13,
    name: 'Teacher & Master Coach',
    cefr: 'C2+ Instructor Level',
    description: 'Pedagogía del inglés, corrección fonética experta y dominio integral del lenguaje.',
    partATheme: 'Applied Linguistics & Phonetic Analysis',
    partBTheme: 'Curriculum Delivery & Advanced Coaching',
    colorHex: '#4a0414',
  },
};

// Default vocabulary from user prototype
export const DEFAULT_PROTOTYPE_VOCAB: VocabItem[] = [
  {
    id: 'vocab_1',
    word: 'Happy',
    translation: 'Feliz / Alegre',
    category: 'Emociones',
    exampleSentence: 'Jessica is very happy today!',
    img: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'vocab_2',
    word: 'Tired',
    translation: 'Cansado / Agotado',
    category: 'Emociones',
    exampleSentence: 'John worked hard and feels tired.',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'vocab_3',
    word: '20 (Twenty)',
    translation: 'Veinte',
    category: 'Números & Edad',
    exampleSentence: 'She is twenty years old.',
    img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'vocab_4',
    word: 'Mexican',
    translation: 'Mexicano / Mexicana',
    category: 'Nacionalidades',
    exampleSentence: 'Carlos is Mexican and lives in Guadalajara.',
    img: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'vocab_5',
    word: 'USA',
    translation: 'Estados Unidos',
    category: 'Países',
    exampleSentence: 'They are traveling across the USA.',
    img: 'https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'vocab_6',
    word: '23 (Twenty-Three)',
    translation: 'Veintitrés',
    category: 'Números & Edad',
    exampleSentence: 'John celebrated his 23rd birthday.',
    img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'vocab_7',
    word: 'Emotions',
    translation: 'Emociones / Sentimientos',
    category: 'Emociones',
    exampleSentence: 'Learn how to describe your emotions in English.',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&auto=format&fit=crop&q=80',
  },
];

// Sample public video stream that plays flawlessly in browser as fallback
export const SAMPLE_VIDEO_URL_1 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
export const SAMPLE_VIDEO_URL_2 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

// Helper to generate pedagogical curriculum for all 13 levels, 2 parts (A & B), 15 lessons each
const LESSON_TOPIC_TEMPLATES: Record<LevelPart, { title: string; topic: string; grammar: string; goal: string }[]> = {
  A: [
    { title: 'Introductions & Greetings', topic: 'Meeting people & polite forms', grammar: 'Verb To Be (am/is/are)', goal: 'Introduce yourself and greet others politely' },
    { title: 'Introducing Another Person', topic: 'Introducing others, third-person details & pronouns', grammar: 'He/She/They is/are, Possessives (his/her)', goal: 'Introduce friends, colleagues and family members' },
    { title: 'Nationalities & Countries', topic: 'Where are you from?', grammar: 'Preposition "from" + Adjectives of nationality', goal: 'Discuss hometowns and world origins' },
    { title: 'Numbers, Time & Schedules', topic: 'Counting 1-100 & telling time', grammar: 'At / On / In (Time prepositions)', goal: 'State hours, meeting times and dates' },
    { title: 'Family & Relationships', topic: 'Family members & descriptions', grammar: 'Possessive adjectives (my, your, his, her)', goal: 'Describe family tree and friendships' },
    { title: 'Daily Objects & Belongings', topic: 'Classroom & office items', grammar: 'This / That / These / Those & Articles a/an', goal: 'Identify and point out physical items' },
    { title: 'Colors, Clothes & Appearance', topic: 'Shopping for outfits & styling', grammar: 'Adjective order before nouns', goal: 'Describe what someone is wearing' },
    { title: 'Days, Months & Calendar', topic: 'Planning the week & seasons', grammar: 'Prepositions of time and frequency adverbs', goal: 'Talk about schedule and calendar dates' },
    { title: 'Feelings & Physical States', topic: 'How are you feeling today?', grammar: 'Adjectives of emotion & intensifiers (very, so)', goal: 'Express emotions and physical comfort' },
    { title: 'Rooms & Furniture at Home', topic: 'House tour & interior spaces', grammar: 'There is / There are (affirmative & negative)', goal: 'Describe living spaces and apartment layout' },
    { title: 'Everyday Actions & Verbs', topic: 'Daily life verbs & habits', grammar: 'Present Simple affirmative (I/you/we/they)', goal: 'Talk about regular daily actions' },
    { title: 'Likes, Dislikes & Preferences', topic: 'Hobbies, music & leisure', grammar: 'Like / Love / Hate + -ing form', goal: 'Express preferences and favorite activities' },
    { title: 'Food & Ordering at a Café', topic: 'Menu items, drinks & snacks', grammar: 'Can I have / Would you like', goal: 'Order refreshments at a café' },
    { title: 'Giving Basic Directions', topic: 'Turn left, go straight, next to', grammar: 'Imperatives & Prepositions of place', goal: 'Guide someone to a nearby landmark' },
    { title: 'Review & Speaking Assessment', topic: 'Comprehensive oral synthesis', grammar: 'Review of Level Part A fundamentals', goal: 'Conduct a fluid 5-minute conversation' },
  ],
  B: [
    { title: 'Daily Routines in Detail', topic: 'Morning to night schedule', grammar: 'Present Simple 3rd person singular (-s/-es)', goal: 'Describe someone else’s workday' },
    { title: 'Jobs, Professions & Workplaces', topic: 'Career fields & daily duties', grammar: 'Present Simple questions (Do / Does)', goal: 'Interview someone about their profession' },
    { title: 'Free Time & Weekend Plans', topic: 'Outdoor activities & sports', grammar: 'Adverbs of frequency (always, often, never)', goal: 'Discuss weekend habits and pastimes' },
    { title: 'Places in the City & Transit', topic: 'Subway, bus, airport & museum', grammar: 'Prepositions of movement (into, out of, across)', goal: 'Navigate public transit in an English city' },
    { title: 'Weather & Seasons Forecast', topic: 'Climate, forecast & clothes', grammar: 'It is raining / snowy / sunny (Present continuous)', goal: 'Discuss weather reports and climate' },
    { title: 'Grocery Shopping & Quantities', topic: 'Supermarket aisles & recipes', grammar: 'Countable vs Uncountable (Much / Many / Some)', goal: 'Make shopping lists and ask for prices' },
    { title: 'Abilities & Skills', topic: 'What can you do? Talents', grammar: 'Can / Can’t for ability and permission', goal: 'Highlight talents and resume skills' },
    { title: 'Past Memories & Yesterday', topic: 'What did you do last weekend?', grammar: 'Past Simple of To Be (Was / Were)', goal: 'Recount past events and yesterday’s mood' },
    { title: 'Regular Past Verbs in Action', topic: 'Life stories & historical events', grammar: 'Past Simple regular verbs (-ed pronunciation)', goal: 'Narrate a finished journey or weekend trip' },
    { title: 'Irregular Past Challenges', topic: 'Went, saw, had, ate, bought', grammar: 'Key irregular past verbs in storytelling', goal: 'Tell an entertaining anecdote smoothly' },
    { title: 'Health, Sickness & Remedies', topic: 'Doctor visits & symptoms', grammar: 'Should / Shouldn’t for health advice', goal: 'Explain symptoms at a pharmacy or clinic' },
    { title: 'Future Goals & Next Vacations', topic: 'Bucket list & travel planning', grammar: 'Be going to + infinitive', goal: 'Present exciting plans for the coming year' },
    { title: 'Comparing Cities & Places', topic: 'Bigger, quieter, more exciting', grammar: 'Comparative & Superlative adjectives', goal: 'Compare two cities or tech gadgets' },
    { title: 'Polite Requests & Phone Calls', topic: 'Phone etiquette & customer care', grammar: 'Could you / May I please', goal: 'Handle a phone call and leave clear messages' },
    { title: 'Level Graduation & Part B Milestone', topic: 'Comprehensive Capstone presentation', grammar: 'Mastery of Level Part B core structures', goal: 'Deliver a structured 3-minute speech' },
  ],
};

export function generateAllLessons(): Lesson[] {
  const allLessons: Lesson[] = [];

  for (let lvl = 1; lvl <= 13; lvl++) {
    const levelNum = lvl as LevelNumber;

    for (const part of ['A', 'B'] as LevelPart[]) {
      const templates = LESSON_TOPIC_TEMPLATES[part];

      for (let i = 0; i < 15; i++) {
        // Part A: lessons 1 to 15; Part B: lessons 17 to 31
        const lNum = part === 'A' ? i + 1 : 17 + i;
        const template = templates[i];
        const lessonId = `L${levelNum}${part}-${lNum < 10 ? '0' + lNum : lNum}`;
        const labelPrefix = `${levelNum}${part} Lesson ${lNum < 10 ? '0' + lNum : lNum}`;

        // Initialize with realistic initial videos
        const defaultVideos: LessonVideoPart[] = [];


        // For Level 1 Part A Lesson 1: Match the user's exact prototype!
        if (levelNum === 1 && part === 'A' && lNum === 1) {
          defaultVideos.push(
            {
              id: `${lessonId}-v1`,
              partNumber: 1,
              label: `${labelPrefix}   1/2`,
              src: 'file:///C:/Users/Lenovo/Desktop/Videos/Lesson1.mp4',
              title: `${template.title} (Part 1)`,
              events: [
                {
                  id: 'jessica_age_badge',
                  startTime: 16,
                  endTime: 18,
                  pauseOnTrigger: false,
                  x: 75,
                  y: 60,
                  type: 'badge',
                  badgeNumber: 20,
                  badgeIcon: 'fa-solid fa-cake-candles',
                  html: `
                    <div class="cake-badge">
                      <div class="number">20</div>
                      <div class="sub-icon"><i class="fa-solid fa-cake-candles"></i></div>
                    </div>
                  `,
                },
              ],
            },
            {
              id: `${lessonId}-v2`,
              partNumber: 2,
              label: `${labelPrefix}   2/2`,
              src: 'file:///C:/Users/Lenovo/Desktop/Videos/lesson1.2.mp4',
              title: `${template.title} (Part 2)`,
              events: [
                {
                  id: 'john_age_badge',
                  startTime: 13,
                  endTime: 14.5,
                  pauseOnTrigger: false,
                  x: 75,
                  y: 60,
                  type: 'badge',
                  badgeNumber: 23,
                  badgeIcon: 'fa-solid fa-cake-candles',
                  html: `
                    <div class="cake-badge">
                      <div class="number">23</div>
                      <div class="sub-icon"><i class="fa-solid fa-cake-candles"></i></div>
                    </div>
                  `,
                },
              ],
            }
          );
        } else {
          // Default placeholder/sample video parts for other lessons
          defaultVideos.push(
            {
              id: `${lessonId}-v1`,
              partNumber: 1,
              label: `${labelPrefix}   1/2`,
              src: SAMPLE_VIDEO_URL_1,
              title: `${template.title} - Video Principal`,
              events: [
                {
                  id: `${lessonId}-evt1`,
                  startTime: 4,
                  endTime: 7,
                  x: 80,
                  y: 35,
                  type: 'badge',
                  badgeNumber: `${levelNum}${part}`,
                  badgeIcon: 'fa-solid fa-star',
                  html: `
                    <div class="cake-badge" style="width: 170px; height: 170px; background: #63051b;">
                      <div class="number" style="font-size: 42px;">${levelNum}${part}</div>
                      <div class="sub-icon" style="font-size: 26px;"><i class="fa-solid fa-graduation-cap"></i></div>
                    </div>
                  `,
                },
              ],
            },
            {
              id: `${lessonId}-v2`,
              partNumber: 2,
              label: `${labelPrefix}   2/2`,
              src: SAMPLE_VIDEO_URL_2,
              title: `${template.title} - Práctica & Speaking`,
              events: [],
            }
          );
        }

        const vocabItems: VocabItem[] = (levelNum === 1 && part === 'A' && lNum === 1)
          ? DEFAULT_PROTOTYPE_VOCAB
          : [
              {
                id: `${lessonId}-vocab1`,
                word: template.topic.split(' ')[0] || 'Key Word',
                translation: 'Concepto Clave',
                category: 'Vocabulary',
                img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80',
                exampleSentence: `Practice using this word in Lesson ${lNum}.`,
              },
              {
                id: `${lessonId}-vocab2`,
                word: 'Conversation',
                translation: 'Conversación',
                category: 'Speaking',
                img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=80',
                exampleSentence: 'Engage in pair work conversations with your classmates.',
              },
            ];

        allLessons.push({
          id: lessonId,
          level: levelNum,
          part,
          lessonNumber: lNum,
          title: template.title,
          topic: template.topic,
          grammarFocus: template.grammar,
          speakingGoal: template.goal,
          videos: defaultVideos,
          vocabList: vocabItems,
          documents: [
            {
              id: `${lessonId}-doc1`,
              title: `Worksheet - ${template.title}.pdf`,
              type: 'pdf',
              url: '#',
              fileSize: '1.4 MB',
              addedAt: '2026-10-17',
            },
          ],
          isCompleted: false,
        });
      }
    }
  }

  return allLessons;
}
