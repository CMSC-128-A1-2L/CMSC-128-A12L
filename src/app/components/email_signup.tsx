"use client"

import { redirect } from "next/navigation"

export default function EmailSignUp() {
  return (
    <button onClick={() => redirect("/register")}
      className="w-3/4 md:w-2/5 bg-[#0C0051] text-white py-3 px-2 rounded-full flex items-center justify-center shadow-md hover:bg-[#0A0041] transition md:text-left ml-4 md:ml-10 mt-10 md:mt-6"
      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "12px", cursor: "pointer" }}>
      Sign up with Email
    </button>
  )
}
