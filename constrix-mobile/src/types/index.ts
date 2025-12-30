export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  type: 'study' | 'fitness';
  currentStreak: number;
  longestStreak: number;
  lastCheckin?: string;
  createdAt: string;
}

export interface Checkin {
  id: string;
  habitId: string;
  checkinDate: string;
  proofData?: {
    type: 'photo' | 'timer' | 'location';
    data: any;
  };
  createdAt: string;
}

export interface Milestone {
  id: string;
  habitId: string;
  milestoneDays: number;
  achievedAt: string;
  blockchainSynced: boolean;
  txHash?: string;
}