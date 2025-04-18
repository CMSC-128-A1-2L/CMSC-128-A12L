"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Lock, Mail, User, Globe } from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    events: true,
    jobs: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: true,
    showPhone: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: string | boolean) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1a1f4d] mb-8">Settings</h1>

      <div className="space-y-8">
        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-[#1a1f4d]" size={24} />
            <h2 className="text-xl font-semibold text-[#1a1f4d]">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-medium text-gray-700">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="toggle toggle-primary bg-gray-200 border-gray-300 checked:bg-[#1a1f4d] checked:border-[#1a1f4d] hover:checked:bg-[#0d47a1] hover:checked:border-[#0d47a1]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-medium text-gray-700">Push Notifications</h3>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() => handleNotificationChange('push')}
                className="toggle toggle-primary bg-gray-200 border-gray-300 checked:bg-[#1a1f4d] checked:border-[#1a1f4d] hover:checked:bg-[#0d47a1] hover:checked:border-[#0d47a1]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-medium text-gray-700">Event Updates</h3>
                <p className="text-sm text-gray-500">Get notified about upcoming events</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.events}
                onChange={() => handleNotificationChange('events')}
                className="toggle toggle-primary bg-gray-200 border-gray-300 checked:bg-[#1a1f4d] checked:border-[#1a1f4d] hover:checked:bg-[#0d47a1] hover:checked:border-[#0d47a1]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-medium text-gray-700">Job Alerts</h3>
                <p className="text-sm text-gray-500">Receive job posting notifications</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.jobs}
                onChange={() => handleNotificationChange('jobs')}
                className="toggle toggle-primary bg-gray-200 border-gray-300 checked:bg-[#1a1f4d] checked:border-[#1a1f4d] hover:checked:bg-[#0d47a1] hover:checked:border-[#0d47a1]"
              />
            </div>
          </div>
        </motion.div>

        {/* Privacy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-[#1a1f4d]" size={24} />
            <h2 className="text-xl font-semibold text-[#1a1f4d]">Privacy</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-medium text-gray-700">Profile Visibility</h3>
                <p className="text-sm text-gray-500">Who can see your profile</p>
              </div>
              <select
                value={privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                className="select select-bordered w-40 border-gray-300 focus:border-[#1a1f4d] focus:ring-[#1a1f4d]"
              >
                <option value="public">Public</option>
                <option value="alumni">Alumni Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-medium text-gray-700">Show Email</h3>
                <p className="text-sm text-gray-500">Display your email on profile</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.showEmail}
                onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                className="toggle toggle-primary bg-gray-200 border-gray-300 checked:bg-[#1a1f4d] checked:border-[#1a1f4d] hover:checked:bg-[#0d47a1] hover:checked:border-[#0d47a1]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-medium text-gray-700">Show Phone</h3>
                <p className="text-sm text-gray-500">Display your phone number on profile</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.showPhone}
                onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                className="toggle toggle-primary bg-gray-200 border-gray-300 checked:bg-[#1a1f4d] checked:border-[#1a1f4d] hover:checked:bg-[#0d47a1] hover:checked:border-[#0d47a1]"
              />
            </div>
          </div>
        </motion.div>

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="text-[#1a1f4d]" size={24} />
            <h2 className="text-xl font-semibold text-[#1a1f4d]">Account</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-medium text-gray-700">Change Password</h3>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <button className="btn bg-[#1a1f4d] text-white hover:bg-[#0d47a1]">Change</button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-medium text-gray-700">Email Preferences</h3>
                <p className="text-sm text-gray-500">Manage your email settings</p>
              </div>
              <button className="btn bg-[#1a1f4d] text-white hover:bg-[#0d47a1]">Manage</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 