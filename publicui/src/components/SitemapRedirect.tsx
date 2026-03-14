import React, { useEffect } from 'react';

const SitemapRedirect: React.FC = () => {
    useEffect(() => {
        const backendUrl = import.meta.env.VITE_API_BASE_URL;
        if (backendUrl) {
            window.location.href = `${backendUrl}/sitemap.xml`;
        }
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-gray-500 italic">Redirecting to sitemap...</p>
        </div>
    );
};

export default SitemapRedirect;
