import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import {
    useSaveThemeMutation,
    useGetThemeDetailQuery
} from "../../../redux/aibot/themeAPI";
import ComponentCard from "../../../components/common/ComponentCard";
import InputField from "../../../components/form/input/InputField";
import toaster from "../../../components/toster";
import Checkbox from "../../../components/form/input/Checkbox";
interface ThemeFormValues {
    AIAssistantThemeId: number;
    Name: string;
    PrimaryColor: string;
    SecondaryColor: string;
    IsActive: boolean;
    AddedBy: number;
    Layout: string;
}

const ThemeForm = () => {
    const Navigate = useNavigate();
    const Location = useLocation();
    const [ThemeId, setThemeId] = useState(0);
    const [IsEditMode, setIsEditMode] = useState(false);
    const QueryParams = new URLSearchParams(Location.search);
    const Id = QueryParams.get("id");

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        register,
        setValue
    } = useForm<ThemeFormValues>({
        defaultValues: {
            AIAssistantThemeId: 0,
            Name: "",
            PrimaryColor: "",
            SecondaryColor: "",
            IsActive: true,
            Layout: "",
        },
    });
    useEffect(() => {

    }, [setValue]);
    const [SaveTheme, { isLoading: IsSaving }] = useSaveThemeMutation();
    const { data: ThemeDetail, isLoading: IsThemeDetailLoading, isSuccess } = useGetThemeDetailQuery(ThemeId, { skip: !IsEditMode || !ThemeId });
    useEffect(() => {
        if (Location.pathname.includes("edit") && Id) {
            setIsEditMode(true);
            setThemeId(parseInt(Id, 10));
        } else {
            setIsEditMode(false);
            setThemeId(0);
        }
    }, [Location, Id]);
    useEffect(() => {
        if (isSuccess && ThemeDetail && ThemeDetail.Data) {
            reset({
                AIAssistantThemeId: ThemeDetail.Data.AIAssistantThemeId,
                Name: ThemeDetail.Data.Name,
                PrimaryColor: ThemeDetail.Data.PrimaryColor,
                SecondaryColor: ThemeDetail.Data.SecondaryColor,
                IsActive: ThemeDetail.Data.IsActive,
                Layout: ThemeDetail.Data.Layout,
            });
        }
    }, [ThemeDetail, reset, isSuccess]);
    const onSubmit = async (FormData: ThemeFormValues) => {
        try {
            const Response: any = await SaveTheme(FormData).unwrap();
            if (Response.Code === 200) {
                toaster.success(`Theme ${IsEditMode ? "updated" : "created"} successfully!`);
                Navigate("/superadmin/assistant/theme");
            } else {
                toaster.error("Failed to save theme.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <ComponentCard title={`${IsEditMode ? "Edit" : "New"} Theme`}>
                    <InputField
                        type="text"
                        id="Name"
                        labelName="Theme Name"
                        placeholder="Theme Name"
                        {...register("Name", { required: "Theme name is required" })}
                        error={!!errors?.Name}
                        errorMsg={errors?.Name?.message}
                    />
                    <InputField
                        type="color"
                        id="PrimaryColor"
                        labelName="Primary Color"
                        placeholder="Primary Color"
                        {...register("PrimaryColor", { required: "Primary Color is required" })}
                        error={!!errors?.PrimaryColor}
                        errorMsg={errors?.PrimaryColor?.message}
                    />
                    <InputField
                        type="color"
                        id="SecondaryColor"
                        labelName="Secondary Color"
                        placeholder="Secondary Color"
                        {...register("SecondaryColor", { required: "Secondary Color is required" })}
                        error={!!errors?.SecondaryColor}
                        errorMsg={errors?.SecondaryColor?.message}
                    />
                    <InputField
                        type="text"
                        id="Layout"
                        labelName="Layout"
                        placeholder="L1,L2"
                        {...register("Layout", { required: "Layout is required" })}
                        error={!!errors?.Layout}
                        errorMsg={errors?.Layout?.message}
                    />
                    <Checkbox label="Active" {...register("IsActive")} />
                    <InputField
                        type="hidden"
                        id="AddedBy"
                        {...register("AddedBy")}
                    />
                    <div className="mt-3 flex justify-end gap-3">
                        <button
                            type="reset"
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white "
                            disabled={IsSaving}
                        >
                            {IsSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </ComponentCard>
            </form>
        </>
    );
};

export default ThemeForm;