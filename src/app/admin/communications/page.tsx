"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, Mail, Bell } from "lucide-react";
import RecipientSelector from "@/app/components/RecipientSelector";
import AdminAnnouncements from "@/app/components/AdminAnnouncements";

const MAX_SUBJECT_LENGTH = 100; // Maximum characters for subject
const MAX_MESSAGE_LENGTH = 1000; // Maximum characters for message

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'announcements'>('email');
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>(new Date().toISOString().slice(0, 16));
  const [status, setStatus] = useState<string>("");
  const [recipients, setRecipients] = useState<string[]>([]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_SUBJECT_LENGTH) {
      setSubject(value);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setMessage(value);
    }
  };

  const handleSendEmail = async (e: React.FormEvent, sendNow: boolean = false) => {
    e.preventDefault();
    setStatus("Sending...");

    if (recipients.length === 0) {
      setStatus("Please select at least one recipient");
      return;
    }

    try {
      const response = await fetch("/api/admin/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject,
          htmlBody: `<p>${message}</p>`,
          provider: "google",
          scheduledTime: sendNow ? new Date().toISOString() : scheduledTime,
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setStatus(sendNow ? "Emails sent successfully!" : "Emails scheduled successfully!");
      // Clear form
      setSubject('');
      setMessage('');
      setScheduledTime(new Date().toISOString().slice(0, 16));
    } catch (error) {
      console.error("Error:", error);
      setStatus("Failed to send emails. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-8"
    >
      <div className="bg-white rounded-2xl p-10 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-4 px-4 relative ${
              activeTab === 'email' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Mail size={20} />
              Email Blast
            </span>
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`pb-4 px-4 relative ${
              activeTab === 'announcements' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Bell size={20} />
              Announcements
            </span>
          </button>
        </div>

        {activeTab === 'email' ? (
          // Email Form
          <div>
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Send Email Blast</h1>
                <p className="text-gray-500 mt-1">Send emails to multiple alumni</p>
              </div>
            </div>
            
            <form onSubmit={(e) => handleSendEmail(e, false)} className="space-y-6">
              {/* Recipient Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select Recipients
                </label>
                <RecipientSelector onRecipientsChange={setRecipients} />
              </div>

              {/* Subject Section */}
              <div className="space-y-3">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <div className="relative group">
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={handleSubjectChange}
                    maxLength={MAX_SUBJECT_LENGTH}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 transition-all duration-200 group-hover:border-blue-300"
                    placeholder="Enter email subject"
                    required
                  />
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {subject.length}/{MAX_SUBJECT_LENGTH}
                  </span>
                </div>
              </div>

              {/* Message Section */}
              <div className="space-y-3">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    value={message}
                    onChange={handleMessageChange}
                    maxLength={MAX_MESSAGE_LENGTH}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none transition-all duration-200 hover:border-blue-300"
                    placeholder="Enter your message"
                    required
                  />
                  <div className="absolute right-4 bottom-4 text-sm text-gray-400">
                    {message.length}/{MAX_MESSAGE_LENGTH}
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="space-y-3">
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
                  Schedule Time
                </label>
                <div className="relative group">
                  <input
                    id="schedule"
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 transition-all duration-200 group-hover:border-blue-300 appearance-none [&::-webkit-calendar-picker-indicator]:bg-gray-100 [&::-webkit-datetime-edit-fields-wrapper]:text-gray-900"
                    onKeyDown={(e) => e.preventDefault()}
                    required
                    style={{ colorScheme: 'light' }}
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                </div>
              </div>

              {/* Buttons Section */}
              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <Calendar className="h-5 w-5" />
                  Schedule Emails
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={(e) => handleSendEmail(e, true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <Mail className="h-5 w-5" />
                  Send Now
                </motion.button>
              </div>
            </form>

            {/* Status Message */}
            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl text-center border border-gray-100"
              >
                <p className={`text-sm ${status.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                  {status}
                </p>
              </motion.div>
            )}
          </div>
        ) : (
          // Announcements Tab
          <AdminAnnouncements />
        )}
      </div>
    </motion.div>
  );
}
