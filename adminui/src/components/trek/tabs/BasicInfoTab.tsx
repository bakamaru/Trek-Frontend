import React from "react";
import { useFormContext } from "react-hook-form";
import { TrekBasicSaveRequest } from "../../../types/trekTypes";

const BasicInfoTab: React.FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<TrekBasicSaveRequest>();

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Name & URL */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-700 uppercase">
                            Trek Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.name
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                                }`}
                            placeholder="e.g., Everest Base Camp Trek"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="url" className="block text-xs font-medium text-gray-700 uppercase">
                            URL Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="url"
                            {...register("url", { required: "URL is required" })}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.url
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                                }`}
                            placeholder="e.g., everest-base-camp-trek"
                        />
                        {errors.url && (
                            <p className="mt-1 text-xs text-red-600">{errors.url.message}</p>
                        )}
                    </div>
                </div>

                {/* Category, Region, Activity Type, Activity Level */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="trekCategoryId" className="block text-xs font-medium text-gray-700 uppercase">
                            Trek Category ID
                        </label>
                        <input
                            type="number"
                            id="trekCategoryId"
                            {...register("trekCategoryId", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="Category ID"
                        />
                    </div>

                    <div>
                        <label htmlFor="trekRegionId" className="block text-xs font-medium text-gray-700 uppercase">
                            Trek Region ID
                        </label>
                        <input
                            type="number"
                            id="trekRegionId"
                            {...register("trekRegionId", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="Region ID"
                        />
                    </div>

                    <div>
                        <label htmlFor="activityTypeId" className="block text-xs font-medium text-gray-700 uppercase">
                            Activity Type ID
                        </label>
                        <input
                            type="number"
                            id="activityTypeId"
                            {...register("activityTypeId", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="Activity Type ID"
                        />
                    </div>

                    <div>
                        <label htmlFor="activityLevelId" className="block text-xs font-medium text-gray-700 uppercase">
                            Activity Level ID
                        </label>
                        <input
                            type="number"
                            id="activityLevelId"
                            {...register("activityLevelId", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="Activity Level ID"
                        />
                    </div>
                </div>

                {/* Duration, Prices, Altitude */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <label htmlFor="durationDays" className="block text-xs font-medium text-gray-700 uppercase">
                            Duration (Days)
                        </label>
                        <input
                            type="number"
                            id="durationDays"
                            {...register("durationDays", { valueAsNumber: true, min: 1 })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., 14"
                        />
                    </div>

                    <div>
                        <label htmlFor="priceInUSD" className="block text-xs font-medium text-gray-700 uppercase">
                            Price (USD)
                        </label>
                        <input
                            type="number"
                            id="priceInUSD"
                            {...register("priceInUSD", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., 1200"
                        />
                    </div>

                    <div>
                        <label htmlFor="priceInNrs" className="block text-xs font-medium text-gray-700 uppercase">
                            Price (NPR)
                        </label>
                        <input
                            type="number"
                            id="priceInNrs"
                            {...register("priceInNrs", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., 150000"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="maxAltitudeMeters" className="block text-xs font-medium text-gray-700 uppercase">
                            Max Altitude (Meters)
                        </label>
                        <input
                            type="number"
                            id="maxAltitudeMeters"
                            {...register("maxAltitudeMeters", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., 5364"
                        />
                    </div>

                    <div>
                        <label htmlFor="maxAltitudeFeet" className="block text-xs font-medium text-gray-700 uppercase">
                            Max Altitude (Feet)
                        </label>
                        <input
                            type="number"
                            id="maxAltitudeFeet"
                            {...register("maxAltitudeFeet", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., 17598"
                        />
                    </div>
                </div>

                {/* Starting & Ending Points */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="startingPoint" className="block text-xs font-medium text-gray-700 uppercase">
                            Starting Point
                        </label>
                        <input
                            type="text"
                            id="startingPoint"
                            {...register("startingPoint")}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., Lukla"
                        />
                    </div>

                    <div>
                        <label htmlFor="endingPoint" className="block text-xs font-medium text-gray-700 uppercase">
                            Ending Point
                        </label>
                        <input
                            type="text"
                            id="endingPoint"
                            {...register("endingPoint")}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., Lukla"
                        />
                    </div>
                </div>

                {/* Overview Description */}
                <div>
                    <label htmlFor="overviewDescription" className="block text-xs font-medium text-gray-700 uppercase">
                        Overview Description
                    </label>
                    <textarea
                        id="overviewDescription"
                        rows={4}
                        {...register("overviewDescription")}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        placeholder="Brief overview of the trek..."
                    />
                </div>

                {/* Accommodation Type */}
                <div>
                    <label htmlFor="baseAccommodationType" className="block text-xs font-medium text-gray-700 uppercase">
                        Base Accommodation Type
                    </label>
                    <input
                        type="text"
                        id="baseAccommodationType"
                        {...register("baseAccommodationType")}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        placeholder="e.g., Teahouse, Lodge"
                    />
                </div>

                {/* City IDs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <label htmlFor="startCityId" className="block text-xs font-medium text-gray-700 uppercase">
                            Start City ID
                        </label>
                        <input
                            type="number"
                            id="startCityId"
                            {...register("startCityId", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="City ID"
                        />
                    </div>

                    <div>
                        <label htmlFor="endCityId" className="block text-xs font-medium text-gray-700 uppercase">
                            End City ID
                        </label>
                        <input
                            type="number"
                            id="endCityId"
                            {...register("endCityId", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="City ID"
                        />
                    </div>

                    <div>
                        <label htmlFor="defaultCurrencyId" className="block text-xs font-medium text-gray-700 uppercase">
                            Default Currency ID
                        </label>
                        <input
                            type="number"
                            id="defaultCurrencyId"
                            {...register("defaultCurrencyId", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="Currency ID"
                        />
                    </div>
                </div>

                {/* Is Active */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        {...register("isActive")}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                        Active
                    </label>
                </div>
            </div>
        </div>
    );
};

export default BasicInfoTab;
