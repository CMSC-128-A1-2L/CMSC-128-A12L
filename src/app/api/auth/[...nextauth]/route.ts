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
import { MongoClient } from "mongodb";
import { Mongoose, Types } from "mongoose";
import { UserModel, UserRole } from "@/models/user_model";

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
      - id: string (User ID)
      - provider: string (Google)
      - refresh_token: string (A refresh token)
      - token_type: string (usually the Bearer) 
      - expires_at: number (Expiration time in seconds) 
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
        After signup, create the user in the database.
        
       */
        const newUser = await UserModel.create({
          role: UserRole.ALUMNI,
          studentId: "2023-12345",
          currentAddress: new Types.ObjectId("65fa3b2e9b3f3c5a6d7e4f12"),
          gender: "Male",
          bio: "I am a new user",
          linkedIn: "https://www.linkedin.com/in/username",
          contactNumbers: ["09999999999", "09999999999"],
          suffix: "Jr.",
          middleName: "John",
          googleId: user.id,
          email: user.email,
          firstName: user.name?.split(" ")[0] ?? "",
          lastName: user.name?.split(" ")[1] ?? "",
        })
        console.log(newUser);
        return "/signup"
        // structure could probably be like this: "/signup?something=something"

      }
     } catch (error){
        console.log("Error establishing connection to the database: ", error);
     }
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

