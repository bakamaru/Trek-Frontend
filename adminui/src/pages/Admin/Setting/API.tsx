import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import ComponentCard from "../../../components/common/ComponentCard";
import Checkbox from "../../../components/form/input/Checkbox";
import toaster from "../../../components/toster";
import { useGetApiConfigQuery, useSaveApiConfigMutation } from "../../../redux/setting/settingAPI";
import { ApiConfig } from "../../../types/settingTypes";

const API = () => {
    const { data: apiResponse, isSuccess } = useGetApiConfigQuery();
    const [saveApiConfig, { isLoading: isSaving }] = useSaveApiConfigMutation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
    } = useForm<ApiConfig>({
        defaultValues: {
            UseEncryption: false,
            UseObfusication: false,
        },
    });

    // Watch both fields to handle mutual exclusion
    const useEncryption = watch("UseEncryption");
    const useObfusication = watch("UseObfusication");

    // Load initial data
    useEffect(() => {
        if (isSuccess && apiResponse?.Data) {
            reset({
                UseEncryption: apiResponse.Data.UseEncryption,
                UseObfusication: apiResponse.Data.UseObfusication,
            });
        }
    }, [isSuccess, apiResponse, reset]);

    // Handle mutual exclusion
    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === "UseEncryption" && value.UseEncryption) {
                setValue("UseObfusication", false);
            }
            if (name === "UseObfusication" && value.UseObfusication) {
                setValue("UseEncryption", false);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    const onSubmit = async (data: ApiConfig) => {
        try {
            const response = await saveApiConfig(data).unwrap();
            if (response.Code === 200) {
                toaster.success("API Configuration saved successfully!");
            } else {
                toaster.error("Failed to save API Configuration.");
            }
        } catch (error: any) {
            toaster.error(error?.data?.Message || "An error occurred.");
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            <ComponentCard title="API Configuration">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Checkbox
                            label="Use Encryption"
                            {...register("UseEncryption")}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Encrypt API JSON payload.
                        </p>
                    </div>

                    <div>
                        <Checkbox
                            label="Use Obfuscation"
                            {...register("UseObfusication")}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Obfuscate API JSON payload.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-75"
                        >
                            {isSaving ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    Saving...
                                </>
                            ) : (
                                "Save"
                            )}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default API;
