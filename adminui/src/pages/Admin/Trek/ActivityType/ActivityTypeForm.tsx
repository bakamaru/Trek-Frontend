import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import Checkbox from "../../../../components/form/input/Checkbox";
import toaster from "../../../../components/toster";
import TextArea from "../../../../components/form/input/TextArea";
import { useGetActivityTypeByIdQuery, useSaveActivityTypeMutation } from "../../../../redux/trek/activityTypeAPI";
import { ActivityTypeSaveRequest } from "../../../../types/trekTypes";

const ActivityTypeForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activityTypeId, setActivityTypeId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<ActivityTypeSaveRequest>({
        defaultValues: {
            activityTypeId: 0,
            name: "",
            description: "",
            isActive: true,
        },
    });

    const [saveActivityType, { isLoading: isSaving }] = useSaveActivityTypeMutation();
    const { data: detailData, isSuccess } = useGetActivityTypeByIdQuery(activityTypeId, { skip: !isEditMode || activityTypeId === 0 });

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setActivityTypeId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setActivityTypeId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.Code === 200) {
            reset({
                activityTypeId: detailData.Data.ActivityTypeId,
                name: detailData.Data.Name,
                description: detailData.Data.Description,
                isActive: detailData.Data.IsActive,
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: ActivityTypeSaveRequest) => {
        try {
            const apiData = {
                ...formData,
                activityTypeId: isEditMode ? activityTypeId : 0,
            };

            const response = await saveActivityType(apiData).unwrap();

            if (response.Code == 200) {
                toaster.success("Activity Type saved successfully!");
                navigate("/superadmin/trek/activitytype");
            } else {
                toaster.error("Failed to save activity type.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Activity Type`}>
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
                        onClick={() => navigate("/superadmin/trek/activitytype")}
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

export default ActivityTypeForm;
