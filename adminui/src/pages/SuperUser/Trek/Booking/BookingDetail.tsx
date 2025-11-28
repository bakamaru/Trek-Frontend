import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBookingDetailQuery, useChangeBookingStatusMutation, useLazyPrintBookingConfirmationQuery, useLazyPrintBookingInvoiceQuery } from "../../../../redux/trek/bookingAPI";
import ComponentCard from "../../../../components/common/ComponentCard";
import toaster from "../../../../components/toster";
import BookingStatusBadge from "../../../../components/booking/BookingStatusBadge";
import PaymentStatusBadge from "../../../../components/booking/PaymentStatusBadge";
import { MdPrint, MdEmail, MdMoreVert, MdArrowBack } from "react-icons/md";

// Import tab components
import SummaryTab from "../../../../components/booking/tabs/SummaryTab";
import TravellersTab from "../../../../components/booking/tabs/TravellersTab";
import HealthTab from "../../../../components/booking/tabs/HealthTab";
import PaymentsTab from "../../../../components/booking/tabs/PaymentsTab";
import ItineraryTab from "../../../../components/booking/tabs/ItineraryTab";
import NotesTab from "../../../../components/booking/tabs/NotesTab";
import DocumentsTab from "../../../../components/booking/tabs/DocumentsTab";
import AuditLogTab from "../../../../components/booking/tabs/AuditLogTab";

type TabKey = "summary" | "travellers" | "health" | "payments" | "itinerary" | "notes" | "documents" | "audit";

const tabs: { key: TabKey; label: string }[] = [
    { key: "summary", label: "Summary" },
    { key: "travellers", label: "Travellers & Contacts" },
    { key: "health", label: "Health & Insurance" },
    { key: "payments", label: "Payments & Invoices" },
    { key: "itinerary", label: "Itinerary / Services" },
    { key: "notes", label: "Notes & Communication" },
    { key: "documents", label: "Documents" },
    { key: "audit", label: "History / Audit Log" },
];

const BookingDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const bookingId = parseInt(id || "0", 10);

    const [activeTab, setActiveTab] = useState<TabKey>("summary");
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [showPrintMenu, setShowPrintMenu] = useState(false);

    const { data: detailData, isLoading, refetch } = useGetBookingDetailQuery(bookingId, {
        skip: bookingId === 0,
    });

    const [changeStatus, { isLoading: isChangingStatus }] = useChangeBookingStatusMutation();
    const [printConfirmation] = useLazyPrintBookingConfirmationQuery();
    const [printInvoice] = useLazyPrintBookingInvoiceQuery();

    const booking = detailData?.Data || {};

    const formatBookingId = (id: number) => {
        return `BKG-${new Date().getFullYear()}-${String(id).padStart(6, "0")}`;
    };

    const handleStatusChange = async (newStatus: string) => {
        let reason = "";
        if (newStatus === "CANCELLED") {
            reason = prompt("Please provide a reason for cancellation:") || "";
            if (!reason) {
                toaster.error("Cancellation reason is required");
                return;
            }
        }

        if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) {
            return;
        }

        try {
            const response: any = await changeStatus({
                bookingId,
                newStatus,
                cancelReason: reason,
            }).unwrap();

            if (response.Code === 200) {
                toaster.success("Status updated successfully");
                refetch();
                setShowStatusMenu(false);
            }
        } catch (error) {
            toaster.error("Failed to update status");
        }
    };

    const handlePrint = async (type: string) => {
        try {
            let result;
            if (type === "confirmation") {
                result = await printConfirmation(bookingId).unwrap();
            } else if (type === "invoice") {
                result = await printInvoice(bookingId).unwrap();
            }

            if (result) {
                const url = window.URL.createObjectURL(result);
                window.open(url, "_blank");
                toaster.success("Document generated successfully");
            }
        } catch (error) {
            toaster.error("Failed to generate document");
        }
        setShowPrintMenu(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading booking details...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/superadmin/trek/booking")}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <MdArrowBack size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {formatBookingId(bookingId)}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <BookingStatusBadge status={booking.BookingStatus} />
                                <PaymentStatusBadge status={booking.PaymentStatus} />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* Status Change Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowStatusMenu(!showStatusMenu)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Change Status
                            </button>
                            {showStatusMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                    <button
                                        onClick={() => handleStatusChange("PENDING")}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Pending
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange("CONFIRMED")}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Confirmed
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange("COMPLETED")}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Completed
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange("CANCELLED")}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Print Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowPrintMenu(!showPrintMenu)}
                                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 flex items-center gap-2"
                            >
                                <MdPrint size={18} />
                                Print
                            </button>
                            {showPrintMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                    <button
                                        onClick={() => handlePrint("confirmation")}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Booking Confirmation
                                    </button>
                                    <button
                                        onClick={() => handlePrint("invoice")}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Invoice
                                    </button>
                                    <button
                                        onClick={() => handlePrint("voucher")}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Voucher
                                    </button>
                                    <button
                                        onClick={() => handlePrint("manifest")}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Traveller Manifest
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div>
                        <div className="text-sm text-gray-500">Product</div>
                        <div className="font-medium text-gray-900">{booking.ProductName || booking.TrekName || "N/A"}</div>
                        <div className="text-xs text-gray-500">{booking.ProductType || "TREK"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Customer</div>
                        <div className="font-medium text-gray-900">{booking.ContactName || "N/A"}</div>
                        <div className="text-xs text-gray-500">{booking.ContactEmail || ""}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Travel Dates</div>
                        <div className="font-medium text-gray-900">
                            {booking.StartDate && booking.EndDate
                                ? `${new Date(booking.StartDate).toLocaleDateString()} - ${new Date(booking.EndDate).toLocaleDateString()}`
                                : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                            {booking.Adults || 0} Adults {booking.Children ? `, ${booking.Children} Children` : ""}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <ComponentCard title="">
                <div className="border-b border-gray-200">
                    <div className="flex gap-1 overflow-x-auto px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${activeTab === tab.key
                                    ? "border-brand-500 text-brand-600"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === "summary" && <SummaryTab bookingId={bookingId} booking={booking} />}
                    {activeTab === "travellers" && <TravellersTab bookingId={bookingId} />}
                    {activeTab === "health" && <HealthTab bookingId={bookingId} />}
                    {activeTab === "payments" && <PaymentsTab bookingId={bookingId} />}
                    {activeTab === "itinerary" && <ItineraryTab bookingId={bookingId} booking={booking} />}
                    {activeTab === "notes" && <NotesTab bookingId={bookingId} />}
                    {activeTab === "documents" && <DocumentsTab bookingId={bookingId} />}
                    {activeTab === "audit" && <AuditLogTab bookingId={bookingId} />}
                </div>
            </ComponentCard>
        </div>
    );
};

export default BookingDetail;
