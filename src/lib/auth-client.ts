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