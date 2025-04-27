//Notification Page (Static Version) only
//This file contains the front-end layout and functionality for the notifications page using hardcoded dummy data only.
// see 'page_1.tsx' for full version

"use client";

import { useState, useEffect, useRef } from "react";
import { EllipsisVertical, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Notification } from "@/entities/notifications";

export default function NotificationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tab, setTab] = useState<'all' | 'unread'>('all');
    const [showOptions, setShowOptions] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Add click outside listener
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowOptions(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
            setError("Failed to load notifications");
            console.error(err);
            setLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await fetch("/api/notifications/mark-all-read", {
                method: "PUT",
            });
            if (!response.ok) throw new Error("Failed to mark all as read");
            
            setNotifications(prevNotifications =>
                prevNotifications.map(notif => ({
        ...notif,
                    isRead: true
                }))
            );
        } catch (err) {
            console.error(err);
        }
    };
  
    const handleMarkAsRead = async (id: string) => {
        console.log("did it go here")
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: true }),
            });
            if (!response.ok) throw new Error("Failed to mark as read");

            setNotifications(prevNotifications =>
                prevNotifications.map(notif =>
                    notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
        } catch (err) {
            console.error(err);
        }
    };
  
    const handleMarkAsUnread = async (id: string) => {
        console.log("did it go here")
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: false }),
            });
            if (!response.ok) throw new Error("Failed to mark as unread");

            setNotifications(prevNotifications =>
                prevNotifications.map(notif =>
                    notif._id === id ? { ...notif, isRead: false } : notif
        )
      );
        } catch (err) {
            console.error(err);
        }
    };
  
    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete notification");

            setNotifications(prevNotifications =>
                prevNotifications.filter(notif => notif._id !== id)
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
            <div className="flex items-center justify-center h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }
  
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-white text-[#0c0051] font-montserrat">
        <h1 className="text-2xl font-bold mb-4 text-[#0c0051]">Notifications</h1>
  
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                tab === 'all' 
                  ? 'bg-[#0c0051] text-white' 
                  : 'bg-gray-100 text-[#0c0051] hover:bg-gray-200'
              }`}
              onClick={() => setTab('all')}
            >
              All Notifications
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                tab === 'unread' 
                  ? 'bg-[#0c0051] text-white' 
                  : 'bg-gray-100 text-[#0c0051] hover:bg-gray-200'
              }`}
              onClick={() => setTab('unread')}
            >
              Unread Notifications
            </button>
          </div>
  
          {/* Mark All as Read Button */}
          <button
            className="px-4 py-2 bg-[#0c0051] text-white rounded-md hover:bg-[#0c0051]/90 transition-colors duration-200"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        </div>
  
        {/* Notifications List */}
        <div className="w-full max-w-[1200px] h-[calc(100vh-200px)] overflow-y-auto mx-auto">
          {filtered.length === 0 ? (
            <p className="text-gray-500">No notifications available.</p>
          ) : (
            filtered.map((notif) => (
              <div
                            key={notif._id}
                className={`p-4 mb-4 bg-[#f0f0f0] rounded-lg shadow-sm transition-all duration-200 hover:bg-[#0c0051] hover:text-white ${
                  notif.isRead ? 'border-l-4 border-[#0c0051]' : ''
                } relative group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm sm:text-base">{notif.message}</p>
                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                        <span className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-300">
                                            {formatTimeAgo(notif.createdAt)} ago
                                        </span>
                                        <span className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-300">•</span>
                                        <span className="text-xs sm:text-sm text-gray-500 capitalize group-hover:text-gray-300">
                                            {notif.type}
                                        </span>
                                        {!notif.userId && (
                                            <>
                                                <span className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-300">•</span>
                                                <span className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-300">
                                                    Global
                                                </span>
                                            </>
                  )}
                                    </div>
                </div>
  
                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                                        onClick={() => {
                                            if (!notif.isRead) {
                                                handleMarkAsRead(notif._id!);
                                            } else {
                                                handleMarkAsUnread(notif._id!);
                                            }
                                        }}
                                        className="px-3 py-1 text-sm bg-white/90 text-[#0c0051] rounded-md hover:bg-white transition-colors"
                                    >
                                        {!notif.isRead ? "Mark as read" : "Mark as unread"}
                  </button>
  
                                    {notif.userId === session?.user?.id && (
                        <button
                                            onClick={() => handleDelete(notif._id!)}
                                            className="px-3 py-1 text-sm bg-gray-100/90 text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center"
                        >
                                            <Trash size={14} className="mr-1" />
                        Delete
                        </button>
                                    )}
                    </div>

                                {/* Unread Dot */}
                                {!notif.isRead && (
                                    <div className="w-2.5 h-2.5 bg-[#0c0051] rounded-full ml-2"></div>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }