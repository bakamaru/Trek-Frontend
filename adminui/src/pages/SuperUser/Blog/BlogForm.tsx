import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../components/common/ComponentCard";
import InputField from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import toaster from "../../../components/toster";
//import RichTextEditor from "../../../components/form/input/RichTextEditor";
import { useGetPostByIdQuery, useSavePostMutation } from "../../../redux/trek/blogAPI";
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

                            {/* <div className="md:col-span-2">
                                <Controller
                                    name="Content"
                                    control={control}
                                    rules={{ required: "Content is required" }}
                                    render={({ field }) => (
                                        <RichTextEditor
                                            id="content"
                                            labelName="Blog Content"
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Write your blog content here..."
                                            error={!!errors?.Content}
                                            errorMsg={errors?.Content?.message}
                                            required
                                        />
                                    )}
                                />
                            </div> */}

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

                            <InputField
                                type="text"
                                id="categories"
                                labelName="Categories"
                                placeholder="category1, category2"
                                {...register("Categories")}
                                error={!!errors?.Categories}
                                errorMsg={errors?.Categories?.message}
                            />

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
