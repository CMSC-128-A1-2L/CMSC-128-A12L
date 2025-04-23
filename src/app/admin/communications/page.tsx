"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, Mail } from "lucide-react";
import RecipientSelector from "@/app/components/RecipientSelector";

export default function CommunicationsPage() {
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [scheduledTime, setTime] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [recipients, setRecipients] = useState<string[]>([]);

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
          provider: "nodemailer",
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
      setTime(new Date().toISOString().slice(0, 16));
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
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 transition-all duration-200 group-hover:border-blue-300"
                placeholder="Enter email subject"
                required
              />
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
            </div>
          </div>

          {/* Message Section */}
          <div className="space-y-3">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none transition-all duration-200 hover:border-blue-300"
              placeholder="Enter your message"
              required
            />
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
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 transition-all duration-200 group-hover:border-blue-300"
                required
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
    </motion.div>
    );
}
