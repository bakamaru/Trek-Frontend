import React from "react";

interface AnalyticsEmbedProps {
    embedUrl?: string; // URL from Looker Studio
    title?: string;
    height?: string;
}

export default function AnalyticsEmbed({
    embedUrl,
    title = "Google Analytics Report",
    height = "600px"
}: AnalyticsEmbedProps) {
    if (!embedUrl) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h3 className="mb-4 font-bold text-gray-800 dark:text-white/90">
                    {title}
                </h3>
                <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                    <p className="text-gray-500 dark:text-gray-400">
                        No report URL provided.
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                        Add your Looker Studio embed URL to view analytics.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-4 font-bold text-gray-800 dark:text-white/90">
                {title}
            </h3>
            <div className="relative w-full overflow-hidden rounded-lg">
                <iframe
                    src={embedUrl}
                    width="100%"
                    height={height}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title={title}
                />
            </div>
        </div>
    );
}
