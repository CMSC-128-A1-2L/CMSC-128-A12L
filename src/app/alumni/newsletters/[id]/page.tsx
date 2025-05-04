"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ImageIcon, User } from "lucide-react";
import ConstellationBackground from "@/app/components/constellationBackground";
import { Card } from "@/components/ui/card";

interface NewsletterItem {
  _id: string;
  tags: string;
  title: string;
  content: string;
  authorId: string;
  publishDate: string;
  updatedAt?: string;
  isPinned: boolean;
  attachments: string[];
  thumbnail: string;
}

export default function NewsletterDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [newsletter, setNewsletter] = useState<NewsletterItem | null>(null);
  const [latestNews, setLatestNews] = useState<NewsletterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await fetch(`/api/alumni/newsletters/${params?.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch newsletter");
        }
        const data = await response.json();
        setNewsletter(data);
      } catch (error) {
        console.error("Error fetching newsletter:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestNews = async () => {
      try {
        const response = await fetch("/api/alumni/newsletters");
        if (!response.ok) {
          throw new Error("Failed to fetch latest news");
        }
        const data = await response.json();
        // Get the 3 most recent newsletters, excluding the current one
        const filteredNews = data
          .filter((item: NewsletterItem) => item._id !== params?.id)
          .sort((a: NewsletterItem, b: NewsletterItem) => 
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
          )
          .slice(0, 3);
        setLatestNews(filteredNews);
      } catch (error) {
        console.error("Error fetching latest news:", error);
      }
    };

    fetchNewsletter();
    fetchLatestNews();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Newsletter not found</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative text-white -mt-16 pt-16 overflow-hidden">
        {newsletter.thumbnail ? (
          <>
            <div className="absolute inset-0">
              <img
                src={newsletter.thumbnail}
                alt={newsletter.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/85 to-[#2a3f8f]/40" />
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90"></div>
            <ConstellationBackground />
          </>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => router.push('/alumni/newsletters')}
              className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
              Back to Newsletters
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {newsletter.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-200">
              {newsletter.tags && (
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                  {newsletter.tags}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-15">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 prose prose-invert max-w-none order-1 lg:order-1"
          >
            {newsletter.thumbnail && (
              <div className="py-5">
                <img
                  src={newsletter.thumbnail}
                  alt={newsletter.title}
                  className="w-[80%] h-[80%] rounded-xl"
                />
              </div>
            )}           
            <div className="flex items-center gap-2">
                <Calendar size={18} />
                <div className="flex items-center gap-4">
                    <span>Published: {new Date(newsletter.publishDate).toLocaleDateString()}</span>
                    {newsletter.updatedAt && (
                      <span>Updated: {new Date(newsletter.updatedAt).toLocaleDateString()}</span>
                    )}
                </div>
            </div>
            <div className="text-lg text-gray-200 whitespace-pre-wrap pt-10">
              {newsletter.content}
            </div>

            {newsletter.attachments && newsletter.attachments.length > 0 && (
              <div className="mt-12 border-t border-white/10 pt-8 pb-10">
                <h3 className="text-2xl font-bold mb-6">Attachments</h3>
                <div className="grid gap-4">
                  {newsletter.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                          {attachment.split('/').pop()}
                        </p>
                        {/* <p className="text-sm text-gray-400">
                          Click to download
                        </p> */}
                      </div>
                      <div className="flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-2"
          >
            <div className="sticky top-10">
              <h2 className="text-xl font-bold mb-4">Read More</h2>
              <div className="space-y-4">
                {latestNews.map((item) => (
                  <Card
                    key={item._id}
                    className="bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border-0"
                    onClick={() => router.push(`/alumni/newsletters/${item._id}`)}
                  >
                    <div className="p-4">
                      <div>
                        <span className="text-sm text-gray-400">
                          {new Date(item.publishDate).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {item.content.split(' ').slice(0, 5).join(' ')}...
                      </p>
                      <div className="flex items-center pt-3">
                        <span className="text-sm bg-white/15 px-2 py-1 rounded-full">{item.tags}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
