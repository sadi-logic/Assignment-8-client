import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const authBaseUrl = process.env.BETTER_AUTH_URL?.replace(/\/$/, "");
if (!authBaseUrl) {
  throw new Error("BETTER_AUTH_URL must be configured for authentication.");
}

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();



export const auth = betterAuth({
  baseURL: authBaseUrl,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      
    }
  },
  plugins: [
    jwt({
      jwt: {
        issuer: `${authBaseUrl}/api/auth`,
        audience: "studiospace-server",
        definePayload: ({ user, session }) => ({
          name: user.name,
          email: user.email,
          image: user.image,
          session: {
            id: session.id,
            userId: session.userId,
            expiresAt: session.expiresAt,
          },
        }),
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7,
    },
  },
});