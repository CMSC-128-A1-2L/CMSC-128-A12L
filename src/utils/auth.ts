import GoogleProvider from "next-auth/providers/google";

// define the google id and secret (check its type first)
const CLIENT_ID = process.env.CLIENT_ID ?? (() => {
  throw new Error("Missing client id in .env file");
})();

const CLIENT_SECRET = process.env.CLIENT_SECRET ?? (() => {
  throw new Error("Missing client secret in .env file");
})();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
  ],
};

