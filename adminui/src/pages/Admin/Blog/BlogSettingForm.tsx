import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import ComponentCard from "../../../components/common/ComponentCard";
import InputField from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import toaster from "../../../components/toster";
import { useGetBlogSettingsQuery, useSaveBlogSettingsMutation } from "../../../redux/trek/blogAPI";
import { PostSettingSaveRequest } from "../../../types/blogTypes";

const BlogSettingForm = () => {
    const navigate = useNavigate();

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<PostSettingSaveRequest>({
        defaultValues: {
            postSettingId: 0,
            recentPostPerPage: 10,
            recentPostPerRow: 3,
            useNextPrev: false,
            showDescriptionInRecentPost: true,
            showDescriptionInLine: 2,
        },
    });

    const [saveSettings, { isLoading: isSaving }] = useSaveBlogSettingsMutation();
    const { data: settingsData, isSuccess } = useGetBlogSettingsQuery();

    useEffect(() => {
        if (isSuccess && settingsData && settingsData.Code === 200) {
            const data = settingsData.Data;
            reset({
                postSettingId: data.PostSettingId,
                recentPostPerPage: data.RecentPostPerPage ?? 10,
                recentPostPerRow: data.RecentPostPerRow ?? 3,
                useNextPrev: data.UseNextPrev ?? false,
                showDescriptionInRecentPost: data.ShowDescriptionInRecentPost ?? true,
                showDescriptionInLine: data.ShowDescriptionInLine ?? 2,
            });
        }
    }, [settingsData, reset, isSuccess]);

    const onSubmit = async (formData: PostSettingSaveRequest) => {
        try {
            const response = await saveSettings(formData).unwrap();

            if (response.Code == 200) {
                toaster.success("Blog settings saved successfully!");
            } else {
                toaster.error("Failed to save blog settings.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title="Blog Settings">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                type="number"
                                id="recentPostPerPage"
                                labelName="Recent Posts Per Page"
                                placeholder="10"
                                {...register("recentPostPerPage", {
                                    required: "This field is required",
                                    min: { value: 1, message: "Minimum value is 1" },
                                    valueAsNumber: true
                                })}
                                error={!!errors?.recentPostPerPage}
                                errorMsg={errors?.recentPostPerPage?.message}
                            />

                            <InputField
                                type="number"
                                id="recentPostPerRow"
                                labelName="Recent Posts Per Row"
                                placeholder="3"
                                {...register("recentPostPerRow", {
                                    required: "This field is required",
                                    min: { value: 1, message: "Minimum value is 1" },
                                    valueAsNumber: true
                                })}
                                error={!!errors?.recentPostPerRow}
                                errorMsg={errors?.recentPostPerRow?.message}
                            />

                            <InputField
                                type="number"
                                id="showDescriptionInLine"
                                labelName="Show Description In Lines"
                                placeholder="2"
                                {...register("showDescriptionInLine", {
                                    required: "This field is required",
                                    min: { value: 0, message: "Minimum value is 0" },
                                    valueAsNumber: true
                                })}
                                error={!!errors?.showDescriptionInLine}
                                errorMsg={errors?.showDescriptionInLine?.message}
                            />

                            <div className="flex flex-col gap-3">
                                <Checkbox
                                    label="Use Next/Previous (instead of pagination)"
                                    {...register("useNextPrev")}
                                />
                                <Checkbox
                                    label="Show Description in Recent Posts"
                                    {...register("showDescriptionInRecentPost")}
                                />
                            </div>
                        </div>
                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/superadmin/blog")}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default BlogSettingForm;
