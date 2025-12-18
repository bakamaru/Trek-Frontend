import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ComponentCard from "../../../components/common/ComponentCard";
import toaster from "../../../components/toster";
import Switch from "../../../components/form/switch/Switch";
import InputField from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import { useGetWebSettingQuery, useSaveWebSettingMutation } from "../../../redux/setting/settingAPI";
import { WebSetting } from "../../../types/settingTypes";

const Web = () => {
    const { data: apiResponse, isSuccess, isLoading } = useGetWebSettingQuery();
    const [saveWebSetting, { isLoading: isSaving }] = useSaveWebSettingMutation();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm<WebSetting>({
        defaultValues: {
            UseHttps: false,
            Lattitude: 0,
            Longitude: 0,
        }
    });

    useEffect(() => {
        if (isSuccess && apiResponse?.Data) {
            reset(apiResponse.Data);
            // Handle existing logo for preview if available and not a file object yet
            if (apiResponse.Data.Logo && typeof apiResponse.Data.Logo === 'string') {
                const cdnPath = import.meta.env.VITE_CDN_PATH || "";
                setLogoPreview(cdnPath + apiResponse.Data.Logo);
            }
        }
    }, [isSuccess, apiResponse, reset]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("LogoFile", file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: WebSetting) => {
        try {
            const response = await saveWebSetting(data).unwrap();
            if (response.Code === 200) {
                toaster.success("Web Settings saved successfully!");
            } else {
                toaster.error(response.Message || "Failed to save Web Settings.");
            }
        } catch (error: any) {
            toaster.error(error?.data?.Message || "An error occurred.");
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 gap-4">
            <ComponentCard title="Web Settings">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">

                    {/* Section 1: Configuration */}
                    <div className="border-b border-stroke pb-6 dark:border-strokedark">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-black dark:text-white">Configuration</h3>
                            <p className="text-sm text-gray-500">Configure global website settings.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="col-span-2">
                                <InputField
                                    labelName="Website Name"
                                    placeholder="Enter Website Name"
                                    {...register("WebsiteName", { required: "Website Name is required" })}
                                    error={!!errors.WebsiteName}
                                    errorMsg={errors.WebsiteName?.message}
                                />
                            </div>

                            <div className="col-span-2">
                                <TextArea
                                    labelName="Description"
                                    rows={4}
                                    placeholder="Enter Website Description"
                                    {...register("Description")}
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                    Logo
                                </label>
                                {logoPreview && (
                                    <div className="mb-4">
                                        <img src={logoPreview} alt="Logo Preview" className="h-20 w-auto object-contain border border-stroke rounded p-2" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Locality */}
                    <div className="border-b border-stroke pb-6 dark:border-strokedark">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-black dark:text-white">Locality</h3>
                            <p className="text-sm text-gray-500">Configure culture and currency settings.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <InputField
                                    labelName="Base Culture"
                                    placeholder="e.g. en-US"
                                    {...register("BaseCulture", { required: "Base Culture is required" })}
                                    error={!!errors.BaseCulture}
                                    errorMsg={errors.BaseCulture?.message}
                                />
                            </div>

                            <div>
                                <InputField
                                    labelName="Base Currency"
                                    placeholder="e.g. USD"
                                    {...register("BaseCurrency", { required: "Base Currency is required" })}
                                    error={!!errors.BaseCurrency}
                                    errorMsg={errors.BaseCurrency?.message}
                                />
                            </div>

                            <div>
                                <InputField
                                    labelName="Currency Code"
                                    placeholder="e.g. $"
                                    {...register("CurrencyCode", { required: "Currency Code is required" })}
                                    error={!!errors.CurrencyCode}
                                    errorMsg={errors.CurrencyCode?.message}
                                />
                            </div>

                            <div>
                                <InputField
                                    labelName="Time Zone Offset"
                                    placeholder="e.g. +05:45"
                                    {...register("TimeZoneOffset")}
                                />
                            </div>

                            <div className="col-span-2">
                                <InputField
                                    labelName="Time Zone Name"
                                    placeholder="e.g. Nepal Standard Time"
                                    {...register("TimeZoneName", { required: "Time Zone Name is required" })}
                                    error={!!errors.TimeZoneName}
                                    errorMsg={errors.TimeZoneName?.message}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Location */}
                    <div className="border-b border-stroke pb-6 dark:border-strokedark">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-black dark:text-white">Location</h3>
                            <p className="text-sm text-gray-500">Configure physical address and coordinates.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="col-span-1 md:col-span-1">
                                <InputField
                                    labelName="Address 1"
                                    placeholder="Address Line 1"
                                    {...register("Address1")}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-1">
                                <InputField
                                    labelName="Address 2"
                                    placeholder="Address Line 2"
                                    {...register("Address2")}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-1">
                                <InputField
                                    labelName="City"
                                    placeholder="City"
                                    {...register("City")}
                                />
                            </div>

                            <div className="col-span-1 md:col-span-1">
                                <InputField
                                    labelName="State"
                                    placeholder="State"
                                    {...register("State")}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-1">
                                <InputField
                                    labelName="Country"
                                    placeholder="Country"
                                    {...register("Country")}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-1 hidden md:block"></div> {/* Spacer */}

                            <div className="col-span-1 md:col-span-1">
                                <InputField
                                    type="text"
                                    labelName="Latitude"
                                    placeholder="Latitude"
                                    {...register("Lattitude", { valueAsNumber: true })}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-1">
                                <InputField

                                    type="text"
                                    labelName="Longitude"
                                    placeholder="Longitude"
                                    {...register("Longitude", { valueAsNumber: true })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Other */}
                    <div className="border-b border-stroke pb-6 dark:border-strokedark">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-black dark:text-white">Other</h3>
                            <p className="text-sm text-gray-500">Configure email and security settings.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="col-span-2">
                                <InputField
                                    type="email"
                                    labelName="Default Email"
                                    placeholder="e.g. info@example.com"
                                    {...register("DefaultEmail", {
                                        required: "Default Email is required",
                                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                    })}
                                    error={!!errors.DefaultEmail}
                                    errorMsg={errors.DefaultEmail?.message}
                                />
                            </div>
                            <div className="col-span-2">
                                <InputField
                                    type="email"
                                    labelName="Support Email"
                                    placeholder="e.g. support@example.com"
                                    {...register("SupportEmail")}
                                />
                            </div>
                            <div className="col-span-2">
                                <InputField
                                    type="email"
                                    labelName="Sales Email"
                                    placeholder="e.g. sales@example.com"
                                    {...register("SalesEmail")}
                                />
                            </div>
                            <div className="col-span-2">
                                <InputField
                                    type="email"
                                    labelName="Marketing Email"
                                    placeholder="e.g. marketing@example.com"
                                    {...register("MarketingEmail")}
                                />
                            </div>

                            <div className="col-span-2">
                                <TextArea
                                    labelName="Google Analytic Script"
                                    rows={4}
                                    placeholder="Enter script here"
                                    {...register("GoogleAnalyticScript")}
                                />
                            </div>

                            <div className="col-span-2">
                                <div className="flex items-center gap-3">
                                    <label className="font-medium text-black dark:text-white">
                                        Use HTTPS
                                    </label>
                                    <Controller
                                        control={control}
                                        name="UseHttps"
                                        render={({ field: { value, onChange } }) => (
                                            <Switch
                                                label=""
                                                checked={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-75"
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

export default Web;
