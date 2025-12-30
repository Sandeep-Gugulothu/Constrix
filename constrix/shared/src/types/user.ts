export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  createdAt: string;
}

export interface AuthToken {
  token: string;
  user: User;
  expiresAt: string;
}