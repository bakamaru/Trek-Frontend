import React, { useState, useEffect } from "react";
import { useSaveBookingTravellersMutation } from "../../../redux/trek/bookingAPI";
import toaster from "../../toster";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

interface TravellersTabProps {
    bookingId: number;
}

const TravellersTab: React.FC<TravellersTabProps> = ({ bookingId }) => {
    const [travellers, setTravellers] = useState<any[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: "",
        passportIssueDate: "",
        passportExpiryDate: "",
        travellerType: "ADULT",
    });

    const [saveTravellers, { isLoading }] = useSaveBookingTravellersMutation();

    const handleAddTraveller = () => {
        if (!formData.name) {
            toaster.error("Name is required");
            return;
        }

        if (editingIndex !== null) {
            const updated = [...travellers];
            updated[editingIndex] = formData;
            setTravellers(updated);
            setEditingIndex(null);
        } else {
            setTravellers([...travellers, formData]);
        }

        setFormData({
            name: "",
            gender: "",
            dateOfBirth: "",
            nationality: "",
            passportNumber: "",
            passportIssueDate: "",
            passportExpiryDate: "",
            travellerType: "ADULT",
        });
        setShowAddForm(false);
    };

    const handleEdit = (index: number) => {
        setFormData(travellers[index]);
        setEditingIndex(index);
        setShowAddForm(true);
    };

    const handleDelete = (index: number) => {
        if (confirm("Are you sure you want to remove this traveller?")) {
            setTravellers(travellers.filter((_, i) => i !== index));
        }
    };

    const handleSave = async () => {
        try {
            const response: any = await saveTravellers({ bookingId, data: travellers }).unwrap();
            if (response.code === 200) {
                toaster.success("Travellers saved successfully");
            }
        } catch (error) {
            toaster.error("Failed to save travellers");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Travellers</h3>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 flex items-center gap-2"
                >
                    <MdAdd size={18} />
                    Add Traveller
                </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium text-gray-900">{editingIndex !== null ? "Edit" : "Add"} Traveller</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={formData.travellerType}
                                onChange={(e) => setFormData({ ...formData, travellerType: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            >
                                <option value="ADULT">Adult</option>
                                <option value="CHILD">Child</option>
                                <option value="INFANT">Infant</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            >
                                <option value="">Select...</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                            <input
                                type="text"
                                value={formData.nationality}
                                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                            <input
                                type="text"
                                value={formData.passportNumber}
                                onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Issue Date</label>
                            <input
                                type="date"
                                value={formData.passportIssueDate}
                                onChange={(e) => setFormData({ ...formData, passportIssueDate: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expiry Date</label>
                            <input
                                type="date"
                                value={formData.passportExpiryDate}
                                onChange={(e) => setFormData({ ...formData, passportExpiryDate: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddTraveller}
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
                        >
                            {editingIndex !== null ? "Update" : "Add"}
                        </button>
                        <button
                            onClick={() => {
                                setShowAddForm(false);
                                setEditingIndex(null);
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Travellers List */}
            <div className="space-y-3">
                {travellers.map((traveller, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Name</div>
                                    <div className="font-medium">{traveller.name}</div>
                                    <div className="text-xs text-gray-500">{traveller.travellerType}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Passport</div>
                                    <div className="font-medium">{traveller.passportNumber || "N/A"}</div>
                                    <div className="text-xs text-gray-500">{traveller.nationality || ""}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Date of Birth</div>
                                    <div className="font-medium">
                                        {traveller.dateOfBirth ? new Date(traveller.dateOfBirth).toLocaleDateString() : "N/A"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(index)}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    <MdEdit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                    <MdDelete size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {travellers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No travellers added yet. Click "Add Traveller" to get started.
                    </div>
                )}
            </div>

            {travellers.length > 0 && (
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Save All Travellers"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TravellersTab;
