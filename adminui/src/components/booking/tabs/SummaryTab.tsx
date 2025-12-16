import React from "react";

interface SummaryTabProps {
    bookingId: number;
    booking: any;
    trekData?: any;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ bookingId, booking, trekData }) => {
    return (
        <div className="space-y-6">
            {/* Product Information */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    {/* Trek Image */}
                    {trekData?.TrekUrl && (
                        <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                            <img
                                src={trekData.TrekUrl || "https://dummyimage.com/600x400/cccccc/ffffff&text=No+Image"}
                                alt={trekData.TrekName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Overview */}
                    {trekData?.OverviewDescription && (
                        <div className="mb-4">
                            <div className="text-sm text-gray-500 mb-1">Overview</div>
                            <div className="text-sm text-gray-800 line-clamp-3 hover:line-clamp-none transition-all">
                                {trekData.OverviewDescription}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-sm text-gray-500">Product Type</div>
                            <div className="font-medium">{trekData?.ProductType || booking.productType || "TREK"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Product Name</div>
                            <div className="font-medium">{trekData?.TrekName || booking.productName || booking.trekName || "N/A"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Region</div>
                            <div className="font-medium">{trekData?.TrekRegionName || trekData?.RegionName || booking.regionName || "N/A"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Difficulty</div>
                            <div className="font-medium">{trekData?.ActivityLevelName || booking.activityLevelName || "N/A"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Duration</div>
                            <div className="font-medium">{trekData?.DurationDays || booking.durationDays || 0} days</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Max Altitude</div>
                            <div className="font-medium">
                                {trekData?.MaxAltitudeMeters ? `${trekData.MaxAltitudeMeters}m / ${trekData.MaxAltitudeFeet}ft` : "N/A"}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Start / End</div>
                            <div className="font-medium text-xs">
                                {trekData?.StartingPoint || "N/A"} <br /> to {trekData?.EndingPoint || "N/A"}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Reference Price</div>
                            <div className="font-medium">
                                {trekData?.PriceInUSD ? `USD ${trekData.PriceInUSD}` : "N/A"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Breakdown */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Base Price ({booking.adults || 0} Adults × ${booking.pricePerPerson || 0})</span>
                            <span className="font-medium">${(booking.adults || 0) * (booking.pricePerPerson || 0)}</span>
                        </div>
                        {booking.children > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Children ({booking.children} × ${booking.childPrice || 0})</span>
                                <span className="font-medium">${booking.children * (booking.childPrice || 0)}</span>
                            </div>
                        )}
                        {booking.addOns && booking.addOns.length > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Add-ons</span>
                                <span className="font-medium">${booking.addOnsTotal || 0}</span>
                            </div>
                        )}
                        {booking.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-${booking.discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                            <span>Taxes & Fees</span>
                            <span className="font-medium">${booking.taxes || 0}</span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 mt-2">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total Amount</span>
                                <span>${booking.totalAmount || 0}</span>
                            </div>
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Paid</span>
                                <span>${booking.paidAmount || 0}</span>
                            </div>
                            <div className="flex justify-between text-red-600 font-medium">
                                <span>Balance Due</span>
                                <span>${(booking.totalAmount || 0) - (booking.paidAmount || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Change Travel Dates
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Change Product
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Add Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SummaryTab;
