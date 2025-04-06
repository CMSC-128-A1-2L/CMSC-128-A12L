"use client";
import React from 'react';

interface JobDetailsProps {
    title: string;
    company: string;
    location: string;
    salary?: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    onApplyClick: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({
    title,
    company,
    location,
    salary,
    description,
    isOpen,
    onClose,
    onApplyClick
}) => {
    // The component is always rendered, but only the modal is shown when isOpen is true; handled in the jobs page
    
    return (
        <dialog id="job_details_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                
                <div className="py-4">
                    <p className="font-bold text-left text-gray-700">Company</p>
                    <p className="px-2 pb-2">{company}</p>

                    <p className="font-bold text-left text-gray-700">Description</p>
                    <p className="px-2 pb-2">{description}</p>

                    <p className="font-bold text-left text-gray-700">Location</p>
                    <p className="px-2 pb-2">{location}</p>

                    {salary && (
                        <>
                            <p className="font-bold text-left text-gray-700">Salary</p>
                            <p className="px-2 pb-2">{salary}</p>
                        </>
                    )}

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={onApplyClick}
                            className="btn btn-primary"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default JobDetails;