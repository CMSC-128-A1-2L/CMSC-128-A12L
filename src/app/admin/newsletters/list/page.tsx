'use client';

import { useEffect, useState } from 'react';
import { Newsletter } from '@/entities/newsletters';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function NewsletterList() {
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        loadNewsletters();
    }, []);

    const loadNewsletters = async () => {
        try {
            const response = await fetch('/api/admin/newsletters');
            if (!response.ok) {
                throw new Error('Failed to fetch newsletters');
            }
            const allNewsletters = await response.json();
            setNewsletters(allNewsletters);
        } catch (error) {
            console.error('Error loading newsletters:', error);
            toast.error('Failed to load newsletters');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this newsletter?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/newsletters/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete newsletter');
            }

            toast.success('Newsletter deleted successfully');
            loadNewsletters();
        } catch (error) {
            console.error('Error deleting newsletter:', error);
            toast.error('Failed to delete newsletter');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">All Newsletters</h2>
                <Link
                    href="/admin/newsletters"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Create New Newsletter
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {newsletters.map((newsletter) => (
                        <li key={newsletter._id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-medium text-gray-900 truncate">
                                        {newsletter.title}
                                    </h3>
                                    <div className="mt-1 space-y-2">
                                        <p className="text-sm text-gray-500">
                                            Published: {new Date(newsletter.publishDate).toLocaleDateString()}
                                            {newsletter.isPinned && (
                                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Pinned
                                                </span>
                                            )}
                                        </p>
                                        {newsletter.tags && (
                                            <div className="flex flex-wrap gap-2">
                                                {newsletter.tags.split(',').map((tag, index) => (
                                                    <span 
                                                        key={index}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                    >
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={`/admin/newsletters/${newsletter._id}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/admin/newsletters/edit/${newsletter._id}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(newsletter._id!)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}