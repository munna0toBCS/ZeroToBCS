const STORAGE_KEY = "zerotobcs_active_exam";

export const saveExamSession = (session) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const getSavedExamSession = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const clearSavedExamSession = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const hasSavedExamSession = () => {
  return getSavedExamSession() !== null;
};