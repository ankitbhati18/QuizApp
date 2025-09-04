export interface UserStats {
  totalQuizzes: number;
  totalCorrect: number;
  streak: number;
  bestStreak: number;
  level: number;
  xp: number;
  coins: number;
  energy: number;
  achievements: string[];
  lastPlayed: string;
  contestsEntered?: number;
}