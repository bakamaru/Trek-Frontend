import React, { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdCheck, MdClose } from "react-icons/md";

interface ItineraryTabProps {
    bookingId: number;
    booking: any;
    trekData?: any;
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ bookingId, booking, trekData }) => {
    const [openDays, setOpenDays] = useState<number[]>([]);
    const [openFaqs, setOpenFaqs] = useState<number[]>([]);

    const toggleDay = (dayNum: number) => {
        setOpenDays((prev) =>
            prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
        );
    };

    const toggleFaq = (faqId: number) => {
        setOpenFaqs((prev) =>
            prev.includes(faqId) ? prev.filter((id) => id !== faqId) : [...prev, faqId]
        );
    };

    if (!trekData) {
        return <div className="p-4 text-gray-500">No product details available.</div>;
    }

    return (
        <div className="space-y-8">

            {/* Highlights */}
            {trekData.Highlights && trekData.Highlights.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Highlights</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {trekData.Highlights && [...trekData.Highlights].sort((a: any, b: any) => a.DisplayOrder - b.DisplayOrder).map((item: any) => (
                            <li key={item.TrekHighLightId}>{item.Description}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Itinerary */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Itinerary</h3>
                <div className="space-y-3">
                    {trekData.Itineraries && trekData.Itineraries.length > 0 ? (
                        [...trekData.Itineraries].sort((a: any, b: any) => a.DayNumber - b.DayNumber).map((day: any) => (
                            <div key={day.ItineraryId || day.DayNumber} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleDay(day.DayNumber)}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                                >
                                    <div className="font-medium text-gray-900">
                                        Day {day.DayNumber}: {day.DayTitle}
                                    </div>
                                    {openDays.includes(day.DayNumber) ? <MdKeyboardArrowUp size={20} /> : <MdKeyboardArrowDown size={20} />}
                                </button>
                                {openDays.includes(day.DayNumber) && (
                                    <div className="p-4 bg-white border-t border-gray-200 text-sm text-gray-600 space-y-2">
                                        <div dangerouslySetInnerHTML={{ __html: day.DailyActivityDetails }} />
                                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                                            {day.OvernightLocation && <span><strong>Overnight:</strong> {day.OvernightLocation}</span>}
                                            {day.TrekTimeHours > 0 && <span><strong>Time:</strong> {day.TrekTimeHours} hrs</span>}
                                            {day.TrekDistanceKM > 0 && <span><strong>Distance:</strong> {day.TrekDistanceKM} km</span>}
                                            {day.MealsIncluded && <span><strong>Meals:</strong> {day.MealsIncluded}</span>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 italic">No itinerary details available.</div>
                    )}
                </div>
            </div>

            {/* Inclusions & Exclusions */}
            {(trekData.InclusionsExclusions && trekData.InclusionsExclusions.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                            <MdCheck size={20} /> What's Included
                        </h3>
                        <ul className="space-y-2">
                            {trekData.InclusionsExclusions.filter((x: any) => x.IsIncluded).map((item: any) => (
                                <li key={item.TrekInclusionExclusionId} className="flex items-start gap-2 text-sm text-gray-700">
                                    <MdCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{item.Description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                            <MdClose size={20} /> What's Not Included
                        </h3>
                        <ul className="space-y-2">
                            {trekData.InclusionsExclusions.filter((x: any) => !x.IsIncluded).map((item: any) => (
                                <li key={item.TrekInclusionExclusionId} className="flex items-start gap-2 text-sm text-gray-700">
                                    <MdClose className="text-red-500 mt-0.5 flex-shrink-0" />
                                    <span>{item.Description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Why Us */}
            {trekData.WhyUs && trekData.WhyUs.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Book With Us?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trekData.WhyUs && [...trekData.WhyUs].sort((a: any, b: any) => a.DisplayOrder - b.DisplayOrder).map((item: any) => (
                            <div key={item.TrekWhyUsId} className="bg-brand-50 p-4 rounded-lg text-sm text-gray-700 border border-brand-100">
                                {item.Description}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FAQs */}
            {trekData.Faqs && trekData.Faqs.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">FAQs</h3>
                    <div className="space-y-2">
                        {trekData.Faqs && [...trekData.Faqs].sort((a: any, b: any) => a.Priority - b.Priority).map((faq: any) => (
                            <div key={faq.TrekFAQId} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(faq.TrekFAQId)}
                                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition text-left"
                                >
                                    <div className="font-medium text-gray-900 text-sm">{faq.Question}</div>
                                    {openFaqs.includes(faq.TrekFAQId) ? <MdKeyboardArrowUp size={18} /> : <MdKeyboardArrowDown size={18} />}
                                </button>
                                {openFaqs.includes(faq.TrekFAQId) && (
                                    <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                                        <div dangerouslySetInnerHTML={{ __html: faq.Solution }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItineraryTab;
