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
import { User, UserRole } from "@/entities/user";

import { UserCredentials } from "@/entities/user_credentials";
import { JWT } from "next-auth/jwt";

// Define the google id and secret 
const googleClientId = process.env.CLIENT_ID ?? (() => {
    throw new Error("Missing client id in .env file");
})();

const googleClientSecret = process.env.CLIENT_SECRET ?? (() => {
    throw new Error("Missing client secret in .env file");
})();

// Function to refresh access token
// async function refreshAccessToken(token: JWT): Promise<JWT> {
//     const userCredentialsRepository = getUserCredentialRepository();
//     const userCredentials = await userCredentialsRepository.getUserCredentialsById(token.sub!);

//     switch (token.provider) {
//         case "google":
//             try {
//                 const url = "https://oauth2.googleapis.com/token";
//                 const response = await fetch(url, {
//                     method: "POST",
//                     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//                     body: new URLSearchParams({
//                         client_id: googleClientId,
//                         client_secret: googleClientSecret,
//                         grant_type: "refresh_token",
//                         refresh_token: userCredentials!.google!.refreshToken,
//                     }),
//                 });
        
//                 const refreshedTokens = await response.json();

//                 if (!response.ok) {
//                     throw new Error("Failed to refresh access token");
//                 }
        
//                 return {
//                     ...token,
//                     accessToken: refreshedTokens.access_token,
//                     expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
//                 };
//             } catch (error) {
//                 console.error("Error refreshing access token:", error);
//                 return { error: "RefreshAccessTokenError" };
//             }
//     }
// }

const adapter: Adapter = (() => {
    const userRepository = getUserRepository();
    const userIdProvider = getUserIdProvider();
    const userCredentialRepository = getUserCredentialRepository();

    async function createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
        console.log("Adapter.createUser() called");
        const userToRegister: User = {
            ...user,
            // TODO: remove if validation is already handled (to check whether the user is a real alumni)
            role: [UserRole.ALUMNI],
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
            ...user,
            // I don't know what is up with the role property, but TS throws an error without this.
            role: userToUpdate.role
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
                email: user.email
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

export const authOptions: NextAuthOptions = {
    adapter: adapter,
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            // This authorization parameter makes it so that every time the user logs in the refresh token is given always
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline", // Request refresh token
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
                    if (user === null) {
                        return null;
                    }

                    const userCredentials = await userCredentialsRepository.getUserCredentialsById(user.id);

                    // Change the password auth session expiry to tomorrow
                    userCredentials!.password!.sessionExpiry = new Date(Date.now() + (1000 * 60 * 60 * 24));
                    await userCredentialsRepository.updateUserCredentials(userCredentials!);

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
        strategy: "jwt"
    },
    /*
      The flow of callbacks is as follows:
      1. signIn callback is triggered
      2. jwt callback is then triggered after signing in
      3. session callback is triggered
    */

    // For more information, visit: https://next-auth.js.org/configuration/callbacks
    callbacks: {
        // Callback for storing information (mostly tokens) in JWT
        async jwt({ token, account, profile, user }) {
            console.log("JWT callback has been triggered.");
            if (user) {
                token.role = user.role ?? [];
            }
            // Token is initialized when the user first signs in
            if (account && profile) {
                token.provider = account.provider;
                token.accessToken = account.access_token;
                // token.expiresAt = Date.now() + (account.expires_at ?? 45) * 1000; // Set expiration time
                console.log(token);
            }

            return token;

            // // Check if access token has expired
            // if (token.expiresAt && Date.now() < Number(token.expiresAt)) {
            //     return token;
            // }

            // // Token has expired, we will be needing to refresh it. We call the refreshAccessToken function
            // return refreshAccessToken(token);
        },

        // Callback for storing any non-sensitive information that persists in all sessions
        async session({ session, token }) {
            /* DO NOT STORE ANY SENSITIVE INFORMATION IN THE SESSION! */
            try{
                if (token) {
                    
                    // create user repository instance
                    const userRepository = getUserRepository();
                    const currentUser = await userRepository.getUserByEmail(session.user.email!);

                    // set session user properties
                    session.user.role = token.role as UserRole[];
                    session.user.accessToken = token.accessToken as string;
                    session.user.id = currentUser!.id;
                    
                    console.log("The session is: ", session);
                }
            } catch (error){
                console.error(error);
            }
            
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }