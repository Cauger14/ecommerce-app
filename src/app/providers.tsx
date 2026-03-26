// app/providers.tsx
"use client";
import { createContext, useContext } from "react";
import { type ReactNode } from "react";
import { type Session } from "better-auth";

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const session = useContext(SessionContext);
  return session;
}