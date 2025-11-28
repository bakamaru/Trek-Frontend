import React from "react";
import { useFormContext } from "react-hook-form";
import { TrekBasicSaveRequest } from "../../../types/trekTypes";

const MapTab: React.FC = () => {
    const { register, watch } = useFormContext<TrekBasicSaveRequest>();
    const mapUrl = watch("trekMap");

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Trek Map</h3>

            <div>
                <label htmlFor="trekMap" className="block text-xs font-medium text-gray-700 uppercase">
                    Map URL / Embed Code
                </label>
                <textarea
                    id="trekMap"
                    rows={3}
                    {...register("trekMap")}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="Enter map URL or embed code..."
                />
                <p className="mt-1 text-xs text-gray-500">
                    Provide a Google Maps URL, iframe embed code, or other map service URL
                </p>
            </div>

            {/* Map Preview */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
                {mapUrl ? (
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Map Preview:</p>
                        <div className="rounded bg-white p-3">
                            <p className="break-all text-xs text-gray-600">{mapUrl}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                            Map will be displayed on the frontend using this URL/embed code
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                            />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">No map configured</p>
                        <p className="text-xs text-gray-400">Add a map URL above to preview</p>
                    </div>
                )}
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-blue-800">
                    <strong>Note:</strong> The map data is saved as part of the basic trek information.
                    Click "Save Basic" in the Basic Info tab to persist changes.
                </p>
            </div>
        </div>
    );
};

export default MapTab;
