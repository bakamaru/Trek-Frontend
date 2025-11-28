import React from "react";
import { useGetBookingDashboardSummaryQuery } from "../../redux/trek/bookingAPI";

const BookingSummaryMetrics: React.FC = () => {
    const { data, isLoading } = useGetBookingDashboardSummaryQuery();

    const metrics = data?.data || {};

    const metricCards = [
        {
            label: "Today's Bookings",
            value: metrics.todayCount || 0,
            subValue: `$${metrics.todayAmount || 0}`,
            color: "text-blue-600",
        },
        {
            label: "This Month",
            value: metrics.monthCount || 0,
            subValue: `$${metrics.monthAmount || 0}`,
            color: "text-green-600",
        },
        {
            label: "Active Bookings",
            value: metrics.activeCount || 0,
            color: "text-purple-600",
        },
        {
            label: "Pending Payment",
            value: metrics.pendingPaymentCount || 0,
            subValue: `$${metrics.pendingPaymentAmount || 0}`,
            color: "text-amber-600",
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {metricCards.map((metric, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">{metric.label}</div>
                    <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                    {metric.subValue && (
                        <div className="text-sm text-gray-600 mt-1">{metric.subValue}</div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BookingSummaryMetrics;
