/*
 * This file handles incoming authentication requests in authentication (auth/[...nextauth]/route.ts)
 * any routes that goes here, goes to route.ts
 *
 * */

import NextAuth from "next-auth";
import { authOptions } from "@/utils/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

