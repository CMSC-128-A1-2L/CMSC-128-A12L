"use client"
import { UserRole } from '@/entities/user';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { handleSignOut } from '@/utils/auth';

const Redirect = () => {
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === "unauthenticated") {
      // Create a promise that resolves after 1 second
      const redirectPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      
      // When the promise resolves, sign out and redirect to login
      redirectPromise.then(() => {
        handleSignOut();
      });
    }
  }, [status]);
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    if(session.user.role.includes(UserRole.ALUMNI)){
        redirect("/alumni");
    }
    else if (session.user.role.includes(UserRole.ADMIN)){
        redirect("/admin");
    }
    else{
        console.log("Invalid role");
        redirect("/login");
    }
  }

  return <div>Not authenticated</div>;
}

export default Redirect;