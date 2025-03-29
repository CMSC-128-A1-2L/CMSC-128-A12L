"use client"
import { UserRole } from '@/entities/user';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Redirect = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    if(session.user.role.includes(UserRole.ALUMNI)){
        redirect("/alumni-landing");
    }
    else if (session.user.role.includes(UserRole.ADMIN)){
        redirect("/admin-landing");
    }
    else{
        console.log("Invalid role");
        redirect("/login");
    }
  }

  return <div>Not authenticated</div>;
}

export default Redirect;