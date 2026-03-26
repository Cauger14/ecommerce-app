// types/auth.ts
export interface SessionUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  image?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuthSession {
  session: SessionData;
  user: SessionUser;
}

export type Session = AuthSession | null;