import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { UserRole } from "./entities/user";
export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log(token);
    // if no toekn
    if(!token){
        console.log("user has not token")
        return NextResponse.redirect(new URL("/login", req.url)); 
    }
    //TODO: IF ACCOUNTS ARE ALREADY LINKED.
    // check if there is access token
    // if (!token.accessToken) {
    //     console.log("No access token");
    //     return NextResponse.redirect(new URL("/login", req.url)); 
    //   }
    
    // we check if the access token is valid in google
    // const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token.accessToken}`);
    // if (!googleResponse.ok) {
    //     console.log("Access token is not ok");
    //     return NextResponse.redirect(new URL("/login", req.url));
    // }

    // Check if the user is an admin (if the user is not an admin and the user tries to access the admin page, redirect to login)
    if ((!token.role?.find(role => role === UserRole.ADMIN) && req.nextUrl.pathname.includes("/admin"))) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    return NextResponse.next();
}

export const config = {
    matcher: ["/alumni-landing/:path*", "/admin-landing/:path*", "/api/admin/:path*"], 
  };