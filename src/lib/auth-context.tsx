"use client";

import * as React from "react";
import { toast } from "sonner";
import { authClient, establishServerSession } from "@/lib/auth-client";

export interface AuthUser {
  name: string;
  email: string;
  image?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isPending: boolean;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const sessionUser = session?.user;
  const sessionUserId = sessionUser?.id;
  const user = React.useMemo(
    () =>
      sessionUser
        ? {
            name: sessionUser.name,
            email: sessionUser.email,
            image: sessionUser.image ?? undefined,
          }
        : null,
    [sessionUser]
  );

  React.useEffect(() => {
    if (!sessionUserId) return;

    let active = true;
    establishServerSession().catch((error: unknown) => {
      if (!active) return;
      console.error("Unable to establish the API session:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to establish the authenticated session."
      );
    });

    return () => {
      active = false;
    };
  }, [sessionUserId]);

  const logout = React.useCallback(async () => {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message || "Unable to log out.");
        return;
      }
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to log out."
      );
    }
  }, []);

  const value = React.useMemo(
    () => ({ user, isPending, logout }),
    [user, isPending, logout]
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
