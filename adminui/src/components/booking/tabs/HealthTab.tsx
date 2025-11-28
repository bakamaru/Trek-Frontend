import React, { useState } from "react";
import { useSaveBookingHealthMutation } from "../../../redux/trek/bookingAPI";
import toaster from "../../toster";

interface HealthTabProps {
    bookingId: number;
}

const HealthTab: React.FC<HealthTabProps> = ({ bookingId }) => {
    const [healthData, setHealthData] = useState({
        medicalConditions: "",
        allergies: "",
        fitnessLevel: "MODERATE",
        insuranceProvider: "",
        policyNumber: "",
        emergencyNotes: "",
        clearedForTrek: false,
    });

    const [saveHealth, { isLoading }] = useSaveBookingHealthMutation();

    const handleSave = async () => {
        try {
            const response: any = await saveHealth({ bookingId, data: [healthData] }).unwrap();
            if (response.code === 200) {
                toaster.success("Health information saved successfully");
            }
        } catch (error) {
            toaster.error("Failed to save health information");
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Health & Insurance Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                    <textarea
                        value={healthData.medicalConditions}
                        onChange={(e) => setHealthData({ ...healthData, medicalConditions: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Any pre-existing medical conditions..."
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                    <textarea
                        value={healthData.allergies}
                        onChange={(e) => setHealthData({ ...healthData, allergies: e.target.value })}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Food allergies, medication allergies, etc..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Level</label>
                    <select
                        value={healthData.fitnessLevel}
                        onChange={(e) => setHealthData({ ...healthData, fitnessLevel: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="BEGINNER">Beginner</option>
                        <option value="MODERATE">Moderate</option>
                        <option value="ADVANCED">Advanced</option>
                        <option value="EXPERT">Expert</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                    <input
                        type="text"
                        value={healthData.insuranceProvider}
                        onChange={(e) => setHealthData({ ...healthData, insuranceProvider: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                    <input
                        type="text"
                        value={healthData.policyNumber}
                        onChange={(e) => setHealthData({ ...healthData, policyNumber: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Notes</label>
                    <textarea
                        value={healthData.emergencyNotes}
                        onChange={(e) => setHealthData({ ...healthData, emergencyNotes: e.target.value })}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Any additional emergency information..."
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={healthData.clearedForTrek}
                            onChange={(e) => setHealthData({ ...healthData, clearedForTrek: e.target.checked })}
                            className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Cleared for Trek</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
                >
                    {isLoading ? "Saving..." : "Save Health Information"}
                </button>
            </div>
        </div>
    );
};

export default HealthTab;
