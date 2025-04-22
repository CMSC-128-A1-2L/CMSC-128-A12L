//Notification Page (Static Version) only
//This file contains the front-end layout and functionality for the notifications page using hardcoded dummy data only.
// see 'page_1.tsx' for full version

"use client";
import { useState } from "react";
import { EllipsisVertical, Trash } from "lucide-react";


const initialNotifications = [
  { id: 1, type: "event", message: "You are invited to the ICS Grand Alumni Homecoming 2025.", time: "2h", unread: true },
  { id: 2, type: "job", message: "New job posted by Momi Oni at Secret Lung: Front-End Developer.", time: "5h", unread: true },
  { id: 3, type: "announcement", message: "Admin posted an announcement: ICS Palicsihan.", time: "9h", unread: true },
  { id: 4, type: "announcement", message: "Admin posted an announcement: Hiring", time: "9h", unread: false },
  { id: 5, type: "donation", message: "You successfully donated ₱500 to the ICS Scholarship Fund.", time: "1d", unread: false },
  { id: 6, type: "event", message: "You are invited in the event discussion: 'TechTalks 2025'.", time: "2d", unread: false },
  { id: 7, type: "donation", message: "You successfully donated ₱100000 to the ICS Scholarship Fund.", time: "1d", unread: false },
  { id: 8, type: "announcement", message: "You are invited to Momi Oni's birthday party ", time: "4d", unread: false },
  { id: 9, type: "announcement", message: "Welcome to AEGIS", time: "4d", unread: false },
  { id: 10, type: "announcement", message: "Reminder: Event tomorrow ", time: "4d", unread: false },
  { id: 11, type: "announcement", message: "Check out the new features", time: "4d", unread: false },
  { id: 12, type: "announcement", message: "Welcome to AEGIS ", time: "4d", unread: false },
];

export default function NotificationsPage() {
    const [tab, setTab] = useState<'all' | 'unread'>('all');
    const [showOptions, setShowOptions] = useState<number | null>(null); 
    const [notifications, setNotifications] = useState(initialNotifications);
  
    const filtered = tab === 'all' ? notifications : notifications.filter((n) => n.unread);
  
    const handleMarkAllAsRead = () => {
      
      const updatedNotifications = notifications.map((notif) => ({
        ...notif,
        unread: false,
      }));
      setNotifications(updatedNotifications);
    };
  
    const handleMarkAsRead = (id: number) => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, unread: false } : notif
        )
      );
    };
  
    const handleMarkAsUnread = (id: number) => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, unread: true } : notif
        )
      );
    };
  
    const handleDelete = (id: number) => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== id)
      );
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
                  {/* Unread Dot */}
                  {notif.unread && (
                    <div className="w-2.5 h-2.5 bg-[#0c0051] rounded-full"></div>
                  )}
                </div>
  
                {/* Ellipsis Button*/}
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