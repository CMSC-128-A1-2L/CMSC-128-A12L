"use client"
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Redirect = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    if(session.user.role === "alumni"){
        redirect("/alumni-landing");
    }
    else if (session.user.role === "admin"){
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