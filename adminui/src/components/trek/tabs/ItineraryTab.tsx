import React, { useState, useEffect } from "react";
import { ItinerarySaveRequest } from "../../../types/trekTypes";
import { useSaveTrekItinerariesMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface ItineraryTabProps {
    trekId: number;
    detailData: any;
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ trekId, detailData }) => {
    const [itineraries, setItineraries] = useState<ItinerarySaveRequest[]>([]);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);
    const [saveItineraries, { isLoading: isSaving }] = useSaveTrekItinerariesMutation();

    useEffect(() => {
        if (detailData && detailData.code === 200) {
            const itineraryData = detailData.data?.itineraries || [];
            setItineraries(itineraryData.sort((a: any, b: any) => (a.dayNumber || 0) - (b.dayNumber || 0)));
        }
    }, [detailData]);

    const handleAddDay = () => {
        const newDayNumber = itineraries.length > 0
            ? Math.max(...itineraries.map(it => it.dayNumber || 0)) + 1
            : 1;

        setItineraries([
            ...itineraries,
            {
                itineraryId: 0,
                dayNumber: newDayNumber,
                dayTitle: "",
                startLocation: "",
                overnightLocation: "",
                startLocationId: 0,
                endLocationId: 0,
                trekTimeHours: 0,
                trekDistanceKM: 0,
                transportMethod: "",
                accommodationType: "",
                mealsIncluded: "",
                dailyActivityDetails: "",
            },
        ]);
        setExpandedDay(newDayNumber);
    };

    const handleRemoveDay = (index: number) => {
        setItineraries(itineraries.filter((_, i) => i !== index));
    };

    const handleDayChange = (index: number, field: keyof ItinerarySaveRequest, value: any) => {
        const updated = [...itineraries];
        updated[index] = { ...updated[index], [field]: value };
        setItineraries(updated);
    };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            const response = await saveItineraries({ trekId, data: itineraries }).unwrap();
            if (response.code === 200) {
                toaster.success("Itinerary saved successfully!");
            } else {
                toaster.error("Failed to save itinerary.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Daily Itinerary</h3>
                <button
                    onClick={handleAddDay}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                >
                    Add Day
                </button>
            </div>

            {itineraries.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">No itinerary days added yet.</p>
                    <button
                        onClick={handleAddDay}
                        className="mt-2 text-xs text-gray-700 underline hover:text-gray-900"
                    >
                        Add your first day
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {itineraries.map((day, index) => (
                        <div key={index} className="rounded-lg border border-gray-200 bg-white">
                            <button
                                onClick={() => setExpandedDay(expandedDay === day.dayNumber ? null : day.dayNumber || index)}
                                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                            >
                                <div>
                                    <span className="text-sm font-medium text-gray-900">
                                        Day {day.dayNumber || index + 1}
                                    </span>
                                    {day.dayTitle && (
                                        <span className="ml-2 text-sm text-gray-600">- {day.dayTitle}</span>
                                    )}
                                </div>
                                <svg
                                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedDay === (day.dayNumber || index) ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {expandedDay === (day.dayNumber || index) && (
                                <div className="border-t border-gray-200 p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Day Title</label>
                                            <input
                                                type="text"
                                                value={day.dayTitle || ""}
                                                onChange={(e) => handleDayChange(index, "dayTitle", e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                                placeholder="e.g., Trek to Namche Bazaar"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Day Number</label>
                                            <input
                                                type="number"
                                                value={day.dayNumber || 0}
                                                onChange={(e) => handleDayChange(index, "dayNumber", parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Start Location</label>
                                            <input
                                                type="text"
                                                value={day.startLocation || ""}
                                                onChange={(e) => handleDayChange(index, "startLocation", e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Overnight Location</label>
                                            <input
                                                type="text"
                                                value={day.overnightLocation || ""}
                                                onChange={(e) => handleDayChange(index, "overnightLocation", e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Trek Time (Hours)</label>
                                            <input
                                                type="number"
                                                value={day.trekTimeHours || 0}
                                                onChange={(e) => handleDayChange(index, "trekTimeHours", parseFloat(e.target.value))}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Distance (KM)</label>
                                            <input
                                                type="number"
                                                value={day.trekDistanceKM || 0}
                                                onChange={(e) => handleDayChange(index, "trekDistanceKM", parseFloat(e.target.value))}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Transport Method</label>
                                            <input
                                                type="text"
                                                value={day.transportMethod || ""}
                                                onChange={(e) => handleDayChange(index, "transportMethod", e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Accommodation</label>
                                            <input
                                                type="text"
                                                value={day.accommodationType || ""}
                                                onChange={(e) => handleDayChange(index, "accommodationType", e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Meals Included</label>
                                            <input
                                                type="text"
                                                value={day.mealsIncluded || ""}
                                                onChange={(e) => handleDayChange(index, "mealsIncluded", e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                                placeholder="e.g., B, L, D"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Daily Activity Details</label>
                                        <textarea
                                            rows={3}
                                            value={day.dailyActivityDetails || ""}
                                            onChange={(e) => handleDayChange(index, "dailyActivityDetails", e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleRemoveDay(index)}
                                        className="text-xs text-red-600 hover:text-red-800"
                                    >
                                        Remove Day
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save Itinerary"}
                </button>
            </div>
        </div>
    );
};

export default ItineraryTab;
