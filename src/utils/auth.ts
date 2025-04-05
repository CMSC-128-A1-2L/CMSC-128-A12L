import { signOut } from "next-auth/react";

/**
 * Signs out the user and redirects to the login page
 * This clears the authentication token from cookies
 */
export const handleSignOut = async () => {
  try {
    await signOut({ redirect: true, callbackUrl: "/login" });
  } catch (error) {
    console.error("Error signing out:", error);
  }
}; 