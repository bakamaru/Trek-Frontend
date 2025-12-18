import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import ComponentCard from "../../../components/common/ComponentCard";
import Checkbox from "../../../components/form/input/Checkbox";
import toaster from "../../../components/toster";
import { useGetBasicSecurityConfigQuery, useSaveBasicSecurityConfigMutation } from "../../../redux/setting/settingAPI";
import { AppBasicSecurity } from "../../../types/settingTypes";

const Basic = () => {
    const { data: apiResponse, isSuccess } = useGetBasicSecurityConfigQuery();
    const [saveBasicConfig, { isLoading: isSaving }] = useSaveBasicSecurityConfigMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AppBasicSecurity>({
        defaultValues: {
            RequireOTP: false,
            RequireDeviceVerification: false,
            OTPExpiryTimeInMinutes: 5,
            SendOTPFromEmail: false,
            SendOTPFromSMS: false,
            PasswordLength: 6,
            RequireNonAlphanumeric: false,
            RequireUppercase: false,
            RequireConfirmedEmail: false,
        },
    });

    useEffect(() => {
        if (isSuccess && apiResponse?.Data) {
            reset(apiResponse.Data);
        }
    }, [isSuccess, apiResponse, reset]);

    const onSubmit = async (data: AppBasicSecurity) => {
        try {
            const response = await saveBasicConfig(data).unwrap();
            if (response.Code === 200) {
                toaster.success("Basic Security Configuration saved successfully!");
            } else {
                toaster.error("Failed to save Basic Security Configuration.");
            }
        } catch (error: any) {
            toaster.error(error?.data?.Message || "An error occurred.");
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            <ComponentCard title="Basic Security Configuration">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* OTP & Device Section */}
                    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <h3 className="mb-4 font-semibold text-black dark:text-white">OTP & Device</h3>
                        <div className="space-y-4">
                            <div>
                                <Checkbox label="Require OTP" {...register("RequireOTP")} />
                            </div>
                            <div>
                                <Checkbox label="Require Device Verification" {...register("RequireDeviceVerification")} />
                            </div>
                            <div>
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    OTP Expiry Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    {...register("OTPExpiryTimeInMinutes", { valueAsNumber: true, min: 1 })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                {errors.OTPExpiryTimeInMinutes && (
                                    <span className="text-sm text-red-500">Value must be at least 1 minute.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* OTP Delivery Section */}
                    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <h3 className="mb-4 font-semibold text-black dark:text-white">OTP Delivery</h3>
                        <div className="space-y-4">
                            <div>
                                <Checkbox label="Send OTP via Email" {...register("SendOTPFromEmail")} />
                            </div>
                            <div>
                                <Checkbox label="Send OTP via SMS" {...register("SendOTPFromSMS")} />
                            </div>
                        </div>
                    </div>

                    {/* Password Policy Section */}
                    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <h3 className="mb-4 font-semibold text-black dark:text-white">Password Policy</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Minimum Password Length
                                </label>
                                <input
                                    type="number"
                                    min="4"
                                    {...register("PasswordLength", { valueAsNumber: true, min: 4 })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                {errors.PasswordLength && (
                                    <span className="text-sm text-red-500">Password length must be at least 4.</span>
                                )}
                            </div>
                            <div>
                                <Checkbox label="Require Non-Alphanumeric Character" {...register("RequireNonAlphanumeric")} />
                            </div>
                            <div>
                                <Checkbox label="Require Uppercase Letter" {...register("RequireUppercase")} />
                            </div>
                            <div>
                                <Checkbox label="Require Confirmed Email" {...register("RequireConfirmedEmail")} />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
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

export default Basic;
