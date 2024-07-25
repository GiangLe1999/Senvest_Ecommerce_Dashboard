export declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      email: string;
    };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      _id: string;
      email: string;
    };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}
