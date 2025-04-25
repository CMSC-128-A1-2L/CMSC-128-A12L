"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Lock, Mail, User, Globe, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { getUserRepository } from "@/repositories/user_repository";

export default function SettingsPage() {
  const { data: session } = useSession();
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

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError("");
  };

  const validatePassword = async () => {
    try {
      // Validate current password
      const response = await fetch("/api/auth/validate-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
        }),
      });

      if (!response.ok) {
        setPasswordError("Cannot receive response from the server");
        return false;
      }

      const { isValid } = await response.json();
      if (!isValid) {
        setPasswordError("Current password is incorrect");
        return false;
      }

      // these are the form fields that does not really need api calls
      if (passwordData.newPassword.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
        return false;
      }
      if (!/[A-Z]/.test(passwordData.newPassword)) {
        setPasswordError("Password must contain at least one uppercase letter");
        return false;
      }
      if (!/[0-9]/.test(passwordData.newPassword)) {
        setPasswordError("Password must contain at least one number");
        return false;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError("New passwords do not match");
        return false;
      }

      return true;
    } catch (error) {
      setPasswordError("Failed to validate password");
      return false;
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validatePassword();
    if (isValid) {
      try {
        if (session?.user.id) {
          const response = await fetch("/api/auth/change-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: session.user.id,
              newPassword: passwordData.newPassword,
            }),
          });

          if (response.ok) {
            setPasswordSuccess(true);
            // Wait for 2 seconds to show the success message
            setTimeout(() => {
              setShowPasswordModal(false);
              setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
              setPasswordSuccess(false);
              // Sign out the user
              signOut({ callbackUrl: '/login' });
            }, 2000);
          } else {
            setPasswordError("Failed to change password");
          }
        } else {
          setPasswordError("Session cannot be found");
        }
      } catch (error) {
        setPasswordError("Failed to change password");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          Settings
        </motion.h1>

        <div className="space-y-8">
          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell className="text-white" size={24} />
              <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                <div>
                  <h3 className="font-medium text-white">Email Notifications</h3>
                  <p className="text-sm text-gray-300">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                <div>
                  <h3 className="font-medium text-white">Push Notifications</h3>
                  <p className="text-sm text-gray-300">Receive push notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                <div>
                  <h3 className="font-medium text-white">Event Updates</h3>
                  <p className="text-sm text-gray-300">Get notified about upcoming events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.events}
                    onChange={() => handleNotificationChange('events')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                <div>
                  <h3 className="font-medium text-white">Job Alerts</h3>
                  <p className="text-sm text-gray-300">Receive job posting notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.jobs}
                    onChange={() => handleNotificationChange('jobs')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-white" size={24} />
              <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Privacy</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                <div>
                  <h3 className="font-medium text-white">Profile Visibility</h3>
                  <p className="text-sm text-gray-300">Who can see your profile</p>
                </div>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="bg-gray-700/50 border border-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="public">Public</option>
                  <option value="alumni">Alumni Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                <div>
                  <h3 className="font-medium text-white">Show Email</h3>
                  <p className="text-sm text-gray-300">Display your email on profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.showEmail}
                    onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                <div>
                  <h3 className="font-medium text-white">Show Phone</h3>
                  <p className="text-sm text-gray-300">Display your phone number on profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.showPhone}
                    onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Password Change Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-white" size={24} />
              <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Change Password</h2>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Change Password
            </button>
          </motion.div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-sm bg-[#0f172a] p-6 rounded-xl border border-white/10 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {passwordError && (
                <p className="text-red-400 text-sm">{passwordError}</p>
              )}

              {passwordSuccess && (
                <p className="text-green-400 text-sm">Password changed successfully!</p>
              )}

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Change Password
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
} 