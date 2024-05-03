import NextAuth from "next-auth/next";

import { Role } from "./types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      role: Role;
    };

    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    error: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      name: string;
      role: Role;
    };

    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    error: string;
  }
}
