import React, { useState, useEffect } from "react";
import { TrekWhyUsSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekWhyUsMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface WhyUsTabProps {
    trekId: number;
    detailData: any;
}

const WhyUsTab: React.FC<WhyUsTabProps> = ({ trekId, detailData }) => {
    const [reasons, setReasons] = useState<TrekWhyUsSaveRequest[]>([]);
    const [saveWhyUs, { isLoading: isSaving }] = useSaveTrekWhyUsMutation();

    useEffect(() => {
        if (detailData && detailData.code === 200) {
            const whyUsData = detailData.data?.whyUs || [];
            setReasons(whyUsData.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        }
    }, [detailData]);

    const handleAdd = () => {
        const newOrder = reasons.length > 0
            ? Math.max(...reasons.map(r => r.displayOrder || 0)) + 1
            : 1;

        setReasons([
            ...reasons,
            {
                trekWhyUsId: 0,
                description: "",
                displayOrder: newOrder,
            },
        ]);
    };

    const handleRemove = (index: number) => {
        setReasons(reasons.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof TrekWhyUsSaveRequest, value: any) => {
        const updated = [...reasons];
        updated[index] = { ...updated[index], [field]: value };
        setReasons(updated);
    };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            const response = await saveWhyUs({ trekId, data: reasons }).unwrap();
            if (response.code === 200) {
                toaster.success("Why Us saved successfully!");
            } else {
                toaster.error("Failed to save.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Why Choose Us</h3>
                <button
                    onClick={handleAdd}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                >
                    Add Reason
                </button>
            </div>

            {reasons.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">No reasons added yet.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {reasons.map((reason, index) => (
                        <div key={index} className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                                {reason.displayOrder || index + 1}
                            </span>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={reason.description || ""}
                                    onChange={(e) => handleChange(index, "description", e.target.value)}
                                    className="block w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                    placeholder="Reason description..."
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
                    {isSaving ? "Saving..." : "Save Why Us"}
                </button>
            </div>
        </div>
    );
};

export default WhyUsTab;
