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
    if (!isOpen) return null;

    return (
        <div className="modal fixed top-0 left-0 visible bg-black/20 w-full h-full flex justify-center items-center">
            <div className="max-w-[460px] bg-white shadow-lg py-2 rounded-md">
                <div className="relative">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 bg-transparent absolute top-3 right-5"
                    >
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                    </button>
                </div>
                <div className="px-10 py-8">
                    <p className="pb-2 text-center font-medium text-gray-700">
                        {title}
                    </p>
                    <div className="py-4 pb-4">
                        <p className="font-bold text-left text-gray-700">Company</p>
                        <ul className="px-4 pb-4">
                            <li className="text-justify">{company}</li>
                        </ul>

                        <p className="font-bold text-left text-gray-700">Description</p>
                        <ul className="px-4 pb-4">
                            <li className="text-justify">{description}</li>
                        </ul>

                        <p className="font-bold text-left text-gray-700">Location</p>
                        <ul className="px-4 pb-4">
                            <li className="text-justify">{location}</li>
                        </ul>

                        {salary && (
                            <>
                                <p className="font-bold text-left text-gray-700">Salary</p>
                                <ul className="px-4 pb-4">
                                    <li className="text-justify">{salary}</li>
                                </ul>
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
            </div>
        </div>
    );
};

export default JobDetails;