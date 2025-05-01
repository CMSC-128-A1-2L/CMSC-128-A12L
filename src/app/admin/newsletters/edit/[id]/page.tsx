'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getNewsletterRepository } from '@/repositories/newsletters_repository';
import { Newsletter } from '@/entities/newsletters';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function EditNewsletter({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isPinned: false,
        thumbnail: '',
        attachments: [] as string[],
        tags: ''
    });

    useEffect(() => {
        loadNewsletter();
    }, [params.id]);

    const loadNewsletter = async () => {
        try {
            const repository = getNewsletterRepository();
            const newsletter = await repository.getNewsletterById(params.id);
            
            if (!newsletter) {
                toast.error('Newsletter not found');
                router.push('/admin/newsletters');
                return;
            }

            setFormData({
                title: newsletter.title,
                content: newsletter.content,
                isPinned: newsletter.isPinned,
                thumbnail: newsletter.thumbnail || '',
                attachments: newsletter.attachments || [],
                tags: newsletter.tags
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
            toast.error('You must be logged in to edit a newsletter');
            return;
        }

        setIsSubmitting(true);
        try {
            const newsletter: Newsletter = {
                _id: params.id,
                title: formData.title,
                content: formData.content,
                authorId: session.user.id,
                isPinned: formData.isPinned,
                thumbnail: formData.thumbnail || undefined,
                attachments: formData.attachments.length > 0 ? formData.attachments : undefined,
                publishDate: new Date(),
                tags: formData.tags
            };

            const repository = getNewsletterRepository();
            await repository.updateNewsletter(newsletter);
            
            toast.success('Newsletter updated successfully!');
            router.push('/admin/newsletters/list');
        } catch (error) {
            console.error('Error updating newsletter:', error);
            toast.error('Failed to update newsletter');
        } finally {
            setIsSubmitting(false);
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
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Edit Newsletter</h1>
            
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

                <div>
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail URL
                    </label>
                    <input
                        type="url"
                        id="thumbnail"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div>
                    <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-1">
                        Attachment URLs (one per line)
                    </label>
                    <textarea
                        id="attachments"
                        value={formData.attachments.join('\n')}
                        onChange={(e) => setFormData({ ...formData, attachments: e.target.value.split('\n').filter(url => url.trim()) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/file1.pdf&#10;https://example.com/file2.pdf"
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

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/newsletters/list')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Newsletter'}
                    </button>
                </div>
            </form>
        </div>
    );
} 