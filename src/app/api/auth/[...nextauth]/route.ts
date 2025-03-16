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
import { WrongLoginCredentialsError } from "@/errors/email_password_authentication";
import { connectDB } from "@/app/services/database/database";
import { UserModel, UserRole } from "@/models/user_model";
import { Types } from "mongoose";

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
    maxAge: 10,
  },

  /*
    The flow of callbacks is as follows:
    1. signIn callback is triggered
    2. jwt callback is then triggered after signing in
    3. session callback is triggered
  */

  callbacks: {
    /*
    the session contains the following properties:
 * - name: string (User's full name)
 * - email: string (User's email address)
 * - image: string (URL to user's profile picture)
 * - googleId: string (User's Google ID)
 */
    async session({ session, token }) {
      // DO NOT STORE ANY SENSITIVE INFORMATION IN THE SESSION.
      console.log("Session callback has been triggered.");
      console.log("The session contains: ", session);

     if(session.user){
        // Here, we add another property to the session. Normally, we can use googleId to identify the user.
        (session.user as { googleId?: string }).googleId = token.googleId as string;
        (session.user as {role?: string}).role = token.role as string;
     }
      return session;
    },

    async signIn({ user, account, profile }) {
      /* 
      The account contaisn the following properties:
        id: string (User ID)
        provider: string (Google)
        refresh_token: string (A refresh token)
        token_type: string (usually the Bearer) 
        expires_at: number (Expiration time in seconds) 
      */

      /*
        We must be able to store the token inside the MongoDB database.
        We establish a connection to the database after the user signs in, check if they already exists.       
      */
     try {
      await connectDB();      

      // Check if current user exists in the database
      const exists = await UserModel.findOne({email: user.email});
      console.log(exists);

      // If the user does not exist, create a new user pertaining to that Google account that the user signs up
      if (!exists) {
        /*
          Before we proceed in making the account, let us first direct the user to the sign up page to indicate their extra information before signing up,
          we can add dynamic parameters in the URL (for example google id, access token, etc.)
        */        
       /*
        After signup, create the user in the database
       */
        const newUser = await UserModel.create({
          googleId: user.id,
          refreshToken: account?.refresh_token ?? (() => {
            throw new Error("Unable to retrieve refresh token.");
          })(),
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
          lastName: user.name?.split(" ")[1] ?? "",
        })
        console.log(newUser);
        // Structure could probably be like this: "/signup?something=something"
        return "/new-signup"; // Re-authenticate the user after signing up
      }
     } catch (error){
        console.log("Error establishing connection to the database: ", error);
        return false; // Re-authenticate
     }
      /* 
        Returns true when signed in and already exists in the database, this defaults to the callback url called in the signIn component, else, 
        just goes to the same page where the user signed in. 
      */
      return true;
    },
      /* 
        Contents that we need to store in token are: 
        - accessToken: string
        - refreshToken: string
        - googleId: string
        - expiresAt: date

      */
    async jwt({ token, user, account }) {
      console.log("Current JWT Token:", token);
      if (account && user) {
        console.log("New Sign-In Detected! Setting tokens.");
        token.googleId = user.id;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;

        try{
          await connectDB();
          const getUser = await UserModel.findOne({email: user.email});
          if(getUser){
            token.role = getUser.role;
          }else{
            throw new Error("User not found");
          }
        } catch (error) {
          console.error("Error fetching user role from database:", error);
        }
      }

      /*
        If the token has expired, we must refresh it. This enables us to extend the validity of the token when the user is currently signed in.
      */
      if(Date.now() > (token.expiresAt as number) * 1000){
        console.log("Access token expired! Refreshing...");
        //Source: https://developers.google.com/identity/protocols/oauth2/web-server#httprest_8
        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID as string ?? (() => {
              throw new Error("Missing client id in .env file");
            }),
            client_secret: process.env.GOOGLE_CLIENT_SECRET as string ?? (() => {
              throw new Error("Missing client secret in .env file");
            }),
            grant_type: "refresh_token",
            refresh_token: token.refreshToken as string ?? (() => {
              throw new Error("Cannot find refresh token in token.");
            }),
          }),
        })
        
        /*
          Parse the json body and get the token, then refill each of the token properties earlier.
        */
        const refreshedToken = await response.json();
        console.log("Refreshed Token Response:", refreshedToken);
        
        token.accessToken = refreshedToken.access_token;
        token.refreshToken = refreshedToken.refresh_token;
        token.expiresAt = refreshedToken.expires_at;
      }
      return token;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

