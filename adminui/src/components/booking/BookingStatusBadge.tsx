import React from "react";

interface BookingStatusBadgeProps {
    status: string;
}

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
    const getStatusStyle = () => {
        switch (status?.toUpperCase()) {
            case "PENDING":
                return "bg-amber-100 text-amber-800";
            case "CONFIRMED":
                return "bg-green-100 text-green-800";
            case "COMPLETED":
                return "bg-blue-100 text-blue-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            case "ON_HOLD":
            case "ON HOLD":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle()}`}>
            {status || "N/A"}
        </span>
    );
};

export default BookingStatusBadge;
