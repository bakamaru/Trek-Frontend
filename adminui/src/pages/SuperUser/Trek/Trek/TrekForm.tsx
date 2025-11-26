import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import Checkbox from "../../../../components/form/input/Checkbox";
import toaster from "../../../../components/toster";
import TextArea from "../../../../components/form/input/TextArea";
import { useGetTrekDetailQuery, useSaveTrekBasicMutation } from "../../../../redux/trek/trekAPI";
import { TrekBasicSaveRequest } from "../../../../types/trekTypes";

const TrekForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [trekId, setTrekId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<TrekBasicSaveRequest>({
        defaultValues: {
            trekId: 0,
            trekCategoryId: 0,
            activityLevelId: 0,
            activityTypeId: 0,
            name: "",
            url: "",
            description: "",
            durationDays: 0,
            maxAltitudeMeters: 0,
            maxAltitudeFeet: 0,
            priceInUSD: 0,
            priceInNrs: 0,
            startingPoint: "",
            endingPoint: "",
            baseAccommodationType: "",
            trekMap: "",
            trekRegionId: 0,
            startCityId: 0,
            endCityId: 0,
            isActive: true,
        },
    });

    const [saveTrekBasic, { isLoading: isSaving }] = useSaveTrekBasicMutation();
    const { data: detailData, isSuccess } = useGetTrekDetailQuery(trekId, { skip: !isEditMode || trekId === 0 });

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setTrekId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setTrekId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.code === 200) {
            reset({
                trekId: detailData.data.trekId,
                trekCategoryId: detailData.data.trekCategoryId,
                activityLevelId: detailData.data.activityLevelId,
                activityTypeId: detailData.data.activityTypeId,
                name: detailData.data.name,
                url: detailData.data.url,
                description: detailData.data.description,
                durationDays: detailData.data.durationDays,
                maxAltitudeMeters: detailData.data.maxAltitudeMeters,
                maxAltitudeFeet: detailData.data.maxAltitudeFeet,
                priceInUSD: detailData.data.priceInUSD,
                priceInNrs: detailData.data.priceInNrs,
                startingPoint: detailData.data.startingPoint,
                endingPoint: detailData.data.endingPoint,
                baseAccommodationType: detailData.data.baseAccommodationType,
                trekMap: detailData.data.trekMap,
                trekRegionId: detailData.data.trekRegionId,
                startCityId: detailData.data.startCityId,
                endCityId: detailData.data.endCityId,
                isActive: detailData.data.isActive,
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: TrekBasicSaveRequest) => {
        try {
            const apiData = {
                ...formData,
                trekId: isEditMode ? trekId : 0,
            };

            const response = await saveTrekBasic(apiData).unwrap();

            if (response.code == 200) {
                toaster.success("Trek saved successfully!");
                navigate("/superadmin/trek/trek");
            } else {
                toaster.error("Failed to save trek.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Trek`}>
                        <InputField
                            type="text"
                            id="name"
                            labelName="Name"
                            placeholder="Name"
                            {...register("name", { required: "Name is required" })}
                            error={!!errors?.name}
                            errorMsg={errors?.name?.message}
                        />

                        <InputField
                            type="text"
                            id="url"
                            labelName="URL Slug"
                            placeholder="URL Slug"
                            {...register("url", { required: "URL is required" })}
                            error={!!errors?.url}
                            errorMsg={errors?.url?.message}
                        />

                        <TextArea
                            id="description"
                            labelName="Description"
                            placeholder="Description"
                            error={!!errors?.description}
                            errorMsg={errors?.description?.message}
                            {...register("description")}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <InputField
                                type="number"
                                id="durationDays"
                                labelName="Duration (Days)"
                                placeholder="Duration"
                                {...register("durationDays", { valueAsNumber: true })}
                                error={!!errors?.durationDays}
                                errorMsg={errors?.durationDays?.message}
                            />
                            <InputField
                                type="number"
                                id="maxAltitudeMeters"
                                labelName="Max Altitude (m)"
                                placeholder="Max Altitude"
                                {...register("maxAltitudeMeters", { valueAsNumber: true })}
                                error={!!errors?.maxAltitudeMeters}
                                errorMsg={errors?.maxAltitudeMeters?.message}
                            />
                            <InputField
                                type="number"
                                id="maxAltitudeFeet"
                                labelName="Max Altitude (ft)"
                                placeholder="Max Altitude"
                                {...register("maxAltitudeFeet", { valueAsNumber: true })}
                                error={!!errors?.maxAltitudeFeet}
                                errorMsg={errors?.maxAltitudeFeet?.message}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                type="number"
                                id="priceInUSD"
                                labelName="Price (USD)"
                                placeholder="Price in USD"
                                {...register("priceInUSD", { valueAsNumber: true })}
                                error={!!errors?.priceInUSD}
                                errorMsg={errors?.priceInUSD?.message}
                            />
                            <InputField
                                type="number"
                                id="priceInNrs"
                                labelName="Price (NPR)"
                                placeholder="Price in NPR"
                                {...register("priceInNrs", { valueAsNumber: true })}
                                error={!!errors?.priceInNrs}
                                errorMsg={errors?.priceInNrs?.message}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                type="text"
                                id="startingPoint"
                                labelName="Starting Point"
                                placeholder="Starting Point"
                                {...register("startingPoint")}
                                error={!!errors?.startingPoint}
                                errorMsg={errors?.startingPoint?.message}
                            />
                            <InputField
                                type="text"
                                id="endingPoint"
                                labelName="Ending Point"
                                placeholder="Ending Point"
                                {...register("endingPoint")}
                                error={!!errors?.endingPoint}
                                errorMsg={errors?.endingPoint?.message}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                type="text"
                                id="baseAccommodationType"
                                labelName="Accommodation Type"
                                placeholder="Accommodation Type"
                                {...register("baseAccommodationType")}
                                error={!!errors?.baseAccommodationType}
                                errorMsg={errors?.baseAccommodationType?.message}
                            />
                            <InputField
                                type="text"
                                id="trekMap"
                                labelName="Map URL"
                                placeholder="Map URL"
                                {...register("trekMap")}
                                error={!!errors?.trekMap}
                                errorMsg={errors?.trekMap?.message}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {/* IDs for related entities. In real app use Select with API data */}
                            <InputField
                                type="number"
                                id="trekCategoryId"
                                labelName="Trek Category ID"
                                placeholder="Trek Category ID"
                                {...register("trekCategoryId", { valueAsNumber: true })}
                                error={!!errors?.trekCategoryId}
                                errorMsg={errors?.trekCategoryId?.message}
                            />
                            <InputField
                                type="number"
                                id="activityLevelId"
                                labelName="Activity Level ID"
                                placeholder="Activity Level ID"
                                {...register("activityLevelId", { valueAsNumber: true })}
                                error={!!errors?.activityLevelId}
                                errorMsg={errors?.activityLevelId?.message}
                            />
                            <InputField
                                type="number"
                                id="activityTypeId"
                                labelName="Activity Type ID"
                                placeholder="Activity Type ID"
                                {...register("activityTypeId", { valueAsNumber: true })}
                                error={!!errors?.activityTypeId}
                                errorMsg={errors?.activityTypeId?.message}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <InputField
                                type="number"
                                id="trekRegionId"
                                labelName="Region ID"
                                placeholder="Region ID"
                                {...register("trekRegionId", { valueAsNumber: true })}
                                error={!!errors?.trekRegionId}
                                errorMsg={errors?.trekRegionId?.message}
                            />
                            <InputField
                                type="number"
                                id="startCityId"
                                labelName="Start City ID"
                                placeholder="Start City ID"
                                {...register("startCityId", { valueAsNumber: true })}
                                error={!!errors?.startCityId}
                                errorMsg={errors?.startCityId?.message}
                            />
                            <InputField
                                type="number"
                                id="endCityId"
                                labelName="End City ID"
                                placeholder="End City ID"
                                {...register("endCityId", { valueAsNumber: true })}
                                error={!!errors?.endCityId}
                                errorMsg={errors?.endCityId?.message}
                            />
                        </div>

                        <Checkbox label="Active" {...register("isActive")} />
                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/superadmin/trek/trek")}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white "
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default TrekForm;
