// Sample page for admin to manage opportunities

'use client';

import { useState, useEffect } from 'react';
import { Opportunity } from '@/entities/opportunity';
import { Plus, Trash2, Briefcase, Building2, MapPin, Tag, Clock, Loader2, Menu, X } from 'lucide-react';
import { createNotification } from '@/services/notification.service';
export default function OpportunitiesTestPage() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<Opportunity>>({
        title: '',
        description: '',
        position: '',
        company: '',
        location: '',
        tags: [],
        workMode: '',
    });

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/opportunities');
            if (!response.ok) throw new Error('Failed to fetch opportunities');
            const data = await response.json();
            setOpportunities(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch('/api/admin/opportunities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create opportunity');
            
            await createNotification({
                type: 'job',
                entity: formData,
                entityName: formData.title ?? '',
                action: 'created'
            });

            await fetchOpportunities();
            setFormData({
                title: '',
                description: '',
                position: '',
                company: '',
                location: '',
                tags: [],
                workMode: '',
            });
            setShowForm(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/opportunities/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete opportunity');
            
            await fetchOpportunities();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Opportunities Management</h1>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm font-medium">
                        {opportunities.length} {opportunities.length === 1 ? 'Opportunity' : 'Opportunities'}
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="lg:hidden bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Create Opportunity Form */}
                <div className={`lg:col-span-1 ${showForm ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 text-gray-700">
                        <div className="flex items-center mb-4 sm:mb-6">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Create New Opportunity</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g. Senior Software Engineer"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    rows={4}
                                    placeholder="Describe the opportunity..."
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="e.g. Software Engineer"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="e.g. Tech Company Inc."
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="e.g. Manila, Philippines"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Tag className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.tags?.join(', ')}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                        className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="e.g. React, Node.js, TypeScript"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        value={formData.workMode}
                                        onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                                        className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                                        required
                                    >
                                        <option value="">Select work mode</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="onsite">On-site</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-5 w-5" />
                                        Create Opportunity
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Opportunities List */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center mb-4 sm:mb-6">
                            <div className="bg-green-100 p-2 rounded-lg mr-3">
                                <Briefcase className="h-5 w-5 text-green-600" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Existing Opportunities</h2>
                        </div>
                        
                        {loading ? (
                            <div className="flex justify-center items-center py-8 sm:py-12">
                                <Loader2 className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                                <span className="ml-2 text-gray-600">Loading opportunities...</span>
                            </div>
                        ) : opportunities.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <div className="bg-gray-100 p-3 sm:p-4 rounded-full inline-block mb-3 sm:mb-4">
                                    <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                                </div>
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No opportunities yet</h3>
                                <p className="text-gray-500">Create your first opportunity using the form.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                {/* Mobile Card View */}
                                <div className="block lg:hidden">
                                    {opportunities.map((opportunity) => (
                                        <div key={opportunity._id} className="p-4 border-b border-gray-200 last:border-b-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                                                    <p className="text-sm text-gray-500">{opportunity.position}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(opportunity._id!)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                                <div>
                                                    <span className="text-gray-500">Company:</span>
                                                    <span className="ml-1 text-gray-900">{opportunity.company}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Location:</span>
                                                    <span className="ml-1 text-gray-900">{opportunity.location}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    opportunity.workMode === 'remote' 
                                                        ? 'bg-purple-100 text-purple-800' 
                                                        : opportunity.workMode === 'hybrid'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {opportunity.workMode.charAt(0).toUpperCase() + opportunity.workMode.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Desktop Table View */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Mode</th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {opportunities.map((opportunity) => (
                                                <tr key={opportunity._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">{opportunity.title}</div>
                                                        <div className="text-sm text-gray-500">{opportunity.position}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">{opportunity.company}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">{opportunity.location}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            opportunity.workMode === 'remote' 
                                                                ? 'bg-purple-100 text-purple-800' 
                                                                : opportunity.workMode === 'hybrid'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {opportunity.workMode.charAt(0).toUpperCase() + opportunity.workMode.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleDelete(opportunity._id!)}
                                                            className="text-red-600 hover:text-red-900 flex items-center justify-end"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 