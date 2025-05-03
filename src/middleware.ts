import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { UserRole } from "./entities/user";
import { Logs } from "./entities/logs";

// in nextjs, a middleware cannot access the session object directly.
// instead, we can just access the token and its fields.
export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log(token);
    // if no token
    if(!token){
        console.log("user has no token");
        // Create a response that redirects to login
        const response = NextResponse.redirect(new URL("/login", req.url));
        // Clear the next-auth.session-token cookie (similar to clearing the session)
        response.cookies.delete("next-auth.session-token");
        return response;
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
        const response = NextResponse.redirect(new URL("/login", req.url));
        // Clear the next-auth.session-token cookie
        response.cookies.delete("next-auth.session-token");
        return response;
    }
    
    // log the user's activity
    if (req.nextUrl.pathname.startsWith('/api')) {
        // Log the API request
        const log: Logs = {
            userId: token.sub || undefined,  // Add userId from token sub (subject)
            name: token.name || "unknown",
            imageUrl: token.imageUrl || "",
            action: req.method + " " + req.nextUrl.pathname,
            status: req.method,
            timestamp: new Date(),
            ipAddress: req.headers.get("x-forwarded-for") || "unknown"
        };

        // Send log to the logs API
        try {
            // Create a clone of the request to avoid modifying the original
            const logRequest = new Request(new URL('/api/logs', req.url), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...log,
                    // Add additional fields that aren't in the Logs interface
                    path: req.nextUrl.pathname,
                    method: req.method
                })
            });
            
            // We can't await the fetch in middleware, so we use a non-blocking approach
            fetch(logRequest).catch(err => console.error('Failed to log API request:', err));
        } catch (error) {
            console.error('Error logging API request:', error);
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/alumni/:path*", "/admin/:path*", "/api/admin/:path*", "/api/alumni/:path*", 
        // this is for the rsvp, i did not include it in the alumni path lmao
        "/api/events/:path*"], 
};
