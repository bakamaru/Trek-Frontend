import React, { useState, useEffect } from "react";
import { TrekHighLightSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekHighlightsMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface HighlightsTabProps {
    trekId: number;
    detailData: any;
}

const HighlightsTab: React.FC<HighlightsTabProps> = ({ trekId, detailData }) => {
    const [highlights, setHighlights] = useState<TrekHighLightSaveRequest[]>([]);
    const [saveHighlights, { isLoading: isSaving }] = useSaveTrekHighlightsMutation();

    useEffect(() => {
        if (detailData && detailData.code === 200) {
            const highlightData = detailData.data?.highlights || [];
            setHighlights(highlightData.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        }
    }, [detailData]);

    const handleAdd = () => {
        const newOrder = highlights.length > 0
            ? Math.max(...highlights.map(h => h.displayOrder || 0)) + 1
            : 1;

        setHighlights([
            ...highlights,
            {
                trekHighLightId: 0,
                description: "",
                displayOrder: newOrder,
            },
        ]);
    };

    const handleRemove = (index: number) => {
        setHighlights(highlights.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof TrekHighLightSaveRequest, value: any) => {
        const updated = [...highlights];
        updated[index] = { ...updated[index], [field]: value };
        setHighlights(updated);
    };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            const response = await saveHighlights({ trekId, data: highlights }).unwrap();
            if (response.code === 200) {
                toaster.success("Highlights saved successfully!");
            } else {
                toaster.error("Failed to save highlights.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Trek Highlights</h3>
                <button
                    onClick={handleAdd}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                >
                    Add Highlight
                </button>
            </div>

            {highlights.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">No highlights added yet.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
                                {highlight.displayOrder || index + 1}
                            </span>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={highlight.description || ""}
                                    onChange={(e) => handleChange(index, "description", e.target.value)}
                                    className="block w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                    placeholder="Highlight description..."
                                />
                            </div>
                            <button
                                onClick={() => handleRemove(index)}
                                className="text-xs text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
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
                    {isSaving ? "Saving..." : "Save Highlights"}
                </button>
            </div>
        </div>
    );
};

export default HighlightsTab;
