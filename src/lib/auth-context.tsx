"use client";

import * as React from "react";
import { toast } from "sonner";

export interface AuthUser {
  name: string;
  email: string;
  image?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Phase 2 (auth): replace this state with the BetterAuth session
  // (createAuthClient -> useSession). Everything else stays as-is.
  const [user, setUser] = React.useState<AuthUser | null>(null);

  const logout = React.useCallback(() => {
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  const value = React.useMemo(
    () => ({ user, setUser, logout }),
    [user, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
