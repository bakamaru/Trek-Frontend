import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../components/common/ComponentCard";
import InputField from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import toaster from "../../../components/toster";
//import RichTextEditor from "../../../components/form/input/RichTextEditor";
import { Editor } from '@tinymce/tinymce-react';
import MultiSelect from "../../../components/form/MultiSelect";
import { useGetPostCategoriesQuery, useGetPostByIdQuery, useSavePostMutation } from "../../../redux/trek/blogAPI";
import { Post } from "../../../types/blogTypes";

const BlogForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [postId, setPostId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [thumbnailImageFile, setThumbnailImageFile] = useState<File | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    const editorRef = useRef(null);
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
        register,
        setValue,
        watch,
    } = useForm<Post>({
        defaultValues: {
            PostId: 0,
            Title: "",
            Url: "",
            Content: "",
            Tags: "",
            Categories: "",
            IsVideoContent: false,
            VideoLink: "",
            RecommendationMetaTags: "",
            IsPublic: true,
            IsActive: true,
        },
    });

    const [savePost, { isLoading: isSaving }] = useSavePostMutation();
    const { data: detailData, isSuccess } = useGetPostByIdQuery(postId, { skip: !isEditMode || postId === 0 });
    const { data: categoryData } = useGetPostCategoriesQuery({ page: 1, limit: 100 });

    const categoryOptions = categoryData?.Data?.map((cat: any) => ({
        value: cat.Name,
        text: cat.Name
    })) || [];

    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    };

    const titleValue = watch("Title");

    useEffect(() => {
        if (!isEditMode && titleValue) {
            setValue("Url", slugify(titleValue), { shouldValidate: true });
        }
    }, [titleValue, isEditMode, setValue]);

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setPostId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setPostId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.Code === 200) {
            const data = detailData.Data;
            reset({
                PostId: data.PostId,
                Title: data.Title || "",
                Url: data.Url || "",
                Content: data.Content || "",
                Tags: data.Tags || "",
                Categories: data.Categories || "",
                ThumbnailImage: data.ThumbnailImage || "",
                CoverImage: data.CoverImage || "",
                PublishedOn: data.PublishedOn ? new Date(data.PublishedOn).toISOString().split('T')[0] : "",
                IsVideoContent: data.IsVideoContent || false,
                VideoLink: data.VideoLink || "",
                RecommendationMetaTags: data.RecommendationMetaTags || "",
                IsPublic: data.IsPublic ?? true,
                IsActive: data.IsActive ?? true,
                // SEO Fields
                MetaTitle: data.MetaTitle || "",
                MetaKeyWords: data.MetaKeyWords || "",
                MetaDescription: data.MetaDescription || "",
                SeoType: data.SeoType || "Article",
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: Post) => {
        try {
            const formDataToSend = new FormData();

            // Add all text fields
            formDataToSend.append("postId", isEditMode ? postId.toString() : "0");
            formDataToSend.append("title", formData.Title || "");
            formDataToSend.append("url", formData.Url || "");
            formDataToSend.append("content", formData.Content || "");
            formDataToSend.append("tags", formData.Tags || "");
            formDataToSend.append("categories", formData.Categories || "");
            formDataToSend.append("publishedOn", formData.PublishedOn || new Date().toISOString());
            formDataToSend.append("isVideoContent", formData.IsVideoContent ? "true" : "false");
            formDataToSend.append("videoLink", formData.VideoLink || "");
            formDataToSend.append("recommendationMetaTags", formData.RecommendationMetaTags || "");
            formDataToSend.append("isPublic", formData.IsPublic ? "true" : "false");
            formDataToSend.append("isActive", formData.IsActive ? "true" : "false");

            // SEO Fields
            formDataToSend.append("metaTitle", formData.MetaTitle || "");
            formDataToSend.append("metaKeyWords", formData.MetaKeyWords || "");
            formDataToSend.append("metaDescription", formData.MetaDescription || "");
            formDataToSend.append("seoType", formData.SeoType || "Article");
            // Also append URL again as it's part of SEO in the backend model usually, or implicitly handled
            // formData.Url is already appended

            // Add image files if present
            if (thumbnailImageFile) {
                formDataToSend.append("thumbnailImageFile", thumbnailImageFile);
            }
            if (coverImageFile) {
                formDataToSend.append("coverImageFile", coverImageFile);
            }

            const response = await savePost(formDataToSend).unwrap();

            if (response.Code == 200) {
                toaster.success("Blog post saved successfully!");
                navigate("/superadmin/blog");
            } else {
                toaster.error("Failed to save blog post.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnailImageFile(e.target.files[0]);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImageFile(e.target.files[0]);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Blog Post`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <InputField
                                    type="text"
                                    id="title"
                                    labelName="Title"
                                    placeholder="Enter blog title"
                                    {...register("Title", { required: "Title is required" })}
                                    error={!!errors?.Title}
                                    errorMsg={errors?.Title?.message}
                                />
                            </div>

                            <InputField
                                type="text"
                                id="url"
                                labelName="URL Slug"
                                placeholder="blog-post-url"
                                {...register("Url", { required: "URL is required" })}
                                error={!!errors?.Url}
                                errorMsg={errors?.Url?.message}
                            />

                            <InputField
                                type="date"
                                id="publishedOn"
                                labelName="Published Date"
                                {...register("PublishedOn")}
                                error={!!errors?.PublishedOn}
                                errorMsg={errors?.PublishedOn?.message}
                            />

                            <div className="md:col-span-2">
                                <Controller
                                    name="Content"
                                    control={control}
                                    rules={{ required: "Content is required" }}
                                    render={({ field, fieldState: { error } }) => (
                                        <div className="flex flex-col gap-1">
                                            <Editor
                                                apiKey='prsn1rfcskorh46nf7vvi1cmntpjwebj1krfdqfweex48c7k'
                                                onInit={(_evt, editor) => (editorRef.current = editor)}
                                                value={field.value}
                                                onEditorChange={(content) => field.onChange(content)}
                                                onBlur={field.onBlur}
                                                init={{
                                                    height: 500,
                                                    menubar: false,
                                                    plugins: [
                                                        'advlist',
                                                        'autolink',
                                                        'lists',
                                                        'link',
                                                        'image',
                                                        'charmap',
                                                        'preview',
                                                        'anchor',
                                                        'searchreplace',
                                                        'visualblocks',
                                                        'code',
                                                        'fullscreen',
                                                        'insertdatetime',
                                                        'media',
                                                        'table',
                                                        'code',
                                                        'help',
                                                        'wordcount',
                                                    ],
                                                    toolbar:
                                                        'undo redo | blocks | ' +
                                                        'bold italic forecolor | alignleft aligncenter ' +
                                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                                        'removeformat | help',
                                                    content_style:
                                                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                                }}
                                            />
                                            {error && <span className="text-sm text-red-500">{error.message}</span>}
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Thumbnail Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                {isEditMode && watch("ThumbnailImage") && !thumbnailImageFile && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Current: {watch("ThumbnailImage")}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Cover Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                {isEditMode && watch("CoverImage") && !coverImageFile && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Current: {watch("CoverImage")}
                                    </p>
                                )}
                            </div>

                            <InputField
                                type="text"
                                id="tags"
                                labelName="Tags"
                                placeholder="tag1, tag2, tag3"
                                {...register("Tags")}
                                error={!!errors?.Tags}
                                errorMsg={errors?.Tags?.message}
                            />

                            <div className="md:col-span-2">
                                <Controller
                                    name="Categories"
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            label="Categories"
                                            options={categoryOptions}
                                            defaultSelected={field.value ? field.value.split(',').filter(Boolean) : []}
                                            onChange={(selected) => field.onChange(selected.join(','))}
                                        />
                                    )}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Checkbox label="Is Video Content" {...register("IsVideoContent")} />
                            </div>

                            {watch("IsVideoContent") && (
                                <div className="md:col-span-2">
                                    <InputField
                                        type="text"
                                        id="videoLink"
                                        labelName="Video Link"
                                        placeholder="https://youtube.com/..."
                                        {...register("VideoLink")}
                                        error={!!errors?.VideoLink}
                                        errorMsg={errors?.VideoLink?.message}
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <InputField
                                    type="text"
                                    id="recommendationMetaTags"
                                    labelName="Recommendation Meta Tags"
                                    placeholder="meta tags for recommendations"
                                    {...register("RecommendationMetaTags")}
                                    error={!!errors?.RecommendationMetaTags}
                                    errorMsg={errors?.RecommendationMetaTags?.message}
                                />
                            </div>
                        </div>
                    </ComponentCard>

                    <ComponentCard title="SEO Configuration">
                        <div className="grid grid-cols-1 gap-4">
                            <InputField
                                type="text"
                                id="metaTitle"
                                labelName="Meta Title"
                                placeholder="SEO Title"
                                {...register("MetaTitle")}
                                error={!!errors?.MetaTitle}
                                errorMsg={errors?.MetaTitle?.message}
                            />
                            <InputField
                                type="text"
                                id="metaKeyWords"
                                labelName="Meta Keywords"
                                placeholder="keyword1, keyword2"
                                {...register("MetaKeyWords")}
                                error={!!errors?.MetaKeyWords}
                                errorMsg={errors?.MetaKeyWords?.message}
                            />
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Meta Description
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="SEO Description"
                                    className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${errors?.MetaDescription ? "border-red-500" : ""
                                        }`}
                                    {...register("MetaDescription", { required: "Meta Description is required" })}
                                ></textarea>
                                {errors?.MetaDescription && (
                                    <span className="text-sm text-red-500">{errors.MetaDescription.message}</span>
                                )}
                            </div>
                        </div>
                    </ComponentCard>

                    <ComponentCard title="Publishing Options">
                        <div className="flex flex-col gap-3">
                            <Checkbox label="Public (Visible to all)" {...register("IsPublic")} />
                            <Checkbox label="Active" {...register("IsActive")} />
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
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default BlogForm;
