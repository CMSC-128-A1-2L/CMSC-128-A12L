"use client"
import React, { useState } from 'react';
import { UserDto } from '@/models/user';

interface DeleteUserProps {
    person: UserDto;
    deleteSuccess: (userId: string) => void;
}

export default function DeleteUser({ person, deleteSuccess }: DeleteUserProps) {
    const [openModal, setModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleModal = () => {
        setModal(!openModal)
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await fetch(`/api/admin/users/${person.id}`, {
                method: "DELETE",
            });
            
            if (response.ok) {
                deleteSuccess(person.id);
                setModal(false);
            } else {
                console.error('Failed to delete user:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <button 
                onClick={handleModal} 
                className="btn bg-[#FF0000] text-white hover:bg-[#ff0000ab]" 
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}
            >
                Delete
            </button>
            {openModal && (
                <div className="fixed top-0 left-0 visible bg-black/20 w-full h-full flex justify-center items-center">
                    <div className="max-w-[460px] bg-white shadow-lg py-2 rounded-md">
                        <div className="px-15 py-8 pb-4">
                            <p className="text-center font-medium text-gray-700" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px"}}>
                                Delete {person.name}'s account?
                            </p>
                        </div>
                        <div className="flex justify-center items-center pt-2 pb-2">
                            <button 
                                type="button" 
                                className="btn mr-3 bg-[#0C0051] text-white hover:bg-[#12006A]text-sm rounded-md" 
                                onClick={handleDelete}
                                disabled={isDeleting}
                                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}
                            >
                                {isDeleting ? "Deleting..." : "Confirm"}
                            </button>
                            <button 
                                type="button" 
                                className="btn bg-[#0C0051] text-white hover:bg-[#12006A]text-sm rounded-md" 
                                onClick={handleModal}
                                disabled={isDeleting}
                                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}