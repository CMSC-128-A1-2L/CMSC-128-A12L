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
                className="select select-bordered w-40 bg-gray-50 border-gray-200 text-gray-600 focus:border-[#1a1f4d] focus:ring-[#1a1f4d] hover:border-[#1a1f4d]"
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
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="btn bg-[#1a1f4d] text-white hover:bg-[#0d47a1]"
              >
                Change
              </button>
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1a1f4d]">Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Password Changed Successfully!</h3>
                <p className="text-gray-600 text-center">
                  You will be signed out and redirected to the login page.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    className="input input-bordered w-full bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400 focus:border-[#1a1f4d] focus:ring-[#1a1f4d] hover:border-[#1a1f4d]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    className="input input-bordered w-full bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400 focus:border-[#1a1f4d] focus:ring-[#1a1f4d] hover:border-[#1a1f4d]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                    className="input input-bordered w-full bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400 focus:border-[#1a1f4d] focus:ring-[#1a1f4d] hover:border-[#1a1f4d]"
                    required
                  />
                </div>

                {passwordError && (
                  <div className="text-red-500 text-sm mt-2">{passwordError}</div>
                )}

                <div className="mt-6 space-y-2">
                  <div className="text-sm text-gray-500">
                    <p className="font-medium mb-1">Password Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>At least 8 characters long</li>
                      <li>Contains at least one uppercase letter</li>
                      <li>Contains at least one number</li>
                      <li>Passwords must match</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="btn btn-ghost hover:bg-gray-100 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn bg-[#1a1f4d] text-white hover:bg-[#0d47a1]"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
} 