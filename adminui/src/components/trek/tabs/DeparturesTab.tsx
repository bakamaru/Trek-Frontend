import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TrekDepartureSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekDeparturesMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface DeparturesTabProps {
    trekId: number;
    detailData: any;
}

const DeparturesTab: React.FC<DeparturesTabProps> = ({ trekId, detailData }) => {
    const [departures, setDepartures] = useState<TrekDepartureSaveRequest[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [saveDepartures, { isLoading: isSaving }] = useSaveTrekDeparturesMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TrekDepartureSaveRequest>({
        defaultValues: {
            trekDepartureId: 0,
            startDate: "",
            endDate: "",
            seatsTotal: 0,
            seatsSold: 0,
            basePrice: 0,
            currencyId: 1,
            closed: false,
        },
    });

    useEffect(() => {
        if (detailData && detailData.Code === 200) {
            const departureData = detailData.Data?.Departures || [];
            const mappedDepartures = departureData.map((item: any) => ({
                trekDepartureId: item.TrekDepartureId,
                startDate: item.StartDate,
                endDate: item.EndDate,
                seatsTotal: item.SeatsTotal,
                seatsSold: item.SeatsSold,
                basePrice: item.BasePrice,
                currencyId: item.CurrencyId,
                closed: item.Closed,
            }));
            setDepartures(mappedDepartures);
        }
    }, [detailData]);

    const handleAdd = () => {
        setEditingIndex(-1);
        reset({
            trekDepartureId: 0,
            startDate: "",
            endDate: "",
            seatsTotal: 0,
            seatsSold: 0,
            basePrice: 0,
            currencyId: 1,
            closed: false,
        });
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        reset(departures[index]);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        reset({
            trekDepartureId: 0,
            startDate: "",
            endDate: "",
            seatsTotal: 0,
            seatsSold: 0,
            basePrice: 0,
            currencyId: 1,
            closed: false,
        });
    };

    const onSubmit = async (data: TrekDepartureSaveRequest) => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        // Additional validation for end date
        if (new Date(data.endDate) < new Date(data.startDate)) {
            toaster.error("End date must be after start date.");
            return;
        }

        // Validate seats sold is not greater than total seats
        if (data.seatsSold > data.seatsTotal) {
            toaster.error("Seats sold cannot be greater than total seats.");
            return;
        }

        try {
            // Save only the current departure being edited
            const response = await saveDepartures({ trekId, data: [data] }).unwrap();
            if (response.Code === 200) {
                toaster.success("Departure saved successfully!");

                // Update local state
                if (editingIndex === -1) {
                    // Adding new - add to departures array
                    setDepartures([...departures, { ...data, trekDepartureId: response.Data?.TrekDepartureId || 0 }]);
                } else if (editingIndex !== null) {
                    // Editing existing - update in departures array
                    const updated = [...departures];
                    updated[editingIndex] = data;
                    setDepartures(updated);
                }

                handleCancel();
            } else {
                toaster.error("Failed to save departure.");
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
                {editingIndex === null && (
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                    >
                        Add Departure
                    </button>
                )}
            </div>

            {/* Edit Form */}
            {editingIndex !== null && (
                <div className="rounded-lg border-2 border-gray-900 bg-gray-50 p-4">
                    <h4 className="mb-3 text-sm font-medium text-gray-900">
                        {editingIndex === -1 ? "Add New Departure" : "Edit Departure"}
                    </h4>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    Start Date <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="date"
                                    {...register("startDate", {
                                        required: "Start date is required",
                                    })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                />
                                {errors.startDate && (
                                    <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    End Date <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="date"
                                    {...register("endDate", {
                                        required: "End date is required",
                                    })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                />
                                {errors.endDate && (
                                    <p className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    Total Seats <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    {...register("seatsTotal", {
                                        required: "Total seats is required",
                                        min: { value: 1, message: "Must be at least 1" },
                                        valueAsNumber: true,
                                    })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                />
                                {errors.seatsTotal && (
                                    <p className="mt-1 text-xs text-red-600">{errors.seatsTotal.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">Seats Sold</label>
                                <input
                                    type="number"
                                    {...register("seatsSold", {
                                        min: { value: 0, message: "Cannot be negative" },
                                        valueAsNumber: true,
                                    })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                />
                                {errors.seatsSold && (
                                    <p className="mt-1 text-xs text-red-600">{errors.seatsSold.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    Base Price <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("basePrice", {
                                        required: "Base price is required",
                                        min: { value: 0, message: "Cannot be negative" },
                                        valueAsNumber: true,
                                    })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                />
                                {errors.basePrice && (
                                    <p className="mt-1 text-xs text-red-600">{errors.basePrice.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center text-sm">
                                <input
                                    type="checkbox"
                                    {...register("closed")}
                                    className="mr-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                />
                                <span className="text-gray-600">Closed for Booking</span>
                            </label>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSaving}
                                className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Departures List */}
            {editingIndex === null && (
                <>
                    {departures.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                            <p className="text-sm text-gray-500">No departures scheduled yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {departures.map((departure, index) => (
                                <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-medium text-gray-900">
                                                    {formatDate(departure.startDate)} - {formatDate(departure.endDate)}
                                                </span>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${departure.closed
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {departure.closed ? "Closed" : "Open"}
                                                </span>
                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                    {departure.seatsSold}/{departure.seatsTotal} seats
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">Base Price: ${departure.basePrice}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(index)}
                                                className="text-xs text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DeparturesTab;
