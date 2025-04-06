"use client";
import React from "react";
import {
  Trash2
} from "lucide-react";

interface JobDetailsProps {
  title: string;
  company: string;
  location: string;
  jobType: string;
  workType: string;
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
  jobType,
  workType,
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
          <p className="font-bold text-left text-gray-700">Job Type</p>
          <p className="px-2 pb-2">{jobType}</p>

          <p className="font-bold text-left text-gray-700">Work Type</p>
          <p className="px-2 pb-2">{workType}</p>

          <p className="font-bold text-left text-gray-700">Company</p>
          <p className="px-2 pb-2">{company}</p>

          <p className="font-bold text-left text-gray-700">Location</p>
          <p className="px-2 pb-2">{location}</p>

          <p className="font-bold text-left text-gray-700">Description</p>
          <p className="px-2 pb-2">{description}</p>

          {salary && (
            <>
              <p className="font-bold text-left text-gray-700">Salary</p>
              <p className="px-2 pb-2">{salary}</p>
            </>
          )}

          <div className="flex flex-col gap-2 pt-6">
            {/* ON ADMIN/CREATOR VIEWS ONLY WIP */}
            <div className="flex flex-row gap-2">
              <button onClick={onApplyClick} className="btn btn-dash flex-grow">
                Edit
              </button>
              <button onClick={onApplyClick} className="btn btn-dash btn-error btn-sqr">
                <Trash2 />
              </button>
            </div>
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
