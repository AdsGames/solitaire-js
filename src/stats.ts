export interface Stats {
  wins: number;
  losses: number;
  streak: number;
  bestStreak: number;
}

const STORAGE_KEY = "solitaire-js:stats";

const EMPTY_STATS: Stats = { wins: 0, losses: 0, streak: 0, bestStreak: 0 };

const readNumber = (data: unknown, key: keyof Stats): number => {
  if (typeof data !== "object" || data === null || !(key in data)) {
    return 0;
  }
  const value: unknown = Reflect.get(data, key);
  return typeof value === "number" ? value : 0;
};

export const loadStats = (): Stats => {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return {
      wins: readNumber(data, "wins"),
      losses: readNumber(data, "losses"),
      streak: readNumber(data, "streak"),
      bestStreak: readNumber(data, "bestStreak"),
    };
  } catch {
    return { ...EMPTY_STATS };
  }
};

const saveStats = (stats: Stats): Stats => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage can be unavailable (private mode). Stats then last one session.
  }
  return stats;
};

export const recordWin = (): Stats => {
  const stats = loadStats();
  const streak = stats.streak + 1;
  return saveStats({
    ...stats,
    wins: stats.wins + 1,
    streak,
    bestStreak: Math.max(stats.bestStreak, streak),
  });
};

export const recordLoss = (): Stats => {
  const stats = loadStats();
  return saveStats({ ...stats, losses: stats.losses + 1, streak: 0 });
};
