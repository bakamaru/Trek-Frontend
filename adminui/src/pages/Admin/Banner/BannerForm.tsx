import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../components/common/ComponentCard";
import InputField from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import toaster from "../../../components/toster";
import { useGetBannerByIdQuery, useSaveBannerMutation } from "../../../redux/trek/bannerAPI";
import { BannerSaveRequest } from "../../../types/trekTypes";

const BannerForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [bannerId, setBannerId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<BannerSaveRequest>({
        defaultValues: {
            bannerId: 0,
            name: "",
            key: "",
            isActive: true,
        },
    });

    const [saveBanner, { isLoading: isSaving }] = useSaveBannerMutation();
    const { data: detailData, isSuccess } = useGetBannerByIdQuery(bannerId, { skip: !isEditMode || bannerId === 0 });

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setBannerId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setBannerId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.Code === 200) {
            reset({
                bannerId: detailData.Data.BannerId,
                name: detailData.Data.Name,
                key: detailData.Data.Key,
                isActive: detailData.Data.IsActive,
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: BannerSaveRequest) => {
        try {
            const apiData = {
                ...formData,
                bannerId: isEditMode ? bannerId : 0,
            };

            const response = await saveBanner(apiData).unwrap();

            if (response.Code == 200) {
                toaster.success("Banner saved successfully!");
                navigate("/admin/banner");
            } else {
                toaster.error(response.Message || "Failed to save banner.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Banner Metadata`}>
                        <InputField
                            type="text"
                            id="name"
                            labelName="Name"
                            placeholder="Banner Name (e.g., Home Hero)"
                            {...register("name", { required: "Name is required" })}
                            error={!!errors?.name}
                            errorMsg={errors?.name?.message}
                        />

                        <InputField
                            type="text"
                            id="key"
                            labelName="Unique Key"
                            placeholder="Unique Key (e.g., home-hero-main)"
                            {...register("key", { required: "Key is required" })}
                            error={!!errors?.key}
                            errorMsg={errors?.key?.message}
                            disabled={isEditMode} // Usually keys shouldn't change, but depends on req. making it disabled for safety if edit.
                        />

                        <Checkbox label="Active" {...register("isActive")} />
                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/banner")}
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
                    {isEditMode && (
                        <button
                            type="button"
                            onClick={() => navigate(`/admin/banner/slides?id=${bannerId}`)}
                            className="bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-sm"
                        >
                            Manage Slides
                        </button>
                    )}
                </div>
            </form>
        </>
    );
};

export default BannerForm;
