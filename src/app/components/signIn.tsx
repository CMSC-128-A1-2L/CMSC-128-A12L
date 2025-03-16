
/* 
 * Sample component that FE can use (optional)
 * */
"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <button onClick={() => signIn("google"
    //   Uncomment this block if you want to specify the callback URL (where the user will go to after signing in)
      ,{
        callbackUrl: "http://localhost:3000/dashboard",
    }
    )}>
      Sign in with Google
    </button>
  );
}

