"use client";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Send, Calendar, MessageSquare, Mail } from "lucide-react";

interface EmailChip {
  id: string;
  email: string;
}

export default function EmailForm() {
  const [emailInput, setEmailInput] = useState<string>("");
  const [emailChips, setEmailChips] = useState<EmailChip[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [scheduledTime, setTime] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 16);
    setTime(formattedDate);
  }, []);

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const email = emailInput.trim();
      if (email && isValidEmail(email)) {
        setEmailChips([...emailChips, { id: Date.now().toString(), email }]);
        setEmailInput('');
      }
    }
  };

  const removeEmailChip = (id: string) => {
    setEmailChips(emailChips.filter(chip => chip.id !== id));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendBlastEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    const recipients = emailChips.map(chip => chip.email);

    const session = await getSession();
    const userEmail = session?.user.email || process.env.NEXT_PUBLIC_EMAIL;
    const domain = userEmail?.split("@")[1];
    const provider = (domain === "gmail.com" || domain === "up.edu.ph") ? 'google' : 'other';

    try {
      const response = await fetch("/api/admin/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject,
          htmlBody: `<p>${message}</p>`,
          provider,
          scheduledTime,
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setStatus("Emails scheduled successfully!");
      // Clear form
      setEmailChips([]);
      setSubject('');
      setMessage('');
      setTime(new Date().toISOString().slice(0, 16));
    } catch (error) {
      console.error("Error:", error);
      setStatus("Failed to schedule emails. Please try again.");
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
        
        <form onSubmit={sendBlastEmail} className="space-y-8">
          {/* Recipients Section */}
          <div className="space-y-3">
            <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">
              Recipients
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[42px] hover:border-blue-300 transition-colors duration-200">
              {emailChips.map((chip) => (
                <motion.div
                  key={chip.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
                >
                  <span>{chip.email}</span>
                  <button
                    type="button"
                    onClick={() => removeEmailChip(chip.id)}
                    className="hover:text-blue-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
              <input
                id="recipients"
                type="text"
                value={emailInput}
                onChange={handleEmailInput}
                onKeyDown={handleEmailKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 min-w-[200px]"
                placeholder="Type email and press Enter"
              />
            </div>
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

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <Send className="h-5 w-5" />
            Schedule Emails
          </motion.button>
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