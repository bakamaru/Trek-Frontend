import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../components/common/ComponentCard";
import InputField from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import toaster from "../../../components/toster";
import { useSavePostCategoryMutation } from "../../../redux/trek/blogAPI";
import { PostCategorySaveRequest } from "../../../types/blogTypes";

const PostCategoryForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [categoryId, setCategoryId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<PostCategorySaveRequest>({
        defaultValues: {
            postCategoryId: 0,
            name: "",
            url: "",
            isActive: true,
        },
    });

    const [saveCategory, { isLoading: isSaving }] = useSavePostCategoryMutation();

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setCategoryId(parseInt(id, 10));
            // TODO: Fetch category details when endpoint is available
        } else {
            setIsEditMode(false);
            setCategoryId(0);
        }
    }, [location, id]);

    const onSubmit = async (formData: PostCategorySaveRequest) => {
        try {
            const apiData = {
                ...formData,
                postCategoryId: isEditMode ? categoryId : 0,
            };

            const response = await saveCategory(apiData).unwrap();

            if (response.Code == 200) {
                toaster.success("Category saved successfully!");
                navigate("/admin/blog/category");
            } else {
                toaster.error("Failed to save category.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Post Category`}>
                        <InputField
                            type="text"
                            id="name"
                            labelName="Name"
                            placeholder="Category Name"
                            {...register("name", { required: "Name is required" })}
                            error={!!errors?.name}
                            errorMsg={errors?.name?.message}
                        />

                        <InputField
                            type="text"
                            id="url"
                            labelName="URL Slug"
                            placeholder="category-url"
                            {...register("url", { required: "URL is required" })}
                            error={!!errors?.url}
                            errorMsg={errors?.url?.message}
                        />

                        <Checkbox label="Active" {...register("isActive")} />
                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/blog/category")}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default PostCategoryForm;
