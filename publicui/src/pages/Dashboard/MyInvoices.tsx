import React from 'react';

const MyInvoices: React.FC = () => {

    const getStatusChipClass = (status: 'Paid' | 'Due' | 'Overdue') => {
        switch (status) {
            case 'Paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Due':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Overdue':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">My Invoices</h1>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">Invoice ID</th>
                            <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">Date</th>
                             <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">Trip</th>
                            <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Amount</th>
                            <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300 text-center">Status</th>
                            <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {USER_INVOICES_DATA.length > 0 ? (
                            USER_INVOICES_DATA.map(invoice => (
                                <tr key={invoice.id} className="border-b dark:border-gray-700">
                                    <td className="p-3 text-gray-800 dark:text-gray-200 font-medium">{invoice.id}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-400">{invoice.date}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-400">{invoice.tripName}</td>
                                    <td className="p-3 text-gray-800 dark:text-gray-200 text-right">${invoice.amount.toLocaleString()}</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button className="text-blue-700 font-semibold hover:underline">Download</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 dark:text-gray-400 py-8">
                                    You have no invoices.
                                </td>
                            </tr>
                        )} */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyInvoices;