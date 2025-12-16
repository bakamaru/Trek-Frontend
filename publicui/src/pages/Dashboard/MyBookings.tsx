import React, { useState } from 'react';
import { useGetUserBookingQuery, MyBookingItemDto, useGetBookingDetailQuery } from '../../redux/api/bookingAPI';
import { useGetTrekDetailByUrlQuery } from '../../redux/api/trekAPI';

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
    // Pagination state
    const [offset, setOffset] = useState(1);
    const [limit] = useState(10);

    // Fetch bookings from API
    const { data, isLoading, isError } = useGetUserBookingQuery({ offset, limit });

    // State for modals
    const [isCancelModalOpen, setCancelModalOpen] = useState(false);
    const [isDateModalOpen, setDateModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);

    const [selectedBooking, setSelectedBooking] = useState<MyBookingItemDto | null>(null);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [selectedProductUrl, setSelectedProductUrl] = useState<string | null>(null);
    const [newTravelDate, setNewTravelDate] = useState('');

    // Review State
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    // Get bookings array from API response
    const bookings = data?.Data || [];

    // Get CDN URL for product images
    const CDN_URL = (import.meta.env.VITE_CDN_PATH || '').replace(/\/+$/, '');
    const getProductImageUrl = (path: string | undefined | null) => {
        if (!path) return null; // Return null for placeholder handling
        if (path.startsWith('http')) return path;
        return `${CDN_URL}${path}`;
    };

    const getStatusChipClass = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const openCancelModal = (booking: MyBookingItemDto) => {
        setSelectedBooking(booking);
        setCancelModalOpen(true);
    };

    const handleCancelBooking = () => {
        if (selectedBooking) {
            // TODO: Implement cancel booking API call
            alert('Cancel booking functionality will be implemented');
            setCancelModalOpen(false);
            setSelectedBooking(null);
        }
    };

    const openDateModal = (booking: MyBookingItemDto) => {
        setSelectedBooking(booking);
        setNewTravelDate(booking.TravelDate || '');
        setDateModalOpen(true);
    };

    const handleDateChange = () => {
        if (selectedBooking) {
            // TODO: Implement change travel date API call
            alert('Change date functionality will be implemented');
            setDateModalOpen(false);
            setSelectedBooking(null);
        }
    };

    const handlePayBalance = (booking: any) => {
        // TODO: Implement payment functionality
        alert('Payment functionality will be implemented');
    };

    const handleViewDetails = (booking: MyBookingItemDto) => {
        setSelectedBookingId(booking.BookingId);
        setSelectedProductUrl(booking.ProductUrl); // Prioritize ProductUrl from booking list
        setDetailsModalOpen(true);
    };

    const openReviewModal = (booking: MyBookingItemDto) => {
        setSelectedBooking(booking);
        setReviewRating(0);
        setReviewComment('');
        setReviewModalOpen(true);
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement review submission API call
        console.log({
            bookingId: selectedBooking?.BookingId,
            rating: reviewRating,
            comment: reviewComment
        });
        alert('Thank you! Your review has been submitted.');
        setReviewModalOpen(false);
        setSelectedBooking(null);
    };


    const BookingDetailsModal: React.FC<{
        isOpen: boolean;
        onClose: () => void;
        bookingId: number | null;
        productUrl: string | null;
    }> = ({ isOpen, onClose, bookingId, productUrl }) => {
        const [activeTab, setActiveTab] = useState<'booking' | 'trek' | 'payment'>('booking');

        // Fetch Booking Details
        const {
            data: bookingDetailResponse,
            isLoading: isBookingLoading,
            isError: isBookingError
        } = useGetBookingDetailQuery(bookingId || 0, {
            skip: !bookingId,
        });

        const bookingDetail = bookingDetailResponse?.Data;

        // Fetch Trek Details
        // Ensure we have a valid URL before fetching. explicit check for empty string
        const {
            data: trekDetailResponse,
            isLoading: isTrekLoading,
            isError: isTrekError
        } = useGetTrekDetailByUrlQuery(productUrl || '', {
            skip: !productUrl,
        });

        const trekDetail = trekDetailResponse?.Data;

        // Hero Image Source: Try TrekMap first, then Booking ProductImage, then fallback
        const heroImage =
            (activeTab === 'trek' && trekDetail?.TrekMap) ? getProductImageUrl(trekDetail.TrekMap) :
                (bookingDetail?.ProductImage) ? getProductImageUrl(bookingDetail.ProductImage) :
                    getProductImageUrl('/default/trek-thumb.jpg');

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-end md:items-center p-0 md:p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 w-full h-[95vh] md:h-[90vh] md:max-w-6xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out">

                    {/* Hero Header */}
                    <div className="relative h-48 md:h-64 shrink-0">
                        <img
                            src={heroImage || ''}
                            alt="Hero"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all z-10"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${bookingDetail?.BookingStatus === 'Confirmed' ? 'bg-green-500/80 text-white' :
                                            bookingDetail?.BookingStatus === 'Pending' ? 'bg-yellow-500/80 text-white' :
                                                'bg-gray-500/80'
                                            }`}>
                                            {bookingDetail?.BookingStatus || 'Loading...'}
                                        </span>
                                        {bookingDetail && <span className="text-sm opacity-90">ID: #{bookingDetail.BookingId}</span>}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold leading-tight shadow-black drop-shadow-lg">
                                        {bookingDetail?.ProductName || trekDetail?.Name || 'Loading Details...'}
                                    </h2>
                                </div>
                                {bookingDetail && (
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm opacity-80">Total Amount</p>
                                        <p className="text-3xl font-bold">${bookingDetail.TotalAmount.toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b text-sm font-medium bg-white dark:bg-gray-800 dark:border-gray-700 md:sticky md:top-0 z-10 px-6 pt-2">
                        <button
                            onClick={() => setActiveTab('booking')}
                            className={`pb-3 px-6 transition-all border-b-2 ${activeTab === 'booking'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            Booking Information
                        </button>
                        <button
                            onClick={() => setActiveTab('trek')}
                            className={`pb-3 px-6 transition-all border-b-2 ${activeTab === 'trek'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            Trek Details
                        </button>
                        <button
                            onClick={() => setActiveTab('payment')}
                            className={`pb-3 px-6 transition-all border-b-2 ${activeTab === 'payment'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            Payment
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-8 custom-scrollbar">
                        {activeTab === 'booking' && (
                            <div className="max-w-5xl mx-auto space-y-8">
                                {isBookingLoading && <div className="p-12 text-center text-gray-500">Loading booking information...</div>}

                                {bookingDetail && (
                                    <>
                                        {/* Quick Stats Cards */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Start Date</p>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                                    {bookingDetail.PreferedStartDate ? new Date(bookingDetail.PreferedStartDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}
                                                </p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Travelers</p>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1">{bookingDetail.Travellers?.length || 0} People</p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Paid Amount</p>
                                                <p className="font-semibold text-green-600 mt-1">${bookingDetail.TotalAmount.toLocaleString()}</p> {/* Using Total for now as Paid mismatch was noted before */}
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Payment</p>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1">{bookingDetail.ModeOfPayment || 'Unspecified'}</p>
                                            </div>
                                        </div>

                                        {/* Flight & Arrival - Boarding Pass Style */}
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative">
                                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                            <div className="p-6">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
                                                    Flight & Arrival Details
                                                </h3>

                                                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-xs text-gray-500 uppercase">Flight Number</p>
                                                        <p className="text-2xl font-mono text-gray-800 dark:text-gray-100 tracking-wider">
                                                            {bookingDetail.FlightNumber || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="hidden md:block w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-xs text-gray-500 uppercase">Airline</p>
                                                        <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                                            {bookingDetail.FlightName || 'Not Provided'}
                                                        </p>
                                                    </div>
                                                    <div className="hidden md:block w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-xs text-gray-500 uppercase">Airport Pickup</p>
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${bookingDetail.AirportPickUp ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {bookingDetail.AirportPickUp ? (
                                                                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Includes Pickup</>
                                                            ) : 'Not Requested'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-8 pt-6 border-t border-dashed border-gray-300 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1">Arrival Date</p>
                                                        <p className="font-medium">{bookingDetail.ArrivalDate ? new Date(bookingDetail.ArrivalDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1">Departure Date</p>
                                                        <p className="font-medium">{bookingDetail.DepartureDate ? new Date(bookingDetail.DepartureDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Travelers Grid */}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Traveler Manifest
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {bookingDetail.Travellers?.map((traveller, index) => (
                                                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex gap-4 items-start hover:shadow-md transition-shadow">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                                                            {traveller.FirstName.charAt(0)}{traveller.LastName.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                                                    {traveller.FirstName} {traveller.LastName}
                                                                </h4>
                                                                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                                                                    {traveller.TravellerType}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1 grid grid-cols-2 gap-y-1">
                                                                <span>Nationality: {traveller.Nationality}</span>
                                                                <span>Passport: •••• {traveller.PassportNumber.slice(-4)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Emergency Contact */}
                                        {bookingDetail.EmergencyContact && (
                                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6">
                                                <h3 className="text-red-800 dark:text-red-400 font-bold mb-4 flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    Emergency Contact
                                                </h3>
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    <div>
                                                        <span className="text-xs text-red-600/70 uppercase font-semibold">Contact Name</span>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {bookingDetail.EmergencyContact.FirstName} {bookingDetail.EmergencyContact.LastName}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-red-600/70 uppercase font-semibold">Relationship</span>
                                                        <p className="font-medium text-gray-900 dark:text-white">{bookingDetail.EmergencyContact.RelationShip}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-red-600/70 uppercase font-semibold">Phone</span>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            <a href={`tel:${bookingDetail.EmergencyContact.HomePhoneNumber}`} className="hover:underline">
                                                                {bookingDetail.EmergencyContact.HomePhoneNumber}
                                                            </a>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-red-600/70 uppercase font-semibold">Email</span>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            <a href={`mailto:${bookingDetail.EmergencyContact.Email}`} className="hover:underline">
                                                                {bookingDetail.EmergencyContact.Email}
                                                            </a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'trek' && (
                            <div className="max-w-5xl mx-auto space-y-10">
                                {isTrekLoading && <div className="p-12 text-center text-gray-500">Loading trek itinerary...</div>}
                                {!isTrekLoading && !trekDetail && <div className="p-12 text-center text-gray-400">Trek details not available.</div>}

                                {trekDetail && (
                                    <>
                                        {/* Overview Section */}
                                        <div className="prose dark:prose-invert max-w-none">
                                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">Experience Overview</h3>
                                            <div dangerouslySetInnerHTML={{ __html: trekDetail.OverviewDescription }} className="text-gray-600 dark:text-gray-300 leading-relaxed" />
                                        </div>

                                        {/* Highlights Visuals */}
                                        {trekDetail.Highlights && trekDetail.Highlights.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {trekDetail.Highlights.map(highlight => (
                                                    <div key={highlight.TrekHighLightId} className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                                                        <span className="text-yellow-600 dark:text-yellow-500 text-xl">★</span>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{highlight.Description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Vertical Timeline Itinerary */}
                                        <div>
                                            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">📅</span>
                                                Daily Itinerary
                                            </h3>

                                            <div className="relative pl-4 md:pl-8 space-y-12">
                                                {/* Vertical Line */}
                                                <div className="absolute top-2 bottom-0 left-[27px] md:left-[43px] w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                                                {trekDetail.Itineraries?.map((day: any) => (
                                                    <div key={day.ItineraryId} className="relative flex gap-6 md:gap-8 group">
                                                        {/* Icon Node */}
                                                        <div className="z-10 flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 rounded-full flex flex-col items-center justify-center shadow-md">
                                                            <span className="text-xs text-gray-500 uppercase font-bold">Day</span>
                                                            <span className="text-xl font-bold text-gray-800 dark:text-white">{day.DayNumber}</span>
                                                        </div>

                                                        {/* Content Card */}
                                                        <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative hover:shadow-md transition-shadow">
                                                            {/* Arrow Pointer */}
                                                            <div className="absolute top-6 -left-2 w-4 h-4 bg-white dark:bg-gray-800 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45"></div>

                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{day.DayTitle}</h4>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {day.TrekTimeHours > 0 && (
                                                                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                                                                            ⏱ {day.TrekTimeHours} hrs
                                                                        </span>
                                                                    )}
                                                                    <span className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-md border border-purple-100">
                                                                        🏠 {day.AccommodationType || 'Lodge'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                                                                dangerouslySetInnerHTML={{ __html: day.DailyActivityDetails }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Inclusions / Exclusions */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                                            <div className="bg-green-50/50 dark:bg-green-900/10 rounded-2xl p-6 border border-green-100 dark:border-green-900/30">
                                                <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-6 flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700">✓</div>
                                                    What's Included
                                                </h3>
                                                <ul className="space-y-4">
                                                    {trekDetail.InclusionsExclusions?.filter((x: any) => x.IsIncluded).map((item: any) => (
                                                        <li key={item.TrekInclusionExclusionId} className="flex items-start gap-3">
                                                            <span className="text-green-600 mt-1 shrink-0">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                            </span>
                                                            <span className="text-sm text-gray-700 dark:text-gray-200">{item.Description}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-red-50/50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/30">
                                                <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-6 flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-700">✕</div>
                                                    What's Excluded
                                                </h3>
                                                <ul className="space-y-4">
                                                    {trekDetail.InclusionsExclusions?.filter((x: any) => !x.IsIncluded).map((item: any) => (
                                                        <li key={item.TrekInclusionExclusionId} className="flex items-start gap-3">
                                                            <span className="text-red-500 mt-1 shrink-0">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </span>
                                                            <span className="text-sm text-gray-700 dark:text-gray-200">{item.Description}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'payment' && bookingDetail && (
                            <div className="max-w-5xl mx-auto space-y-8">
                                {/* Financial Overview Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Payment Status</h3>
                                            <p className="text-sm text-gray-500">Manage your payments and view history</p>
                                        </div>
                                        <div className="flex gap-4 text-right">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-semibold">Total Cost</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">${bookingDetail.TotalAmount.toLocaleString()}</p>
                                            </div>
                                            <div className="w-px bg-gray-200 dark:bg-gray-700 h-10"></div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-semibold">Due Balance</p>
                                                <p className="text-2xl font-bold text-red-600">${((bookingDetail.TotalAmount || 0) - (bookingDetail.PaidAmount || 0)).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800 flex flex-col items-start gap-4">
                                            <div>
                                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">STEP 1</span>
                                                <h4 className="font-bold text-lg text-blue-900 dark:text-blue-300">Pay Booking Deposit</h4>
                                                <p className="text-sm text-blue-700/80 dark:text-blue-400 mt-1">
                                                    A 20% deposit is required to confirm your reservation.
                                                </p>
                                                <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-2">
                                                    ${((bookingDetail.TotalAmount || 0) * 0.20).toLocaleString()} <span className="text-xs font-normal opacity-70">(20%)</span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handlePayBalance(bookingDetail)} // Reusing existing handler for now
                                                className="mt-auto w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-200 dark:shadow-none transition-all"
                                            >
                                                Pay Deposit Now
                                            </button>
                                        </div>

                                        <div className="flex-1 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 border border-gray-100 dark:border-gray-700 flex flex-col items-start gap-4">
                                            <div>
                                                <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">STEP 2</span>
                                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">Pay Remaining Balance</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Clear the remaining amount before your trip start date.
                                                </p>
                                                <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-2">
                                                    ${((bookingDetail.TotalAmount || 0) - ((bookingDetail.TotalAmount || 0) * 0.20)).toLocaleString()} <span className="text-xs font-normal opacity-70">(80%)</span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handlePayBalance(bookingDetail)}
                                                className="mt-auto w-full py-3 bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 rounded-lg font-semibold transition-all"
                                            >
                                                Pay Balance
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment History Table */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment History</h3>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 font-semibold">
                                                    <tr>
                                                        <th className="px-6 py-4">Date</th>
                                                        <th className="px-6 py-4">Description</th>
                                                        <th className="px-6 py-4">Amount</th>
                                                        <th className="px-6 py-4">Method</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-center">Receipt</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {/* Mock Data - Replace with actual history when available */}
                                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">Dec 12, 2025</td>
                                                        <td className="px-6 py-4 text-gray-500">Initial Deposit (20%)</td>
                                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">$500.00</td>
                                                        <td className="px-6 py-4 text-gray-500">Credit Card</td>
                                                        <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Success</span></td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 transition" title="View Receipt">
                                                                <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {bookingDetail.PaidAmount === 0 && (
                                                        <tr>
                                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">
                                                                No payment history available.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
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

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">My Bookings</h1>

                {/* {isLoading && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">Loading bookings...</p>
                    </div>
                )}

                {isError && (
                    <div className="text-center py-8">
                        <p className="text-red-500 dark:text-red-400">Error loading bookings. Please try again later.</p>
                    </div>
                )} */}


                <div className="space-y-6">
                    {isLoading && bookings.length == 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <div role="status">
                                <svg aria-hidden="true" className="inline w-8 h-8 w-8 h-8 text-neutral-tertiary animate-spin fill-brand" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>)}

                    {bookings.length > 0 && (
                        bookings.map(booking => (
                            <div key={booking.BookingId} className="p-4 border dark:border-gray-700 rounded-lg">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <img
                                        src={getProductImageUrl(booking.ProductImage) || getProductImageUrl('/default/trek-thumb.jpg')}
                                        alt={booking.ProductName}
                                        className="w-full md:w-48 h-48 md:h-auto object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{booking.ProductName}</h2>
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusChipClass(booking.BookingStatus)}`}>
                                                {booking.BookingStatus}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div><p className="font-semibold text-gray-800 dark:text-gray-200">Booking ID</p><p>{booking.BookingId}</p></div>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">Travel Date</p>
                                                <p>{booking.TravelDate ? new Date(booking.TravelDate).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">Paid Amount</p>
                                                <p>${booking.PaidAmount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">Travelers</p>
                                                <p>{booking.TotalTraveler}</p>
                                            </div>
                                        </div>
                                        {booking.PendingAmount && booking.PendingAmount > 0 && booking.BookingStatus === 'Confirmed' && (
                                            <div className="mt-2 text-red-600 dark:text-red-400 font-semibold">
                                                Pending Amount: ${booking.PendingAmount.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 border-t dark:border-gray-700 pt-4 flex flex-wrap gap-2 justify-end items-center">
                                    {booking.BookingStatus !== 'Cancelled' && (
                                        <button
                                            onClick={() => handleViewDetails(booking)}
                                            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                        >
                                            View Details
                                        </button>
                                    )}
                                    {booking.BookingStatus === 'Completed' && (
                                        <button
                                            onClick={() => openReviewModal(booking)}
                                            className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                                        >
                                            Leave Review
                                        </button>
                                    )}
                                    {booking.BookingStatus === 'Confirmed' && (
                                        <>
                                            {booking.PendingAmount && booking.PendingAmount > 0 && (
                                                <>
                                                    <button
                                                        onClick={() => handlePayBalance(booking)}
                                                        className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                                                    >
                                                        Pay Balance
                                                    </button>
                                                    <button
                                                        onClick={() => alert('Your request to pay on arrival has been noted.')}
                                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                                    >
                                                        Pay on Arrival
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => openDateModal(booking)}
                                                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-yellow-400 rounded-md hover:bg-yellow-500"
                                            >
                                                Change Date
                                            </button>
                                            <button
                                                onClick={() => openCancelModal(booking)}
                                                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                            >
                                                Cancel Booking
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    {bookings.length == 0 && isLoading == false && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">Data not found</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">You have no bookings yet.</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Cancellation Modal */}
            <Modal isOpen={isCancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Confirm Cancellation">
                <p className="text-gray-600 dark:text-gray-300">Are you sure you want to cancel your booking for "{selectedBooking?.ProductName}"? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={() => setCancelModalOpen(false)} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Go Back</button>
                    <button onClick={handleCancelBooking} className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700">Yes, Cancel</button>
                </div>
            </Modal>

            {/* Date Change Modal */}
            <Modal isOpen={isDateModalOpen} onClose={() => setDateModalOpen(false)} title="Change Travel Date">
                <p className="text-gray-600 dark:text-gray-300 mb-4">Select a new travel date for your trip to "{selectedBooking?.ProductName}".</p>
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
            <Modal isOpen={isReviewModalOpen} onClose={() => setReviewModalOpen(false)} title={`Review ${selectedBooking?.ProductName}`}>
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

            {/* Booking Details Modal - Full Screen */}
            <BookingDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                bookingId={selectedBookingId}
                productUrl={selectedProductUrl}
            />

        </>
    );
};

export default MyBookings;