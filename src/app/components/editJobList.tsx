"use client";
import React, { useState } from "react";

interface EditJobModalProps {
  initialJobData?: {
    title: string;
    company: string;
    location: string;
    workMode: string;
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
    workMode: "On-site",
    description: "",
    tags: [],
  },
  isOpen,
  onClose,
  onSave,
}) => {
  const [jobData, setJobData] = useState(initialJobData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add useEffect to handle modal visibility
  React.useEffect(() => {
    const modal = document.getElementById('edit_job_modal') as HTMLDialogElement;
    if (modal) {
      if (isOpen) {
        modal.showModal();
      } else {
        modal.close();
      }
    }
  }, [isOpen]);

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
    if (!jobData.workMode) newErrors.workMode = "Work mode is required";
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

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(',')) {
      // Remove the comma and update tags
      const newTags = value
        .slice(0, -1)
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
      setJobData(prev => ({
        ...prev,
        tags: [...new Set(newTags)] // Remove duplicates
      }));
    } else {
      // Just update the input value
      setJobData(prev => ({
        ...prev,
        tags: value.split(',').map(tag => tag.trim()).filter(Boolean)
      }));
    }
  };

  return (
    <dialog id="edit_job_modal" className="modal">
      <div className="modal-box rounded-3xl bg-white">
        <div className="relative">
          <button 
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 hover:bg-[#605dff] hover:text-white"
          >
            ✕
          </button>
        </div>

        <h3 className="font-bold text-xl text-gray-900 mt-4">Edit Job Post</h3>

        {/* Form fields */}
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
            <p className="font-bold text-left text-gray-800">Work Mode</p>
            <select
              name="workMode"
              value={jobData.workMode}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="on-site">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.workMode && <p className="text-red-500 text-sm">{errors.workMode}</p>}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={jobData.tags?.join(', ')}
              onChange={handleTagsChange}
              className="w-full p-2 border rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
      <div className="modal-backdrop" onClick={onClose}>
        <button onClick={onClose}>close</button>
      </div>
    </dialog>
  );
};

export default EditJobModal;