import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { TrekBasicSaveRequest } from "../../../../types/trekTypes";
import { useGetTrekDetailQuery, useSaveTrekBasicMutation } from "../../../../redux/trek/trekAPI";
import { useGetAllCurrencyActiveQuery } from "../../../../redux/trek/currencyAPI";
import { useGetAllActivityTypeActiveQuery } from "../../../../redux/trek/activityTypeAPI";
import { useGetAllActivityLevelActiveQuery } from "../../../../redux/trek/activityLevelAPI";
import { useGetAllTrekRegionActiveQuery } from "../../../../redux/trek/trekRegionAPI";
import { useGetAllTrekCategoryActiveQuery } from "../../../../redux/trek/trekCategoryAPI";
import { useGetAllCityActiveQuery } from "../../../../redux/trek/cityAPI";
import toaster from "../../../../components/toster";
import ComponentCard from "../../../../components/common/ComponentCard";
import BasicInfoTab from "../../../../components/trek/tabs/BasicInfoTab";
import GalleryTab from "../../../../components/trek/tabs/GalleryTab";
import ItineraryTab from "../../../../components/trek/tabs/ItineraryTab";
import InclusionExclusionTab from "../../../../components/trek/tabs/InclusionExclusionTab";
import HighlightsTab from "../../../../components/trek/tabs/HighlightsTab";
import WhyUsTab from "../../../../components/trek/tabs/WhyUsTab";
import FAQTab from "../../../../components/trek/tabs/FAQTab";
import ReviewsTab from "../../../../components/trek/tabs/ReviewsTab";
import GuidesTab from "../../../../components/trek/tabs/GuidesTab";
import MapTab from "../../../../components/trek/tabs/MapTab";
import DeparturesTab from "../../../../components/trek/tabs/DeparturesTab";

export type TabKey =
    | "basic"
    | "gallery"
    | "itinerary"
    | "inclusionExclusion"
    | "highlights"
    | "whyUs"
    | "faq"
    | "reviews"
    | "guides"
    | "map"
    | "departures";

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

const TrekFormPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const [trekId, setTrekId] = useState<number>(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>("basic");

    // Fetch trek detail when editing
    const { data: detailData, isLoading: isDetailLoading } = useGetTrekDetailQuery(trekId, {
        skip: trekId === 0,
    });

    const { data: activeCurrencies } = useGetAllCurrencyActiveQuery({});
    const { data: activeActivityTypes } = useGetAllActivityTypeActiveQuery({});
    const { data: activeActivityLevels } = useGetAllActivityLevelActiveQuery({});
    const { data: activeRegions } = useGetAllTrekRegionActiveQuery({});
    const { data: activeCategories } = useGetAllTrekCategoryActiveQuery({});
    const { data: activeCities } = useGetAllCityActiveQuery({});

    const [saveTrekBasic, { isLoading: isSaving }] = useSaveTrekBasicMutation();

    // Form setup
    const methods = useForm<TrekBasicSaveRequest>({
        defaultValues: {
            trekId: 0,
            name: "",
            url: "",
            trekCategoryId: 0,
            trekRegionId: 0,
            activityTypeId: 0,
            activityLevelId: 0,
            durationDays: 0,
            priceInUSD: 0,
            priceInNrs: 0,
            maxAltitudeMeters: 0,
            maxAltitudeFeet: 0,
            startingPoint: "",
            endingPoint: "",
            overviewDescription: "",
            baseAccommodationType: "",
            startCityId: 0,
            endCityId: 0,
            defaultCurrencyId: 0,
            trekMap: "",
            isActive: true,
        },
    });

    const { reset } = methods;

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setTrekId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setTrekId(0);
        }
    }, [location, id]);

    // Load trek detail into form when editing
    useEffect(() => {
        if (detailData && detailData.Code === 200 && detailData.Data) {
            const trek = detailData.Data.Trek || detailData.Data;
            reset({
                trekId: trek.TrekId || 0,
                name: trek.Name || "",
                url: trek.Url || "",
                trekCategoryId: trek.TrekCategoryId || 0,
                trekRegionId: trek.TrekRegionId || 0,
                activityTypeId: trek.ActivityTypeId || 0,
                activityLevelId: trek.ActivityLevelId || 0,
                durationDays: trek.DurationDays || 0,
                priceInUSD: trek.PriceInUSD || 0,
                priceInNrs: trek.PriceInNrs || 0,
                maxAltitudeMeters: trek.MaxAltitudeMeters || 0,
                maxAltitudeFeet: trek.MaxAltitudeFeet || 0,
                startingPoint: trek.StartingPoint || "",
                endingPoint: trek.EndingPoint || "",
                overviewDescription: trek.OverviewDescription || trek.Description || "",
                baseAccommodationType: trek.BaseAccommodationType || "",
                startCityId: trek.StartCityId || 0,
                endCityId: trek.EndCityId || 0,
                defaultCurrencyId: trek.DefaultCurrencyId || 0,
                trekMap: trek.TrekMap || "",
                isActive: trek.IsActive ?? true,
            });
        }
    }, [detailData, reset]);

    const handleSaveBasic = async (data: TrekBasicSaveRequest) => {
        try {
            const apiData = {
                ...data,
                trekId: trekId,
            };

            const response = await saveTrekBasic(apiData).unwrap();

            if (response.Code === 200) {
                toaster.success("Trek saved successfully!");

                // If creating new, update trekId and switch to edit mode
                if (trekId === 0 && response.Data?.TrekId) {
                    setTrekId(response.Data.TrekId);
                    setIsEditMode(true);
                    // Update URL to edit mode
                    navigate(`/superadmin/trek/trek/edit?id=${response.Data.TrekId}`, { replace: true });
                }
            } else {
                toaster.error("Failed to save trek.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    const handleCancel = () => {
        navigate("/superadmin/trek/trek");
    };

    const isNewTrek = trekId === 0;

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleSaveBasic)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <ComponentCard title={`${isEditMode ? "Edit" : "New"} Trek`}>
                            {/* Tabs */}
                            <div className="border-b border-gray-200 mb-4">
                                <div className="flex gap-1 overflow-x-auto px-6">
                                    {tabs.map((tab) => {
                                        const isDisabled = isNewTrek && tab.key !== "basic";
                                        return (
                                            <button
                                                key={tab.key}
                                                type="button"
                                                onClick={() => !isDisabled && setActiveTab(tab.key)}
                                                disabled={isDisabled}
                                                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${activeTab === tab.key
                                                    ? "border-brand-500 text-brand-600"
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
                            <div className="px-6 pb-6">
                                {isDetailLoading && trekId > 0 ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-sm text-gray-500">Loading trek details...</div>
                                    </div>
                                ) : (
                                    <>
                                        {activeTab === "basic" && (
                                            <BasicInfoTab
                                                activeCategories={activeCategories}
                                                activeRegions={activeRegions}
                                                activeActivityTypes={activeActivityTypes}
                                                activeActivityLevels={activeActivityLevels}
                                                activeCities={activeCities}
                                                activeCurrencies={activeCurrencies}
                                            />
                                        )}
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
                        </ComponentCard>
                    </div>

                    {/* Footer Actions */}
                    {activeTab === "basic" && (
                        <div className="mt-3 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    )}
                </form>
            </FormProvider>
        </>
    );
};

export default TrekFormPage;
