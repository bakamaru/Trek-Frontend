import React from "react";

interface ItineraryTabProps {
    bookingId: number;
    booking: any;
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ bookingId, booking }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Trek Itinerary</h3>

            <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-4">
                    This section shows the trek itinerary for this booking. Customizations can be made per booking if needed.
                </div>

                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((day) => (
                        <div key={day} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="font-medium text-gray-900 mb-2">Day {day}</div>
                            <div className="text-sm text-gray-600">
                                Sample itinerary content for day {day}. This would come from the trek details.
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Guide Assignment</h4>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Assign Guide
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Change Guide
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItineraryTab;
