import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import Checkbox from "../../../../components/form/input/Checkbox";
import toaster from "../../../../components/toster";
import TextArea from "../../../../components/form/input/TextArea";
import { useGetPermitByIdQuery, useSavePermitMutation } from "../../../../redux/trek/permitAPI";
import { PermitSaveRequest } from "../../../../types/trekTypes";

const PermitForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [permitId, setPermitId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<PermitSaveRequest>({
        defaultValues: {
            permitId: 0,
            name: "",
            description: "",
            isActive: true,
        },
    });

    const [savePermit, { isLoading: isSaving }] = useSavePermitMutation();
    const { data: detailData, isSuccess } = useGetPermitByIdQuery(permitId, { skip: !isEditMode || permitId === 0 });

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setPermitId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setPermitId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.code === 200) {
            reset({
                permitId: detailData.data.permitId,
                name: detailData.data.name,
                description: detailData.data.description,
                isActive: detailData.data.isActive,
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: PermitSaveRequest) => {
        try {
            const apiData = {
                ...formData,
                permitId: isEditMode ? permitId : 0,
            };

            const response = await savePermit(apiData).unwrap();

            if (response.code == 200) {
                toaster.success("Permit saved successfully!");
                navigate("/superadmin/trek/permit");
            } else {
                toaster.error("Failed to save permit.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Permit`}>
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
                        onClick={() => navigate("/superadmin/trek/permit")}
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

export default PermitForm;
