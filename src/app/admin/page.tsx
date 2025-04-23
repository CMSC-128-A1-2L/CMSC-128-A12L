"use client";

import React, { useState } from "react";
import { motion } from 'framer-motion';
import ConstellationBackground from '../components/constellation_background';
import Modal from '../components/modal';

interface ActivityItem {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  color: string;
}

export default function AdminDashboard() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const activities: ActivityItem[] = [
    {
      id: 1,
      title: "New User Registration",
      content: "A new user has registered in the system. Their account is pending verification.",
      timestamp: "2 minutes ago",
      color: "bg-green-500"
    },
    {
      id: 2,
      title: "Event Creation",
      content: "A new event 'Alumni Homecoming 2024' has been created and is now open for registration.",
      timestamp: "1 hour ago",
      color: "bg-blue-500"
    },
    {
      id: 3,
      title: "Job Posting",
      content: "A new job opportunity has been posted by Company XYZ for Software Engineer position.",
      timestamp: "3 hours ago",
      color: "bg-yellow-500"
    },
    {
      id: 4,
      title: "User Registration",
      content: "A new user has completed their profile setup and is now active in the system.",
      timestamp: "5 hours ago",
      color: "bg-green-500"
    },
    {
      id: 5,
      title: "Event Update",
      content: "The annual alumni meetup event details have been updated with new venue information.",
      timestamp: "1 day ago",
      color: "bg-blue-500"
    }
  ];

  return (
    <div className="px-8 py-6">
      <div className="relative bg-gradient-to-r from-[#1a1f4d] to-[#0d47a1] rounded-xl p-6 mb-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ConstellationBackground customWidth={true} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white text-center">Welcome, Admin</h1>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-black">Total Alumni</h2>
          <p className="text-3xl font-bold text-black">1,234</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-black">Active Jobs</h2>
          <p className="text-3xl font-bold text-black">45</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-black">Upcoming Events</h2>
          <p className="text-3xl font-bold text-black">89</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-black">New Users</h2>
          <p className="text-3xl font-bold text-black">32</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 shadow-md h-[400px]">
          <h2 className="text-2xl font-semibold mb-4 text-black">Quick Actions</h2>
          <div className="border-b-2 border-gray-800 mb-4"></div>
          <div className="space-y-4">
            <button className="w-full bg-[#1a1f4d] hover:bg-[#0d47a1] text-white rounded-lg p-4 text-left flex items-center justify-between transition-colors cursor-pointer">
              <span>Create New Event</span>
              <span className="text-xl">+</span>
            </button>
            <button className="w-full bg-[#1a1f4d] hover:bg-[#0d47a1] text-white rounded-lg p-4 text-left flex items-center justify-between transition-colors cursor-pointer">
              <span>Add New Alumni</span>
              <span className="text-xl">+</span>
            </button>
            <button className="w-full bg-[#1a1f4d] hover:bg-[#0d47a1] text-white rounded-lg p-4 text-left flex items-center justify-between transition-colors cursor-pointer">
              <span>Generate Reports</span>
              <span className="text-xl">+</span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md flex flex-col h-[400px]">
          <h2 className="text-2xl font-semibold mb-4 text-black">Recent Activity</h2>
          <div className="border-b-2 border-gray-800 mb-4"></div>
          <div className="flex flex-col space-y-4 overflow-y-auto h-[300px]">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.color}`}></div>
                  <p className="text-sm font-medium text-black">{activity.title}</p>
                </div>
                <p className="text-xs text-black mt-1">{activity.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.title || ""}
        content={selectedActivity?.content || ""}
        timestamp={selectedActivity?.timestamp || ""}
      />
    </div>
  );
}
