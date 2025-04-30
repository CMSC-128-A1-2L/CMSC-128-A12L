//Notification Page (Static Version) only
//This file contains the front-end layout and functionality for the notifications page using hardcoded dummy data only.
// see 'page_1.tsx' for full version

"use client";

import { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ConstellationBackground from "@/app/components/constellationBackground";
import { Notification } from "@/entities/notifications";
import { motion } from "framer-motion";

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchNotifications();
    }
  }, [status, session]);

  const fetchNotifications = async () => {
    try {
      if (!session?.user?.id) {
        setError("User session not found");
        setLoading(false);
        return;
      }
      const response = await fetch(`/api/notifications?userId=${session.user.id}`);
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications");
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", { method: "PUT" });
      if (!response.ok) throw new Error("Failed to mark all as read");

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      if (!response.ok) throw new Error("Failed to mark as read");

      setNotifications(prev =>
        prev.map(notif => notif._id === id ? { ...notif, isRead: true } : notif)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsUnread = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: false }),
      });
      if (!response.ok) throw new Error("Failed to mark as unread");

      setNotifications(prev =>
        prev.map(notif => notif._id === id ? { ...notif, isRead: false } : notif)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");

      setNotifications(prev =>
        prev.filter(notif => notif._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = tab === 'all'
    ? notifications
    : notifications.filter((n) => !n.isRead);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="relative text-white -mt-16 pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90"></div>
        <ConstellationBackground />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notifications</h1>
          <p className="text-2xl text-gray-200 mt-2">View your recent notifications</p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {/* Tabs and Mark all */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                tab === 'all'
                  ? 'bg-white/10 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
              onClick={() => setTab('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                tab === 'unread'
                  ? 'bg-white/10 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
              onClick={() => setTab('unread')}
            >
              Unread
            </button>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors cursor-pointer"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-lg">
              No notifications found.
            </div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif._id}
                className={`group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-200 ${
                  notif.isRead ? "border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg text-white font-semibold">{notif.message}</p>
                    <div className="flex flex-wrap items-center gap-2 text-gray-400 text-sm mt-1">
                      <span>{formatTimeAgo(notif.createdAt)} ago</span>
                      <span>•</span>
                      <span className="capitalize">{notif.type}</span>
                      {!notif.userId && (
                        <>
                          <span>•</span>
                          <span>Global</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions  */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        notif.isRead ? handleMarkAsUnread(notif._id!) : handleMarkAsRead(notif._id!);
                      }}
                      className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-gray-200 text-xs cursor-pointer"
                    >
                      {notif.isRead ? "Mark as Unread" : "Mark as Read"}
                    </button>
                    {notif.userId === session?.user?.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notif._id!);
                        }}
                        className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center cursor-pointer"
                      >
                        <Trash size={14} className="mr-1" />
                        Delete
                      </button>
                    )}
                  </div>

                  {/* Unread dot */}
                  {!notif.isRead && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
