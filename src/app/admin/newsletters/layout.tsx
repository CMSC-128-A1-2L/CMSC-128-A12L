import Link from 'next/link';

export default function NewslettersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
                    <nav className="mt-4 flex space-x-4">
                        <Link
                            href="/admin/newsletters"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Create Newsletter
                        </Link>
                        <Link
                            href="/admin/newsletters/list"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            View Newsletters
                        </Link>
                    </nav>
                </div>
                {children}
            </div>
        </div>
    );
} 