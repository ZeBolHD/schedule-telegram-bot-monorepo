import { Role, Token } from "@repo/database";

export interface Tokens {
  accessToken: string;
  refreshToken: Token;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
  verified: boolean;
}
