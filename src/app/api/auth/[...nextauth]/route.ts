/*
 * This file handles incoming authentication requests in authentication (auth/[...nextauth]/route.ts)
 * any routes that goes here, goes to route.ts
 *
 * */

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
      // this authorization parameter makes it so that every time the user logs in the refresh token is given always
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      console.log("Session: ", session);
      console.log("User: ", user);
      return session;
    },
    async signIn({ user, account, profile }) {
      // account contains 'refresh token'
      console.log("Sign in: ", { user, account, profile })
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = account.access_token;
        console.log("The token contents are: ", token);
      }
      return token;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

