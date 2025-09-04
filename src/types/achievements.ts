import { UserStats } from './user';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;
  level?: number;
  condition?: (stats: UserStats) => boolean;
}