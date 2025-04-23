"use client";
import { useState } from "react";

export default function CreateJL({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    workType: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <dialog id="create_job_modal" className="modal" open>
      <div className="modal-box rounded-3xl bg-white">
        <form method="dialog">
          <button 
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 hover:bg-[#605dff] hover:text-white"
          >
            ✕
          </button>
        </form>

        <h3 className="font-bold text-xl text-gray-900 mt-4">Create a new job post</h3>

        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          <div>
            <p className="font-bold text-left text-gray-800">Job Title</p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <p className="font-bold text-left text-gray-800">Company Name</p>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <p className="font-bold text-left text-gray-800">Location</p>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-left text-gray-800">Job Type</p>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select job type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <p className="font-bold text-left text-gray-800">Work Type</p>
              <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select work type</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <p className="font-bold text-left text-gray-800">Job Description</p>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block mt-6"
          >
            Create Job Post
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
