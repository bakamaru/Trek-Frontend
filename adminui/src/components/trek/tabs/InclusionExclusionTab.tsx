import React, { useState, useEffect } from "react";
import { TrekInclusionExclusionSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekInclusionsMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface InclusionExclusionTabProps {
    trekId: number;
    detailData: any;
}

const InclusionExclusionTab: React.FC<InclusionExclusionTabProps> = ({ trekId, detailData }) => {
    const [items, setItems] = useState<TrekInclusionExclusionSaveRequest[]>([]);
    const [saveInclusions, { isLoading: isSaving }] = useSaveTrekInclusionsMutation();

    useEffect(() => {
        if (detailData && detailData.code === 200) {
            const inclusionData = detailData.data?.inclusionsExclusions || detailData.data?.inclusions || [];
            setItems(inclusionData);
        }
    }, [detailData]);

    const handleAddItem = (isIncluded: boolean) => {
        setItems([
            ...items,
            {
                trekInclusionExclusionId: 0,
                description: "",
                isIncluded,
                isOptional: false,
                optionalCostDetails: "",
            },
        ]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: keyof TrekInclusionExclusionSaveRequest, value: any) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            const response = await saveInclusions({ trekId, data: items }).unwrap();
            if (response.code === 200) {
                toaster.success("Inclusions/Exclusions saved successfully!");
            } else {
                toaster.error("Failed to save.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    const includedItems = items.filter((item) => item.isIncluded);
    const excludedItems = items.filter((item) => !item.isIncluded);

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Inclusions & Exclusions</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Included Column */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-medium text-green-800 uppercase">✔ Included</h4>
                        <button
                            onClick={() => handleAddItem(true)}
                            className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 hover:bg-green-200"
                        >
                            Add
                        </button>
                    </div>

                    {includedItems.length === 0 ? (
                        <p className="text-xs text-gray-400">No inclusions added.</p>
                    ) : (
                        <div className="space-y-2">
                            {items.map((item, index) => {
                                if (!item.isIncluded) return null;
                                return (
                                    <div key={index} className="rounded border border-green-200 bg-green-50 p-2">
                                        <input
                                            type="text"
                                            value={item.description || ""}
                                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                            className="mb-2 block w-full rounded border border-green-300 px-2 py-1 text-xs focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                                            placeholder="Description..."
                                        />
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center text-xs">
                                                <input
                                                    type="checkbox"
                                                    checked={item.isOptional || false}
                                                    onChange={(e) => handleItemChange(index, "isOptional", e.target.checked)}
                                                    className="mr-1 h-3 w-3"
                                                />
                                                Optional
                                            </label>
                                            <button
                                                onClick={() => handleRemoveItem(index)}
                                                className="text-xs text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        {item.isOptional && (
                                            <input
                                                type="text"
                                                value={item.optionalCostDetails || ""}
                                                onChange={(e) => handleItemChange(index, "optionalCostDetails", e.target.value)}
                                                className="mt-2 block w-full rounded border border-green-300 px-2 py-1 text-xs"
                                                placeholder="Optional cost details..."
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Excluded Column */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-medium text-red-800 uppercase">✖ Excluded</h4>
                        <button
                            onClick={() => handleAddItem(false)}
                            className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-200"
                        >
                            Add
                        </button>
                    </div>

                    {excludedItems.length === 0 ? (
                        <p className="text-xs text-gray-400">No exclusions added.</p>
                    ) : (
                        <div className="space-y-2">
                            {items.map((item, index) => {
                                if (item.isIncluded) return null;
                                return (
                                    <div key={index} className="rounded border border-red-200 bg-red-50 p-2">
                                        <input
                                            type="text"
                                            value={item.description || ""}
                                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                            className="mb-2 block w-full rounded border border-red-300 px-2 py-1 text-xs focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                                            placeholder="Description..."
                                        />
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            className="text-xs text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save Inclusions & Exclusions"}
                </button>
            </div>
        </div>
    );
};

export default InclusionExclusionTab;
