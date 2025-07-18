import KakaoProvider from "next-auth/providers/kakao";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { user, account, session, verificationToken } from "@/lib/schema";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: account as any,
    sessionsTable: session as any,
    verificationTokensTable: verificationToken as any,
  }),
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      }
      return baseUrl;
    },
  },
  events: {
    async signIn(message) {
      console.log("signIn event:", message);
    },
    async createUser(message) {
      console.log("createUser event:", message);
    },
    async linkAccount(message) {
      console.log("linkAccount event:", message);
    },
    async signOut(message) {
      console.log("signOut event:", message);
    },
  },
  debug: process.env.NODE_ENV === "development",
};
