import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../components/common/ComponentCard";
import InputField from "../../../components/form/input/InputField";
import toaster from "../../../components/toster";
import { useGetGrantDetailsQuery, useCreateGrantMutation, useUpdateGrantMutation, useGetApplicationsQuery } from "../../../redux/setting/clientAPI";
import { CreateGrantRequest, UpdateGrantRequest } from "../../../redux/setting/clientAPI";

const GrantForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [grantId, setGrantId] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<CreateGrantRequest>({
        defaultValues: {
            subject: "",
            status: "valid",
            applicationId: "",
            scopes: [],
        },
    });

    const [createGrant, { isLoading: isCreating }] = useCreateGrantMutation();
    const [updateGrant, { isLoading: isUpdating }] = useUpdateGrantMutation();
    const { data: detailData, isSuccess } = useGetGrantDetailsQuery(grantId, { skip: !isEditMode || !grantId });
    const { data: applicationsData } = useGetApplicationsQuery({ offset: 1, limit: 100, search: "" });

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setGrantId(id);
        } else {
            setIsEditMode(false);
            setGrantId("");
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData) {
            reset({
                subject: detailData.subject || "",
                status: detailData.status || "valid",
                applicationId: "",
                scopes: detailData.scopes || [],
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: CreateGrantRequest) => {
        try {
            if (isEditMode) {
                const updateData: UpdateGrantRequest = {
                    id: grantId,
                    status: formData.status || "valid",
                };
                const response = await updateGrant(updateData).unwrap();
                toaster.success("Grant updated successfully!");
            } else {
                const response = await createGrant(formData).unwrap();
                toaster.success("Grant created successfully!");
            }
            navigate("/admin/openiddict/grant");
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    const isSaving = isCreating || isUpdating;

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Grant`}>
                        <InputField
                            type="text"
                            id="subject"
                            labelName="Subject"
                            placeholder="Subject (User ID, Email, etc.)"
                            {...register("subject", { required: "Subject is required" })}
                            error={!!errors?.subject}
                            errorMsg={errors?.subject?.message}
                            disabled={isEditMode}
                        />


                        <div className="relative">
                            <div className="w-full px-2.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Application
                                </label>
                                <select
                                    {...register("applicationId")}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-brand-500/50 outline-none"
                                    disabled={isEditMode}
                                >
                                    <option value="">Select Application (Optional)</option>
                                    {applicationsData?.Data?.Rows?.map((app: any) => (
                                        <option key={app.Id} value={app.Id}>
                                            {app.DisplayName || app.ClientId}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="w-full px-2.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <select
                                    {...register("status")}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-brand-500/50 outline-none"
                                >
                                    <option value="valid">Valid</option>
                                    <option value="revoked">Revoked</option>
                                </select>
                            </div>
                        </div>
                        <InputField
                            type="text"
                            id="scopes"
                            labelName="Scopes (comma-separated)"
                            placeholder="openid, profile, email"
                            {...register("scopes", {
                                setValueAs: (v) => {
                                    // If it's already an array, return it as-is
                                    if (Array.isArray(v)) return v;
                                    // If it's a string, split it
                                    if (typeof v === 'string' && v) {
                                        return v.split(",").map((s: string) => s.trim());
                                    }
                                    // Otherwise return empty array
                                    return [];
                                },
                            })}
                            error={!!errors?.scopes}
                            errorMsg={errors?.scopes?.message}
                            disabled={isEditMode}
                        />

                        {isEditMode && (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    Note: Only status can be updated in edit mode. Subject, Application, and Scopes cannot be changed.
                                </p>
                            </div>
                        )}
                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/openiddict/grant")}
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

export default GrantForm;
