import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import Checkbox from "../../../../components/form/input/Checkbox";
import toaster from "../../../../components/toster";
import TextArea from "../../../../components/form/input/TextArea";
import { useGetEquipmentCategoryByIdQuery, useSaveEquipmentCategoryMutation } from "../../../../redux/trek/equipmentCategoryAPI";
import { EquipmentCategorySaveRequest } from "../../../../types/trekTypes";

const EquipmentCategoryForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [equipmentCategoryId, setEquipmentCategoryId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<EquipmentCategorySaveRequest>({
        defaultValues: {
            equipmentCategoryId: 0,
            name: "",
            description: "",
            tag: "",
            isActive: true,
        },
    });

    const [saveEquipmentCategory, { isLoading: isSaving }] = useSaveEquipmentCategoryMutation();
    const { data: detailData, isSuccess } = useGetEquipmentCategoryByIdQuery(equipmentCategoryId, { skip: !isEditMode || equipmentCategoryId === 0 });

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setEquipmentCategoryId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setEquipmentCategoryId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.Code === 200) {
            reset({
                equipmentCategoryId: detailData.Data.EquipmentCategoryId,
                name: detailData.Data.Name,
                description: detailData.Data.Description,
                tag: detailData.Data.Tag,
                isActive: detailData.Data.IsActive,
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: EquipmentCategorySaveRequest) => {
        try {
            const apiData = {
                ...formData,
                equipmentCategoryId: isEditMode ? equipmentCategoryId : 0,
            };

            const response = await saveEquipmentCategory(apiData).unwrap();

            if (response.Code == 200) {
                toaster.success("Equipment Category saved successfully!");
                navigate("/superadmin/trek/equipmentcategory");
            } else {
                toaster.error("Failed to save equipment category.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Equipment Category`}>
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

                        <InputField
                            type="text"
                            id="tag"
                            labelName="Tag"
                            placeholder="Tag"
                            {...register("tag")}
                            error={!!errors?.tag}
                            errorMsg={errors?.tag?.message}
                        />

                        <Checkbox label="Active" {...register("isActive")} />
                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/superadmin/trek/equipmentcategory")}
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

export default EquipmentCategoryForm;
