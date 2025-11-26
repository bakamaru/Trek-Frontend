import React, { useContext } from 'react';
import { Link } from 'react-router-dom';



const Confirmation: React.FC = () => {
    return (
        <div className="pt-20 bg-gray-50 dark:bg-gray-900">
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-12 rounded-lg shadow-lg">
                        <div className="w-24 h-24 bg-green-100 text-green-600 text-5xl rounded-full flex items-center justify-center mx-auto mb-6">
                            ✓
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">Booking Confirmed!</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Thank you for booking with Heavenly Pathways. Your adventure awaits! A confirmation email with all your trip details has been sent to your inbox.
                        </p>
                        <div className="text-left bg-gray-50 dark:bg-gray-700 p-6 rounded-md border dark:border-gray-600 mb-8">
                            <h3 className="text-xl font-bold dark:text-gray-200 mb-4">Next Steps</h3>
                            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                <p><strong>Booking ID:</strong> RH12345678</p>
                                <p>Please check your email for the complete itinerary and important travel documents.</p>
                            </div>
                        </div>
                        <Link to="/" className="bg-blue-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Confirmation;