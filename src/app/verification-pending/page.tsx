"use client"
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import ConstellationBackground from '../components/constellation_background';
import { useEffect, useState, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User } from '@/entities/user';
export default function VerificationPending() {
    const { data: session } = useSession();
    const router = useRouter();
    const [hasDocument, setHasDocument] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            if (!session?.user?.id) return;
            
            setIsLoading(true);
            try {
                const user = await fetch(`/api/users/${session.user.id}`, {
                    method: "GET",
                });
                if (user.ok) {
                    const userData = await user.json();
                    console.log("userData: ", userData)
                    setHasDocument(!!userData.documentUrl);
                    setUser(userData);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchUser();
    }, [session]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type === 'application/pdf') {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    setUploadError('PDF file size must be less than 5MB');
                    setPdfFile(null);
                } else {
                    setPdfFile(file);
                    setUploadError(null);
                }
            } else {
                setUploadError('Please upload a valid PDF file');
                setPdfFile(null);
            }
        } else {
            setPdfFile(null);
        }
    };

    const handleUpload = async () => {
        if (!pdfFile || !session?.user?.id) return;
        
        setIsUploading(true);
        setUploadError(null);
        
        try {
            const formData = new FormData();
            formData.append('pdfFile', pdfFile);
            
            const response = await fetch(`/api/users/${session.user.id}`, {
                method: 'PUT',
                body: formData,
            });
            
            if (response.ok) {
                setUploadSuccess(true);
                setHasDocument(true);
                setPdfFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                const data = await response.json();
                setUploadError(data.message || 'Failed to upload document');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            setUploadError('An error occurred while uploading your document');
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-[#1a237e] relative overflow-hidden">
            <ConstellationBackground />
            
            {/* Mobile Layout */}
            <div className="md:hidden min-h-screen flex flex-col relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a237e]/80 to-[#0a0041]/80"></div>
                
                {/* Header */}
                <div className="p-4 border-b border-white/10 relative z-10">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center text-white/80 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Back to home</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="relative w-32 h-32 bg-white/5 rounded-full p-4 shadow-lg border border-white/10">
                            <Image
                                src="/assets/LOGO_NAME.svg"
                                alt="AEGIS Logo"
                                fill
                                className="object-contain p-2"
                                priority
                            />
                        </div>
                    </motion.div>
                    
                    {isLoading ? (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center mb-8"
                        >
                            <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
                        </motion.div>
                    ) : hasDocument ? (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center mb-8"
                        >
                            <h1 className="text-2xl font-bold text-white mb-2">Verification Pending</h1>
                            <p className="text-white/70 text-sm">Your alumni status is being verified</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center mb-8"
                        >
                            <h1 className="text-2xl font-bold text-white mb-2">Required</h1>
                            <p className="text-white/70 text-sm">Please upload your alumni verification document</p>
                        </motion.div>
                    )}

                    {/* Info Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="w-full max-w-sm bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10"
                    >
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                </div>
                            ) : hasDocument ? (
                                <>
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                    </div>
                                    <p className="text-white/70 text-center">
                                        We are currently reviewing your alumni status. This process may take a few days. We will notify you once your verification is complete.
                                    </p>
                                    <button
                                        onClick={() => {
                                            router.push('/')
                                            signOut({ redirect: false });
                                        }}
                                        className="w-full bg-white text-[#1a237e] py-3 rounded-lg font-medium hover:bg-white/90 transition-colors shadow-md"
                                    >
                                        Return to Home
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center text-white mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    
                                    <div className="mb-4 p-3 bg-blue-50/20 border border-blue-200/30 rounded-lg">
                                        <p className="text-xs text-blue-200 font-medium">Required File Format:</p>
                                        <p className="text-xs text-blue-100 mt-1">Please name your file as: <span className="font-bold">SurnameInitials_AlumniVerification.pdf</span></p>
                                        <p className="text-xs text-blue-100">Example: <span className="font-medium">DelaCruzJD_AlumniVerification.pdf</span></p>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                                        />
                                        {pdfFile && (
                                            <p className="mt-1 text-xs text-green-300">Selected file: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)}MB)</p>
                                        )}
                                        {uploadError && (
                                            <p className="mt-1 text-xs text-red-300">{uploadError}</p>
                                        )}
                                        {uploadSuccess && (
                                            <p className="mt-1 text-xs text-green-300">Document uploaded successfully!</p>
                                        )}
                                        <p className="mt-1 text-xs text-white/70">Maximum file size: 5MB. Accepted format: PDF only.</p>
                                    </div>
                                    
                                    <button
                                        onClick={handleUpload}
                                        disabled={!pdfFile || isUploading}
                                        className={`w-full bg-white text-[#1a237e] py-3 rounded-lg font-medium transition-colors shadow-md ${
                                            !pdfFile || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/90'
                                        }`}
                                    >
                                        {isUploading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1a237e] mr-2"></div>
                                                Uploading...
                                            </div>
                                        ) : (
                                            'Upload Document'
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex min-h-screen items-center justify-center p-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl relative perspective-[2000px] flex items-center justify-center my-8">
                    <div className="w-full flex flex-col md:flex-row shadow-lg overflow-hidden rounded-lg min-h-[600px]">
                        {/* Left Section with Logo */}
                        <div className="flex flex-col items-center justify-center p-6 w-full md:w-[45%] relative flex-grow"
                            style={{ backgroundColor: "rgba(11, 1, 67, 0.8)" }}
                        >
                            <div className="relative w-32 h-32 md:w-48 md:h-48 mb-6 md:mb-8">
                                <Image
                                    src="/assets/LOGO_NAME.svg"
                                    alt="AEGIS Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {isLoading ? (
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-white mb-2 lg:mb-4"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                    Loading...
                                </h2>
                            ) : hasDocument ? (
                                <>
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-white mb-2 lg:mb-4"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        Verification Pending
                                    </h2>
                                    <p className="text-white/70 text-sm lg:text-base text-center px-4"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        Your alumni status is being verified.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-white mb-2 lg:mb-4"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        Document Required
                                    </h2>
                                    <p className="text-white/70 text-sm lg:text-base text-center px-4"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        Please upload your alumni verification document.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Right Section */}
                        <div className="w-full md:w-[55%] p-6 sm:p-8 lg:p-12 text-[#0C0051] flex flex-col items-center justify-center bg-white flex-grow">
                            <div className="w-full max-w-md">
                                <div className="mb-6 md:mb-8">
                                    <button
                                        onClick={() => {
                                            router.push('/')
                                            signOut({ redirect: false });
                                        }}
                                        className="mb-4 md:mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                        </svg>
                                        Back to home
                                    </button>

                                    {isLoading ? (
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3"
                                            style={{ fontFamily: "Montserrat, sans-serif" }}
                                        >
                                            Loading...
                                        </h2>
                                    ) : hasDocument ? (
                                        <>
                                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3"
                                                style={{ fontFamily: "Montserrat, sans-serif" }}
                                            >
                                                Status Update
                                            </h2>

                                            <p className="text-gray-600 text-sm lg:text-base"
                                                style={{ fontFamily: "Montserrat, sans-serif" }}
                                            >
                                                We are currently reviewing your alumni status
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3"
                                                style={{ fontFamily: "Montserrat, sans-serif" }}
                                            >
                                                Upload Required
                                            </h2>

                                            <p className="text-gray-600 text-sm lg:text-base"
                                                style={{ fontFamily: "Montserrat, sans-serif" }}
                                            >
                                                Please upload your alumni verification document to proceed
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C0051]"></div>
                                        </div>
                                    ) : hasDocument ? (
                                        <>
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C0051]"></div>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-gray-600 text-sm">
                                                    Your alumni status verification is in progress. This process may take a few days to complete. We will notify you once your verification is finished.
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    router.push('/')
                                                    signOut({ redirect: false });
                                                }}
                                                className="w-full bg-[#0C0051] text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:bg-[#0A0041] mt-2 flex items-center justify-center cursor-pointer"
                                                style={{ fontFamily: "Montserrat, sans-serif" }}
                                            >
                                                Return to Home
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-center text-[#0C0051] mb-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>

                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <p className="text-blue-800 text-sm font-medium">Required File Format:</p>
                                                <p className="text-blue-700 text-sm mt-1">Please name your file as: <span className="font-bold">SurnameInitials_AlumniVerification.pdf</span></p>
                                                <p className="text-blue-700 text-sm">Example: <span className="font-medium">DelaCruzJD_AlumniVerification.pdf</span></p>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleFileChange}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0C0051] file:text-white hover:file:bg-[#0A0041]"
                                                />
                                                {pdfFile && (
                                                    <p className="mt-2 text-xs text-green-600">Selected file: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)}MB)</p>
                                                )}
                                                {uploadError && (
                                                    <p className="mt-2 text-xs text-red-500">{uploadError}</p>
                                                )}
                                                {uploadSuccess && (
                                                    <p className="mt-2 text-xs text-green-600">Document uploaded successfully!</p>
                                                )}
                                                <p className="mt-2 text-xs text-gray-500">Maximum file size: 5MB. Accepted format: PDF only.</p>
                                            </div>

                                            <button
                                                onClick={handleUpload}
                                                disabled={!pdfFile || isUploading}
                                                className={`w-full bg-[#0C0051] text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:bg-[#0A0041] mt-2 flex items-center justify-center cursor-pointer ${
                                                    !pdfFile || isUploading ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                                style={{ fontFamily: "Montserrat, sans-serif" }}
                                            >
                                                {isUploading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Uploading...
                                                    </div>
                                                ) : (
                                                    'Upload Document'
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 