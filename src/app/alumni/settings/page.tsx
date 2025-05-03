"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Lock, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import ConstellationBackground from "@/app/components/constellationBackground";

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
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: string | boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const validatePassword = async () => {
    try {
      const response = await fetch("/api/auth/validate-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwordData.currentPassword }),
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: session.user.id,
              newPassword: passwordData.newPassword,
            }),
          });

          if (response.ok) {
            setPasswordSuccess(true);
            setTimeout(() => {
              setShowPasswordModal(false);
              setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
              setPasswordSuccess(false);
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative text-white -mt-16 pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90"></div>
        <ConstellationBackground />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Settings</h1>
            <p className="text-xl text-gray-200">Manage your account preferences</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        <div className="space-y-8">

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell size={24} className="text-white" />
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>

            {/* Notification toggles */}
            {[
            { key: "email", title: "Email Notifications", description: "Receive notifications via email" },
            { key: "push", title: "Push Notifications", description: "Receive push notifications" },
            { key: "events", title: "Event Updates", description: "Get notified about upcoming events" },
            { key: "jobs", title: "Job Alerts", description: "Receive job posting notifications" },
          ].map(({ key, title, description }) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div>
                <h3 className="font-medium text-white">{title}</h3>
                <p className="text-sm text-gray-300">{description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={() => handleNotificationChange(key as keyof typeof notifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          ))}
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lock size={24} className="text-white" />
              <h2 className="text-xl font-semibold text-white">Privacy</h2>
            </div>

            <div className="space-y-4">
              {/* Profile Visibility */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/10 transition-colors">
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

              {/* Show Email Toggle */}
              {(["showEmail", "showPhone"] as const).map(key => (
              <div key={key} className="flex items-center justify-between p-4 rounded-lg hover:bg-white/10 transition-colors">
                <div>
                  <h3 className="font-medium text-white">{key === "showEmail" ? "Show Email" : "Show Phone"}</h3>
                  <p className="text-sm text-gray-300">
                    {key === "showEmail" ? "Display your email" : "Display your phone number"} on profile
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy[key]}
                    onChange={(e) => handlePrivacyChange(key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            ))}
            </div>
          </motion.div>

          {/* Change Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lock size={24} className="text-white" />
              <h2 className="text-xl font-semibold text-white">Change Password</h2>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
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
            className="bg-[#0f172a] p-6 rounded-xl border border-white/10 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {["currentPassword", "newPassword", "confirmPassword"].map(name => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                    {name.replace(/Password/, " Password")}
                  </label>
                  <input
                    type="password"
                    name={name}
                    value={passwordData[name as keyof typeof passwordData]}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
              {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-400 text-sm">Password changed successfully!</p>}

              <button type="submit" className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
                Change Password
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
