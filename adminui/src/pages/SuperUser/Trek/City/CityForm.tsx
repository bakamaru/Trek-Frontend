import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import Checkbox from "../../../../components/form/input/Checkbox";
import toaster from "../../../../components/toster";
import { useGetCityByIdQuery, useSaveCityMutation } from "../../../../redux/trek/cityAPI";
import { CitySaveRequest } from "../../../../types/trekTypes";

const CityForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cityId, setCityId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<CitySaveRequest>({
        defaultValues: {
            cityId: 0,
            countryId: 1, // Default to 1 for now, or add Country dropdown
            name: "",
            stateProvince: "",
            latitude: 0,
            longitude: 0,
            isSystem: false,
            isActive: true,
        },
    });

    const [saveCity, { isLoading: isSaving }] = useSaveCityMutation();
    const { data: detailData, isSuccess } = useGetCityByIdQuery(cityId, { skip: !isEditMode || cityId === 0 });

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setCityId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setCityId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.code === 200) {
            reset({
                cityId: detailData.data.cityId,
                countryId: detailData.data.countryId,
                name: detailData.data.name,
                stateProvince: detailData.data.stateProvince,
                latitude: detailData.data.latitude,
                longitude: detailData.data.longitude,
                isSystem: detailData.data.isSystem,
                isActive: detailData.data.isActive,
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: CitySaveRequest) => {
        try {
            const apiData = {
                ...formData,
                cityId: isEditMode ? cityId : 0,
            };

            const response = await saveCity(apiData).unwrap();

            if (response.code == 200) {
                toaster.success("City saved successfully!");
                navigate("/superadmin/trek/city");
            } else {
                toaster.error("Failed to save city.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} City`}>
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
                            id="stateProvince"
                            labelName="State/Province"
                            placeholder="State/Province"
                            {...register("stateProvince")}
                            error={!!errors?.stateProvince}
                            errorMsg={errors?.stateProvince?.message}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                type="number"
                                id="latitude"
                                labelName="Latitude"
                                placeholder="Latitude"
                                {...register("latitude", { valueAsNumber: true })}
                                error={!!errors?.latitude}
                                errorMsg={errors?.latitude?.message}
                            />
                            <InputField
                                type="number"
                                id="longitude"
                                labelName="Longitude"
                                placeholder="Longitude"
                                {...register("longitude", { valueAsNumber: true })}
                                error={!!errors?.longitude}
                                errorMsg={errors?.longitude?.message}
                            />
                        </div>

                        <Checkbox label="Active" {...register("isActive")} />
                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/superadmin/trek/city")}
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

export default CityForm;
