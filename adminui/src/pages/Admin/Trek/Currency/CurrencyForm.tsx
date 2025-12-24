import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import Checkbox from "../../../../components/form/input/Checkbox";
import toaster from "../../../../components/toster";
import { useGetCurrencyByIdQuery, useSaveCurrencyMutation } from "../../../../redux/trek/currencyAPI";
import { CurrencySaveRequest } from "../../../../types/trekTypes";

const CurrencyForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currencyId, setCurrencyId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<CurrencySaveRequest>({
        defaultValues: {
            currencyId: 0,
            code: "",
            name: "",
            symbol: "",
            decimalPlaces: 2,
            isSystem: false,
            isActive: true,
        },
    });

    const [saveCurrency, { isLoading: isSaving }] = useSaveCurrencyMutation();
    const { data: detailData, isSuccess } = useGetCurrencyByIdQuery(currencyId, { skip: !isEditMode || currencyId === 0 });

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setCurrencyId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setCurrencyId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.Code === 200) {
            reset({
                currencyId: detailData.Data.CurrencyId,
                code: detailData.Data.Code,
                name: detailData.Data.Name,
                symbol: detailData.Data.Symbol,
                decimalPlaces: detailData.Data.DecimalPlaces,
                isSystem: detailData.Data.IsSystem,
                isActive: detailData.Data.IsActive,
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: CurrencySaveRequest) => {
        try {
            const apiData = {
                ...formData,
                currencyId: isEditMode ? currencyId : 0,
            };

            const response = await saveCurrency(apiData).unwrap();

            if (response.Code == 200) {
                toaster.success("Currency saved successfully!");
                navigate("/superadmin/trek/currency");
            } else {
                toaster.error("Failed to save currency.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Currency`}>
                        <InputField
                            type="text"
                            id="name"
                            labelName="Name"
                            placeholder="Name"
                            {...register("name", { required: "Name is required" })}
                            error={!!errors?.name}
                            errorMsg={errors?.name?.message}
                        />

                        <InputField
                            type="text"
                            id="code"
                            labelName="Code"
                            placeholder="Code (e.g. USD)"
                            {...register("code", { required: "Code is required" })}
                            error={!!errors?.code}
                            errorMsg={errors?.code?.message}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                type="text"
                                id="symbol"
                                labelName="Symbol"
                                placeholder="Symbol (e.g. $)"
                                {...register("symbol")}
                                error={!!errors?.symbol}
                                errorMsg={errors?.symbol?.message}
                            />
                            <InputField
                                type="number"
                                id="decimalPlaces"
                                labelName="Decimal Places"
                                placeholder="Decimal Places"
                                {...register("decimalPlaces", { valueAsNumber: true })}
                                error={!!errors?.decimalPlaces}
                                errorMsg={errors?.decimalPlaces?.message}
                            />
                        </div>

                        <Checkbox label="Active" {...register("isActive")} />
                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/superadmin/trek/currency")}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white "
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default CurrencyForm;
