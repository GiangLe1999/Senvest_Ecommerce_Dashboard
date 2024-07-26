// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

import axios from "axios";

import axiosInstance from "@/configs/axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials): Promise<any> {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const { data } = await axiosInstance.post("/login", {
            email,
            password,
          });

          const { ok } = data;

          if (ok) {
            return {
              user: { ...data?.admin },
              backendTokens: {
                accessToken: data?.accessToken,
                refreshToken: data?.refreshToken,
                expiresIn: data?.expiresIn,
              },
            };
          } else {
            return null;
          }
        } catch (error: any) {
          console.error("Error during authentication:", error);

          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      if (new Date().getTime() < token.backendTokens.expiresIn) {
        return token;
      }

      try {
        const { data } = await axios.post(
          `${process.env.API_BASE_URL}/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Refresh ${token.backendTokens.refreshToken}`,
            },
          },
        );

        return {
          ...token,
          backendTokens: {
            accessToken: data?.accessToken,
            refreshToken: data?.refreshToken,
            expiresIn: data?.expiresIn,
          },
        };
      } catch (error) {
        console.log(error);

        return token;
      }
    },
    async session({ session, token }) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
