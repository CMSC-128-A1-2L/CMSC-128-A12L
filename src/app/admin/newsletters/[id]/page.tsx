'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Newsletter } from '@/entities/newsletters';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Calendar, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';
import ConstellationBackground from "@/app/components/constellationBackground";
import NewsletterEditModal from "@/app/components/NewsletterEditModal";

export default function ViewNewsletter() {
    const params = useParams();
    const router = useRouter();
    const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    const loadNewsletter = async () => {
        try {
            const response = await fetch(`/api/admin/newsletters/${params?.id}`);
            if (!response.ok) throw new Error('Failed to fetch newsletter');
            setNewsletter(await response.json());
        } catch (error) {
            console.error('Error loading newsletter:', error);
            toast.error('Failed to load newsletter');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNewsletter();
    }, [params?.id]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/admin/newsletters/${params?.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete newsletter');
            toast.success('Newsletter deleted successfully');
            router.push('/admin/newsletters');
        } catch (error) {
            console.error('Error deleting newsletter:', error);
            toast.error('Failed to delete newsletter');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0f2e] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!newsletter) {
        return (
            <div className="min-h-screen bg-[#0a0f2e] text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Newsletter not found</h1>
                    <button
                        onClick={() => router.push('/admin/newsletters/list')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                    >
                        Back to Newsletters
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-[#0a0f2e] text-white bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="relative -mt-8 pt-8 overflow-hidden">
                        {newsletter.thumbnail ? (
                            <div className="absolute inset-0">
                                <img
                                    src={newsletter.thumbnail}
                                    alt={newsletter.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90" />
                            </div>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90"></div>
                                <ConstellationBackground />
                            </>
                        )}
                        <div className="relative px-8 py-12 z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <button
                                    onClick={() => router.push('/admin/newsletters')}
                                    className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors cursor-pointer"
                                >
                                    <ArrowLeft size={20} />
                                    Back to Newsletters
                                </button>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">{newsletter.title}</h1>
                                <div className="flex items-center gap-4 text-gray-200">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} />
                                        <span>{new Date(newsletter.publishDate).toLocaleDateString()}</span>
                                    </div>
                                    {newsletter.tags && (
                                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                            {newsletter.tags}
                                        </span>
                                    )}
                                    {newsletter.isPinned && (
                                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                                            Pinned
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-8 py-8 bg-[#0a0f2e]">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="flex-1 prose prose-invert max-w-none"
                            >
                                <div className="text-lg text-gray-200 whitespace-pre-wrap">
                                    {newsletter.content}
                                </div>

                                {newsletter.attachments && newsletter.attachments.length > 0 && (
                                    <div className="mt-12 border-t border-white/10 pt-8">
                                        <h2 className="text-2xl font-bold mb-6">Attachments</h2>
                                        <div className="grid gap-4">
                                            {newsletter.attachments.map((attachment, index) => (
                                                <a
                                                    key={index}
                                                    href={attachment}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                                                >
                                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Paperclip className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-base font-medium truncate group-hover:text-blue-400 transition-colors">
                                                            {attachment.split('/').pop()}
                                                        </p>
                                                        <p className="text-sm text-gray-400">Click to download</p>
                                                    </div>
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
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            <motion.aside
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-full lg:w-80 flex-shrink-0"
                            >
                                <div className="sticky top-8">
                                    <div className="bg-white/5 rounded-lg p-6">
                                        <h2 className="text-xl font-bold mb-4">Actions</h2>
                                        <div className="space-y-4">
                                            <button
                                                onClick={() => setShowEditModal(true)}
                                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg cursor-pointer"
                                            >
                                                Edit Newsletter
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg cursor-pointer"
                                            >
                                                Delete Newsletter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.aside>
                        </div>
                    </div>
                </div>
            </div>

            <NewsletterEditModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                newsletter={newsletter}
                onSave={loadNewsletter}
            />
        </div>
    );
}