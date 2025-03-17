"use client";

import { useState } from "react";

export function CredentialsForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    // Implement authentication logic here
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto">
      <fieldset className="fieldset w-full bg-base-200 border border-base-100 p-4 rounded-box">
        <legend className="fieldset-legend text-lg font-bold">Login</legend>

        {/* Email Field */}
        {/* <label className="fieldset-label">Email</label> */}
        <div className="space-y-4">
        <input
          type="email"
          required
          className="input input-bordered w-full"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Field */}
        {/* <label className="fieldset-label mt-2">Password</label> */}
        <input
          type="password"
          required
          className="input input-bordered w-full"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>
        {/* Login Button */}
    
        <button type="submit" className="btn btn-neutral bg-[#0C0051] text-white rounded-full flex items-center justify-center mt-4 w-full hover:bg-[#0A0041] cursor-pointer">
          Login
        </button>
      </fieldset>
    </form>
  );
}
