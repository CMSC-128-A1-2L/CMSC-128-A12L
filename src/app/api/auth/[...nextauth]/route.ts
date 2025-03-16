/*
 * This file handles incoming authentication requests in authentication (auth/[...nextauth]/route.ts)
 * any routes that goes here, goes to route.ts
 * */
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from 'next-auth/providers/credentials';

import { EmailAndPasswordAuthenticationProvider } from '@/providers/email_and_password_authentication';
import { getUserCredentialRepository } from "@/repositories/user_credentials_repository";
import { getPasswordEncryptionProvider } from "@/providers/password_encryption";
import { WrongLoginCredentialsError } from "@/errors/email_password_authentication";
import { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import { getUserIdProvider } from "@/providers/user_id";
import { getUserRepository } from "@/repositories/user_repository";
import { User, UserCredentials } from "@/models/user";

// Define the google id and secret 
const googleClientId = process.env.CLIENT_ID ?? (() => {
  throw new Error("Missing client id in .env file");
})();

const googleClientSecret = process.env.CLIENT_SECRET ?? (() => {
  throw new Error("Missing client secret in .env file");
})();

const adapter: Adapter = (() => {
  const userRepository = getUserRepository();
  const userIdProvider = getUserIdProvider();
  const userCredentialRepository = getUserCredentialRepository();

  async function createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
    console.log("Adapter.createUser() called");
    const userToRegister: User = {
      ...user,
      id: userIdProvider.generate()
    };

    while ((await userRepository.getUserById(userToRegister.id)) !== null) {
      userToRegister.id = userIdProvider.generate();
    }

    await userRepository.createUser(userToRegister);

    return userToRegister;
  }

  async function getUser(id: string): Promise<AdapterUser | null> {
    console.log("Adapter.getUser() called");
    return await userRepository.getUserById(id);
  }

  async function getUserByAccount(providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">): Promise<AdapterUser | null> {
    console.log("Adapter.getUserByAccount() called");
    const userCredentials = await userCredentialRepository.getUserCredentialsByProvider(providerAccountId.provider, providerAccountId.providerAccountId);
    if (!userCredentials) {
      return null;
    }

    const user = await userRepository.getUserById(userCredentials.id);
    return user;
  }

  async function updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
    console.log("Adapter.updateUser() called");
    const userToUpdate = await userRepository.getUserById(user.id);
    if (!userToUpdate) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...userToUpdate,
      ...user
    };

    await userRepository.updateUser(updatedUser);
    return updatedUser;
  }

  async function linkAccount(account: AdapterAccount): Promise<void> {
    console.log("Adapter.linkAccount() called");
    let userCredentials: UserCredentials | null = await userCredentialRepository.getUserCredentialsById(account.userId);
    const shouldAdd: boolean = userCredentials === null;

    if (userCredentials === null) {
      const user = await userRepository.getUserById(account.userId);
      if (user === null) {
        throw new Error("User not found");
      }

      userCredentials = {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified
      };
    }

    switch (account.provider) {
      case "google":
        if (account.refresh_token === undefined) {
          throw new Error("Cannot link without refresh token.");
        }

        userCredentials.google = {
          id: account.providerAccountId,
          refreshToken: account.refresh_token
        };
        break;
    }

    if (shouldAdd) {
      await userCredentialRepository.createUserCredentials(userCredentials);
    }
    else {
      await userCredentialRepository.updateUserCredentials(userCredentials);
    }
  }

  const getUserByEmail = async (email: string): Promise<AdapterUser | null> => {
    console.log("Adapter.getUserByEmail() called");
    const user = await userRepository.getUserByEmail(email);
    return user;
  }

  return {
    createUser: createUser,
    getUser: getUser,
    getUserByAccount: getUserByAccount,
    getUserByEmail: getUserByEmail,
    updateUser: updateUser,
    linkAccount: linkAccount,
  };
})()

// Introducing NextAuthOptions type-safety reduces the need to include types in parameters in callbacks
const authOptions: NextAuthOptions = {
  adapter: adapter,
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

        const provider = new EmailAndPasswordAuthenticationProvider(
          userCredentialsRepository,
          passwordEncryptionProvider
        );

        try {
          const authenticatedUser = await provider.loginUser(credentials.email, credentials.password);
          const user = await userRepository.getUserById(authenticatedUser.id);
          
          return user;
        }
        catch (error) {
          if (error instanceof WrongLoginCredentialsError) {
            console.error(error);
            return null;
          }

          throw error;
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
    async signIn({ user, account }) {
      /* 
      The account contaisn the following properties:
      - provider: string (Google)
      - refresh_token: string (A refresh token)
      - token_type: string (usually the Bearer) 
      - expires_at: number (Expiration time in seconds) 
      */
      console.log("Sign in callback.")
      // console.log(user);
      // console.log(account);
      return true;
    },
    /*
 * - The token object contains:
 *   - id: string (User ID)
 *   - email: string (User's email)
 *   - accessToken: string (OAuth access token)
 */
    async jwt({ token, user, account }) {
      console.log("JWT callback.")
      // console.log(user);
      // console.log(account);

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

export { handler as GET, handler as POST }
