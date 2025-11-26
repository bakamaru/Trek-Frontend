import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import Checkbox from "../../../../components/form/input/Checkbox";
import toaster from "../../../../components/toster";
import TextArea from "../../../../components/form/input/TextArea";
import { useGetEquipmentByIdQuery, useSaveEquipmentMutation } from "../../../../redux/trek/equipmentAPI";
import { useGetAllEquipmentCategoryActiveQuery } from "../../../../redux/trek/equipmentCategoryAPI";
import { EquipmentSaveRequest } from "../../../../types/trekTypes";
import Select from "../../../../components/form/Select";

const EquipmentForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [equipmentId, setEquipmentId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<EquipmentSaveRequest>({
        defaultValues: {
            equipmentId: 0,
            equipmentCategoryId: 0,
            name: "",
            description: "",
            isActive: true,
        },
    });

    const [saveEquipment, { isLoading: isSaving }] = useSaveEquipmentMutation();
    const { data: detailData, isSuccess } = useGetEquipmentByIdQuery(equipmentId, { skip: !isEditMode || equipmentId === 0 });
    const { data: categoryData, isLoading: isCategoryLoading } = useGetAllEquipmentCategoryActiveQuery({});

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setEquipmentId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setEquipmentId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.code === 200) {
            reset({
                equipmentId: detailData.data.equipmentId,
                equipmentCategoryId: detailData.data.equipmentCategoryId,
                name: detailData.data.name,
                description: detailData.data.description,
                isActive: detailData.data.isActive,
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: EquipmentSaveRequest) => {
        try {
            const apiData = {
                ...formData,
                equipmentId: isEditMode ? equipmentId : 0,
            };

            const response = await saveEquipment(apiData).unwrap();

            if (response.code == 200) {
                toaster.success("Equipment saved successfully!");
                navigate("/superadmin/trek/equipment");
            } else {
                toaster.error("Failed to save equipment.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Equipment`}>
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
                            labelName="Category"
                            placeholder="Select Category"
                            options={categoryData?.data?.map((cat: any) => ({
                                label: cat.name,
                                value: cat.equipmentCategoryId,
                            })) || []}
                            {...register("equipmentCategoryId", { valueAsNumber: true, required: "Category is required" })}
                            error={!!errors?.equipmentCategoryId}
                            errorMsg={errors?.equipmentCategoryId?.message}
                        />

                        <Checkbox label="Active" {...register("isActive")} />
                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/superadmin/trek/equipment")}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white "
                        disabled={isSaving || isCategoryLoading}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default EquipmentForm;
