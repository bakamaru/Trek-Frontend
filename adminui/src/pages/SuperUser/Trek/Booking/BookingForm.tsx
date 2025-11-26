import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import toaster from "../../../../components/toster";
import TextArea from "../../../../components/form/input/TextArea";
import { useGetBookingDetailQuery, useSaveBookingBasicMutation } from "../../../../redux/trek/bookingAPI";
import { BookingBasicSaveRequest } from "../../../../types/trekTypes";
import Select from "../../../../components/form/Select";

const BookingForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [bookingId, setBookingId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm<BookingBasicSaveRequest>({
        defaultValues: {
            bookingId: 0,
            userId: 0,
            trekId: 0,
            trekDepartureId: 0,
            bookingDate: new Date().toISOString(),
            bookingStatus: "PENDING",
            totalAmount: 0,
            currency: "USD",
            contactName: "",
            contactEmail: "",
            contactPhone: "",
            specialRequests: "",
        },
    });

    const [saveBookingBasic, { isLoading: isSaving }] = useSaveBookingBasicMutation();
    const { data: detailData, isSuccess } = useGetBookingDetailQuery(bookingId, { skip: !isEditMode || bookingId === 0 });

    useEffect(() => {
        if (location.pathname.includes("edit") && id) {
            setIsEditMode(true);
            setBookingId(parseInt(id, 10));
        } else {
            setIsEditMode(false);
            setBookingId(0);
        }
    }, [location, id]);

    useEffect(() => {
        if (isSuccess && detailData && detailData.code === 200) {
            reset({
                bookingId: detailData.data.bookingId,
                userId: detailData.data.userId,
                trekId: detailData.data.trekId,
                trekDepartureId: detailData.data.trekDepartureId,
                bookingDate: detailData.data.bookingDate,
                bookingStatus: detailData.data.bookingStatus,
                totalAmount: detailData.data.totalAmount,
                currency: detailData.data.currency,
                contactName: detailData.data.contactName,
                contactEmail: detailData.data.contactEmail,
                contactPhone: detailData.data.contactPhone,
                specialRequests: detailData.data.specialRequests,
            });
        }
    }, [detailData, reset, isSuccess]);

    const onSubmit = async (formData: BookingBasicSaveRequest) => {
        try {
            const apiData = {
                ...formData,
                bookingId: isEditMode ? bookingId : 0,
            };

            const response = await saveBookingBasic(apiData).unwrap();

            if (response.code == 200) {
                toaster.success("Booking saved successfully!");
                navigate("/superadmin/trek/booking");
            } else {
                toaster.error("Failed to save booking.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <ComponentCard title={`${isEditMode ? "Edit" : "New"} Booking`}>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                type="text"
                                id="contactName"
                                labelName="Contact Name"
                                placeholder="Contact Name"
                                {...register("contactName", { required: "Contact Name is required" })}
                                error={!!errors?.contactName}
                                errorMsg={errors?.contactName?.message}
                            />
                            <InputField
                                type="email"
                                id="contactEmail"
                                labelName="Contact Email"
                                placeholder="Contact Email"
                                {...register("contactEmail", { required: "Contact Email is required" })}
                                error={!!errors?.contactEmail}
                                errorMsg={errors?.contactEmail?.message}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                type="text"
                                id="contactPhone"
                                labelName="Contact Phone"
                                placeholder="Contact Phone"
                                {...register("contactPhone")}
                                error={!!errors?.contactPhone}
                                errorMsg={errors?.contactPhone?.message}
                            />
                            <Select
                                labelName="Status"
                                placeholder="Select Status"
                                options={[
                                    { label: "Pending", value: "PENDING" },
                                    { label: "Confirmed", value: "CONFIRMED" },
                                    { label: "Cancelled", value: "CANCELLED" },
                                    { label: "Completed", value: "COMPLETED" },
                                ]}
                                {...register("bookingStatus")}
                                error={!!errors?.bookingStatus}
                                errorMsg={errors?.bookingStatus?.message}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                type="number"
                                id="totalAmount"
                                labelName="Total Amount"
                                placeholder="Total Amount"
                                {...register("totalAmount", { valueAsNumber: true })}
                                error={!!errors?.totalAmount}
                                errorMsg={errors?.totalAmount?.message}
                            />
                            <InputField
                                type="text"
                                id="currency"
                                labelName="Currency"
                                placeholder="Currency"
                                {...register("currency")}
                                error={!!errors?.currency}
                                errorMsg={errors?.currency?.message}
                            />
                        </div>

                        <TextArea
                            id="specialRequests"
                            labelName="Special Requests"
                            placeholder="Special Requests"
                            error={!!errors?.specialRequests}
                            errorMsg={errors?.specialRequests?.message}
                            {...register("specialRequests")}
                        />

                        {/* Note: Trek and Departure selection would typically require dropdowns fetching from TrekAPI and DepartureAPI.
                For simplicity in this iteration, we are keeping them as basic inputs or hidden if auto-assigned.
                In a real scenario, you'd add Select components here.
            */}
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                type="number"
                                id="trekId"
                                labelName="Trek ID"
                                placeholder="Trek ID"
                                {...register("trekId", { valueAsNumber: true })}
                                error={!!errors?.trekId}
                                errorMsg={errors?.trekId?.message}
                            />
                            <InputField
                                type="number"
                                id="trekDepartureId"
                                labelName="Departure ID"
                                placeholder="Departure ID"
                                {...register("trekDepartureId", { valueAsNumber: true })}
                                error={!!errors?.trekDepartureId}
                                errorMsg={errors?.trekDepartureId?.message}
                            />
                        </div>

                    </ComponentCard>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/superadmin/trek/booking")}
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

export default BookingForm;
