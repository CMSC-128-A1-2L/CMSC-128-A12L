"use client";
import { useEffect, useState } from "react";
import { EllipsisVertical, Trash } from "lucide-react";

export default function NotificationsPage() {
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); 
    return () => clearInterval(interval);
  }, []);

  const filtered = tab === 'all' ? notifications : notifications.filter((n) => n.unread);

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/mark-all-read", { method: "PATCH" });
      if (res.ok) {
        const updated = await fetch("/api/notifications").then((r) => r.json());
        setNotifications(updated);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((notif) => notif.id === id ? { ...notif, unread: false } : notif)
        );
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAsUnread = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}/unread`, { method: "PATCH" });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((notif) => notif.id === id ? { ...notif, unread: true } : notif)
        );
      }
    } catch (error) {
      console.error("Failed to mark as unread:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white text-[#0c0051] font-montserrat">
      <h1 className="text-2xl font-bold mb-4 text-[#0c0051]">Notifications</h1>

      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${tab === 'all' ? 'bg-[#0c0051] text-white' : 'bg-gray-100 text-[#0c0051]'}`}
            onClick={() => setTab('all')}
          >
            All Notifications
          </button>
          <button
            className={`px-4 py-2 rounded-md ${tab === 'unread' ? 'bg-[#0c0051] text-white' : 'bg-gray-100 text-[#0c0051]'}`}
            onClick={() => setTab('unread')}
          >
            Unread Notifications
          </button>
        </div>

        {/* Mark All as Read Button */}
        <button
          className="px-4 py-2 bg-[#0c0051] text-white rounded-md"
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
              key={notif.id}
              className={`p-4 mb-4 bg-[#f0f0f0] rounded-lg shadow-sm transition-all duration-200 hover:bg-[#0c0051] hover:text-white ${
                notif.unread ? 'border-l-4 border-[#0c0051]' : ''
              } relative group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold">{notif.message}</p>
                  <span className="text-sm text-gray-500">{notif.time} ago</span>
                </div>
                {notif.unread && (
                  <div className="w-2.5 h-2.5 bg-[#0c0051] rounded-full"></div>
                )}
              </div>

              {/* Ellipsis Button */}
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button
                  className="p-2 text-[#0c0051] hover:bg-[#f0f0f0] rounded-full"
                  onClick={() => setShowOptions(showOptions === notif.id ? null : notif.id)}
                >
                  <EllipsisVertical size={20} />
                </button>

                {/* Dropdown options */}
                {showOptions === notif.id && (
                  <div className="absolute top-[-50px] right-0 mt-2 bg-white shadow-lg rounded-md p-2 z-30">
                    <button
                      className="block w-full text-left text-[#0c0051] text-sm py-1 px-3 hover:bg-[#f0f0f0] rounded-md whitespace-nowrap"
                      onClick={() =>
                        notif.unread ? handleMarkAsRead(notif.id) : handleMarkAsUnread(notif.id)
                      }
                    >
                      {notif.unread ? "Mark as read" : "Mark as unread"}
                    </button>
                    <button
                      className="block w-full text-left text-[#0c0051] text-sm py-1 px-3 hover:bg-[#f0f0f0] rounded-md whitespace-nowrap"
                      onClick={() => handleDelete(notif.id)}
                    >
                      <Trash size={14} className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
