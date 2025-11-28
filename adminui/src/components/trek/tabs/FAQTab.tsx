import React, { useState, useEffect } from "react";
import { TrekFAQSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekFaqsMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface FAQTabProps {
    trekId: number;
    detailData: any;
}

const FAQTab: React.FC<FAQTabProps> = ({ trekId, detailData }) => {
    const [faqs, setFaqs] = useState<TrekFAQSaveRequest[]>([]);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [saveFaqs, { isLoading: isSaving }] = useSaveTrekFaqsMutation();

    useEffect(() => {
        if (detailData && detailData.code === 200) {
            const faqData = detailData.data?.faqs || [];
            setFaqs(faqData.sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0)));
        }
    }, [detailData]);

    const handleAdd = () => {
        setFaqs([
            ...faqs,
            {
                trekFAQId: 0,
                category: "",
                question: "",
                solution: "",
                priority: faqs.length + 1,
            },
        ]);
        setExpandedFaq(faqs.length);
    };

    const handleRemove = (index: number) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof TrekFAQSaveRequest, value: any) => {
        const updated = [...faqs];
        updated[index] = { ...updated[index], [field]: value };
        setFaqs(updated);
    };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            const response = await saveFaqs({ trekId, data: faqs }).unwrap();
            if (response.code === 200) {
                toaster.success("FAQs saved successfully!");
            } else {
                toaster.error("Failed to save FAQs.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Frequently Asked Questions</h3>
                <button
                    onClick={handleAdd}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                >
                    Add FAQ
                </button>
            </div>

            {faqs.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">No FAQs added yet.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <div key={index} className="rounded-lg border border-gray-200 bg-white">
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                            >
                                <span className="text-sm font-medium text-gray-900">
                                    {faq.question || `FAQ ${index + 1}`}
                                </span>
                                <svg
                                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedFaq === index ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {expandedFaq === index && (
                                <div className="border-t border-gray-200 p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Category</label>
                                            <input
                                                type="text"
                                                value={faq.category || ""}
                                                onChange={(e) => handleChange(index, "category", e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                                placeholder="e.g., General, Permits"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Priority</label>
                                            <input
                                                type="number"
                                                value={faq.priority || 0}
                                                onChange={(e) => handleChange(index, "priority", parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Question</label>
                                        <input
                                            type="text"
                                            value={faq.question || ""}
                                            onChange={(e) => handleChange(index, "question", e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="What is the question?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Answer</label>
                                        <textarea
                                            rows={3}
                                            value={faq.solution || ""}
                                            onChange={(e) => handleChange(index, "solution", e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Provide the answer..."
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleRemove(index)}
                                        className="text-xs text-red-600 hover:text-red-800"
                                    >
                                        Remove FAQ
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
                    {isSaving ? "Saving..." : "Save FAQs"}
                </button>
            </div>
        </div>
    );
};

export default FAQTab;
