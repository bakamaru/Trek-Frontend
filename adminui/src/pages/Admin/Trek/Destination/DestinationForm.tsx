
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import TextAreaField from "../../../../components/form/input/TextArea";
import Checkbox from "../../../../components/form/input/Checkbox";
import toaster from "../../../../components/toster";
import { useSaveDestinationMutation, useGetDestinationByIdQuery, Destination } from "../../../../redux/trek/destinationAPI";
import { useGetAllCountriesQuery } from "../../../../redux/other/miscAPI";
import Select from "../../../../components/form/Select";
import { Controller } from "react-hook-form";

const DestinationForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [destinationId, setDestinationId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const idParam = queryParams.get("id");
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [thumbnailImagePreview, setThumbnailImagePreview] = useState<string | null>(null);

    const {
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        control,
    } = useForm<Destination>({
        defaultValues: {
            DestinationId: 0,
            Name: "",
            CountryId: 0,
            CountryName: "",
            CountrySubtitle: "",
            Description: "",
            ShortDescription: "",
            IsTopDestination: false,
            IsActive: true,
        },
    });

    const [saveDestination, { isLoading: isSaving }] = useSaveDestinationMutation();
    const { data: destinationData } = useGetDestinationByIdQuery(destinationId, {
        skip: !isEditMode || destinationId === 0,
    });
    const { data: countries } = useGetAllCountriesQuery({});

    const countryOptions = countries?.Data?.map((c: any) => ({
        value: c.CountryId.toString(),
        label: c.Name,
    })) || [];

    useEffect(() => {
        if (location.pathname.includes("edit") && idParam) {
            setIsEditMode(true);
            setDestinationId(parseInt(idParam, 10));
        } else {
            setIsEditMode(false);
            setDestinationId(0);
        }
    }, [location, idParam]);

    useEffect(() => {
        if (destinationData && destinationData.Code === 200 && destinationData.Data) {
            const data = destinationData.Data;
            setValue("DestinationId", data.DestinationId);
            setValue("Name", data.Name);
            setValue("CountryId", data.CountryId);
            setValue("CountryName", data.CountryName);
            setValue("CountrySubtitle", data.CountrySubtitle);
            setValue("Description", data.Description);
            setValue("ShortDescription", data.ShortDescription);
            setValue("ShortDescription", data.ShortDescription);
            setValue("IsTopDestination", data.IsTopDestination);
            setValue("IsActive", data.IsActive);

            if (data.CoverImage) {
                const cdnPath = import.meta.env.VITE_CDN_PATH || "";
                setCoverImagePreview(`${cdnPath}${data.CoverImage}`);
            }
            if (data.ThumbnailImage) {
                const cdnPath = import.meta.env.VITE_CDN_PATH || "";
                setThumbnailImagePreview(`${cdnPath}${data.ThumbnailImage}`);
            }
        }
    }, [destinationData, setValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "cover" | "thumbnail") => {
        const file = e.target.files?.[0];
        if (file) {
            setValue(type === "cover" ? "CoverImage" : "ThumbnailImage", file as any); // Type cast for FormData compatibility
            const previewUrl = URL.createObjectURL(file);
            if (type === "cover") {
                setCoverImagePreview(previewUrl);
            } else {
                setThumbnailImagePreview(previewUrl);
            }
        }
    };

    const onSubmit = async (formData: any) => {
        try {
            const submitData = new FormData();
            submitData.append("DestinationId", (isEditMode ? destinationId : 0).toString());
            submitData.append("Name", formData.Name);
            submitData.append("CountryId", formData.CountryId.toString());
            submitData.append("CountryName", formData.CountryName);
            submitData.append("CountrySubtitle", formData.CountrySubtitle);
            submitData.append("Description", formData.Description || "");
            submitData.append("ShortDescription", formData.ShortDescription || "");
            submitData.append("IsTopDestination", formData.IsTopDestination ? "true" : "false");
            submitData.append("IsActive", formData.IsActive ? "true" : "false");

            if (formData.CoverImage instanceof File) {
                submitData.append("CoverImage", formData.CoverImage);
            }
            if (formData.ThumbnailImage instanceof File) {
                submitData.append("ThumbnailImage", formData.ThumbnailImage);
            }

            const response = await saveDestination(submitData).unwrap();

            if (response.Code === 200) {
                toaster.success(`Destination ${isEditMode ? "updated" : "created"} successfully!`);
                navigate("/admin/destination");
            } else {
                toaster.error(response.Message || `Failed to ${isEditMode ? "update" : "save"} destination.`);
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Destination`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                type="text"
                                id="name"
                                labelName="Name"
                                placeholder="Destination Name"
                                {...register("Name", { required: "Name is required" })}
                                error={!!errors?.Name}
                                errorMsg={errors?.Name?.message}
                            />
                            <div className="flex flex-col gap-2">
                                <Controller
                                    name="CountryId"
                                    control={control}
                                    rules={{ required: "Country is required", min: { value: 1, message: "Country is required" } }}
                                    render={({ field }) => (
                                        <Select
                                            options={countryOptions}
                                            labelName="Country"
                                            placeholder="Select Country"
                                            onChange={(e) => {
                                                const selectedId = Number(e.target.value);
                                                field.onChange(selectedId);
                                                const selectedCountry = countries?.Data?.find((c: any) => c.CountryId === selectedId);
                                                if (selectedCountry) {
                                                    setValue("CountryName", selectedCountry.Name);
                                                }
                                            }}
                                            value={field.value?.toString()}
                                            error={!!errors.CountryId}
                                            errorMsg={errors.CountryId?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <InputField
                                type="text"
                                id="countrySubtitle"
                                labelName="Country Subtitle"
                                placeholder="Subtitle"
                                {...register("CountrySubtitle")}
                            />
                        </div>

                        <div className="mt-4">

                            <TextAreaField
                                id="shortDescription"
                                labelName="Short Description"
                                placeholder="Brief summary"
                                {...register("ShortDescription")}
                                rows={3}
                            />
                            <TextAreaField
                                id="description"
                                labelName="Description"
                                placeholder="Full Description"
                                {...register("Description")}
                                rows={5}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Cover Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, "cover")}
                                    className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:px-2.5 file:py-1 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                />
                                {coverImagePreview && (
                                    <div className="mt-2">
                                        <img src={coverImagePreview} alt="Cover Preview" className="h-40 object-cover rounded shadow" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Thumbnail Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, "thumbnail")}
                                    className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:px-2.5 file:py-1 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                />
                                {thumbnailImagePreview && (
                                    <div className="mt-2">
                                        <img src={thumbnailImagePreview} alt="Thumbnail Preview" className="h-40 object-cover rounded shadow" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex gap-6">
                            <Checkbox label="Top Destination" {...register("IsTopDestination")} />
                            <Checkbox label="Active" {...register("IsActive")} />
                        </div>

                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/destination")}
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

export default DestinationForm;
