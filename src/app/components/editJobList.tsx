"use client";
import React, { useState } from "react";

interface EditJobModalProps {
  initialJobData?: {
    title: string;
    company: string;
    location: string;
    jobType: string;
    workType: string;
    salary?: string;
    description: string;
    tags?: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: any) => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({
  initialJobData = {
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    workType: "On-site",
    salary: "",
    description: "",
    tags: [],
  },
  isOpen,
  onClose,
  onSave,
}) => {
  const [jobData, setJobData] = useState(initialJobData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!jobData.title) newErrors.title = "Job title is required";
    if (!jobData.company) newErrors.company = "Company is required";
    if (!jobData.location) newErrors.location = "Location is required";
    if (!jobData.jobType) newErrors.jobType = "Job type is required";
    if (!jobData.workType) newErrors.workType = "Work type is required";
    if (!jobData.description) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(jobData);
      onClose();
    }
  };


  return (
    <dialog id="edit_job_modal" className="modal">
      <div className="modal-box rounded-3xl bg-white">
        <form method="dialog">
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 hover:bg-[#605dff] hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <h3 className="font-bold text-xl text-gray-900 mt-4">Edit Job Post</h3>

        <div className="pt-4 space-y-4">
          <div>
            <p className="font-bold text-left text-gray-800">Job Title</p>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div>
            <p className="font-bold text-left text-gray-800">Company</p>
            <input
              type="text"
              name="company"
              value={jobData.company}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
          </div>

          <div>
            <p className="font-bold text-left text-gray-800">Job Type</p>
            <select
              name="jobType"
              value={jobData.jobType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            {errors.jobType && <p className="text-red-500 text-sm">{errors.jobType}</p>}
          </div>

          <div>
            <p className="font-bold text-left text-gray-800">Work Type</p>
            <select
              name="workType"
              value={jobData.workType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            {errors.workType && <p className="text-red-500 text-sm">{errors.workType}</p>}
          </div>

          <div>
            <p className="font-bold text-left text-gray-800">Location</p>
            <input
              type="text"
              name="location"
              value={jobData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          <div>
            <p className="font-bold text-left text-gray-800">Description</p>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md h-24 bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div>
            <p className="font-bold text-left text-gray-800">Salary (Optional)</p>
            <input
              type="text"
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. $50,000 - $70,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={jobData.tags?.join(', ') || ''}
              onChange={(e) => setJobData({
                ...jobData,
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. React, TypeScript, Node.js"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="btn btn-primary btn-block mt-6"
          >
            Save Changes
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default EditJobModal;