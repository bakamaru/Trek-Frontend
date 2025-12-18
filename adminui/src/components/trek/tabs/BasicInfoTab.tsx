import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useLocation } from "react-router";

import { TrekBasicSaveRequest } from "../../../types/trekTypes";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import MultiSelect from "../../form/MultiSelect";
import SelectCreatable from "../../ui/SelectCreateable";

interface BasicInfoTabProps {
    activeCategories: any;
    activeRegions: any;
    activeActivityTypes: any;
    activeActivityLevels: any;
    activeCities: any;
    activeCurrencies: any;
    activeDestinations?: any;
    onCategoryCreate?: (name: string) => Promise<number | null>;
    onRegionCreate?: (name: string) => Promise<number | null>;
    onActivityTypeCreate?: (name: string) => Promise<number | null>;
    onActivityLevelCreate?: (name: string) => Promise<number | null>;
    onCityCreate?: (name: string) => Promise<number | null>;
    onCurrencyCreate?: (name: string) => Promise<number | null>;
    onDestinationCreate?: (name: string) => Promise<number | null>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
    activeCategories,
    activeRegions,
    activeActivityTypes,
    activeActivityLevels,
    activeCities,
    activeCurrencies,
    activeDestinations,
    onCategoryCreate,
    onRegionCreate,
    onActivityTypeCreate,
    onActivityLevelCreate,
    onCityCreate,
    onCurrencyCreate,
    onDestinationCreate,
}) => {
    const {
        register,
        control,
        formState: { errors },
        watch,
        setValue,
    } = useFormContext<TrekBasicSaveRequest>();

    const location = useLocation();
    const isEditMode = location.pathname.includes("edit");

    const slugify = (text: string) => {
        if (!text) return "";
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    };

    const trekName = watch("name");

    useEffect(() => {
        if (trekName) {
            setValue("url", slugify(trekName), { shouldValidate: true });
        }
    }, [trekName, setValue]);

    const editorRef = useRef<any>(null);

    const accommodationOptions = [
        { value: "Tea House", text: "Tea House" },
        { value: "Lodge", text: "Lodge" },
        { value: "Hotel", text: "Hotel" },
        { value: "Villa", text: "Villa" },
        { value: "Camp", text: "Camp" },
        { value: "Home Stay", text: "Home Stay" },
    ];

    // Options Transformation
    const categoryOptions = activeCategories?.Data?.map((item: any) => ({
        label: item.Name,
        value: item.TrekCategoryId,
    })) || [];

    const regionOptions = activeRegions?.Data?.map((item: any) => ({
        label: item.Name,
        value: item.TrekRegionId,
    })) || [];

    const activityTypeOptions = activeActivityTypes?.Data?.map((item: any) => ({
        label: item.Name,
        value: item.ActivityTypeId,
    })) || [];

    const activityLevelOptions = activeActivityLevels?.Data?.map((item: any) => ({
        label: item.Name,
        value: item.ActivityLevelId,
    })) || [];

    const cityOptions = activeCities?.Data?.map((item: any) => ({
        label: item.Name,
        value: item.CityId,
    })) || [];

    const currencyOptions = activeCurrencies?.Data?.map((item: any) => ({
        label: item.Name,
        value: item.CurrencyId,
    })) || [];

    const destinationOptions = activeDestinations?.Data?.map((item: any) => ({
        label: item.Name,
        value: item.DestinationId,
    })) || [];

    // Placeholder Creation Handlers
    const handleCategoryCreation = async (val: string) => {
        if (onCategoryCreate) {
            return await onCategoryCreate(val);
        }
        console.log("Create Category:", val);
        return null;
    };
    const handleRegionCreation = async (val: string) => {
        if (onRegionCreate) {
            return await onRegionCreate(val);
        }
        console.log("Create Region:", val);
        return null;
    };
    const handleActivityTypeCreation = async (val: string) => {
        if (onActivityTypeCreate) {
            return await onActivityTypeCreate(val);
        }
        console.log("Create Activity Type:", val);
        return null;
    };
    const handleActivityLevelCreation = async (val: string) => {
        if (onActivityLevelCreate) {
            return await onActivityLevelCreate(val);
        }
        console.log("Create Activity Level:", val);
        return null;
    };
    const handleCityCreation = async (val: string) => {
        if (onCityCreate) {
            return await onCityCreate(val);
        }
        console.log("Create City:", val);
        return null;
    };
    const handleCurrencyCreation = async (val: string) => {
        if (onCurrencyCreate) {
            return await onCurrencyCreate(val);
        }
        console.log("Create Currency:", val);
        return null;
    };
    const handleDestinationCreation = async (val: string) => {
        if (onDestinationCreate) {
            return await onDestinationCreate(val);
        }
        console.log("Create Destination:", val);
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Name & URL */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-700 uppercase">
                            Trek Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.name
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                                }`}
                            placeholder="e.g., Everest Base Camp Trek"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="url" className="block text-xs font-medium text-gray-700 uppercase">
                            URL Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="url"
                            {...register("url", { required: "URL is required" })}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.url
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                                }`}
                            placeholder="e.g., everest-base-camp-trek"
                        />
                        {errors.url && (
                            <p className="mt-1 text-xs text-red-600">{errors.url.message}</p>
                        )}
                    </div>
                </div>

                {/* Category, Region, Activity Type, Activity Level */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Trek Category */}
                    <div>
                        <Controller
                            control={control}
                            name="trekCategoryId"
                            render={({ field }) => (
                                <SelectCreatable
                                    labelText="Trek Category"
                                    options={categoryOptions}
                                    onCreateOption={async (val) => {
                                        const id = await handleCategoryCreation(val);
                                        if (id) field.onChange(id);
                                    }}
                                    placeholder="Select Category"
                                    onChange={(option) => field.onChange(option?.value)}
                                    value={
                                        categoryOptions.find(
                                            (opt: any) => opt.value === field.value
                                        ) || null
                                    }
                                    error={errors.trekCategoryId?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Trek Region */}
                    <div>
                        <Controller
                            control={control}
                            name="trekRegionId"
                            render={({ field }) => (
                                <SelectCreatable
                                    labelText="Trek Region"
                                    options={regionOptions}
                                    onCreateOption={async (val) => {
                                        const id = await handleRegionCreation(val);
                                        if (id) field.onChange(id);
                                    }}
                                    placeholder="Select Region"
                                    onChange={(option) => field.onChange(option?.value)}
                                    value={
                                        regionOptions.find(
                                            (opt: any) => opt.value === field.value
                                        ) || null
                                    }
                                    error={errors.trekRegionId?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Activity Type */}
                    <div>
                        <Controller
                            control={control}
                            name="activityTypeId"
                            render={({ field }) => (
                                <SelectCreatable
                                    labelText="Activity Type"
                                    options={activityTypeOptions}
                                    onCreateOption={async (val) => {
                                        const id = await handleActivityTypeCreation(val);
                                        if (id) field.onChange(id);
                                    }}
                                    placeholder="Select Activity Type"
                                    onChange={(option) => field.onChange(option?.value)}
                                    value={
                                        activityTypeOptions.find(
                                            (opt: any) => opt.value === field.value
                                        ) || null
                                    }
                                    error={errors.activityTypeId?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Activity Level */}
                    <div>
                        <Controller
                            control={control}
                            name="activityLevelId"
                            render={({ field }) => (
                                <SelectCreatable
                                    labelText="Activity Level"
                                    options={activityLevelOptions}
                                    onCreateOption={async (val) => {
                                        const id = await handleActivityLevelCreation(val);
                                        if (id) field.onChange(id);
                                    }}
                                    placeholder="Select Activity Level"
                                    onChange={(option) => field.onChange(option?.value)}
                                    value={
                                        activityLevelOptions.find(
                                            (opt: any) => opt.value === field.value
                                        ) || null
                                    }
                                    error={errors.activityLevelId?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Duration, Prices, Altitude */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <label htmlFor="durationDays" className="block text-xs font-medium text-gray-700 uppercase">
                            Duration (Days)
                        </label>
                        <input
                            type="number"
                            id="durationDays"
                            {...register("durationDays", { valueAsNumber: true, min: 1 })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., 14"
                        />
                    </div>

                    <div>
                        <label htmlFor="priceInUSD" className="block text-xs font-medium text-gray-700 uppercase">
                            Price (USD)
                        </label>
                        <input
                            type="number"
                            id="priceInUSD"
                            {...register("priceInUSD", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., 1200"
                        />
                    </div>

                    <div>
                        <label htmlFor="priceInNrs" className="block text-xs font-medium text-gray-700 uppercase">
                            Price (NPR)
                        </label>
                        <input
                            type="number"
                            id="priceInNrs"
                            {...register("priceInNrs", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., 150000"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="maxAltitudeMeters" className="block text-xs font-medium text-gray-700 uppercase">
                            Max Altitude (Meters)
                        </label>
                        <input
                            type="number"
                            id="maxAltitudeMeters"
                            {...register("maxAltitudeMeters", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., 5364"
                        />
                    </div>

                    <div>
                        <label htmlFor="maxAltitudeFeet" className="block text-xs font-medium text-gray-700 uppercase">
                            Max Altitude (Feet)
                        </label>
                        <input
                            type="number"
                            id="maxAltitudeFeet"
                            {...register("maxAltitudeFeet", { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., 17598"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Destination */}
                    <div>
                        <Controller
                            control={control}
                            name="destinationId"
                            render={({ field }) => (
                                <SelectCreatable
                                    labelText="Destination"
                                    options={destinationOptions}
                                    onCreateOption={async (val) => {
                                        const id = await handleDestinationCreation(val);
                                        if (id) field.onChange(id);
                                    }}
                                    placeholder="Select Destination"
                                    onChange={(option) => field.onChange(option?.value)}
                                    value={
                                        destinationOptions.find(
                                            (opt: any) => opt.value === field.value
                                        ) || null
                                    }
                                    error={errors.destinationId?.message}
                                />
                            )}
                        />
                    </div>
                    <div>

                        <Controller
                            name="baseAccommodationType"
                            control={control}
                            render={({ field }) => (
                                <MultiSelect
                                    label="Accommodation Type"
                                    options={accommodationOptions}
                                    defaultSelected={field.value ? field.value.split(',').map(s => s.trim()) : []}
                                    onChange={(selected) => field.onChange(selected.join(','))}
                                />
                            )}
                        />
                    </div>
                </div>



                {/* Overview Description */}
                <div>
                    <label htmlFor="overviewDescription" className="block text-xs font-medium text-gray-700 uppercase mb-2">
                        Overview Description
                    </label>
                    <Controller
                        name="overviewDescription"
                        control={control}
                        render={({ field }) => (
                            <Editor
                                apiKey="prsn1rfcskorh46nf7vvi1cmntpjwebj1krfdqfweex48c7k"
                                onInit={(_evt, editor) => (editorRef.current = editor)}
                                value={field.value}
                                onEditorChange={(content) => field.onChange(content)}
                                onBlur={field.onBlur}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                                        "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                                        "insertdatetime", "media", "table", "help", "wordcount"
                                    ],
                                    toolbar:
                                        "undo redo | blocks | " +
                                        "bold italic forecolor | alignleft aligncenter " +
                                        "alignright alignjustify | bullist numlist outdent indent | " +
                                        "removeformat | help",
                                    content_style:
                                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                }}
                            />
                        )}
                    />
                </div>

                {/* Accommodation Type */}


                {/* City IDs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Start City */}
                    <div>
                        <Controller
                            control={control}
                            name="startCityId"
                            render={({ field }) => (
                                <SelectCreatable
                                    labelText="Start City"
                                    options={cityOptions}
                                    onCreateOption={async (val) => {
                                        const id = await handleCityCreation(val);
                                        if (id) field.onChange(id);
                                    }}
                                    placeholder="Select Start City"
                                    onChange={(option) => field.onChange(option?.value)}
                                    value={
                                        cityOptions.find(
                                            (opt: any) => opt.value === field.value
                                        ) || null
                                    }
                                    error={errors.startCityId?.message}
                                />
                            )}
                        />
                    </div>

                    {/* End City */}
                    <div>
                        <Controller
                            control={control}
                            name="endCityId"
                            render={({ field }) => (
                                <SelectCreatable
                                    labelText="End City"
                                    options={cityOptions}
                                    onCreateOption={async (val) => {
                                        const id = await handleCityCreation(val);
                                        if (id) field.onChange(id);
                                    }}
                                    placeholder="Select End City"
                                    onChange={(option) => field.onChange(option?.value)}
                                    value={
                                        cityOptions.find(
                                            (opt: any) => opt.value === field.value
                                        ) || null
                                    }
                                    error={errors.endCityId?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Default Currency */}
                    <div>
                        <Controller
                            control={control}
                            name="defaultCurrencyId"
                            render={({ field }) => (
                                <SelectCreatable
                                    labelText="Default Currency"
                                    options={currencyOptions}
                                    onCreateOption={async (val) => {
                                        const id = await handleCurrencyCreation(val);
                                        if (id) field.onChange(id);
                                    }}
                                    placeholder="Select Currency"
                                    onChange={(option) => field.onChange(option?.value)}
                                    value={
                                        currencyOptions.find(
                                            (opt: any) => opt.value === field.value
                                        ) || null
                                    }
                                    error={errors.defaultCurrencyId?.message}
                                />
                            )}
                        />
                    </div>
                </div>
                {/* Starting & Ending Points */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="startingPoint" className="block text-xs font-medium text-gray-700 uppercase">
                            Starting Point
                        </label>
                        <input
                            type="text"
                            id="startingPoint"
                            {...register("startingPoint")}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., Lukla"
                        />
                    </div>

                    <div>
                        <label htmlFor="endingPoint" className="block text-xs font-medium text-gray-700 uppercase">
                            Ending Point
                        </label>
                        <input
                            type="text"
                            id="endingPoint"
                            {...register("endingPoint")}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            placeholder="e.g., Lukla"
                        />
                    </div>
                </div>
                {/* Is Active */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        {...register("isActive")}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                        Active
                    </label>
                </div>

                {/* Popular & Trending */}
                <div className="flex gap-6">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPopular"
                            {...register("isPopular")}
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <label htmlFor="isPopular" className="ml-2 text-sm text-gray-700">
                            Is Popular
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isTrending"
                            {...register("isTrending")}
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <label htmlFor="isTrending" className="ml-2 text-sm text-gray-700">
                            Is Trending
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInfoTab;
