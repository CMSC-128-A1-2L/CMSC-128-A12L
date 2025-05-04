'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  company: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function JobApplicationForm({
  jobId,
  jobTitle,
  company,
  onClose,
  onSuccess
}: JobApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resumeUrl: '',
    portfolio: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Add useEffect to handle modal visibility
  useEffect(() => {
    const modal = document.getElementById("job_application_modal") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('document')) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    // Create a temporary URL for preview
    setFormData(prev => ({ ...prev, resumeUrl: URL.createObjectURL(file) }));
  };

  const uploadResume = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/cloudinary/upload_resume', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload resume');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please upload your resume');
      return;
    }

    try {
      setLoading(true);

      // First upload the resume to Cloudinary
      const resumeUrl = await uploadResume(selectedFile);
      
      // Then submit the application with the Cloudinary URL
      const response = await fetch('/api/alumni/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          coverLetter: formData.coverLetter,
          resume: resumeUrl,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          portfolio: formData.portfolio
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit application');
      }

      toast.success('Application submitted successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="job_application_modal" className="modal">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="modal-box max-w-2xl bg-white/10 backdrop-blur-md text-white border border-white/10 p-0 rounded-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="relative h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-black/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-6">
            <h2 className="text-xl font-bold">Apply for {jobTitle}</h2>
            <p className="text-white/80">{company}</p>
          </div>
        </div>

        {/* Application Form */}
        <form id="job-application-form" onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder:text-white/30"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder:text-white/30"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder:text-white/30"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Portfolio URL (Optional)</label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder:text-white/30"
                placeholder="https://your-portfolio.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Cover Letter</label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder:text-white/30"
              rows={4}
              placeholder="Tell us why you're interested in this position..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Resume/CV</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-lg hover:border-white/20 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-white/30" />
                <div className="flex flex-wrap justify-center text-sm text-white/60">
                  <label htmlFor="resume-upload" className="relative cursor-pointer rounded-md font-medium text-blue-200 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:ring-offset-2">
                    <span>Upload a file</span>
                    <input
                      id="resume-upload"
                      name="resume-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-white/40">
                  {selectedFile ? (
                    <span className="text-green-400">Selected: {selectedFile.name}</span>
                  ) : (
                    'PDF, DOC, DOCX up to 5MB'
                  )}
                </p>
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-end space-x-4 p-6 border-t border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="job-application-form"
            disabled={loading}
            className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-colors border border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">↻</span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Briefcase size={18} />
                <span>Submit Application</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}