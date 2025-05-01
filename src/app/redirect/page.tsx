"use client"
import { UserRole } from '@/entities/user';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { handleSignOut } from '@/utils/auth';

const Redirect = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "unauthenticated") {
        handleSignOut();
    }

    if (status === "authenticated" && session) {
      console.log("in redirect, testing for ", session.user.role)
      if (session.user.role.includes(UserRole.ALUMNI)) {
        router.push("/alumni");
      }
      else if (session.user.role.includes(UserRole.ADMIN)) {
        router.push("/admin");
      }
      else {
        // When the role is not found, redirect to verification pending page
        console.log("User's alumni status is pending verification.");
        router.push("/verification-pending");
      }
    }
  }, [status, session, router]);
  
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // This will show briefly before the redirect happens
  return (
    <div className="flex items-center justify-center h-screen">
      <div>Redirecting...</div>
    </div>
  );
}

export default Redirect;