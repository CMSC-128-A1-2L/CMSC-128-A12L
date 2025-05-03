"use client";

import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import Link from 'next/link';
import ConstellationBackground from '../components/constellation_background';
import Modal from '../components/modal';

interface ActivityItem {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  color: string;
}

interface DashboardStats {
  numberOfAlumni: number;
  numberOfNewUsers: number;
  numberOfUpcomingEvents: number;
  numberOfOpportunities: number;
}

export default function AdminDashboard() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    numberOfAlumni: 0,
    numberOfNewUsers: 0,
    numberOfUpcomingEvents: 0,
    numberOfOpportunities: 0,
  });

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const res = await fetch('/api/reports/admin-dashboard');
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
      }
    }

    fetchDashboardStats();
  }, []);

  const [activities, setActivities] = useState<ActivityItem[]>([]);

useEffect(() => {
  async function fetchActivities() {
    try {
      const res = await fetch('/api/reports/recent-activity');
      if (!res.ok) throw new Error("Failed to fetch recent activities");
      const data = await res.json();

      const mappedActivities: ActivityItem[] = data.map((item: any) => {
        let color = "";
        switch (item.classifier) {
          case 1:
            color = "bg-blue-500";
            break;
          case 2:
            color = "bg-green-500";
            break;
          case 3:
            color = "bg-yellow-500";
            break;
        }

        return {
          id: item.id,
          title: item.heading,
          content: item.message,
          timestamp: item.timestamp,
          color
        };
      });

      setActivities(mappedActivities);
    } catch (error) {
      console.error("Activities fetch error:", error);
    }
  }

  fetchActivities();
}, []);


  return (
    <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      <div className="relative bg-gradient-to-r from-[#1a1f4d] to-[#0d47a1] rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ConstellationBackground customWidth={true} />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">Welcome, Admin</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-black">Total Alumni</h2>
          <p className="text-2xl sm:text-3xl font-bold text-black">{stats.numberOfAlumni}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-black">Active Jobs</h2>
          <p className="text-2xl sm:text-3xl font-bold text-black">{stats.numberOfOpportunities}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-black">Upcoming Events</h2>
          <p className="text-2xl sm:text-3xl font-bold text-black">{stats.numberOfUpcomingEvents}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-black">New Users</h2>
          <p className="text-2xl sm:text-3xl font-bold text-black">{stats.numberOfNewUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 shadow-md min-h-[300px] sm:h-[400px]">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Quick Actions</h2>
          <div className="border-b-2 border-gray-800 mb-4"></div>
          <div className="space-y-3 sm:space-y-4">
            <Link href="/admin/events" className="block">
              <button className="w-full bg-[#1a1f4d] hover:bg-[#0d47a1] text-white rounded-lg p-3 sm:p-4 text-left flex items-center justify-between transition-colors cursor-pointer">
                <span className="text-sm sm:text-base">Create New Event</span>
                <span className="text-lg sm:text-xl">+</span>
              </button>
            </Link>

            <Link href="/admin/user-management" className="block">
              <button className="w-full bg-[#1a1f4d] hover:bg-[#0d47a1] text-white rounded-lg p-3 sm:p-4 text-left flex items-center justify-between transition-colors cursor-pointer">
                <span className="text-sm sm:text-base">Manage Users</span>
                <span className="text-lg sm:text-xl">+</span>
              </button>
            </Link>

           

            <button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/puppeteer');
                  if (!response.ok) throw new Error('Failed to generate PDF');
                  
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'admin-reports.pdf';
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                } catch (error) {
                  console.error('Error generating PDF:', error);
                  alert('Failed to generate PDF report');
                }
              }}
              className="w-full bg-[#1a1f4d] hover:bg-[#0d47a1] text-white rounded-lg p-3 sm:p-4 text-left flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="text-sm sm:text-base">Download Reports PDF</span>
              <span className="text-lg sm:text-xl">↓</span>
            </button>

            <Link href="/admin/communications" className="block">
              <button className="w-full bg-[#1a1f4d] hover:bg-[#0d47a1] text-white rounded-lg p-3 sm:p-4 text-left flex items-center justify-between transition-colors cursor-pointer">
                <span className="text-sm sm:text-base">Send Communications</span>
                <span className="text-lg sm:text-xl">+</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md flex flex-col min-h-[300px] sm:h-[400px]">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Recent Activity</h2>
          <div className="border-b-2 border-gray-800 mb-4"></div>
          <div className="flex flex-col space-y-3 sm:space-y-4 overflow-y-auto flex-grow">
            {activities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className="bg-gray-50 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-gray-100 transition-colors"
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
