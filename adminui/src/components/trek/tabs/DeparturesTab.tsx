import React, { useState, useEffect } from "react";
import { TrekDepartureSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekDeparturesMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface DeparturesTabProps {
    trekId: number;
    detailData: any;
}

const DeparturesTab: React.FC<DeparturesTabProps> = ({ trekId, detailData }) => {
    const [departures, setDepartures] = useState<TrekDepartureSaveRequest[]>([]);
    const [saveDepartures, { isLoading: isSaving }] = useSaveTrekDeparturesMutation();

    useEffect(() => {
        if (detailData && detailData.code === 200) {
            const departureData = detailData.data?.departures || [];
            setDepartures(departureData);
        }
    }, [detailData]);

    const handleAdd = () => {
        setDepartures([
            ...departures,
            {
                trekDepartureId: 0,
                startDate: "",
                endDate: "",
                seatsTotal: 0,
                seatsSold: 0,
                basePrice: 0,
                currencyId: 1,
                closed: false,
            },
        ]);
    };

    const handleRemove = (index: number) => {
        setDepartures(departures.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof TrekDepartureSaveRequest, value: any) => {
        const updated = [...departures];
        updated[index] = { ...updated[index], [field]: value };
        setDepartures(updated);
    };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            const response = await saveDepartures({ trekId, data: departures }).unwrap();
            if (response.code === 200) {
                toaster.success("Departures saved successfully!");
            } else {
                toaster.error("Failed to save departures.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Group Departures</h3>
                <button
                    onClick={handleAdd}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                >
                    Add Departure
                </button>
            </div>

            {departures.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">No departures scheduled yet.</p>
                    <button
                        onClick={handleAdd}
                        className="mt-2 text-xs text-gray-700 underline hover:text-gray-900"
                    >
                        Schedule your first departure
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {departures.map((departure, index) => (
                        <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Start Date</label>
                                        <input
                                            type="date"
                                            value={departure.startDate || ""}
                                            onChange={(e) => handleChange(index, "startDate", e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">End Date</label>
                                        <input
                                            type="date"
                                            value={departure.endDate || ""}
                                            onChange={(e) => handleChange(index, "endDate", e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Total Seats</label>
                                        <input
                                            type="number"
                                            value={departure.seatsTotal || 0}
                                            onChange={(e) => handleChange(index, "seatsTotal", parseInt(e.target.value))}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Seats Sold</label>
                                        <input
                                            type="number"
                                            value={departure.seatsSold || 0}
                                            onChange={(e) => handleChange(index, "seatsSold", parseInt(e.target.value))}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Base Price</label>
                                        <input
                                            type="number"
                                            value={departure.basePrice || 0}
                                            onChange={(e) => handleChange(index, "basePrice", parseFloat(e.target.value))}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center text-sm">
                                            <input
                                                type="checkbox"
                                                checked={departure.closed || false}
                                                onChange={(e) => handleChange(index, "closed", e.target.checked)}
                                                className="mr-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                            />
                                            <span className={departure.closed ? "text-red-700 font-medium" : "text-gray-600"}>
                                                Closed
                                            </span>
                                        </label>

                                        {departure.startDate && departure.endDate && (
                                            <span className="text-xs text-gray-500">
                                                {formatDate(departure.startDate)} - {formatDate(departure.endDate)}
                                            </span>
                                        )}

                                        {departure.seatsTotal && departure.seatsSold !== undefined && (
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                {departure.seatsSold}/{departure.seatsTotal} seats
                                            </span>
                                        )}

                                        {departure.closed ? (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                                Closed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                Open
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleRemove(index)}
                                        className="text-xs text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
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
                    {isSaving ? "Saving..." : "Save Departures"}
                </button>
            </div>
        </div>
    );
};

export default DeparturesTab;
