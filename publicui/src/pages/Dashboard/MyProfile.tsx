import React, { useState } from 'react';

const MyProfile: React.FC = () => {
    const [profile, setProfile] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically make an API call to save the data
        console.log("Profile saved:", profile);
        alert("Profile updated successfully!");
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">My Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-6">
                    <img src={profile.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                    <div>
                        <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                            Change Picture
                        </button>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input type="text" name="name" id="name" value={profile.name} onChange={handleChange} className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input type="email" name="email" id="email" value={profile.email} onChange={handleChange} className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                        <input type="tel" name="phone" id="phone" value={profile.phone} onChange={handleChange} className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                        <input type="text" name="address" id="address" value={profile.address} onChange={handleChange} className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                    <button type="submit" className="bg-blue-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MyProfile;