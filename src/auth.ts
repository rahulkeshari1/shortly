import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MySQLAuthAdapter } from "@/lib/auth-adapter";

export const authOptions: NextAuthOptions = {
  adapter: MySQLAuthAdapter(),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "database",
  },

  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
      }

      return session;
    },
  },
};
