export const questionSchema = {
  id: "",

  exam: "BCS",
  organization: "BPSC",
  year: null,
  paper: "Preliminary",

  subject: "",
  topic: "",
  subTopic: "",

  question: "",

  options: ["", "", "", ""],

  answer: 0,

  explanation: "",

  source: "",

  isPreviousYear: false,

  patternId: "",
  patternType: "",
  repeatedCount: 0,
  similarQuestionIds: [],

  difficulty: "Medium",
  importance: 5,

  marks: 1,
  negativeMark: 0.25,

  tags: [],

  aiHint: "",
  smartNote: "",

  createdBy: "ZeroToBCS",
  status: "approved",
};