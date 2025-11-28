import React, { useState, useEffect } from "react";
import { useGetBookingPaymentsQuery, useAddBookingPaymentMutation, useRefundBookingPaymentMutation } from "../../../redux/trek/bookingAPI";
import toaster from "../../toster";
import { MdAdd } from "react-icons/md";

interface PaymentsTabProps {
    bookingId: number;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ bookingId }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [paymentData, setPaymentData] = useState({
        amount: 0,
        paymentMethod: "CARD",
        transactionId: "",
        reference: "",
        notes: "",
    });

    const { data: paymentsData, refetch } = useGetBookingPaymentsQuery(bookingId);
    const [addPayment, { isLoading: isAdding }] = useAddBookingPaymentMutation();
    const [refundPayment] = useRefundBookingPaymentMutation();

    const payments = paymentsData?.data || [];

    const handleAddPayment = async () => {
        if (paymentData.amount <= 0) {
            toaster.error("Amount must be greater than 0");
            return;
        }

        try {
            const response: any = await addPayment({ bookingId, data: paymentData }).unwrap();
            if (response.code === 200) {
                toaster.success("Payment added successfully");
                setShowAddForm(false);
                setPaymentData({
                    amount: 0,
                    paymentMethod: "CARD",
                    transactionId: "",
                    reference: "",
                    notes: "",
                });
                refetch();
            }
        } catch (error) {
            toaster.error("Failed to add payment");
        }
    };

    const handleRefund = async (paymentId: number) => {
        const reason = prompt("Please provide a reason for refund:");
        if (!reason) return;

        const amount = prompt("Refund amount:");
        if (!amount || parseFloat(amount) <= 0) return;

        try {
            const response: any = await refundPayment({
                bookingId,
                paymentId,
                data: { amount: parseFloat(amount), reason },
            }).unwrap();

            if (response.code === 200) {
                toaster.success("Refund processed successfully");
                refetch();
            }
        } catch (error) {
            toaster.error("Failed to process refund");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 flex items-center gap-2"
                >
                    <MdAdd size={18} />
                    Add Payment
                </button>
            </div>

            {/* Add Payment Form */}
            {showAddForm && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium text-gray-900">Record Payment</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                            <input
                                type="number"
                                value={paymentData.amount}
                                onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <select
                                value={paymentData.paymentMethod}
                                onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            >
                                <option value="CARD">Credit/Debit Card</option>
                                <option value="BANK">Bank Transfer</option>
                                <option value="CASH">Cash</option>
                                <option value="ONLINE">Online Gateway</option>
                                <option value="CHECK">Check</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                            <input
                                type="text"
                                value={paymentData.transactionId}
                                onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                            <input
                                type="text"
                                value={paymentData.reference}
                                onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                value={paymentData.notes}
                                onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                                rows={2}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddPayment}
                            disabled={isAdding}
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
                        >
                            {isAdding ? "Adding..." : "Add Payment"}
                        </button>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Payments List */}
            <div className="space-y-3">
                {payments.map((payment: any, index: number) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 grid grid-cols-4 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Date</div>
                                    <div className="font-medium">
                                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Amount</div>
                                    <div className="font-medium text-green-600">${payment.amount || 0}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Method</div>
                                    <div className="font-medium">{payment.paymentMethod || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Transaction ID</div>
                                    <div className="font-medium text-xs">{payment.transactionId || "N/A"}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRefund(payment.paymentId)}
                                className="px-3 py-1 text-sm font-medium text-red-600 border border-red-300 rounded hover:bg-red-50"
                            >
                                Refund
                            </button>
                        </div>
                        {payment.notes && (
                            <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Notes:</span> {payment.notes}
                            </div>
                        )}
                    </div>
                ))}

                {payments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No payments recorded yet. Click "Add Payment" to record a payment.
                    </div>
                )}
            </div>

            {/* Invoice Actions */}
            <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Invoice Actions</h4>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Generate Invoice
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Download Invoice PDF
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Email Invoice to Customer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentsTab;
