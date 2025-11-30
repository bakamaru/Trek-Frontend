import React, { useState, useEffect } from "react";
import { TrekGuideSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekGuidesMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface GuidesTabProps {
    trekId: number;
    detailData: any;
}

const GuidesTab: React.FC<GuidesTabProps> = ({ trekId, detailData }) => {
    const [guides, setGuides] = useState<TrekGuideSaveRequest[]>([]);
    const [saveGuides, { isLoading: isSaving }] = useSaveTrekGuidesMutation();

    useEffect(() => {
        if (detailData && detailData.Code === 200) {
            const guideData = detailData.Data?.Guides || [];
            const mappedGuides = guideData.map((item: any) => ({
                trekAvailableGuideId: item.TrekAvailableGuideId,
                guideId: item.GuideId,
                isRecommended: item.IsRecommended,
            }));
            setGuides(mappedGuides);
        }
    }, [detailData]);

    const handleAdd = () => {
        setGuides([
            ...guides,
            {
                trekAvailableGuideId: 0,
                guideId: 0,
                isRecommended: false,
            },
        ]);
    };

    const handleRemove = (index: number) => {
        setGuides(guides.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof TrekGuideSaveRequest, value: any) => {
        const updated = [...guides];
        updated[index] = { ...updated[index], [field]: value };
        setGuides(updated);
    };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            const response = await saveGuides({ trekId, data: guides }).unwrap();
            if (response.Code === 200) {
                toaster.success("Guides saved successfully!");
            } else {
                toaster.error("Failed to save guides.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Available Guides</h3>
                <button type="button"
                    onClick={handleAdd}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                >
                    Assign Guide
                </button>
            </div>

            {guides.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">No guides assigned yet.</p>
                    <button type="button"
                        onClick={handleAdd}
                        className="mt-2 text-xs text-gray-700 underline hover:text-gray-900"
                    >
                        Assign your first guide
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {guides.map((guide, index) => (
                        <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Guide ID</label>
                                    <input
                                        type="number"
                                        value={guide.guideId || 0}
                                        onChange={(e) => handleChange(index, "guideId", parseInt(e.target.value))}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        placeholder="Enter Guide ID"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Reference to guide from the guides master table
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            checked={guide.isRecommended || false}
                                            onChange={(e) => handleChange(index, "isRecommended", e.target.checked)}
                                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                        />
                                        <span className="flex items-center gap-2">
                                            Recommended Guide
                                            {guide.isRecommended && (
                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                    ⭐ Recommended
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                    <button type="button"
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
                    {isSaving ? "Saving..." : "Save Guides"}
                </button>
            </div>
        </div>
    );
};

export default GuidesTab;
