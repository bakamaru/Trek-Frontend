import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useChangePasswordMutation } from '../../redux/user/userAPI';
import { ChangePasswordDto } from '../../types/usertypes';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ChangePassword: React.FC = () => {
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ChangePasswordDto>();

    const newPassword = watch('NewPassword');

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const onSubmit = async (data: ChangePasswordDto) => {
        try {
            const result: any = await changePassword({
                OldPassword: data.OldPassword,
                NewPassword: data.NewPassword,
                ConfirmPassword: data.ConfirmPassword
            }).unwrap();

            if (result.Code === 200) {
                toast.success('Password changed successfully!');
                reset();
            } else {
                toast.error('Failed to change password: ' + result.Message);
            }
        } catch (error: any) {
            console.error("Password change failed", error);
            toast.error(error?.data?.Message || 'An error occurred while changing password.');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                        <FaLock className="text-blue-600 dark:text-blue-400 text-2xl" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">Change Password</h1>
                    <p className="text-gray-600 dark:text-gray-400">Update your password to keep your account secure</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <label htmlFor="OldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                id="OldPassword"
                                {...register("OldPassword", {
                                    required: "Current password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })}
                                className="block w-full p-3 pr-12 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter your current password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.OldPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.OldPassword.message}</p>}
                    </div>

                    {/* New Password */}
                    <div>
                        <label htmlFor="NewPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                id="NewPassword"
                                {...register("NewPassword", {
                                    required: "New password is required",
                                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                        message: "Password must contain uppercase, lowercase, and number"
                                    }
                                })}
                                className="block w-full p-3 pr-12 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter your new password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.NewPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.NewPassword.message}</p>}
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Password must be at least 8 characters with uppercase, lowercase, and number
                        </p>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                id="ConfirmPassword"
                                {...register("ConfirmPassword", {
                                    required: "Please confirm your new password",
                                    validate: value => value === newPassword || "Passwords do not match"
                                })}
                                className="block w-full p-3 pr-12 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="Confirm your new password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.ConfirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.ConfirmPassword.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6 border-t dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FaLock className="mr-2" />
                                    Update Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;