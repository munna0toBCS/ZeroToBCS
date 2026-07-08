import englishSubject from "./subject";
import { englishTree } from "./tree";
import { englishTopics } from "./topics";
import { englishLessonsDatabase } from "./lessonsDatabase";

const englishCurriculum = {
  ...englishSubject,
  tree: englishTree,
  topics: englishTopics,
  lessons: englishLessonsDatabase,
};

export default englishCurriculum;