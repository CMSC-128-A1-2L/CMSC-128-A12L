"use client";
import React, { useState } from "react";
import { Briefcase, Building2, MapPin, Tag, Clock, X } from "lucide-react";

interface EditJobModalProps {
  initialJobData?: {
    title: string;
    company: string;
    location: string;
    workMode: string;
    description: string;
    tags?: string[];
    position?: string;
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
    workMode: "on-site",
    description: "",
    tags: [],
    position: "",
  },
  isOpen,
  onClose,
  onSave,
}) => {
  const [jobData, setJobData] = useState(initialJobData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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

  // Reset loading state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        await onSave(jobData);
        // The actual API call and success/error handling is done in the parent component
      } catch (error) {
        console.error('Error saving job:', error);
        setLoading(false);
      }
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJobData((prev) => ({
      ...prev,
      tags: value.split(',').map(tag => tag.trim()).filter(Boolean)
    }));
  };

  return (
    <dialog id="edit_job_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-2xl bg-gradient-to-br from-[#1a1f4d]/90 to-[#2a3f8f]/90 text-white border border-white/10 p-0 rounded-xl overflow-hidden flex flex-col max-h-[90vh] mx-auto w-full">
        <div className="relative h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Edit Job Posting</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form id="edit-job-form" onSubmit={handleSubmit} className="space-y-4 p-6 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-white/50 text-white"
              placeholder="e.g. Senior Software Engineer"
              required
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Position</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Briefcase className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                name="position"
                value={jobData.position || ""}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-white/50 text-white"
                placeholder="e.g. Software Engineer"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Company</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Building2 className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-white/50 text-white"
                placeholder="e.g. Tech Company Inc."
                required
              />
            </div>
            {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MapPin className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-white/50 text-white"
                placeholder="e.g. Manila, Philippines"
                required
              />
            </div>
            {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Work Mode</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Clock className="h-5 w-5 text-white/50" />
              </div>
              <select
                name="workMode"
                value={jobData.workMode}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                required
              >
                <option value="" className="bg-[#1a1f4d]">Select work mode</option>
                <option value="remote" className="bg-[#1a1f4d]">Remote</option>
                <option value="hybrid" className="bg-[#1a1f4d]">Hybrid</option>
                <option value="on-site" className="bg-[#1a1f4d]">On-site</option>
              </select>
            </div>
            {errors.workMode && <p className="text-red-400 text-sm mt-1">{errors.workMode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Tags (comma-separated)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Tag className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                name="tags"
                value={jobData.tags?.join(', ') || ''}
                onChange={handleTagsChange}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-white/50 text-white"
                placeholder="e.g. React, Node.js, TypeScript"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-white/50 text-white"
              rows={4}
              placeholder="Describe the job role and requirements..."
              required
            ></textarea>
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>
        </form>

        <div className="flex justify-end gap-3 p-6 border-t border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-job-form"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving...' : 'Save Changes'}
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