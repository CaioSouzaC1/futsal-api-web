import { UserProps } from "@/@types/user";
import api from "@/services/api";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { User } from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

interface Auth extends User {
  token: string;
  user: UserProps;
}

const providers = [
  CredentialProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      confirm_password: { label: "Confirm Password", type: "password" },
    },
    authorize: async (credentials) => {
      try {
        const response = await api.post("/auth/login", {
          email: credentials?.email,
          password: credentials?.password,
          confirm_password: credentials?.confirm_password,
        });

        const { user, token } = response.data.data;

        return {
          token: token,
          user: {
            name: user.name,
            id: user.id,
            email: user.email,
            email_verified_at: user.email_verified_at,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        } as unknown as Auth;
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
];

const callbacks = {
  jwt: async ({ token, user }: { token: any; user: any }) => {
    if (user) {
      return {
        token,
        user,
      };
    }
    return token;
  },
  session: async ({
    session,
    token,
  }: {
    session: any;
    user: object;
    token: any;
  }) => {
    return {
      ...session,
      user: token.user.user,
      token: token.user.token,
    };
  },
};

const authOptions: NextAuthOptions = {
  providers,
  callbacks,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, authOptions);
