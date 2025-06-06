"use client"
import { User } from '@/entities/user';
import { UserDto } from '@/models/user';
import { getUserRepository } from '@/repositories/user_repository';
import React, { useState, useEffect } from 'react';

export default function PromoteUser({ person }: {person: UserDto}) {
    const [openModal, setModal] = useState(false);
    const [disable, setDisabled] = useState(false);
    const [promote, setPromote] = useState("Promote");

    async function handleClick() {
      try{
        const response = await fetch(`/api/admin/users/${person.id}`, {
          method: "PUT",
          body: JSON.stringify({
            ...person,
            role: ["admin", "alumni"]
          }),
        })
        if (response.ok) {
            setPromote("Promoted")
            setDisabled(true)
            setModal(!openModal)  
        }
        else {
            setPromote("Promote")
            setDisabled(false)
            setModal(!openModal)
            console.log(response.statusText)
        }
      }
      catch(error) {
        console.log(error)
      }

    };
    const handleModal = () => {
        setModal(!openModal)
    }

    return(
        <>
        <button onClick={handleModal} disabled={disable} className="mr-3 btn disabled:bg-black disabled:text-gray-500 bg-[#0C0051] text-white hover:bg-[#12006A]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>{promote}</button>
        {openModal &&
           <div className="fixed top-0 left-0 visible bg-black/20 w-full h-full flex justify-center items-center">
           <div className="max-w-[460px] bg-white shadow-lg py-2 rounded-md">
             <div className="px-15 py-8 pb-4">
               <p className="text-center font-medium text-gray-700" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px"}}>Promote {person.name}'s account?</p>
             </div>
             <div className="flex justify-center items-center pt-2 pb-2">
             <button type="button" className="btn mr-3 bg-[#0C0051] text-white hover:bg-[#12006A]text-sm rounded-md" onClick={handleClick} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>
                Confirm
               </button>
               <button type="button" className="btn bg-[#0C0051] text-white hover:bg-[#12006A]text-sm rounded-md" onClick={handleModal} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>
                Cancel
               </button>
             </div>
           </div>
         </div>
        }
        </>
    )
}