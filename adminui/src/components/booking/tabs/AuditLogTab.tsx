import React from "react";
import { useGetBookingAuditLogQuery } from "../../../redux/trek/bookingAPI";

interface AuditLogTabProps {
    bookingId: number;
}

const AuditLogTab: React.FC<AuditLogTabProps> = ({ bookingId }) => {
    const { data: auditData, isLoading } = useGetBookingAuditLogQuery(bookingId);

    const auditLogs = auditData?.data || [];

    if (isLoading) {
        return <div className="text-center py-8 text-gray-500">Loading audit log...</div>;
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>

            <div className="space-y-3">
                {auditLogs.map((log: any, index: number) => (
                    <div key={index} className="bg-white border-l-4 border-blue-500 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="font-medium text-gray-900">{log.action || "Action"}</div>
                                <div className="text-sm text-gray-600">{log.description || ""}</div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {log.timestamp ? new Date(log.timestamp).toLocaleString() : ""}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>By: {log.performedBy || "System"}</span>
                            {log.oldValue && log.newValue && (
                                <span>
                                    Changed from <span className="font-medium">{log.oldValue}</span> to{" "}
                                    <span className="font-medium">{log.newValue}</span>
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {auditLogs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No audit history available yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogTab;
