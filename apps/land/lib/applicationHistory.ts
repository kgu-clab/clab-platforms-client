export type ApplicationHistory = {
  recruitmentId: number;
  studentId: string;
  submittedAt: string;
};

const APPLICATION_HISTORY_KEY = 'clab:last-application';
let cachedRawHistory: string | null | undefined;
let cachedHistory: ApplicationHistory | null | undefined;

export function saveApplicationHistory(history: ApplicationHistory) {
  if (typeof window === 'undefined') return;

  const rawHistory = JSON.stringify(history);
  window.localStorage.setItem(APPLICATION_HISTORY_KEY, rawHistory);
  cachedRawHistory = rawHistory;
  cachedHistory = history;
}

export function getApplicationHistory(): ApplicationHistory | null {
  if (typeof window === 'undefined') return null;

  const rawHistory = window.localStorage.getItem(APPLICATION_HISTORY_KEY);
  if (rawHistory === cachedRawHistory) return cachedHistory ?? null;

  try {
    const history: unknown = rawHistory ? JSON.parse(rawHistory) : null;
    if (
      !history ||
      typeof history !== 'object' ||
      !('recruitmentId' in history) ||
      !('studentId' in history) ||
      typeof history.recruitmentId !== 'number' ||
      typeof history.studentId !== 'string'
    ) {
      cachedRawHistory = rawHistory;
      cachedHistory = null;
      return null;
    }

    cachedRawHistory = rawHistory;
    cachedHistory = {
      recruitmentId: history.recruitmentId,
      studentId: history.studentId,
      submittedAt:
        'submittedAt' in history && typeof history.submittedAt === 'string'
          ? history.submittedAt
          : '',
    };
    return cachedHistory;
  } catch {
    cachedRawHistory = rawHistory;
    cachedHistory = null;
    return null;
  }
}
