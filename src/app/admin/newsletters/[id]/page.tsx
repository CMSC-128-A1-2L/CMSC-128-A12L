'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Newsletter } from '@/entities/newsletters';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Calendar, Paperclip, Tag } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ViewNewsletter() {
    const params = useParams();
    const router = useRouter();
    const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadNewsletter();
    }, [params?.id]);

    const loadNewsletter = async () => {
        try {
            const response = await fetch(`/api/admin/newsletters/${params?.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch newsletter');
            }
            const data = await response.json();
            setNewsletter(data);
        } catch (error) {
            console.error('Error loading newsletter:', error);
            toast.error('Failed to load newsletter');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!newsletter) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Newsletter not found</h2>
                <Link href="/admin/newsletters/list" className="text-blue-600 hover:text-blue-800">
                    Back to Newsletters
                </Link>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-4 py-8"
        >
            {/* Navigation and Actions */}
            <div className="flex justify-between items-center mb-8">
                <Link 
                    href="/admin/newsletters/list" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Newsletters
                </Link>
                <Link
                    href={`/admin/newsletters/edit/${newsletter._id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
                >
                    Edit Newsletter
                </Link>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-md p-8">
                {/* Header */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                    {newsletter.thumbnail && (
                        <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src={newsletter.thumbnail}
                                alt={newsletter.title}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        {newsletter.title}
                    </h1>
                    <div className="flex items-center text-gray-600 text-sm space-x-4">
                        <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(newsletter.publishDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                        {newsletter.isPinned && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                📌 Pinned
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="prose max-w-none mb-8">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {newsletter.content}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-6">
                    {/* Tags */}
                    {newsletter.tags && (
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Tag className="w-4 h-4 mr-2 text-gray-400" />
                                Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {newsletter.tags.split(',').map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Attachments */}
                    {newsletter.attachments && newsletter.attachments.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                <Paperclip className="w-4 h-4 mr-2 text-gray-400" />
                                Attachments ({newsletter.attachments.length})
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {newsletter.attachments.map((attachment, index) => {
                                    const fileName = attachment.split('/').pop() || attachment;
                                    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
                                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);
                                    
                                    return (
                                        <a
                                            key={index}
                                            href={attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <div className="shrink-0">
                                                {isImage ? (
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                                                        <img 
                                                            src={attachment} 
                                                            alt={fileName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                        <Paperclip className="w-6 h-6 text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4 flex-1 min-w-0">
                                                <p className="text-sm font-medium text-blue-600 group-hover:text-blue-800 truncate">
                                                    {fileName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {fileExt.toUpperCase()}
                                                </p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}