import React, { useState, useContext } from 'react';
import { UserBooking, Trek, TourDetail } from '../../types/types';

const StarIcon: React.FC<{ filled: boolean; onClick?: () => void }> = ({ filled, onClick }) => (
    <svg 
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-8 w-8 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300'}`} 
        viewBox="0 0 20 20" 
        fill="currentColor"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const MyBookings: React.FC = () => {
   
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    
    // State for modals
    const [isCancelModalOpen, setCancelModalOpen] = useState(false);
    const [isDateModalOpen, setDateModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    
    const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(null);
    const [selectedTripDetails, setSelectedTripDetails] = useState<Trek | TourDetail | null>(null);
    const [newTravelDate, setNewTravelDate] = useState('');
    
    // Review State
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    const getStatusChipClass = (status: 'Confirmed' | 'Completed' | 'Cancelled') => {
        switch (status) {
            case 'Confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    };

    const openCancelModal = (booking: UserBooking) => {
        setSelectedBooking(booking);
        setCancelModalOpen(true);
    };

    const handleCancelBooking = () => {
        if (selectedBooking) {
            setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...b, status: 'Cancelled', pendingAmount: 0 } : b));
            setCancelModalOpen(false);
            setSelectedBooking(null);
        }
    };

    const openDateModal = (booking: UserBooking) => {
        setSelectedBooking(booking);
        setNewTravelDate(booking.travelDate);
        setDateModalOpen(true);
    };

    const handleDateChange = () => {
        if (selectedBooking) {
            setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...b, travelDate: newTravelDate } : b));
            setDateModalOpen(false);
            setSelectedBooking(null);
        }
    };
    
    const handlePayBalance = (booking: UserBooking) => {
        const tripItem = [].find(item => item.id === booking.tripId);
        if (tripItem) {
            // setBookingDetails({
            //     item: tripItem,
            //     travelers: booking.travelers,
            //     date: booking.travelDate,
            //     pendingAmount: booking.pendingAmount,
            // });
            // navigate('/checkout');
        } else {
            alert('Could not find trip details to proceed with payment.');
        }
    };

    const handleViewDetails = (booking: UserBooking) => {
        const allTrips = [];
        const tripDetails = allTrips.find(trip => trip.id === booking.tripId);
        if (tripDetails) {
            setSelectedTripDetails(tripDetails);
            setDetailsModalOpen(true);
        } else {
            alert('Trip details could not be found.');
        }
    };

    const openReviewModal = (booking: UserBooking) => {
        setSelectedBooking(booking);
        setReviewRating(0);
        setReviewComment('');
        setReviewModalOpen(true);
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send data to the backend
        console.log({
            bookingId: selectedBooking?.id,
            tripId: selectedBooking?.tripId,
            rating: reviewRating,
            comment: reviewComment
        });
        alert('Thank you! Your review has been submitted.');
        setReviewModalOpen(false);
        setSelectedBooking(null);
    };
    
    const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string; size?: 'md' | '5xl' }> = ({ isOpen, onClose, children, title, size = 'md' }) => {
        if (!isOpen) return null;
        const sizeClass = size === 'md' ? 'max-w-md' : 'max-w-5xl';
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizeClass} m-4`}>
                    <div className="flex justify-between items-center border-b p-4 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl font-bold">&times;</button>
                    </div>
                    <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
                </div>
            </div>
        );
    };

    const TripDetailsModal: React.FC<{ trip: Trek | TourDetail | null, isOpen: boolean, onClose: () => void }> = ({ trip, isOpen, onClose }) => {
        const [activeTab, setActiveTab] = useState('itinerary');

        const TabButton: React.FC<{tabName: string; label: string}> = ({ tabName, label }) => (
            <button
                onClick={() => setActiveTab(tabName)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === tabName ? 'bg-blue-700 text-white' : 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
                {label}
            </button>
        );

        if (!trip) return null;
        
        const isTrek = 'itinerary' in trip;

        return (
            <Modal isOpen={isOpen} onClose={onClose} title={trip.title} size="5xl">
                <div className="flex border-b dark:border-gray-700">
                    <TabButton tabName="itinerary" label={isTrek ? "Itinerary" : "Details"} />
                    <TabButton tabName="nextSteps" label="What's Next?" />
                    <TabButton tabName="travelerInfo" label="Traveler Info" />
                    <TabButton tabName="emergencyContact" label="Emergency Contact" />
                </div>
                <div className="py-6">
                    {activeTab === 'itinerary' && (
                        <div>
                            <h3 className="text-2xl font-bold mb-4">{isTrek ? "Daily Itinerary" : "Trip Overview"}</h3>
                            {isTrek ? (
                                <div className="space-y-4">
                                    {(trip as Trek).itinerary.map(day => (
                                        <div key={day.day} className="p-4 border dark:border-gray-600 rounded-md">
                                            <p className="font-bold text-blue-800 dark:text-blue-400">Day {day.day}: {day.title}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{day.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-300">{trip.overview}</p>
                            )}
                        </div>
                    )}
                    {activeTab === 'nextSteps' && (
                        <div>
                             <h3 className="text-2xl font-bold mb-4">What to do next</h3>
                             <ul className="space-y-3 list-disc list-inside text-gray-600 dark:text-gray-300">
                                <li><strong>Check Visa Requirements:</strong> Ensure your passport is valid for at least 6 months and check if you need a visa for your destination.</li>
                                <li><strong>Book Flights:</strong> Arrange your international flights to and from the destination.</li>
                                <li><strong>Get Travel Insurance:</strong> Comprehensive travel and medical insurance is mandatory for all our trips.</li>
                                <li><strong>Physical Preparation:</strong> For treks, start a fitness routine to prepare for the physical demands.</li>
                                <li><strong>Review Equipment List:</strong> Check the provided equipment list and start gathering your gear.</li>
                             </ul>
                             <button className="mt-6 bg-blue-700 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300">
                                Download Brochure
                             </button>
                        </div>
                    )}
                    {activeTab === 'travelerInfo' && (
                        <div>
                             <h3 className="text-2xl font-bold mb-4">Update Traveler Details</h3>
                             <form className="space-y-4 max-w-lg">
                                 <div>
                                     <label className="block text-sm font-medium">Full Name (as on passport)</label>
                                     <input type="text" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="block text-sm font-medium">Date of Birth</label>
                                         <input type="date" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:[color-scheme:dark]" />
                                     </div>
                                      <div>
                                         <label className="block text-sm font-medium">Nationality</label>
                                         <input type="text" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="block text-sm font-medium">Passport Number</label>
                                         <input type="text" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                                     </div>
                                     <div>
                                         <label className="block text-sm font-medium">Passport Expiry Date</label>
                                         <input type="date" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:[color-scheme:dark]" />
                                     </div>
                                 </div>
                                 <div className="pt-2">
                                    <button type="submit" className="px-4 py-2 rounded-md text-white bg-blue-700 hover:bg-blue-800">Save Details</button>
                                 </div>
                             </form>
                        </div>
                    )}
                     {activeTab === 'emergencyContact' && (
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Update Emergency Contact</h3>
                            <form className="space-y-4 max-w-lg">
                                 <div>
                                     <label className="block text-sm font-medium">Contact Name</label>
                                     <input type="text" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium">Relationship</label>
                                     <input type="text" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium">Phone Number</label>
                                     <input type="tel" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                                 </div>
                                 <div className="pt-2">
                                    <button type="submit" className="px-4 py-2 rounded-md text-white bg-blue-700 hover:bg-blue-800">Save Contact</button>
                                 </div>
                            </form>
                        </div>
                    )}
                </div>
            </Modal>
        )
    }


    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">My Bookings</h1>
                <div className="space-y-6">
                    {bookings.length > 0 ? (
                        bookings.map(booking => (
                            <div key={booking.id} className="p-4 border dark:border-gray-700 rounded-lg">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <img src={booking.tripImage} alt={booking.tripName} className="w-full md:w-48 h-48 md:h-auto object-cover rounded-md" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{booking.tripName}</h2>
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusChipClass(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div><p className="font-semibold text-gray-800 dark:text-gray-200">Booking ID</p><p>{booking.id}</p></div>
                                            <div><p className="font-semibold text-gray-800 dark:text-gray-200">Travel Date</p><p>{new Date(booking.travelDate).toLocaleDateString()}</p></div>
                                            <div><p className="font-semibold text-gray-800 dark:text-gray-200">Total Cost</p><p>${booking.totalCost.toLocaleString()}</p></div>
                                            <div><p className="font-semibold text-gray-800 dark:text-gray-200">Travelers</p><p>{booking.travelers}</p></div>
                                        </div>
                                         {booking.pendingAmount && booking.pendingAmount > 0 && booking.status === 'Confirmed' && (
                                            <div className="mt-2 text-red-600 dark:text-red-400 font-semibold">Pending Amount: ${booking.pendingAmount.toLocaleString()}</div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-4 border-t dark:border-gray-700 pt-4 flex flex-wrap gap-2 justify-end items-center">
                                    {booking.status !== 'Cancelled' && (
                                        <button onClick={() => handleViewDetails(booking)} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">View Details</button>
                                    )}
                                    {booking.status === 'Completed' && (
                                        <button onClick={() => openReviewModal(booking)} className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">Leave Review</button>
                                    )}
                                    {booking.status === 'Confirmed' && (
                                        <>
                                            {booking.pendingAmount && booking.pendingAmount > 0 && (
                                                <>
                                                    <button onClick={() => handlePayBalance(booking)} className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Pay Balance</button>
                                                    <button onClick={() => alert('Your request to pay on arrival has been noted.')} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Pay on Arrival</button>
                                                </>
                                            )}
                                            <button onClick={() => openDateModal(booking)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-yellow-400 rounded-md hover:bg-yellow-500">Change Date</button>
                                            <button onClick={() => openCancelModal(booking)} className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Cancel Booking</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">You have no bookings yet.</p>
                    )}
                </div>
            </div>

            {/* Cancellation Modal */}
            <Modal isOpen={isCancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Confirm Cancellation">
                <p className="text-gray-600 dark:text-gray-300">Are you sure you want to cancel your booking for "{selectedBooking?.tripName}"? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={() => setCancelModalOpen(false)} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Go Back</button>
                    <button onClick={handleCancelBooking} className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700">Yes, Cancel</button>
                </div>
            </Modal>

            {/* Date Change Modal */}
            <Modal isOpen={isDateModalOpen} onClose={() => setDateModalOpen(false)} title="Change Travel Date">
                <p className="text-gray-600 dark:text-gray-300 mb-4">Select a new travel date for your trip to "{selectedBooking?.tripName}".</p>
                <input 
                    type="date" 
                    value={newTravelDate} 
                    onChange={(e) => setNewTravelDate(e.target.value)}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:[color-scheme:dark]"
                />
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={() => setDateModalOpen(false)} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={handleDateChange} className="px-4 py-2 rounded-md text-white bg-blue-700 hover:bg-blue-800">Request Change</button>
                </div>
            </Modal>

            {/* Review Modal */}
            <Modal isOpen={isReviewModalOpen} onClose={() => setReviewModalOpen(false)} title={`Review ${selectedBooking?.tripName}`}>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon 
                                    key={star} 
                                    filled={star <= reviewRating} 
                                    onClick={() => setReviewRating(star)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="review" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                        <textarea 
                            id="review"
                            rows={4}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Share your experience..."
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => setReviewModalOpen(false)} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md text-white bg-blue-700 hover:bg-blue-800">Submit Review</button>
                    </div>
                </form>
            </Modal>
            
            <TripDetailsModal trip={selectedTripDetails} isOpen={isDetailsModalOpen} onClose={() => setDetailsModalOpen(false)} />
        </>
    );
};

export default MyBookings;