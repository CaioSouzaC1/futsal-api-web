import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import { UserProps } from "@/@types/user";
import api from "@/services/api";

interface JWT {
  token: string;
  user: {
    user: UserProps;
  };
}

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const response = await api.post("/auth/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          return response.data;
        } catch (error: any) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            throw new Error(error.response.data.message);
          }

          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          ...token,
          token: user.data.token,
          user: user.data as unknown as UserProps,
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session = {
          ...session,
          token: token.token as string,
          user: (token as unknown as JWT).user,
        };
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, nextAuthOptions);
