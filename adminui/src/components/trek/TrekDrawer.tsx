import React from "react";
import { TabKey } from "../../pages/SuperUser/Trek/Trek/AdminTrekManagement";
import BasicInfoTab from "./tabs/BasicInfoTab";
import GalleryTab from "./tabs/GalleryTab";
import ItineraryTab from "./tabs/ItineraryTab";
import InclusionExclusionTab from "./tabs/InclusionExclusionTab";
import HighlightsTab from "./tabs/HighlightsTab";
import WhyUsTab from "./tabs/WhyUsTab";
import FAQTab from "./tabs/FAQTab";
import ReviewsTab from "./tabs/ReviewsTab";
import GuidesTab from "./tabs/GuidesTab";
import MapTab from "./tabs/MapTab";
import DeparturesTab from "./tabs/DeparturesTab";

interface TrekDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    trekId: number;
    activeTab: TabKey;
    onTabChange: (tab: TabKey) => void;
    onSaveBasic: () => void;
    isSaving: boolean;
    isLoading: boolean;
    detailData: any;
}

const tabs: { key: TabKey; label: string }[] = [
    { key: "basic", label: "Basic Info" },
    { key: "gallery", label: "Gallery" },
    { key: "itinerary", label: "Itinerary" },
    { key: "inclusionExclusion", label: "Inclusions & Exclusions" },
    { key: "highlights", label: "Highlights" },
    { key: "whyUs", label: "Why Us" },
    { key: "faq", label: "FAQ" },
    { key: "reviews", label: "Reviews" },
    { key: "guides", label: "Guides" },
    { key: "map", label: "Map" },
    { key: "departures", label: "Departures" },
];

const TrekDrawer: React.FC<TrekDrawerProps> = ({
    isOpen,
    onClose,
    trekId,
    activeTab,
    onTabChange,
    onSaveBasic,
    isSaving,
    isLoading,
    detailData,
}) => {
    if (!isOpen) return null;

    const isNewTrek = trekId === 0;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {isNewTrek ? "New Trek" : `Edit Trek`}
                                {!isNewTrek && (
                                    <span className="ml-2 text-sm font-normal text-gray-500">#{trekId}</span>
                                )}
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                {isNewTrek
                                    ? "Minimal basic info first, then enrich with gallery, FAQs, departures and more."
                                    : "Update trek details across different sections using the tabs below."}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="mt-4 flex gap-1 overflow-x-auto border-b border-gray-200">
                        {tabs.map((tab) => {
                            const isDisabled = isNewTrek && tab.key !== "basic";
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => !isDisabled && onTabChange(tab.key)}
                                    disabled={isDisabled}
                                    className={`whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition ${activeTab === tab.key
                                        ? "border-gray-900 text-gray-900"
                                        : isDisabled
                                            ? "border-transparent text-gray-300 cursor-not-allowed"
                                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {isLoading && trekId > 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-sm text-gray-500">Loading trek details...</div>
                        </div>
                    ) : (
                        <>
                            {activeTab === "basic" && <BasicInfoTab />}
                            {activeTab === "gallery" && <GalleryTab trekId={trekId} detailData={detailData} />}
                            {activeTab === "itinerary" && <ItineraryTab trekId={trekId} detailData={detailData} />}
                            {activeTab === "inclusionExclusion" && <InclusionExclusionTab trekId={trekId} detailData={detailData} />}
                            {activeTab === "highlights" && <HighlightsTab trekId={trekId} detailData={detailData} />}
                            {activeTab === "whyUs" && <WhyUsTab trekId={trekId} detailData={detailData} />}
                            {activeTab === "faq" && <FAQTab trekId={trekId} detailData={detailData} />}
                            {activeTab === "reviews" && <ReviewsTab trekId={trekId} detailData={detailData} />}
                            {activeTab === "guides" && <GuidesTab trekId={trekId} detailData={detailData} />}
                            {activeTab === "map" && <MapTab />}
                            {activeTab === "departures" && <DeparturesTab trekId={trekId} detailData={detailData} />}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                            Changes are local only. Wire to API endpoints.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                            {activeTab === "basic" && (
                                <button
                                    onClick={onSaveBasic}
                                    disabled={isSaving}
                                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : "Save Basic"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TrekDrawer;
