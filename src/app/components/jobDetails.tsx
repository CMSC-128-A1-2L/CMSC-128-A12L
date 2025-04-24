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
  onEditClick: () => void;
  onDeleteClick: () => void;
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
  onEditClick,
}) => {
  return (
    <dialog id="job_details_modal" className="modal">
      <div className="modal-box rounded-3xl bg-white">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 hover:bg-[#605dff] hover:text-white">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-xl text-gray-900 mt-4">{title}</h3>

        <div className="pt-4">
          <p className="font-bold text-left text-gray-800">Job Type</p>
          <p className="px-2 pb-2 text-gray-700">{jobType}</p>

          <p className="font-bold text-left text-gray-800">Work Type</p>
          <p className="px-2 pb-2 text-gray-700">{workType}</p>

          <p className="font-bold text-left text-gray-800">Company</p>
          <p className="px-2 pb-2 text-gray-700">{company}</p>

          <p className="font-bold text-left text-gray-800">Location</p>
          <p className="px-2 pb-2 text-gray-700">{location}</p>

          <p className="font-bold text-left text-gray-800">Description</p>
          <p className="px-2 pb-2 text-gray-700">{description}</p>

          {salary && (
            <>
              <p className="font-bold text-left text-gray-800">Salary</p>
              <p className="px-2 pb-2 text-gray-700">{salary}</p>
            </>
          )}

          <div className="flex flex-row gap-2 mt-4">
            <button onClick={onEditClick} className="btn btn-dash flex-grow bg-gray-100 hover:bg-gray-200 text-gray-800">
              Edit
            </button>
            <button onClick={onApplyClick} className="btn btn-dash btn-error btn-sqr">
              <Trash2 />
            </button>
          </div>
          <button
            onClick={onApplyClick}
            className="btn btn-primary btn-block mt-2"
          >
            Apply Now
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default JobDetails;
