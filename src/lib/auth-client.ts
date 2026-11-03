import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [jwtClient()],
});



export const { signIn, signUp, useSession } = authClient;

export async function getAuthToken(): Promise<string> {
  const { data, error } = await authClient.token();
  if (error) {
    throw new Error(error.message || "Unable to get an authentication token.");
  }
  if (!data?.token) {
    throw new Error("The authentication response did not include a token.");
  }
  return data.token;
}

let sessionExchange: Promise<void> | null = null;

export function establishServerSession(): Promise<void> {
  if (sessionExchange) return sessionExchange;

  sessionExchange = (async () => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
      throw new Error("NEXT_PUBLIC_SERVER_URL is not configured.");
    }

    const token = await getAuthToken();
    const response = await fetch(
      `${serverUrl.replace(/\/$/, "")}/auth/session`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Unable to establish the authenticated session (HTTP ${response.status}).`
      );
    }
  })().finally(() => {
    sessionExchange = null;
  });

  return sessionExchange;
}