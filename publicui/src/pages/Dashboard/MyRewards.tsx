import React from 'react';

const MyRewards: React.FC = () => {
    const nextTierPoints = 2000;
    const progressPercentage =1;// (REWARD_POINTS_TOTAL / nextTierPoints) * 100;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">My Rewards</h1>
            
            {/* Points Summary */}
            <div className="bg-blue-700 text-white p-6 rounded-lg mb-8 text-center">
                <p className="text-lg font-medium">Your Points Balance</p>
                <p className="text-5xl font-extrabold my-2">{2}</p>
                <p className="opacity-80">Earn points on every booking and redeem them for discounts!</p>
            </div>

            {/* Progress to Next Tier */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Next Reward: Gold Tier</h2>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span>{2} pts</span>
                    <span>{nextTierPoints.toLocaleString()} pts</span>
                </div>
                 <p className="text-center text-sm text-gray-500 dark:text-gray-300 mt-2">
                    You're only <span className="font-bold text-green-600 dark:text-green-400">{nextTierPoints - 1}</span> points away from reaching Gold Tier!
                </p>
            </div>

            {/* Activity History */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Points History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">Date</th>
                                <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">Description</th>
                                <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[].map((activity, index) => (
                                <tr key={index} className="border-b dark:border-gray-700">
                                    <td className="p-3 text-gray-700 dark:text-gray-400">{activity.date}</td>
                                    <td className="p-3 text-gray-800 dark:text-gray-200">{activity.description}</td>
                                    <td className={`p-3 text-right font-bold ${activity.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {activity.points > 0 ? '+' : ''}{activity.points}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyRewards;