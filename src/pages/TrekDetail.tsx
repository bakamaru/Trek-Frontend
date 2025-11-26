import React, { useContext, useState, useEffect } from 'react';
import { TREKS_DATA } from '../const/constants';
import { Trek as TrekType } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { Link, useParams } from 'react-router-dom';



const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

interface TrekDetailProps {
   // trekId: string;
}

const TrekDetail: React.FC<TrekDetailProps> = () => {
    const [trek, setTrek] = useState<TrekType | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeItinerary, setActiveItinerary] = useState<number | null>(1);
    const [activeFaq, setActiveFaq] = useState<number | null>(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const { slug } = useParams();
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            const foundTrek = TREKS_DATA.find(t => t.id === slug);
            setTrek(foundTrek || null);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [slug]);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') setLightboxOpen(false);
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, lightboxIndex, trek]);

    if (loading) {
        return <LoadingSpinner fullPage={true} />;
    }

    if (!trek) {
        return (
            <div className="pt-20 h-screen flex items-center justify-center">
                <h1 className="text-3xl font-bold">Trek Not Found</h1>
            </div>
        );
    }

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const nextImage = () => {
        if (!trek) return;
        setLightboxIndex((prev) => (prev + 1) % trek.gallery.length);
    };

    const prevImage = () => {
        if (!trek) return;
        setLightboxIndex((prev) => (prev - 1 + trek.gallery.length) % trek.gallery.length);
    };

    const Lightbox = () => (
        lightboxOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
                <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors" onClick={() => setLightboxOpen(false)} aria-label="Close lightbox">&times;</button>
                <button className="absolute left-4 sm:left-10 text-white text-4xl hover:text-gray-300 transition-colors" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Previous image">&#8249;</button>
                <img src={trek.gallery[lightboxIndex]} alt={`Trek gallery image ${lightboxIndex + 1}`} className="max-h-[90vh] max-w-[90vw] object-contain" onClick={(e) => e.stopPropagation()} />
                <button className="absolute right-4 sm:right-10 text-white text-4xl hover:text-gray-300 transition-colors" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Next image">&#8250;</button>
            </div>
        )
    );

    return (
        <div className="pt-20 bg-gray-50 dark:bg-gray-800">
            <SEO
                title={trek.title}
                description={`Book ${trek.title} - ${trek.duration} adventure. ${trek.overview.substring(0, 100)}...`}
                image={trek.image}
                context={`${trek.title} is a ${trek.difficulty} level trek lasting ${trek.duration}. Overview: ${trek.overview}`}
            />
            <Lightbox />
            {/* Hero Section */}
            <section
                className="h-[50vh] bg-cover bg-center flex items-end text-white relative"
                style={{ backgroundImage: `url(${trek.image})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                <div className="container mx-auto px-4 z-10 pb-12">
                    <h1 className="text-5xl lg:text-6xl font-extrabold">{trek.title}</h1>
                    <div className="flex flex-wrap items-center mt-4 gap-x-4 gap-y-2">
                        <div className="flex items-center">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} filled={i < trek.rating} />
                                ))}
                            </div>
                            <span className="text-white ml-2">({trek.reviews} reviews)</span>
                        </div>
                        <span className="text-lg hidden md:inline">|</span>
                        <span className="text-lg">{trek.duration}</span>
                        <span className="text-lg hidden md:inline">|</span>
                        <span className={`font-bold px-3 py-1 rounded-full text-sm ${trek.difficulty === 'Strenuous' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>{trek.difficulty}</span>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Left/Main Column */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Overview */}
                            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Trip Overview</h2>
                                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{trek.overview}</p>
                            </div>

                            {/* Itinerary */}
                            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Daily Itinerary</h2>
                                <div className="space-y-4">
                                    {trek.itinerary.map(item => (
                                        <div key={item.day} className="border dark:border-gray-600 rounded-lg overflow-hidden">
                                            <button onClick={() => setActiveItinerary(activeItinerary === item.day ? null : item.day)} className="w-full text-left p-4 bg-gray-50 dark:bg-gray-600 hover:bg-blue-50 dark:hover:bg-gray-500 flex justify-between items-center transition-colors">
                                                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">Day {item.day}: {item.title}</h3>
                                                <span className={`transform transition-transform text-blue-700 ${activeItinerary === item.day ? 'rotate-180' : ''}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </span>
                                            </button>
                                            <div className={`transition-all duration-500 ease-in-out ${activeItinerary === item.day ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                                <div className="p-6 border-t dark:border-gray-600">
                                                    {item.image && <img src={item.image} alt={item.title} className="w-full h-auto rounded-lg mb-4" />}
                                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                        {item.altitude && <span className="font-semibold"><strong>Altitude:</strong> {item.altitude}</span>}
                                                        {item.duration && <span className="font-semibold"><strong>Duration:</strong> {item.duration}</span>}
                                                        {item.meals && <span className="font-semibold"><strong>Meals:</strong> {item.meals}</span>}
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cost Includes/Excludes */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">What's Included</h3>
                                    <ul className="space-y-2">
                                        {trek.included.map((item, index) => (
                                            <li key={index} className="flex items-start text-gray-600 dark:text-gray-300"><svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">What's Excluded</h3>
                                    <ul className="space-y-2">
                                        {trek.excluded.map((item, index) => (
                                            <li key={index} className="flex items-start text-gray-600 dark:text-gray-300"><svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Equipment */}
                            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Equipment Checklist</h2>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {trek.equipment.map(cat => (
                                        <div key={cat.category}>
                                            <h4 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">{cat.category}</h4>
                                            <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                                                {cat.items.map((item, idx) => <li key={idx}>{item}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Gallery & Video */}
                            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Gallery & Video</h2>
                                {trek.videoEmbedUrl && (
                                    <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
                                        <div className="relative h-0 pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
                                            <iframe className="absolute top-0 left-0 w-full h-full" src={trek.videoEmbedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {trek.gallery.map((imgSrc, index) => (
                                        <div key={index} className="cursor-pointer overflow-hidden rounded-lg group" onClick={() => openLightbox(index)}>
                                            <img src={imgSrc} alt={`Trek gallery image ${index + 1}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Map */}
                            {trek.mapEmbedUrl && (
                                <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Trek Route Map</h2>
                                    <div className="overflow-hidden rounded-lg">
                                        <iframe src={trek.mapEmbedUrl} width="100%" height="450" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="rounded-lg dark:grayscale dark:invert"></iframe>
                                    </div>
                                </div>
                            )}

                            {/* FAQs */}
                            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    {trek.faqs.map((faq, index) => (
                                        <div key={index} className="border dark:border-gray-600 rounded-lg overflow-hidden">
                                            <button onClick={() => setActiveFaq(activeFaq === index ? null : index)} className="w-full text-left p-4 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 flex justify-between items-center">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{faq.question}</h3>
                                                <span className={`transform transition-transform dark:text-gray-400 ${activeFaq === index ? 'rotate-180' : ''}`}>▼</span>
                                            </button>
                                            <div className={`transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}>
                                                <div className="p-4 border-t dark:border-gray-600">
                                                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Sticky Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 space-y-8">
                                {/* Trip Facts Card */}
                                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg border dark:border-gray-600">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b dark:border-gray-600 pb-3">Trip Facts</h3>
                                    <div className="space-y-4">
                                        {trek.tripFacts.map(fact => (
                                            <div key={fact.label} className="flex items-center">
                                                <div className="text-blue-700 mr-4">{fact.icon}</div>
                                                <div>
                                                    <p className="font-semibold text-gray-700 dark:text-gray-200">{fact.label}</p>
                                                    <p className="text-gray-600 dark:text-gray-400">{fact.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Booking Card */}
                                <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg border dark:border-gray-600">
                                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        From <span className="text-blue-700">${trek.price.toLocaleString()}</span>
                                        <span className="text-base font-normal text-gray-500 dark:text-gray-400"> / person</span>
                                    </p>
                                    <div className="my-6">
                                        <Link to={`/trek/${trek.id}/booking`} className="w-full text-center block bg-blue-700 text-white px-6 py-4 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 text-lg">
                                            Book This Trip
                                        </Link>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Questions? <Link to="/contact" className="text-blue-700 underline">Contact an Expert</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TrekDetail;