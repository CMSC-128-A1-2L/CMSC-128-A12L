"use client";
import React from "react";

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
  onApplyClick,
}) => {
  return (
    <dialog id="job_details_modal" className="modal">
      <div className="modal-box rounded-3xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg mt-4">{title}</h3>

        <div className="pt-4">
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

          <div className="pt-6">
            <button
              onClick={onApplyClick}
              className="btn btn-primary btn-block"
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
