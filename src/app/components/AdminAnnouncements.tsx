"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Edit2, Trash2, Globe, Pin } from "lucide-react";

interface Announcement {
  _id?: string;
  title: string;
  content: string;
  authorId: string;
  publishDate: Date;
  visibility: string;
  isPinned: boolean;
  attachments?: string[];
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    visibility: "all",
    isPinned: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/admin/announcements");
      if (!response.ok) throw new Error("Failed to fetch announcements");
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `/api/admin/announcements?id=${editingId}`
        : "/api/admin/announcements";
      
      const method = editingId ? "PUT" : "POST";
      
      // Format the data according to the API requirements
      const announcementData = {
        ...newAnnouncement,
        _id: editingId, // Include the ID for PUT requests
        publishDate: new Date(), // Update the publish date
      };
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementData),
      });

      if (!response.ok) throw new Error("Failed to save announcement");
      
      await fetchAnnouncements();
      resetForm();
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    
    try {
      const response = await fetch(`/api/admin/announcements?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete announcement");
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const resetForm = () => {
    setNewAnnouncement({
      title: "",
      content: "",
      visibility: "all",
      isPinned: false,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
        <div className="p-3 bg-blue-50 rounded-xl">
          <Bell className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Announcements</h1>
          <p className="text-gray-500 mt-1">Create and manage announcements for alumni</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Announcement Title</label>
            <div className="relative">
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                required
                placeholder="Enter announcement title"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] bg-gray-50"
              required
              placeholder="Enter announcement content"
            />
          </div>

          {/* Controls Section - Modified for mobile responsiveness */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
              <select
                value={newAnnouncement.visibility}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, visibility: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 cursor-pointer"
              >
                <option value="all">All Users</option>
                <option value="alumni">Alumni Only</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:opacity-0">Options</label>
              <div className="flex items-center h-[46px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAnnouncement.isPinned}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isPinned: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-700">Pin Announcement</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {isEditing ? "Update" : "Post"} Announcement
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Announcements List */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Posted Announcements</h2>
        {announcements.map((announcement) => (
          <motion.div
            key={announcement._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-black">{announcement.title}</h3>
                <p className="text-gray-600 mt-2">{announcement.content}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-sm text-gray-500">
                    {new Date(announcement.publishDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Globe size={14} className="mr-1" />
                    {announcement.visibility}
                  </span>
                  {announcement.isPinned && (
                    <span className="flex items-center text-sm text-blue-500">
                      <Pin size={14} className="mr-1" />
                      Pinned
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setNewAnnouncement({
                      title: announcement.title,
                      content: announcement.content,
                      visibility: announcement.visibility,
                      isPinned: announcement.isPinned,
                    });
                    setIsEditing(true);
                    setEditingId(announcement._id || null);
                  }}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => announcement._id && handleDelete(announcement._id)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
