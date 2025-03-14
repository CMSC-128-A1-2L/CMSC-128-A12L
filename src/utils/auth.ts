import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

// Define the google id and secret 
const CLIENT_ID = process.env.CLIENT_ID ?? (() => {
  throw new Error("Missing client id in .env file");
})();

const CLIENT_SECRET = process.env.CLIENT_SECRET ?? (() => {
  throw new Error("Missing client secret in .env file");
})();


// Introducing NextAuthOptions type-safety reduces the need to include types in parameters in callbacks
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      // this authorization parameter makes it so that every time the user logs in the refresh token is given always
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        },
      },
    }
    ),
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

