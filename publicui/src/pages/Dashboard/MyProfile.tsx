import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useGetUserProfileQuery, useSaveUserMutation, useUploadProfilePictureMutation } from '../../redux/user/userAPI';
import { AppUser } from '../../types/usertypes';
import { FaCloudUploadAlt, FaPen, FaUserEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyProfile: React.FC = () => {
    const { data: profileData, isLoading, refetch } = useGetUserProfileQuery();
    const [saveUser, { isLoading: isSaving }] = useSaveUserMutation();
    const [uploadProfilePicture, { isLoading: isUploading }] = useUploadProfilePictureMutation();

    // View/Edit Mode State
    const [isEditing, setIsEditing] = useState(false);

    // Local state for image preview
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<AppUser>();

    // CDN Integration
    const CDN_URL = (import.meta.env.VITE_CDN_PATH || '').replace(/\/+$/, '');
    const getImageUrl = (path: string | undefined | null) => {

        if (path.startsWith('http'))
            return path;

        return `${CDN_URL}${path}`;
    };

    useEffect(() => {
        if (profileData && profileData.Data) {
            reset(profileData.Data);
            setImagePreview(getImageUrl(profileData.Data.ProfilePicture));
        }
    }, [profileData, reset]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload immediately
            const formData = new FormData();
            formData.append('file', file);

            try {
                const result: any = await uploadProfilePicture(formData).unwrap();
                if (result.Code === 200) {
                    toast.success('Profile picture updated successfully!');
                    refetch();
                } else {
                    toast.error('Failed to upload profile picture: ' + result.Message);
                }
            } catch (error) {
                console.error("Upload failed", error);
                toast.error('An error occurred while uploading the image.');
            }
        }
    };

    const onSubmit = async (data: AppUser) => {
        try {
            const result: any = await saveUser(data).unwrap();
            if (result.Code === 200) {
                toast.success('Profile updated successfully!');
                setIsEditing(false); // Switch back to view mode
                refetch();
            } else {
                toast.error('Failed to update profile: ' + result.Message);
            }
        } catch (error) {
            console.error("Save failed", error);
            toast.error('An error occurred while saving profile.');
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleEditClick = () => {
        if (profileData?.Data) {
            reset(profileData.Data); // Refill form with latest data
        }
        setIsEditing(true);
    };

    if (isLoading) return <div className="p-8 text-center">Loading profile...</div>;

    const user = profileData?.Data;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">

            {/* Profile Picture (Centered & Editable) */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                    <img
                        src={imagePreview}
                        alt={user?.FirstName}
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-lg"
                    />

                    {/* Overlay for Edit/Upload */}
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        {isUploading ? (
                            <span className="text-white text-xs font-semibold">Uploading...</span>
                        ) : (
                            <FaCloudUploadAlt className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 border-2 border-white dark:border-gray-800 shadow-md">
                        <FaPen className="text-white text-xs" />
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                />
                <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">{user?.FirstName} {user?.LastName}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.Email}</p>
            </div>

            {/* Header with Edit Button */}
            {!isEditing && (
                <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Personal Information</h3>
                    <button
                        onClick={handleEditClick}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                        <FaUserEdit className="text-lg" />
                        <span>Edit Profile</span>
                    </button>
                </div>
            )}


            {isEditing ? (
                /* EDIT MODE FORM */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">

                    {/* Hidden Fields (as requested to be hidden from form UI but needed for state) */}
                    <input type="hidden" {...register("AppUserId")} />
                    <input type="hidden" {...register("IdentityUserId")} />
                    <input type="hidden" {...register("UserName")} />
                    <input type="hidden" {...register("Email")} />
                    <input type="hidden" {...register("PhoneNumber")} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* FirstName */}
                        <div>
                            <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="FirstName"
                                {...register("FirstName", { required: "First Name is required" })}
                                className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            />
                            {errors.FirstName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.FirstName.message}</p>}
                        </div>

                        {/* LastName */}
                        <div>
                            <label htmlFor="LastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="LastName"
                                {...register("LastName", { required: "Last Name is required" })}
                                className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            />
                            {errors.LastName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.LastName.message}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="Address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                            <input
                                type="text"
                                id="Address"
                                {...register("Address")}
                                className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>

                        {/* DOB */}
                        <div>
                            <label htmlFor="DOB" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                            <input
                                type="date"
                                id="DOB"
                                {...register("DOB")}
                                className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label htmlFor="Gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                            <select
                                id="Gender"
                                {...register("Gender")}
                                className="mt-1 block w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Bio */}
                        <div className="md:col-span-2">
                            <label htmlFor="Bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                            <textarea
                                id="Bio"
                                rows={4}
                                {...register("Bio")}
                                className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 space-x-4 border-t dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                if (profileData?.Data) reset(profileData.Data); // Reset to original data
                            }}
                            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors duration-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-blue-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                /* VIEW MODE */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 animate-fade-in">
                    <ViewField label="Full Name" value={`${user?.FirstName} ${user?.LastName}`} />
                    <ViewField label="Username" value={user?.UserName} />
                    <ViewField label="Email Address" value={user?.Email} />
                    <ViewField label="Phone Number" value={user?.PhoneNumber} />
                    <ViewField label="Address" value={user?.Address || "-"} />
                    <ViewField label="Date of Birth" value={user?.DOB ? new Date(user.DOB).toLocaleDateString() : "-"} />
                    <ViewField label="Gender" value={user?.Gender || "-"} />
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bio</label>
                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                            {user?.Bio || "No bio added yet."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const ViewField = ({ label, value }: { label: string, value?: string | number | null }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
        <p className="text-gray-900 dark:text-white font-medium text-lg">{value}</p>
    </div>
);

export default MyProfile;