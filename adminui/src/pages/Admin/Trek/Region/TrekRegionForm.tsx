import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import Checkbox from "../../../../components/form/input/Checkbox";
import toaster from "../../../../components/toster";
import TextArea from "../../../../components/form/input/TextArea";
import { useGetTrekRegionByIdQuery, useSaveTrekRegionMutation } from "../../../../redux/trek/trekRegionAPI";
import { TrekRegionSaveRequest } from "../../../../types/trekTypes";

const TrekRegionForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [trekRegionId, setTrekRegionId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<TrekRegionSaveRequest>({
        defaultValues: {
            trekRegionId: 0,
            name: "",
            description: "",
            isActive: true,
        },
    });

    const [saveTrekRegion, { isLoading: isSaving }] = useSaveTrekRegionMutation();
    const { data: detailData, isSuccess } = useGetTrekRegionByIdQuery(trekRegionId, { skip: !isEditMode || trekRegionId === 0 });

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setTrekRegionId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setTrekRegionId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.Code === 200) {
            reset({
                trekRegionId: detailData.Data.TrekRegionId,
                name: detailData.Data.Name,
                description: detailData.Data.Description,
                isActive: detailData.Data.IsActive,
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: TrekRegionSaveRequest) => {
        try {
            const apiData = {
                ...formData,
                trekRegionId: isEditMode ? trekRegionId : 0,
            };

            const response = await saveTrekRegion(apiData).unwrap();

            if (response.Code == 200) {
                toaster.success("Trek Region saved successfully!");
                navigate("/superadmin/trek/region");
            } else {
                toaster.error("Failed to save trek region.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Trek Region`}>
                        <InputField
                            type="text"
                            id="name"
                            labelName="Name"
                            placeholder="Name"
                            {...register("name", { required: "Name is required" })}
                            error={!!errors?.name}
                            errorMsg={errors?.name?.message}
                        />

                        <TextArea
                            id="description"
                            labelName="Description"
                            placeholder="Description"
                            error={!!errors?.description}
                            errorMsg={errors?.description?.message}
                            {...register("description")}
                        />

                        <Checkbox label="Active" {...register("isActive")} />
                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/superadmin/trek/region")}
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

export default TrekRegionForm;
