'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Newsletter } from '@/entities/newsletters';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, X, Paperclip } from 'lucide-react';

export default function EditNewsletter() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isPinned: false,
        thumbnail: '',
        attachments: [] as string[],
        tags: ''
    });

    useEffect(() => {
        if (params?.id) {
            loadNewsletter();
        } else {
            router.push('/admin/newsletters/list');
        }
    }, [params?.id]);

    const loadNewsletter = async () => {
        if (!params?.id) return;
        
        try {
            const response = await fetch(`/api/admin/newsletters/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch newsletter');
            }
            const newsletter = await response.json();
            setFormData({
                title: newsletter.title,
                content: newsletter.content,
                isPinned: newsletter.isPinned || false,
                thumbnail: newsletter.thumbnail || '',
                attachments: newsletter.attachments || [],
                tags: newsletter.tags || ''
            });
        } catch (error) {
            console.error('Error loading newsletter:', error);
            toast.error('Failed to load newsletter');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) {
            toast.error('You must be logged in to update a newsletter');
            return;
        }

        if (!params?.id) {
            toast.error('Newsletter ID is missing');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/newsletters/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    isPinned: formData.isPinned,
                    thumbnail: formData.thumbnail || undefined,
                    attachments: formData.attachments.length > 0 ? formData.attachments : undefined,
                    tags: formData.tags
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update newsletter');
            }

            toast.success('Newsletter updated successfully!');
            router.push('/admin/newsletters/list');
        } catch (error) {
            console.error('Error updating newsletter:', error);
            toast.error('Failed to update newsletter');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <Link 
                    href="/admin/newsletters/list" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Newsletters
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Newsletter</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                            Thumbnail URL
                        </label>
                        <div className="space-y-3">
                            <input
                                type="url"
                                id="thumbnail"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                            {formData.thumbnail && (
                                <div className="relative rounded-lg overflow-hidden shadow-md">
                                    <img 
                                        src={formData.thumbnail}
                                        alt="Thumbnail preview"
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, thumbnail: '' })}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-1">
                            Attachments (one URL per line)
                        </label>
                        <div className="space-y-3">
                            <textarea
                                id="attachments"
                                value={formData.attachments.join('\n')}
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    attachments: e.target.value.split('\n').filter(url => url.trim())
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/file1.pdf&#10;https://example.com/file2.jpg"
                                rows={4}
                            />
                            {formData.attachments.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {formData.attachments.map((url, index) => {
                                        const fileName = url.split('/').pop() || url;
                                        const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
                                        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);

                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center p-3 bg-gray-50 rounded-lg group"
                                            >
                                                <div className="shrink-0">
                                                    {isImage ? (
                                                        <div className="w-10 h-10 rounded overflow-hidden">
                                                            <img 
                                                                src={url} 
                                                                alt={fileName}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error';
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                                                            <Paperclip className="w-5 h-5 text-gray-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-3 flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {fileName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {fileExt.toUpperCase()}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newAttachments = [...formData.attachments];
                                                        newAttachments.splice(index, 1);
                                                        setFormData({ ...formData, attachments: newAttachments });
                                                    }}
                                                    className="ml-2 text-gray-400 hover:text-red-500"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., alumni, events, updates"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPinned"
                            checked={formData.isPinned}
                            onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-700">
                            Pin this newsletter
                        </label>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}