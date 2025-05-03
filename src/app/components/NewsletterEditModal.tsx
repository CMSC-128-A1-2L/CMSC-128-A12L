'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Paperclip } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Newsletter } from '@/entities/newsletters';

interface NewsletterEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    newsletter: Newsletter | null;
    onSave: () => void;
}

export default function NewsletterEditModal({ isOpen, onClose, newsletter, onSave }: NewsletterEditModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isPinned: false,
        thumbnail: '',
        attachments: [] as string[],
        tags: ''
    });

    // Update form data when newsletter changes
    useEffect(() => {
        if (newsletter) {
            setFormData({
                title: newsletter.title,
                content: newsletter.content,
                isPinned: newsletter.isPinned || false,
                thumbnail: newsletter.thumbnail || '',
                attachments: newsletter.attachments || [],
                tags: newsletter.tags || ''
            });
        }
    }, [newsletter]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletter?._id) {
            toast.error('Newsletter ID is missing');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/newsletters/${newsletter._id}`, {
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
            onSave();
            onClose();
        } catch (error) {
            console.error('Error updating newsletter:', error);
            toast.error('Failed to update newsletter');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-white/30 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-lg shadow-xl p-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Edit Newsletter</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px] text-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="Enter tags separated by commas"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                        <input
                            type="text"
                            value={formData.thumbnail}
                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="Enter thumbnail URL"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (one URL per line)</label>
                        <div className="space-y-3">
                            <textarea
                                value={formData.attachments.join('\n')}
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    attachments: e.target.value.split('\n').filter(url => url.trim())
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
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

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <input
                            type="checkbox"
                            id="isPinned"
                            checked={formData.isPinned}
                            onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="isPinned" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Pin this newsletter
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
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