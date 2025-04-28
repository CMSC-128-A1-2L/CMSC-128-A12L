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
import ConstellationBackground from "@/app/components/constellationBackground";

interface DashboardStats {
  connections: number;
  upcomingEvents: number;
  jobOpportunities: number;
  unreadNotifications: number;
  trends: {
    connections: string;
    events: string;
    jobs: string;
    notifications: string;
  };
}

interface UserLog {
  _id?: string;
  userId?: string;
  imageUrl?: string;
  name: string;
  action: string;
  status?: string;
  timestamp: Date;
  ipAddress?: string;
}

interface ActivityItemProps {
  icon: any;
  title: string;
  description: string;
  time: string;
  color: string;
}

declare global {
  interface Date {
    toRelativeString(): string;
  }
}

Date.prototype.toRelativeString = function(): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - this.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
};

export default function AlumniDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    connections: 0,
    upcomingEvents: 0,
    jobOpportunities: 0,
    unreadNotifications: 0,
    trends: {
      connections: "",
      events: "",
      jobs: "",
      notifications: ""
    }
  });
  const [recentActivities, setRecentActivities] = useState<ActivityItemProps[]>([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        // Get current date and last week's date
        const now = new Date();
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Fetch alumni with timestamps
        const alumniResponse = await fetch('/api/users?includeTimestamp=true');
        const alumniData = await alumniResponse.json();
        const newAlumniCount = alumniData.filter((a: any) => new Date(a.createdAt) > lastWeek).length;
        
        // Fetch events
        const eventsResponse = await fetch('/api/events?timeline=ongoing');
        const eventsData = await eventsResponse.json();
        const newEventsCount = eventsData.filter((e: any) => new Date(e.createdAt) > lastWeek).length;
        
        // Fetch job opportunities
        const jobsResponse = await fetch('/api/alumni/opportunities');
        const jobsData = await jobsResponse.json();
        const newJobsCount = jobsData.filter((j: any) => new Date(j.createdAt) > lastWeek).length;
        
        // Fetch notifications
        const notificationsResponse = await fetch(`/api/notifications?userId=${session?.user?.id}&unread=true`);
        const notificationsData = await notificationsResponse.json();
        const newNotificationsCount = notificationsData.filter((n: any) => new Date(n.createdAt) > lastWeek).length;

        setStats({
          connections: alumniData.length || 0,
          upcomingEvents: eventsData.length || 0,
          jobOpportunities: jobsData.length || 0,
          unreadNotifications: notificationsData.length || 0,
          trends: {
            connections: `+${newAlumniCount} this week`,
            events: newEventsCount > 0 ? `${newEventsCount} new` : "No new events",
            jobs: newJobsCount > 0 ? `${newJobsCount} new posts` : "No new posts",
            notifications: newNotificationsCount > 0 ? `${newNotificationsCount} new` : "No new"
          }
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchDashboardStats();
    }
  }, [session]);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch('/api/logs/user?limit=3');
        const logs: UserLog[] = await response.json();
        
        const activities = logs.map(log => {
          let icon = Users;
          let color = "bg-blue-100/20";
          let title = "Activity";
          let description = '';

          // Parse the action string
          const [method, path] = log.action.split(' ');

          // Determine activity type and description
          if (path.includes('profile')) {
            if (method === 'PUT') {
              description = 'Updated your profile information';
            }
          } else if (path.includes('events')) {
            icon = Calendar;
            color = "bg-green-100/20";
            title = "Event Activity";
            if (path.includes('interested')) {
              description = 'Marked interest in attending an event';
            } else if (path.includes('not-going')) {
              description = 'Marked as not attending an event';
            } else if (path.includes('maybe-going')) {
              description = 'Marked as maybe attending an event';
            }
          } else if (path.includes('opportunities') || path.includes('jobs')) {
            icon = Briefcase;
            color = "bg-purple-100/20";
            title = "Job Activity";
            if (method === 'POST') {
              description = 'Posted a new job opportunity';
            } else if (method === 'PUT') {
              description = 'Updated a job posting';
            }
          }

          return {
            icon,
            color,
            title,
            description: description || 'Performed an activity',
            time: new Date(log.timestamp).toRelativeString()
          };
        });

        setRecentActivities(activities);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      }
    };

    fetchRecentActivities();
  }, [session]);

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
    },
    {
      title: "Announcements",
      icon: Bell,
      href: "/alumni/announcements",
      color: "bg-red-500",
      description: "Stay updated with important news"
    }
  ];

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
            title="Active Alumni"
            value={stats.connections}
            icon={Users}
            color="text-blue-500"
            trend={stats.trends.connections}
            loading={loading}
          />
          <StatCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            icon={Calendar}
            color="text-green-500"
            trend={stats.trends.events}
            loading={loading}
          />
          <StatCard
            title="Job Opportunities"
            value={stats.jobOpportunities}
            icon={Briefcase}
            color="text-purple-500"
            trend={stats.trends.jobs}
            loading={loading}
          />
          <StatCard
            title="Notifications"
            value={stats.unreadNotifications}
            icon={Bell}
            color="text-orange-500"
            trend={stats.trends.notifications}
            loading={loading}
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
          <div className="grid grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="w-full h-[200px]"
              >
                <Link href={action.href}>
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm border-0 h-full">
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
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    icon={activity.icon}
                    title={activity.title}
                    description={activity.description}
                    time={activity.time}
                    color={activity.color}
                  />
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">
                  No recent activities
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend, loading }: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string;
  trend: string;
  loading: boolean;
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
            {loading ? (
              <div className="mt-1 space-y-2">
                <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-bold mt-1 text-white">{value}</h3>
                <p className="text-sm text-gray-400 mt-1">{trend}</p>
              </>
            )}
          </div>
          <div className={`p-4 rounded-xl ${color} bg-opacity-10 ${loading ? 'animate-pulse' : ''}`}>
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