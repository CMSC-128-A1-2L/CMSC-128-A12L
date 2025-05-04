"use client";
import React, { useState } from "react";
import { Briefcase, Building2, MapPin, Tag, Clock, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { createNotification } from '@/services/notification.service';
export default function CreateJL({ onClose, onSuccess }: { onClose: () => void, onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    position: "",
    company: "",
    location: "",
    tags: [] as string[],
    workMode: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/alumni/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create job');
      
      toast.success('Job posted successfully');
      // First notify all users about the new job
      await createNotification({
        type: 'job',
        entity: formData,
        entityName: formData.title ?? '',
        action: 'created',
        sendAll: true
    });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error('Failed to create job');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="create_job_modal" className="modal" open>
      <div className="modal-box max-w-2xl bg-white/10 backdrop-blur-md text-white border border-white/10 p-0 rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="relative h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Create New Job Posting</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form id="create-job-form" onSubmit={handleSubmit} className="space-y-4 p-6 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-white/50 text-white"
              placeholder="e.g. Senior Software Engineer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Position</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Briefcase className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
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
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-white/50 text-white"
                placeholder="e.g. Tech Company Inc."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MapPin className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-white/50 text-white"
                placeholder="e.g. Manila, Philippines"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Work Mode</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Clock className="h-5 w-5 text-white/50" />
              </div>
              <select
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                required
              >
                <option value="" className="bg-[#1a1f4d]">Select work mode</option>
                <option value="remote" className="bg-[#1a1f4d]">Remote</option>
                <option value="hybrid" className="bg-[#1a1f4d]">Hybrid</option>
                <option value="on-site" className="bg-[#1a1f4d]">On-site</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Tags (comma-separated)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Tag className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-white/50 text-white"
                placeholder="e.g. React, Node.js, TypeScript"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-white/50 text-white"
              rows={4}
              placeholder="Describe the job role and requirements..."
              required
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 p-6 border-t border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-job-form"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
