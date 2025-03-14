/*
 * This file handles incoming authentication requests in authentication (auth/[...nextauth]/route.ts)
 * any routes that goes here, goes to route.ts
 * */
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from 'next-auth/providers/credentials';

import { EmailAndPasswordAuthenticationProvider } from '@/providers/email_and_password_authentication';
import { getUserCredentialRepository } from "@/repositories/user_email_credentials_repository";
import { getUserRepository } from "@/repositories/user_repository";
import { getPasswordEncryptionProvider } from "@/providers/password_encryption";
import { getUserIdProvider } from "@/providers/user_id";

// Define the google id and secret 
const googleClientId = process.env.CLIENT_ID ?? (() => {
  throw new Error("Missing client id in .env file");
})();

const googleClientSecret = process.env.CLIENT_SECRET ?? (() => {
  throw new Error("Missing client secret in .env file");
})();

// Introducing NextAuthOptions type-safety reduces the need to include types in parameters in callbacks
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      // This authorization parameter makes it so that every time the user logs in the refresh token is given always
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        },
      },
    }),
    Credentials({
      id: "email-password",
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email"
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password"
        }
      },
      async authorize(credentials) {
        if (credentials === undefined) {
          return null;
        }

        const userRepository = getUserRepository();
        const userCredentialsRepository = getUserCredentialRepository();
        const passwordEncryptionProvider = getPasswordEncryptionProvider();
        const userIdProvider = getUserIdProvider();

        const provider = new EmailAndPasswordAuthenticationProvider(
          userRepository,
          userCredentialsRepository,
          passwordEncryptionProvider,
          userIdProvider
        );

        try {
          const user = await provider.loginUser(credentials.email, credentials.password);
          if (user.id === undefined) {
            console.error("Validated user has no ID!");
            return null;
          }

          return {
            id: user.id,
            email: credentials.email,
            name: `${user.firstName} ${user.lastName}`,
            image: null
          };
        }
        catch (error) {
          console.error(error);
          return null;
        }
      }
    })
  ],
  // This part indicates the maximum time before the session is removed
  session: {
    strategy: "jwt",
    maxAge: 60,
  },
  callbacks: {
    /*
    the session contains the following properties:
 * - name: string (User's full name)
 * - email: string (User's email address)
 * - image: string (URL to user's profile picture)
 * - expires: string (Expiration timestamp)
 */
    async session({ session }) {
      return session;
    },
    async signIn({ user, account, profile }) {
      /* 
      The account contaisn the following properties:
      - provider: string (Google)
      - refresh_token: string (A refresh token)
      - token_type: string (usually the Bearer) 
      - expires_at: number (Expiration time in seconds) 
      */
      return true;
    },
    /*
 * - The token object contains:
 *   - id: string (User ID)
 *   - email: string (User's email)
 *   - accessToken: string (OAuth access token)
 */
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = account.access_token;
      }
      return token;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

