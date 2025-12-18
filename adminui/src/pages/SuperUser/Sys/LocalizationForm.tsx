import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import toaster from "../../../components/toster";
import InputField from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox"; // Using Checkbox to match PostCategoryForm
import { MdCheck, MdClose, MdEdit } from "react-icons/md";
import {
    useGetCountriesQuery,
    useCreateRegionMutation,
    useGetRegionQuery,
    useGetResourcesQuery,
    useSaveLocaleResourceMutation,
} from "../../../redux/setting/localizationAPI";
import { LocaleRegion, LocaleResource } from "../../../types/settingTypes";

const LocalizationForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const regionId = id ? parseInt(id) : 0;

    // --- State & API Hooks ---
    const { data: countriesData } = useGetCountriesQuery();
    const { data: regionResponse, isSuccess: isRegionLoaded } = useGetRegionQuery(regionId, { skip: !isEditMode });

    // Pagination state for resources
    const [pageNo, setPageNo] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const limit = 20;

    const { data: resourcesData, refetch: refetchResources } = useGetResourcesQuery(
        { localRegionId: regionId, pageNo, limit, query: searchTerm },
        { skip: !isEditMode }
    );

    const [createRegion, { isLoading: isCreating }] = useCreateRegionMutation();
    const [saveResource] = useSaveLocaleResourceMutation();

    // --- Form Setup ---
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<LocaleRegion>({
        defaultValues: {
            IsActive: true,
            IsDefault: false,
        },
    });

    // Populate form in Edit Mode
    useEffect(() => {
        if (isEditMode && isRegionLoaded && regionResponse?.Data) {
            reset(regionResponse.Data);
        }
    }, [isEditMode, isRegionLoaded, regionResponse, reset]);


    // --- Handlers ---
    const onSubmitRegion = async (data: LocaleRegion) => {
        if (isEditMode) {
            // See previous note: specific update endpoint logic might be needed or handled via create
            // Assuming createRegion or similar logic for now or just informative as per previous code
            // But to match UI request, I'll keep the handler structure.
            toaster.info("Region update logic placeholder.");
        } else {
            try {
                const res = await createRegion(data).unwrap();
                if (res.Code === 200) {
                    toaster.success("Region created successfully");
                    navigate("/superadmin/setting/localization");
                } else {
                    toaster.error(res.Message || "Failed to create region");
                }
            } catch (err: any) {
                toaster.error(err?.data?.Message || "Error creating region");
            }
        }
    };

    // --- Resource Inline Edit Logic ---
    const [editingResourceId, setEditingResourceId] = useState<number | null>(null);
    const [tempValue, setTempValue] = useState("");

    const startEditing = (resource: LocaleResource) => {
        setEditingResourceId(resource.LocaleResourceId);
        setTempValue(resource.Value);
    };

    const cancelEditing = () => {
        setEditingResourceId(null);
        setTempValue("");
    };

    const saveEditing = async (resource: LocaleResource) => {
        try {
            const payload = { ...resource, Value: tempValue, LocaleRegionId: regionId };
            const res = await saveResource(payload).unwrap();
            if (res.Code === 200) {
                toaster.success("Resource updated");
                setEditingResourceId(null);
                refetchResources();
            } else {
                toaster.error(res.Message || "Update failed");
            }
        } catch (err: any) {
            toaster.error(err?.data?.Message || "Error updating resource");
        }
    };


    return (
        <>
            <form onSubmit={handleSubmit(onSubmitRegion)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {/* Region Details Section */}
                    <ComponentCard title={isEditMode ? "Edit Locale Region" : "New Locale Region"}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Country <span className="text-meta-1">*</span>
                                </label>
                                <Controller
                                    name="CountryId"
                                    control={control}
                                    rules={{ required: "Country is required" }}
                                    render={({ field }) => (
                                        <ReactSelect
                                            {...field}
                                            options={countriesData?.Data?.map((c) => ({ label: c.Name, value: c.CountryId })) || []}
                                            value={
                                                countriesData?.Data
                                                    ?.map((c) => ({ label: c.Name, value: c.CountryId }))
                                                    .find((c) => c.value === field.value) || null
                                            }
                                            onChange={(val) => field.onChange(val?.value)}
                                            isDisabled={isEditMode}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                        />
                                    )}
                                />
                                {errors.CountryId && (
                                    <span className="mt-1 block text-sm text-danger">{errors.CountryId.message}</span>
                                )}
                            </div>

                            <InputField
                                labelName="Culture"
                                placeholder="e.g. en-US"
                                {...register("Culture", { required: "Culture is required" })}
                                error={!!errors.Culture}
                                errorMsg={errors.Culture?.message}
                                disabled={isEditMode}
                            />
                        </div>

                        <div className="mt-4 flex gap-6">
                            <Checkbox label="Is Active" {...register("IsActive")} disabled={false} />
                            {/* Is Default can be added if needed, kept hidden/readonly as per previous code logic or requirement */}
                        </div>

                    </ComponentCard>
                </div>

                {/* Buttons matching PostCategoryForm */}
                {!isEditMode && (
                    <div className="mt-3 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/superadmin/setting/localization")}
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
                            disabled={isCreating}
                        >
                            {isCreating ? "Saving..." : "Save"}
                        </button>
                    </div>
                )}
            </form>

            {/* Resources Section (Only in Edit Mode) - kept as card below */}
            {isEditMode && (
                <div className="mt-6">
                    <ComponentCard title="Localized Resources">
                        <div className="p-4">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="grid grid-cols-[35%_25%_25%_15%] border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
                                    <div className="flex items-center"><p className="font-medium">Key</p></div>
                                    <div className="flex items-center"><p className="font-medium">Base Value</p></div>
                                    <div className="flex items-center"><p className="font-medium">Local Value</p></div>
                                    <div className="flex items-center justify-end"><p className="font-medium">Action</p></div>
                                </div>

                                {resourcesData?.Data?.length ?? 0 > 0 ? (
                                    resourcesData?.Data?.map((resource: LocaleResource) => (
                                        <div
                                            key={resource.LocaleResourceId}
                                            className="grid grid-cols-[35%_25%_25%_15%] border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5 items-center hover:bg-gray-50 dark:hover:bg-meta-4"
                                        >
                                            <div className="break-all pr-2">
                                                <p className="text-sm font-bold text-black dark:text-white">{resource.Name}</p>
                                                <p className="text-xs text-gray-500">({resource.GroupName})</p>
                                            </div>
                                            <div className="break-all pr-2">
                                                <p className="text-sm text-black dark:text-white">{resource.BaseValue}</p>
                                            </div>
                                            <div className="p-2">
                                                {editingResourceId === resource.LocaleResourceId ? (
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        value={tempValue}
                                                        onChange={(e) => setTempValue(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                saveEditing(resource);
                                                            }
                                                        }}
                                                        className="w-full rounded border-[1.5px] border-primary bg-white py-1 px-2 font-medium outline-none transition dark:bg-meta-4"
                                                    />
                                                ) : (
                                                    <div
                                                        className="group flex items-center justify-between cursor-pointer rounded border border-stroke border-dashed px-3 py-1.5 hover:border-primary hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4 transition-all duration-300"
                                                        onClick={() => startEditing(resource)}
                                                    >
                                                        <span className={`${!resource.Value ? 'text-gray-400 italic' : 'text-black dark:text-white'} truncate`}>
                                                            {resource.Value || "Click to edit"}
                                                        </span>
                                                        <MdEdit className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                {editingResourceId === resource.LocaleResourceId ? (
                                                    <>
                                                        <button
                                                            onClick={() => saveEditing(resource)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success hover:bg-success hover:text-white transition-all"
                                                            title="Save"
                                                        >
                                                            <MdCheck size={18} />
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all"
                                                            title="Cancel"
                                                        >
                                                            <MdClose size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => startEditing(resource)} className="text-primary hover:underline self-center p-2">
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="border-t border-stroke py-8 text-center text-gray-500 dark:border-strokedark dark:text-gray-400">
                                        <p>No data found</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex justify-between p-4">
                                <button
                                    disabled={pageNo <= 1}
                                    onClick={() => setPageNo(p => p - 1)}
                                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span>Page {pageNo}</span>
                                <button
                                    disabled={!resourcesData?.Data || resourcesData.Data.length < limit}
                                    onClick={() => setPageNo(p => p + 1)}
                                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
            )}
        </>
    );
};

export default LocalizationForm;
