import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSaveBookingEmergencyMutation, useGetBookingDetailQuery } from "../../../redux/trek/bookingAPI";
import toaster from "../../toster";
import { BookingEmergencyContactSaveRequest } from "../../../types/trekTypes";

interface EmergencyContactsTabProps {
    bookingId: number;
}

const EmergencyContactsTab: React.FC<EmergencyContactsTabProps> = ({ bookingId }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingEmergencyContactSaveRequest>();

    // We need to fetch the detail again or pass it down. 
    // Ideally pass it down, but for now I'll use the hook cache or just refetch.
    // Assuming `bookingId` is passed and we can get data from `useGetBookingDetailQuery`.
    const { data: detailData } = useGetBookingDetailQuery(bookingId);

    const [saveEmergency, { isLoading }] = useSaveBookingEmergencyMutation();

    useEffect(() => {
        if (detailData && detailData.Code === 200 && detailData.Data.EmergencyContact) {
            const ec = detailData.Data.EmergencyContact;
            // Map API response to form fields (PascalCase to camelCase if needed, but the interface seems to use camelCase for properties except the API response usually comes in PascalCase... wait.
            // trekTypes.ts shows BookingEmergencyContactSaveRequest properties as camelCase (firstName, etc).
            // But API response `detailData.Data` usually has PascalCase. 
            // I need to map PascalCase response to camelCase form fields.
            reset({
                emergencyContactId: ec.EmergencyContactId,
                bookingId: bookingId,
                firstName: ec.FirstName,
                middleName: ec.MiddleName,
                lastName: ec.LastName,
                address: ec.Address,
                city: ec.City,
                zip: ec.Zip,
                country: ec.Country,
                relationShip: ec.RelationShip,
                email: ec.Email,
                homePhoneNumber: ec.HomePhoneNumber,
                personalNumber: ec.PersonalNumber,
            });
        }
    }, [detailData, bookingId, reset]);

    const onSubmit: SubmitHandler<BookingEmergencyContactSaveRequest> = async (data) => {
        try {
            const payload = { ...data, bookingId }; // Ensure bookingId is present
            const response: any = await saveEmergency({ bookingId, data: payload }).unwrap();
            if (response.Code === 200) {
                toaster.success("Emergency contact saved successfully");
            } else {
                toaster.error(response.Message || "Failed to save");
            }
        } catch (error) {
            toaster.error("Failed to save emergency contact");
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact Information</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                            {...register("firstName", { required: "First Name is required" })}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                        <input
                            {...register("middleName")}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                            {...register("lastName", { required: "Last Name is required" })}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                        <input
                            {...register("relationShip")}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Home Phone</label>
                        <input
                            {...register("homePhoneNumber")}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Personal Phone</label>
                        <input
                            {...register("personalNumber")}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            {...register("address")}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            {...register("city")}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
                        <input
                            {...register("zip")}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                            {...register("country")}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Save Emergency Contact"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmergencyContactsTab;
