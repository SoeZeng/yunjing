const KEY = "yunjing.v1";

export const emptyProgress = () => ({
  days: {},
  outcomes: {},
  quiz: {},
});

export function loadProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || typeof raw !== "object") return emptyProgress();
    return {
      days: raw.days || {},
      outcomes: raw.outcomes || {},
      quiz: raw.quiz || {},
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
