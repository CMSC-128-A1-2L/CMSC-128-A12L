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
import { connectDB } from "@/app/services/database/database";
import { UserModel, UserRole } from "@/models/user_model";
import { Types } from "mongoose";
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

// Function to refresh access token
async function refreshAccessToken(token: any) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000, 
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

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
  /*
    The flow of callbacks is as follows:
    1. signIn callback is triggered
    2. jwt callback is then triggered after signing in
    3. session callback is triggered
  */

    // For more information, visit: https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // Callback to handle the sign-in process
    async signIn({ user, account }){
      try{

        await connectDB();
        
        const exists = await UserModel.findOne({email: user.email});
        
        // If user does not exist, create a new user in the database
        if(!exists){
          const newUser = await UserModel.create({
            googleId: user.id,
            refreshToken: account?.refresh_token,
            role: UserRole.ALUMNI,
            studentId: "2023-12345",
            currentAddress: new Types.ObjectId("65fa3b2e9b3f3c5a6d7e4f12"),
            gender: "Male",
            bio: "I am a new user",
            linkedIn: "https://www.linkedin.com/in/username",
            contactNumbers: ["09999999999", "09999999999"],
            suffix: "Jr.",
            email: user.email,
            firstName: user.name?.split(" ")[0] ?? "",
            lastName: "user" // to avoid conflicts, since sometimes the user does not have a last name

            /* take note that we can add a return field here that redirects the user to a certain page before signing up 
              for e.g: return "/goToAnotherSignUpPageBeforeAccessingTheApp?addParametersHere=example"  
            */
          })
        }
      } catch (error){
        console.error("Error occurred while the user is signing in: ", error);
        return false;
      }
      return true;
    },

    // Callback for storing information (mostly tokens) in JWT
    async jwt({ token, account, profile }) {
      console.log("JWT callback has been triggered.");
      console.log("The token details are: ", token);
    
      // Token is initialized when the user has a first sign-in
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = Date.now() + (Number(account.expires_in) ?? 3600) * 1000; // Set expiration time
      }
      
      // Check if access token has expired
      if (token.expiresAt && Date.now() < Number(token.expiresAt)) {
        return token;
      }
    
      // Token has expired, we will be needing to refresh it. We call the refreshAccessToken function
      return refreshAccessToken(token);
    },

    // Callback for storing any non-sensitive information that persists in all sessions
    async session({ session, token, user }){
      /* DO NOT STORE ANY SENSITIVE INFORMATION IN THE SESSION! */
      console.log("Session callback has been triggered.");
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
