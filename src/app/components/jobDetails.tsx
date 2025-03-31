import React, { useState } from 'react';

export default function JobDetails(){
    const [openModal, setModal] = useState(false);
    
    const handleModal = () => {
        setModal(!openModal)
    }
    return(
        <>
            <button onClick={handleModal} className="btn bg-[#FF0000] text-white hover:bg-[#ff0000ab]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>Details</button>
            {openModal &&
                <div className="fixed top-0 left-0 visible bg-black/20 w-full h-full flex justify-center items-center">
                    <div className="max-w-[460px] bg-white shadow-lg py-2 rounded-md">
                        <div className="relative">
                            <button type="button" onClick={handleModal} className="text-gray-400 bg-transparent absolute top-3 right-5" style={{cursor: "pointer"}}>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </div>
                        <div className="px-10 py-8" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "24px"}}>
                            <p className="pb-2 text-center font-medium text-gray-700">Lorem Ipsum</p>
                            <div className="py-4 pb-4" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px"}}>
                                <p className="font-bold text-left text-gray-700">Qualifications</p>
                                    <div className="px-4 pb-4">
                                        <li className="text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                                        <li className="text-justify">Nullam at semper lacus.</li>
                                        <li className="text-justify">Duis imperdiet, quam ut placerat congue, odio velit ornare elit, id feugiat dui neque eget felis. Sed vestibulum aliquet arc </li>
                                    </div>
                                <p className="font-bold text-left text-gray-700">Location</p>
                                    <div className="px-4 pb-4">
                                        <li className="text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                    </div>
                                <p className="font-bold text-left text-gray-700">Job Type</p>
                                    <div className="px-4 pb-4">
                                        <li className="text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                    </div>
                                <p className="font-bold text-left text-gray-700">Employment Level</p>
                                    <div className="px-4 pb-4">
                                        <li className="text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}