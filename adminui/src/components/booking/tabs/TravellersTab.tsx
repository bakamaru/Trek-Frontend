import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSaveBookingTravellersMutation, useSaveBookingHealthMutation, useGetBookingDetailQuery } from "../../../redux/trek/bookingAPI";
import toaster from "../../toster";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { BookingTravellerSaveRequest, BookingHealthInfoSaveRequest } from "../../../types/trekTypes";

interface TravellersTabProps {
    bookingId: number;
}

// Combined interface for the form
interface CombinedTravellerFormData extends BookingTravellerSaveRequest, Omit<BookingHealthInfoSaveRequest, 'bookingTravellerId'> {
    // UI specific
    tempId?: string; // For identifying new unsaved items locally
}

const TravellersTab: React.FC<TravellersTabProps> = ({ bookingId }) => {
    // Local state to hold the list of travellers (merged data)
    const [travellersList, setTravellersList] = useState<CombinedTravellerFormData[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // API hooks
    const { data: detailData, refetch } = useGetBookingDetailQuery(bookingId);
    const [saveTravellers, { isLoading: isSavingTravellers }] = useSaveBookingTravellersMutation();
    const [saveHealth, { isLoading: isSavingHealth }] = useSaveBookingHealthMutation();

    // Form hook
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CombinedTravellerFormData>({
        defaultValues: {
            travellerType: "ADULT",
            gender: "MALE",
            fitnessLevel: "MODERATE",
            clearedForTrek: false
        } as any
    });

    // Load data from API and merge
    useEffect(() => {
        if (detailData && detailData.Code === 200 && detailData.Data) {
            const backendTravellers: any[] = detailData.Data.Travellers || [];
            const backendHealth: any[] = detailData.Data.HealthInfos || [];

            const merged: CombinedTravellerFormData[] = backendTravellers.map((t) => {
                // Find matching health info
                const h = backendHealth.find((hi) => hi.BookingTravellerId === t.BookingTravellerId) || {};

                // Map to our combined interface (PascalCase from API to camelCase for form if needed, OR just match what save expects)
                // The Save interfaces use camelCase properties (firstName, etc).
                // The API response `t` has PascalCase (FirstName, etc) based on previous files.
                return {
                    bookingTravellerId: t.BookingTravellerId,
                    bookingId: t.BookingId,
                    firstName: t.FirstName,
                    lastName: t.LastName,
                    gender: t.Gender,
                    dob: t.Dob ? t.Dob.split('T')[0] : "",
                    nationality: t.Nationality,
                    passportNumber: t.PassportNumber,
                    passportIssuedDate: t.PassportIssuedDate ? t.PassportIssuedDate.split('T')[0] : "",
                    passportExpiryDate: t.PassportExpiryDate ? t.PassportExpiryDate.split('T')[0] : "",
                    travellerType: t.TravellerType,

                    // Health fields
                    bookingHealthInfoId: h.BookingHealthInfoId,
                    medicalConditions: h.MedicalConditions,
                    allergies: h.Allergies,
                    fitnessLevel: h.FitnessLevel || "MODERATE",
                    insuranceProvider: h.InsuranceProvider,
                    insurancePolicyNo: h.InsurancePolicyNo,
                    emergencyNotes: h.EmergencyNotes,
                    // Extra field not in Interface but in UI? 'clearedForTrek' was in HealthTab. 
                    // It's not in BookingHealthInfoSaveRequest in trekTypes.ts. I'll check if I should persist it.
                    // Assuming no for now or mapped to something else? 
                    // I'll emit it if not supported.
                };
            });
            setTravellersList(merged);
        }
    }, [detailData]);

    const onSubmit: SubmitHandler<CombinedTravellerFormData> = (data) => {
        if (editingIndex !== null) {
            const updated = [...travellersList];
            updated[editingIndex] = data;
            setTravellersList(updated);
            setEditingIndex(null);
        } else {
            setTravellersList([...travellersList, { ...data, tempId: Date.now().toString() }]);
        }

        reset({
            bookingTravellerId: undefined,
            firstName: "",
            lastName: "",
            gender: "MALE",
            dob: "",
            nationality: "",
            passportNumber: "",
            passportIssuedDate: "",
            passportExpiryDate: "",
            travellerType: "ADULT",
            medicalConditions: "",
            allergies: "",
            fitnessLevel: "MODERATE",
            insuranceProvider: "",
            insurancePolicyNo: "",
            emergencyNotes: "",
        });
        setShowAddForm(false);
    };

    const handleEdit = (index: number) => {
        const item = travellersList[index];
        reset(item);
        setEditingIndex(index);
        setShowAddForm(true);
    };

    const handleDelete = (index: number) => {
        if (confirm("Are you sure you want to remove this traveller?")) {
            const updated = travellersList.filter((_, i) => i !== index);
            setTravellersList(updated);
        }
    };

    const handleSaveAll = async () => {
        try {
            // 1. Save Travellers
            const travellersPayload: BookingTravellerSaveRequest[] = travellersList.map(t => ({
                bookingTravellerId: t.bookingTravellerId, // might be undefined for new
                bookingId: bookingId,
                firstName: t.firstName,
                lastName: t.lastName,
                gender: t.gender,
                dob: t.dob,
                nationality: t.nationality,
                passportNumber: t.passportNumber,
                passportIssuedDate: t.passportIssuedDate,
                passportExpiryDate: t.passportExpiryDate,
                travellerType: t.travellerType,
            }));

            const travellerResponse: any = await saveTravellers({ bookingId, data: travellersPayload }).unwrap();

            if (travellerResponse.Code === 200) {
                // If we get back the saved list with IDs, we can save health data.
                // Assuming Data contains the list of saved travellers with new IDs.
                const savedTravellers = travellerResponse.Data;

                if (Array.isArray(savedTravellers)) {
                    // Map health info to the new IDs. 
                    // We assume order is preserved or we have some way to match. 
                    // Since we sent a list, and get a list, indices *should* match.

                    const healthPayload: BookingHealthInfoSaveRequest[] = travellersList.map((original, i) => {
                        const savedId = savedTravellers[i]?.BookingTravellerId;
                        return {
                            bookingHealthInfoId: original.bookingHealthInfoId,
                            bookingTravellerId: savedId, // Use the ID from backend response
                            medicalConditions: original.medicalConditions,
                            allergies: original.allergies,
                            fitnessLevel: original.fitnessLevel,
                            insuranceProvider: original.insuranceProvider,
                            insurancePolicyNo: original.insurancePolicyNo,
                            emergencyNotes: original.emergencyNotes,
                        };
                    });

                    // 2. Save Health Data
                    const healthResponse: any = await saveHealth({ bookingId, data: healthPayload }).unwrap();
                    if (healthResponse.Code === 200) {
                        toaster.success("Travellers and Health information saved successfully");
                        refetch(); // Refresh data
                    } else {
                        toaster.warning("Travellers saved, but Health info save failed: " + healthResponse.Message);
                    }
                } else {
                    toaster.success("Travellers saved (Health info skipped - could not verify IDs)");
                    refetch();
                }
            } else {
                toaster.error(travellerResponse.Message || "Failed to save travellers");
            }
        } catch (error) {
            console.error(error);
            toaster.error("An error occurred while saving");
        }
    };

    const handleCancelForm = () => {
        reset({
            firstName: "",
            lastName: "",
            // reset to defaults...
        });
        setEditingIndex(null);
        setShowAddForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Travellers</h3>
                <button
                    onClick={() => {
                        reset({
                            travellerType: "ADULT",
                            gender: "MALE",
                            fitnessLevel: "MODERATE",
                        });
                        setEditingIndex(null);
                        setShowAddForm(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 flex items-center gap-2"
                >
                    <MdAdd size={18} />
                    Add Traveller
                </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">{editingIndex !== null ? "Edit" : "Add"} Traveller</h4>

                    {/* Basic Info */}
                    <div>
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Basic Details</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                <input {...register("firstName", { required: "First name is required" })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                                {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                <input {...register("lastName", { required: "Last name is required" })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                                {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select {...register("travellerType")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                                    <option value="ADULT">Adult</option>
                                    <option value="CHILD">Child</option>
                                    <option value="INFANT">Infant</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select {...register("gender")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input type="date" {...register("dob")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                <input {...register("nationality")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Passport Info */}
                    <div>
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-2">Passport Details</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                                <input {...register("passportNumber")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                                <input type="date" {...register("passportIssuedDate")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                <input type="date" {...register("passportExpiryDate")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Health & Insurance Info */}
                    <div>
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-2">Health & Insurance</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                                <textarea {...register("medicalConditions")} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                                <textarea {...register("allergies")} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Level</label>
                                <select {...register("fitnessLevel")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="MODERATE">Moderate</option>
                                    <option value="ADVANCED">Advanced</option>
                                    <option value="EXPERT">Expert</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                                <input {...register("insuranceProvider")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                                <input {...register("insurancePolicyNo")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Notes</label>
                                <textarea {...register("emergencyNotes")} rows={1} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleCancelForm}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
                        >
                            {editingIndex !== null ? "Update" : "Add"} (Local)
                        </button>
                    </div>
                </form>
            )}

            {/* Travellers List */}
            <div className="space-y-3">
                {travellersList.map((traveller, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Name</div>
                                    <div className="font-medium">{traveller.firstName} {traveller.lastName}</div>
                                    <div className="text-xs text-gray-500">{traveller.travellerType} • {traveller.gender}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Details</div>
                                    <div className="font-medium text-sm">Passport: {traveller.passportNumber || "N/A"}</div>
                                    <div className="text-xs text-gray-500">{traveller.nationality || "No nationality"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Health</div>
                                    <div className="font-medium text-sm">{traveller.insuranceProvider ? `Ins: ${traveller.insuranceProvider}` : "No Insurance"}</div>
                                    <div className="text-xs text-gray-500">{traveller.medicalConditions || "No known conditions"}</div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    {traveller.bookingTravellerId ? `ID: ${traveller.bookingTravellerId}` : "New (Unsaved)"}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(index)}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                    title="Edit"
                                >
                                    <MdEdit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    title="Remove"
                                >
                                    <MdDelete size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {travellersList.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        No travellers added yet. Click "Add Traveller" to get started.
                    </div>
                )}
            </div>

            {travellersList.length > 0 && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={handleSaveAll}
                        disabled={isSavingTravellers || isSavingHealth}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 shadow-sm"
                    >
                        {(isSavingTravellers || isSavingHealth) ? "Saving..." : "Save All Changes"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TravellersTab;
