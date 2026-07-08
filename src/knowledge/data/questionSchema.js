export const questionSchema = {
  id: "",

  exam: "",
  examStage: "",

  subjectId: "",
  sectionId: "",
  topicId: "",
  subTopicId: "",

  questionType: "MCQ",

  sourceType: "MODEL",
  sourceName: "",
  sourceYear: "",
  sourceExamNo: "",

  question: "",

  options: {
    A: "",
    B: "",
    C: "",
    D: "",
  },

  correctOption: "",

  explanation: "",

  tags: [],

  applicableExams: [],

  difficulty: "STANDARD",

  stats: {
    askedCount: 0,
    correctCount: 0,
    wrongCount: 0,
    skipCount: 0,
  },

  revision: {
    repeatAfterDays: 1,
    lastAskedAt: null,
    lastSolvedAt: null,
  },

  quality: {
    verified: false,
    reviewedBy: "",
    issue: "",
  },

  active: true,

  createdAt: null,
  updatedAt: null,
};