'use client';

import { useEffect, useState } from 'react';
import { Newsletter } from '@/entities/newsletters';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Plus, X, Loader2, Search, Pencil, Trash2, Newspaper, Paperclip, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import NewsletterEditModal from "@/app/components/NewsletterEditModal";

export default function NewsletterList() {
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isPinned: false,
        thumbnail: '',
        attachments: [] as string[],
        tags: ''
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/newsletters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    isPinned: formData.isPinned,
                    tags: formData.tags,
                    thumbnail: formData.thumbnail,
                    attachments: formData.attachments,
                    publishDate: new Date(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create newsletter');
            }

            toast.success('Newsletter created successfully');
            await loadNewsletters();
            setShowForm(false);
            setFormData({
                title: '',
                content: '',
                isPinned: false,
                thumbnail: '',
                attachments: [],
                tags: ''
            });
        } catch (error) {
            console.error('Error creating newsletter:', error);
            toast.error('Failed to create newsletter');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
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

    const handleEdit = async (newsletter: Newsletter) => {
        setEditingNewsletter(newsletter);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingNewsletter(null);
    };

    const filteredNewsletters = newsletters.filter(newsletter => 
        newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsletter.tags?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredNewsletters.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNewsletters = filteredNewsletters.slice(startIndex, endIndex);

    // Handle page navigation
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 2) {
                for (let i = 1; i <= 3; i++) {
                    pageNumbers.push(i);
                }
            } else if (currentPage >= totalPages - 1) {
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
            }
        }
        
        return pageNumbers;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 md:px-10">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Newsletters Management Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-4 md:p-6 w-full"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                            <Newspaper className="w-8 h-8 mr-3 text-blue-600" />
                            Newsletters Management
                        </h2>
                        <div className="flex space-x-2 w-full md:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowForm(!showForm)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center w-full md:w-auto justify-center cursor-pointer"
                            >
                                {showForm ? (
                                    <>
                                        <X className="w-4 h-4 mr-2" />
                                        Close
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Newsletter
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>

                    {/* Create Newsletter Form */}
                    <div className={showForm ? 'block' : 'hidden'}>
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 text-gray-700">
                            <div className="flex items-center mb-4 sm:mb-6">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <Plus className="h-5 w-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Create New Newsletter</h2>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                                        placeholder="Enter newsletter title"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                                        rows={4}
                                        placeholder="Enter newsletter content..."
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                                        placeholder="e.g., news, updates, events"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                                    <input
                                        type="url"
                                        value={formData.thumbnail}
                                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                                        placeholder="Enter thumbnail image URL"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Attachment URLs (one per line)</label>
                                    <textarea
                                        value={formData.attachments?.join('\n') || ''}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            attachments: e.target.value.split('\n').filter(url => url.trim() !== '')
                                        })}
                                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                                        rows={3}
                                        placeholder="Enter attachment URLs, one per line"
                                    />
                                </div>
                                
                                <div className="flex items-center space-x-2">
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

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center cursor-pointer"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-5 w-5" />
                                            Create Newsletter
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search newsletters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Newsletters Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredNewsletters.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchQuery ? 'No matching newsletters found' : 'No newsletters yet'}
                                </h3>
                                <p className="text-gray-500">
                                    {searchQuery 
                                        ? 'Try adjusting your search terms'
                                        : 'Create your first newsletter using the form above.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Publish Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tags
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentNewsletters.map((newsletter) => (
                                            <tr key={newsletter._id} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{newsletter.title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(newsletter.publishDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {newsletter.isPinned ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            Pinned
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            Regular
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {newsletter.tags && newsletter.tags.split(',').map((tag, index) => (
                                                            <span 
                                                                key={index}
                                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                            >
                                                                {tag.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-3">
                                                        <Link
                                                            href={`/admin/newsletters/${newsletter._id}`}
                                                            className="text-blue-600 hover:text-blue-900 p-1 flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Search className="h-4 w-4" />
                                                            <span>View</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleEdit(newsletter)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(newsletter._id!)}
                                                            className="text-red-600 hover:text-red-900 p-1 flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {filteredNewsletters.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                            <div className="flex justify-between flex-1 sm:hidden">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                        <span className="font-medium">{Math.min(endIndex, filteredNewsletters.length)}</span> of{' '}
                                        <span className="font-medium">{filteredNewsletters.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
                                        <button
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        {getPageNumbers().map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => goToPage(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                                    currentPage === pageNum
                                                        ? 'z-10 bg-blue-600 text-white'
                                                        : 'text-gray-900 hover:bg-gray-50'
                                                } border border-gray-300`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            <NewsletterEditModal
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                newsletter={editingNewsletter}
                onSave={loadNewsletters}
            />
        </div>
    );
}