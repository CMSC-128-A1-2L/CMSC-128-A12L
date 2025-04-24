"use client";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Bell, 
  Heart, 
  Settings,
  ArrowRight,
  User,
  FileText,
  Mail,
  GraduationCap,
  Building2,
  Globe,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  connections: number;
  upcomingEvents: number;
  jobOpportunities: number;
  unreadNotifications: number;
}

export default function AlumniDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    connections: 0,
    upcomingEvents: 0,
    jobOpportunities: 0,
    unreadNotifications: 0
  });

  useEffect(() => {
    setStats({
      connections: 42,
      upcomingEvents: 3,
      jobOpportunities: 5,
      unreadNotifications: 2
    });
  }, []);

  const quickActions = [
    {
      title: "Update Profile",
      icon: User,
      href: "/alumni/profile",
      color: "bg-blue-500",
      description: "Keep your information up to date"
    },
    {
      title: "View Events",
      icon: Calendar,
      href: "/alumni/events",
      color: "bg-green-500",
      description: "Discover upcoming alumni events"
    },
    {
      title: "Job Board",
      icon: Briefcase,
      href: "/alumni/jobs",
      color: "bg-purple-500",
      description: "Explore career opportunities"
    },
    {
      title: "Network",
      icon: Users,
      href: "/alumni/network",
      color: "bg-orange-500",
      description: "Connect with fellow alumni"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative text-white -mt-16 pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back, {session?.user?.email?.split("@")[0] || "Alumni"}!
            </h1>
            <p className="text-xl text-gray-200">
              Your alumni network is growing stronger every day
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            title="Connections"
            value={stats.connections}
            icon={Users}
            color="text-blue-500"
            trend="+5 this week"
          />
          <StatCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            icon={Calendar}
            color="text-green-500"
            trend="2 new events"
          />
          <StatCard
            title="Job Opportunities"
            value={stats.jobOpportunities}
            icon={Briefcase}
            color="text-purple-500"
            trend="3 new postings"
          />
          <StatCard
            title="Notifications"
            value={stats.unreadNotifications}
            icon={Bell}
            color="text-orange-500"
            trend="2 unread"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={action.href}>
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm border-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-200 text-sm">
                      {action.description}
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-0">
            <div className="space-y-6">
              <ActivityItem
                icon={Users}
                title="New Connection"
                description="John Doe connected with you"
                time="2 hours ago"
                color="bg-blue-100/20"
              />
              <ActivityItem
                icon={Calendar}
                title="Event Reminder"
                description="Alumni Meetup starts in 3 days"
                time="1 day ago"
                color="bg-green-100/20"
              />
              <ActivityItem
                icon={Briefcase}
                title="New Job Posting"
                description="Software Engineer position at Tech Corp"
                time="2 days ago"
                color="bg-purple-100/20"
              />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string;
  trend: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">{title}</p>
            <h3 className="text-3xl font-bold mt-1 text-white">{value}</h3>
            <p className="text-sm text-gray-400 mt-1">{trend}</p>
          </div>
          <div className={`p-4 rounded-xl ${color} bg-opacity-10`}>
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ActivityItem({ icon: Icon, title, description, time, color }: {
  icon: any;
  title: string;
  description: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex items-start space-x-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-gray-200">{description}</p>
        <p className="text-sm text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}