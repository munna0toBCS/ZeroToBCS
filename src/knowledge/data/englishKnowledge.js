import { createTopic, createLesson } from "./knowledgeSchema";

const englishKnowledge = {
  id: "english",
  title: "English",
  sections: [
    {
      id: "grammar",
      title: "Grammar",
      topics: [
        createTopic({
          id: "tense",
          title: "Tense",
          difficulty: "Beginner",
          estimatedTime: "40 min",
          exams: ["BCS", "Bank", "NTRCA", "Primary"],
          relatedTopics: ["voice", "narration", "subject-verb-agreement"],
          lessons: [
            createLesson({
              id: "tense-intro",
              title: "What is Tense?",
              content:
                "Tense shows the time of an action. It tells us whether an action happens in the present, happened in the past, or will happen in the future.",
              examples: [
                "I eat rice. — Present",
                "I ate rice. — Past",
                "I will eat rice. — Future",
              ],
              commonMistakes: [
                "Using past form after did.",
                "Using will with past verb.",
              ],
              shortcuts: [
                "After did, always use base verb.",
                "Will + base verb.",
              ],
            }),
          ],
        }),

        createTopic({
          id: "voice",
          title: "Voice",
          difficulty: "Intermediate",
          estimatedTime: "35 min",
          exams: ["BCS", "Bank", "NTRCA"],
          relatedTopics: ["tense", "narration"],
          lessons: [],
        }),

        createTopic({
          id: "narration",
          title: "Narration",
          difficulty: "Intermediate",
          estimatedTime: "35 min",
          exams: ["BCS", "Bank", "NTRCA"],
          relatedTopics: ["tense", "voice"],
          lessons: [],
        }),
      ],
    },
  ],
};

export default englishKnowledge;