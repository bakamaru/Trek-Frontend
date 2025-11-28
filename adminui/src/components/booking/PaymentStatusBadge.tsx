import React from "react";

interface PaymentStatusBadgeProps {
    status: string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
    const getStatusStyle = () => {
        switch (status?.toUpperCase()) {
            case "UNPAID":
                return "bg-red-100 text-red-800";
            case "PARTIAL":
            case "PARTIALLY_PAID":
                return "bg-amber-100 text-amber-800";
            case "PAID":
            case "FULLY_PAID":
                return "bg-green-100 text-green-800";
            case "REFUNDED":
                return "bg-blue-100 text-blue-800";
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

export default PaymentStatusBadge;
