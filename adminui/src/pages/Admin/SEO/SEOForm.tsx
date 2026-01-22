import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../components/common/ComponentCard";
import InputField from "../../../components/form/input/InputField";
import TextAreaField from "../../../components/form/input/TextArea";
import Checkbox from "../../../components/form/input/Checkbox";
import Select from "../../../components/form/Select";
import toaster from "../../../components/toster";
import {
    useCreateSeoMutation,
    useGetSeoByIdQuery,
    useUpdateSeoMutation,
    useCheckUrlExistMutation,
} from "../../../redux/seo/seoAPI";
import { SeoSaveRequest } from "../../../types/seoTypes";

const SEOForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [seoId, setSeoId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const idParam = queryParams.get("id");
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const {
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        watch,
        control,
    } = useForm<SeoSaveRequest>({
        defaultValues: {
            url: "",
            seoType: "",
            metaTitle: "",
            metaDescription: "",
            metaKeyWords: "",
            pageId: 0,
            pageName: "",
            productId: 0,
            lastUrl: "",
            isActive: true,
        },
    });

    const [createSeo, { isLoading: isCreating }] = useCreateSeoMutation();
    const [updateSeo, { isLoading: isUpdating }] = useUpdateSeoMutation();
    const [checkUrlExist] = useCheckUrlExistMutation();

    const { data: seoData, isLoading: isLoadingData } = useGetSeoByIdQuery(seoId, {
        skip: !isEditMode || seoId === 0,
    });

    const seoType = watch("seoType");

    useEffect(() => {
        if (location.pathname.includes("edit") && idParam) {
            setIsEditMode(true);
            setSeoId(parseInt(idParam, 10));
        } else {
            setIsEditMode(false);
            setSeoId(0);
        }
    }, [location, idParam]);

    useEffect(() => {
        if (seoData && seoData.Code === 200 && seoData.Data) {
            const data = seoData.Data;
            setValue("url", data.Url);
            setValue("seoType", data.SeoType);
            setValue("metaTitle", data.MetaTitle);
            setValue("metaDescription", data.MetaDescription);
            setValue("metaKeyWords", data.MetaKeyWords);
            setValue("pageId", data.PageId);
            setValue("pageName", data.PageName);
            setValue("productId", data.ProductId);
            setValue("lastUrl", data.LastUrl);
            setValue("isActive", data.IsActive);
            if (data.Image) {
                const cdnPath = import.meta.env.VITE_CDN_PATH || "";
                setPreviewImage(`${cdnPath}${data.Image}`);
            }
        }
    }, [seoData, setValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("imageFile", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (formData: SeoSaveRequest) => {
        try {
            const submitData = new FormData();
            submitData.append("SEOId", (isEditMode ? seoId : 0).toString());
            submitData.append("Url", formData.url);
            submitData.append("SeoType", formData.seoType);
            submitData.append("MetaTitle", formData.metaTitle);
            submitData.append("MetaDescription", formData.metaDescription);
            if (formData.metaKeyWords) submitData.append("MetaKeyWords", formData.metaKeyWords);
            if (formData.pageId) submitData.append("PageId", formData.pageId.toString());
            // PageName and LastUrl suppressed from UI but if kept in state, we don't necessarily update them or we can send empty/defaults if needed.
            // But per request "Hide" implies we might not change them or they auto-handle.
            // If they are required by backend, we might need to handle them.
            // Assuming they are optional or handled by backend logic if missing.
            if (formData.pageName) submitData.append("PageName", formData.pageName);
            if (formData.productId) submitData.append("ProductId", formData.productId.toString());
            if (formData.lastUrl) submitData.append("LastUrl", formData.lastUrl);
            submitData.append("IsActive", formData.isActive ? "true" : "false");

            if (formData.imageFile) {
                submitData.append("ImageFile", formData.imageFile);
            }

            let response;
            if (isEditMode) {
                response = await updateSeo(submitData).unwrap();
            } else {
                response = await createSeo(submitData).unwrap();
            }

            if (response.Code === 200) {
                toaster.success(`SEO entry ${isEditMode ? "updated" : "created"} successfully!`);
                navigate("/admin/seo");
            } else {
                toaster.error(response.Message || `Failed to ${isEditMode ? "update" : "save"} SEO entry.`);
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    const isSaving = isCreating || isUpdating;

    const seoTypeOptions = [
        { value: "Page", label: "Page" },
        { value: "Product", label: "Product" },
        { value: "Article", label: "Article" },
        { value: "Category", label: "Category" },
        { value: "News", label: "News" },
    ];

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} SEO Entry`}>


                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Meta Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="seoType"
                                    control={control}
                                    rules={{ required: "SEO Type is required" }}
                                    render={({ field }) => (
                                        <Select
                                            options={seoTypeOptions}
                                            labelName="SEO Type"
                                            placeholder="Select Type"
                                            onChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                            error={!!errors.seoType}
                                            errorMsg={errors.seoType?.message}
                                        />
                                    )}
                                />
                                <InputField
                                    type="text"
                                    id="pageName"
                                    labelName="Page Name"
                                    placeholder="Name for Page"
                                    {...register("pageName", { required: "Page name is required" })}
                                    error={!!errors?.pageName}
                                    errorMsg={errors?.pageName?.message}
                                />

                            </div>
                            <InputField
                                type="text"
                                id="metaTitle"
                                labelName="Meta Title"
                                placeholder="Title for search engines"
                                {...register("metaTitle", { required: "Meta Title is required" })}
                                error={!!errors?.metaTitle}
                                errorMsg={errors?.metaTitle?.message}
                            />

                            <InputField
                                type="text"
                                id="url"
                                labelName="URL"
                                placeholder="/example-page"
                                {...register("url", {
                                    required: "URL is required",
                                    validate: {
                                        startsWithSlash: (value) =>
                                            value.startsWith("/") || "URL must start with /",
                                        checkExistence: async (value) => {
                                            if (isEditMode && value === seoData?.Data?.Url) return true;
                                            if (!value) return true;
                                            try {
                                                const response = await checkUrlExist({
                                                    url: value,
                                                    type: watch("seoType") || "Page",
                                                }).unwrap();
                                                if (response.Data === true) {
                                                    return "Url already in use!";
                                                }
                                                return true;
                                            } catch (error) {
                                                console.error("URL check failed", error);
                                                return true;
                                            }
                                        },
                                    },
                                })}
                                error={!!errors?.url}
                                errorMsg={errors?.url?.message}
                            />
                            <TextAreaField
                                id="metaDescription"
                                labelName="Meta Description"
                                placeholder="Description for search engines"
                                {...register("metaDescription", { required: "Meta Description is required" })}
                                rows={3}
                                error={!!errors?.metaDescription}
                                errorMsg={errors?.metaDescription?.message}
                            />
                            <InputField
                                type="text"
                                id="metaKeyWords"
                                labelName="Meta Keywords"
                                placeholder="keyword1, keyword2"
                                {...register("metaKeyWords")}
                            />
                        </div>

                        {seoType && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {seoType === "Product" ? (
                                    <InputField
                                        type="number"
                                        id="productId"
                                        labelName="Product ID"
                                        placeholder="0"
                                        {...register("productId", { valueAsNumber: true })}
                                    />
                                ) : (
                                    <InputField
                                        type="number"
                                        id="pageId"
                                        labelName="Page ID"
                                        placeholder="0"
                                        {...register("pageId", { valueAsNumber: true })}
                                    />
                                )}
                            </div>
                        )}

                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Image</h3>
                            <div className="mb-4">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:px-2.5 file:py-1 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                />
                            </div>
                            {previewImage && (
                                <div className="mt-2">
                                    <img src={previewImage} alt="Preview" className="h-40 object-cover rounded shadow" />
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <Checkbox label="Active" {...register("isActive")} />
                        </div>

                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/seo")}
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

export default SEOForm;
