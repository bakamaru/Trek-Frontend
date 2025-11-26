
import React, { useState, useContext } from 'react';
import { TREKS_DATA, TOURS_DETAIL_DATA, SIGHTSEEING_SPOTS_DATA } from '../const/constants';
import { Trek, TourDetail, SightseeingSpot, CustomTrip } from '../types/types';

type TravelStyle = 'adventure' | 'relaxation' | 'culture';
type Budget = 'budget' | 'mid-range' | 'luxury';

interface Preferences {
    style: TravelStyle;
    budget: Budget;
    duration: number;
    interests: string[];
}

interface GeneratedPlan {
    mainActivity: Trek | TourDetail;
    sightseeing: SightseeingSpot[];
    totalCost: number;
}

const TripPlanner: React.FC = () => {
    const [step, setStep] = useState(1);
    const [preferences, setPreferences] = useState<Preferences>({
        style: 'adventure',
        budget: 'mid-range',
        duration: 7,
        interests: [],
    });
    const [plan, setPlan] = useState<GeneratedPlan | null>(null);

    const interestOptions = ['hiking', 'history', 'food', 'beach', 'nature'];

    const handleInterestToggle = (interest: string) => {
        setPreferences(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest],
        }));
    };

    const generatePlan = () => {
        const { budget, duration, interests, style } = preferences;

        const budgetMap = {
            budget: [0, 1000],
            'mid-range': [1000, 2000],
            luxury: [2000, 10000],
        };

        const [minBudget, maxBudget] = budgetMap[budget];

        const allActivities: (Trek | TourDetail)[] = [...TREKS_DATA, ...TOURS_DETAIL_DATA];
        
        const possibleActivities = allActivities.filter(activity => {
            const durationInDays = parseInt(activity.duration.split(' ')[0]);
            const matchesDuration = durationInDays <= duration;
            const matchesBudget = activity.price >= minBudget && activity.price <= maxBudget;
            const matchesTags = interests.every(interest => activity.tags?.includes(interest)) && activity.tags?.includes(style);
            return matchesDuration && matchesBudget && matchesTags;
        });

        if (possibleActivities.length === 0) {
            alert("No trips match your criteria. Please try different options.");
            return;
        }

        const mainActivity = possibleActivities[Math.floor(Math.random() * possibleActivities.length)];
        
        const remainingDays = duration - parseInt(mainActivity.duration.split(' ')[0]);
        let remainingBudget = (maxBudget - mainActivity.price) * 0.5; // Allocate portion of remaining budget for sightseeing
        
        // FIX: Handle location for both Trek and TourDetail types. A trek does not have a location property.
        let location = '';
        if ('location' in mainActivity) { // It's a TourDetail
            location = mainActivity.location.split(',')[0].trim();
        } else if ('difficulty' in mainActivity) { // It's a Trek, assume starting city is Kathmandu for sightseeing
            location = 'Kathmandu';
        }
        
        let sightseeing: SightseeingSpot[] = [];
        if (remainingDays > 0 && location) {
            const possibleSpots = SIGHTSEEING_SPOTS_DATA.filter(spot => 
                spot.location.includes(location) &&
                interests.some(i => spot.tags.includes(i))
            ).sort(() => 0.5 - Math.random());
            
            for(const spot of possibleSpots) {
                if(remainingBudget >= spot.estimatedCost) {
                    sightseeing.push(spot);
                    remainingBudget -= spot.estimatedCost;
                }
            }
        }

        const totalCost = mainActivity.price + sightseeing.reduce((sum, spot) => sum + spot.estimatedCost, 0);

        setPlan({ mainActivity, sightseeing, totalCost });
    };

    const handleBookNow = () => {
        if (!plan) return;
        
        const overview = `Your personalized ${preferences.duration}-day trip. Main activity: ${plan.mainActivity.title}. Includes sightseeing: ${plan.sightseeing.map(s => s.name).join(', ') || 'None'}.`;

        const customTrip: CustomTrip = {
            id: `custom-${Date.now()}`,
            title: `Your Custom ${preferences.style.charAt(0).toUpperCase() + preferences.style.slice(1)} Trip`,
            image: plan.mainActivity.image,
            price: plan.totalCost,
            overview: overview,
        };

        // setBookingDetails({
        //     item: customTrip,
        //     travelers: 1, // Defaulting to 1 traveler for planner
        //     date: new Date().toISOString().split('T')[0],
        // });

        // navigate('/checkout');
    }

    const renderStep = () => {
        switch(step) {
            case 1: // Style & Budget
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">What's your travel style?</h2>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {(['adventure', 'relaxation', 'culture'] as TravelStyle[]).map(s => (
                                <button key={s} onClick={() => setPreferences(p => ({...p, style: s}))} className={`p-4 border rounded-lg text-lg capitalize transition ${preferences.style === s ? 'bg-blue-700 text-white border-blue-700' : 'dark:border-gray-600 hover:border-blue-600'}`}>{s}</button>
                            ))}
                        </div>
                        <h2 className="text-2xl font-bold mb-4">What's your budget?</h2>
                        <div className="grid grid-cols-3 gap-4">
                             {(['budget', 'mid-range', 'luxury'] as Budget[]).map(b => (
                                <button key={b} onClick={() => setPreferences(p => ({...p, budget: b}))} className={`p-4 border rounded-lg text-lg capitalize transition ${preferences.budget === b ? 'bg-blue-700 text-white border-blue-700' : 'dark:border-gray-600 hover:border-blue-600'}`}>{b}</button>
                            ))}
                        </div>
                    </div>
                );
            case 2: // Duration & Interests
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">How long is your trip?</h2>
                        <div className="flex items-center gap-4 mb-8">
                            <input type="range" min="3" max="30" value={preferences.duration} onChange={e => setPreferences(p => ({...p, duration: parseInt(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                            <span className="font-bold text-lg w-24 text-center">{preferences.duration} days</span>
                        </div>
                         <h2 className="text-2xl font-bold mb-4">What are your interests?</h2>
                        <div className="flex flex-wrap gap-4">
                            {interestOptions.map(interest => (
                                <button key={interest} onClick={() => handleInterestToggle(interest)} className={`px-4 py-2 border rounded-full text-md capitalize transition ${preferences.interests.includes(interest) ? 'bg-blue-700 text-white border-blue-700' : 'dark:border-gray-600 hover:border-blue-600'}`}>{interest}</button>
                            ))}
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    if (plan) {
        return (
             <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
                        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">Your Personalized Trip Plan</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Based on your preferences, here is our recommendation!</p>
                        
                        <div className="text-left border-t dark:border-gray-700 pt-6">
                            <h3 className="text-2xl font-bold mb-4 text-blue-700">Main Activity</h3>
                            <div className="flex gap-6 items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <img src={plan.mainActivity.image} alt={plan.mainActivity.title} className="w-48 h-32 object-cover rounded-md"/>
                                <div>
                                    <h4 className="text-xl font-bold">{plan.mainActivity.title}</h4>
                                    {/* FIX: Conditionally display location for Trek (no location property) or TourDetail */}
                                    <p className="text-gray-600 dark:text-gray-300">{plan.mainActivity.duration} · {'location' in plan.mainActivity ? plan.mainActivity.location : 'Nepal'}</p>
                                    <p className="font-bold text-lg">${plan.mainActivity.price}</p>
                                </div>
                            </div>

                            {plan.sightseeing.length > 0 && (
                                <>
                                <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-700">Suggested Sightseeing</h3>
                                <div className="space-y-4">
                                    {plan.sightseeing.map(spot => (
                                        <div key={spot.name} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="text-lg font-bold">{spot.name}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{spot.description}</p>
                                                </div>
                                                <p className="font-bold text-md">${spot.estimatedCost}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                </>
                            )}

                            <div className="mt-8 pt-6 border-t dark:border-gray-700 text-right">
                                <p className="text-gray-600 dark:text-gray-300 text-xl">Estimated Total</p>
                                <p className="text-4xl font-extrabold text-gray-800 dark:text-white">${plan.totalCost.toLocaleString()}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">per person</p>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                            <button onClick={() => setPlan(null)} className="px-8 py-3 rounded-md font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors duration-300">
                                Start Over
                            </button>
                             <button onClick={handleBookNow} className="px-8 py-3 rounded-md font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-300">
                                Book This Trip
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }


    return (
        <div className="pt-20">
            <section className="bg-gray-100 dark:bg-gray-800 py-20 text-center">
                <div className="container mx-auto px-4">
                <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">Build Your Perfect Trip</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">Tell us your preferences, and we'll craft a personalized itinerary just for you.</p>
                </div>
            </section>
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
                        <div className="mb-8">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-blue-700 h-2.5 rounded-full" style={{ width: `${(step / 2) * 100}%` }}></div>
                            </div>
                            <p className="text-center text-sm mt-2 text-gray-500 dark:text-gray-400">Step {step} of 2</p>
                        </div>
                        
                        {renderStep()}

                        <div className="flex justify-between mt-10">
                            <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="px-6 py-2 rounded-md font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                                Back
                            </button>
                            {step < 2 ? (
                                <button onClick={() => setStep(s => Math.min(2, s + 1))} className="px-6 py-2 rounded-md font-semibold bg-blue-700 text-white hover:bg-blue-800">
                                    Next
                                </button>
                            ) : (
                                <button onClick={generatePlan} className="px-6 py-2 rounded-md font-semibold bg-green-500 text-white hover:bg-green-600">
                                    Generate Plan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TripPlanner;
