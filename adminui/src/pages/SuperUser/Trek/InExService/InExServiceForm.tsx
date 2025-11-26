import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import Checkbox from "../../../../components/form/input/Checkbox";
import toaster from "../../../../components/toster";
import TextArea from "../../../../components/form/input/TextArea";
import { useGetInExServiceByIdQuery, useSaveInExServiceMutation } from "../../../../redux/trek/inExServiceAPI";
import { InExServiceSaveRequest } from "../../../../types/trekTypes";
import Select from "../../../../components/form/Select";

const InExServiceForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [inExServiceId, setInExServiceId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<InExServiceSaveRequest>({
        defaultValues: {
            inExServiceId: 0,
            name: "",
            description: "",
            type: "INCLUSION", // Default
            isActive: true,
        },
    });

    const [saveInExService, { isLoading: isSaving }] = useSaveInExServiceMutation();
    const { data: detailData, isSuccess } = useGetInExServiceByIdQuery(inExServiceId, { skip: !isEditMode || inExServiceId === 0 });

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setInExServiceId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setInExServiceId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.code === 200) {
            reset({
                inExServiceId: detailData.data.inExServiceId,
                name: detailData.data.name,
                description: detailData.data.description,
                type: detailData.data.type,
                isActive: detailData.data.isActive,
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: InExServiceSaveRequest) => {
        try {
            const apiData = {
                ...formData,
                inExServiceId: isEditMode ? inExServiceId : 0,
            };

            const response = await saveInExService(apiData).unwrap();

            if (response.code == 200) {
                toaster.success("Service saved successfully!");
                navigate("/superadmin/trek/inexservice");
            } else {
                toaster.error("Failed to save service.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Inclusion/Exclusion Service`}>
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

                        <Select
                            labelName="Type"
                            placeholder="Select Type"
                            options={[
                                { label: "Inclusion", value: "INCLUSION" },
                                { label: "Exclusion", value: "EXCLUSION" },
                            ]}
                            {...register("type", { required: "Type is required" })}
                            error={!!errors?.type}
                            errorMsg={errors?.type?.message}
                        />

                        <Checkbox label="Active" {...register("isActive")} />
                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/superadmin/trek/inexservice")}
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

export default InExServiceForm;
