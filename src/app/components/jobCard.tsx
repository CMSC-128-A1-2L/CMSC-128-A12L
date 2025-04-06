"use client";
import React from 'react';

interface JobListingCardProps {
    title: string;
    company: string;
    location: string;
    salary?: string;
    description: string;
    imageUrl: string;
    onApplyClick: () => void;
}

const JobListingCard: React.FC<JobListingCardProps> = ({
    title,
    company,
    location,
    salary,
    description,
    imageUrl,
    onApplyClick,
}) => {
    return (
        <div className="border rounded-lg shadow-md overflow-hidden max-w-md bg-white">
            <div className="relative h-40">
                <img
                    src={imageUrl}
                    alt={`${company} job banner`}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600 mb-1">{company} • {location}</p>
                {salary && <p className="text-gray-600 mb-4">{salary}</p>}

                <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Details</h3>
                    {/* <p className="text-gray-600 text-sm">{description}</p> */}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onApplyClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobListingCard;