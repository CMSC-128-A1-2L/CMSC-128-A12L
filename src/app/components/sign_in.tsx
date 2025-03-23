"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <button
      onClick={() => signIn("google",
        {
          callbackUrl: `${process.env.NEXT_PUBLIC_CALLBACK_URL}/alumni-landing`,
        }
      )}
      className="w-3/4 md:w-2/5 bg-[#0C0051] text-white py-3 px-2 rounded-full flex items-center justify-center shadow-md hover:bg-[#0A0041] transition md:text-left ml-4 md:ml-10 mt-10 md:mt-25 "
      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "12px", cursor: "pointer" }}
    >
      <img src="/assets/google.png" alt="Google" className="w-4 h-4 mr-2" />
      Sign in with Google
    </button>

  );
}




