import NextAuth from "next-auth";

import { UserProps } from "./user";

declare module "next-auth" {
  interface User {
    data: {
      token: string;
      user: UserProps;
    };
  }

  interface Session {
    token: string;
    user: UserProps;
  }
}
