import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import TwitterProvider from "next-auth/providers/twitter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

/**
 * Module augmentation for `next-auth` types.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }

  interface User {
    role: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    // Admin sessions expire after 4 hours of inactivity
    maxAge: 4 * 60 * 60, // 4 hours in seconds
    // Update session every 30 minutes to prevent unnecessary token refreshes
    updateAge: 30 * 60, // 30 minutes in seconds
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    
    // Facebook OAuth
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    
    // Apple OAuth
    ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_PRIVATE_KEY ? [
      AppleProvider({
        clientId: process.env.APPLE_CLIENT_ID,
        clientSecret: {
          teamId: process.env.APPLE_TEAM_ID || "",
          privateKey: process.env.APPLE_PRIVATE_KEY,
          keyId: process.env.APPLE_KEY_ID || "",
        },
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),
    
    // X (Twitter) OAuth
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      version: "2.0",
      allowDangerousEmailAccountLinking: true,
    }),
    
    // Email/Password Credentials
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E‑post", type: "email" },
        password: { label: "Lösenord", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Ange både e‑post och lösenord");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Ogiltig e‑post eller lösenord");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Ogiltig e‑post eller lösenord");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

/**
 * Higher-order function to protect API routes
 */
export const withAuth = (handler: any, roles?: string[]) => {
  return async (req: any, res: any) => {
    const session = await getServerAuthSession({ req, res });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (roles && !roles.includes(session.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return handler(req, res);
  };
};
