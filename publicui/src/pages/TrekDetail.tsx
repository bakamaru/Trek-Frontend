import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { Link, useParams } from 'react-router-dom';
import { useGetTrekDetailByUrlQuery } from '../redux/api/trekAPI';



const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

interface TrekDetailProps {
    // trekId: string;
}

const TrekDetail: React.FC<TrekDetailProps> = () => {
    const { slug } = useParams();
    const { data: rawData, isLoading, error } = useGetTrekDetailByUrlQuery(slug || '', {
        skip: !slug
    });

    // API may return envelope { Code, Message, Data } or raw DTO
    const dto: any = rawData && (rawData.Data ?? rawData);

    // Map DTO to UI-friendly shape used below
    const trek = React.useMemo(() => {
        if (!dto) return null;

        const d = dto as any;

        // helpers to read image url from gallery item or other image fields
        const CDN = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_CDN_PATH) || '';
        const normalizePath = (p: string) => {
            if (!p) return '';
            const s = p.toString();
            if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//')) return s;
            // ensure single slash between CDN and path
            const base = CDN.endsWith('/') ? CDN.slice(0, -1) : CDN;
            const path = s.startsWith('/') ? s : `/${s}`;
            return base ? `${base}${path}` : path;
        };

        // Accept either a string or an object with common keys
        const getImgUrl = (img: any) => {
            if (!img) return '';
            if (typeof img === 'string') return normalizePath(img);
            // common object keys from API
            const candidates = [img.ImagePath, img.ImageUrl, img.Url, img.Path, img.PathUrl, img.CoverImage];
            for (const c of candidates) {
                if (c) return normalizePath(c);
            }
            return '';
        };

        const gallery: string[] = Array.isArray(d.Gallery) ? d.Gallery.map((g: any) => getImgUrl(g)).filter(Boolean) : [];

        const itinerary = Array.isArray(d.Itineraries)
            ? d.Itineraries.map((it: any, idx: number) => ({
                day: it.Day ?? it.DayNumber ?? it.DayNumber ?? idx + 1,
                title: it.DayTitle ?? it.Title ?? it.Name ?? `Day ${it.Day ?? idx + 1}`,
                image: getImgUrl(it.Image ?? it.ImageUrl ?? it.CoverImage),
                altitude: it.AltitudeMeters ?? it.MaxAltitudeMeters ?? null,
                // Trek-specific fields
                startLocation: it.StartLocation ?? it.StartLocationName ?? '',
                overnightLocation: it.OvernightLocation ?? it.OvernightLocationName ?? '',
                trekTimeHours: typeof it.TrekTimeHours !== 'undefined' ? it.TrekTimeHours : (it.TrekTime ?? null),
                trekDistanceKM: typeof it.TrekDistanceKM !== 'undefined' ? it.TrekDistanceKM : (it.TrekDistance ?? null),
                transportMethod: it.TransportMethod ?? it.Transport ?? '',
                accommodationType: it.AccommodationType ?? it.Accommodation ?? '',
                mealsIncluded: it.MealsIncluded ?? it.Meals ?? '',
                dailyActivity: it.DailyActivityDetails ?? it.Description ?? it.Details ?? it.Overview ?? '',
                duration: it.Duration ?? it.DurationText ?? null,
                meals: it.Meals ?? null,
                description: it.Description ?? it.Overview ?? it.Details ?? '',
            }))
            : [];

        // InclusionsExclusions: split by a flag or a Type property
        const inclusions: string[] = [];
        const exclusions: string[] = [];
        if (Array.isArray(d.InclusionsExclusions)) {
            d.InclusionsExclusions.forEach((ie: any) => {
                const text = ie.Description ?? ie.Text ?? ie.Item ?? ie.Name ?? '';
                const isInclude = ie.IsIncluded ?? (ie.Type && ie.Type.toString().toLowerCase().includes('include')) ?? null;
                if (isInclude === false) exclusions.push(text);
                else inclusions.push(text);
            });
        }

        // WhyUs mapping (ordered)
        const whyUs = Array.isArray(d.WhyUs)
            ? d.WhyUs
                .slice()
                .sort((a: any, b: any) => (a.DisplayOrder ?? 0) - (b.DisplayOrder ?? 0))
                .map((w: any) => ({ id: w.TrekWhyUsId ?? w.Id, text: w.Description ?? w.Text ?? '' }))
            : [];

        // Highlights: accept array or delimited/string form
        let highlights: string[] = [];
        if (Array.isArray(d.Highlights)) {
            highlights = d.Highlights.map((h: any) => (typeof h === 'string' ? h : (h.Text ?? h.Description ?? ''))).filter(Boolean);
        } else if (typeof d.Highlights === 'string' && d.Highlights.trim()) {
            highlights = d.Highlights.split(/\r?\n|;|,/).map((s: string) => s.trim()).filter(Boolean);
        }

        // FAQs mapping and grouping by category
        const rawFaqs = Array.isArray(d.Faqs) ? d.Faqs : [];
        const faqGroups: Record<string, Array<{ question: string; answer: string }>> = {};
        rawFaqs.forEach((f: any) => {
            const cat = f.Category ?? 'General';
            const q = f.Question ?? f.Title ?? '';
            const a = f.Solution ?? f.Answer ?? f.Response ?? '';
            if (!faqGroups[cat]) faqGroups[cat] = [];
            faqGroups[cat].push({ question: q, answer: a });
        });

        // Reviews: compute count and avg rating if possible
        let reviewsCount = 0;
        let avgRating = 0;
        if (Array.isArray(d.Reviews) && d.Reviews.length > 0) {
            reviewsCount = d.Reviews.length;
            const sum = d.Reviews.reduce((s: number, r: any) => s + (r.Rating ?? r.Stars ?? 0), 0);
            avgRating = Math.round((sum / reviewsCount) || 0);
        }

        // Trip facts
        const tripFacts = [
            { label: 'Duration', value: `${d.DurationDays ?? d.Duration ?? 0} Days`, icon: '⏱' },
            { label: 'Max Altitude', value: `${d.MaxAltitudeMeters ?? d.MaxAltitude ?? 0} m`, icon: '🗻' },
            { label: 'Start', value: d.StartingPoint ?? d.StartCityName ?? '', icon: '📍' },
            { label: 'End', value: d.EndingPoint ?? d.EndCityName ?? '', icon: '🏁' },
        ];

        // Difficulty mapping from ActivityLevelId
        const difficulty = (() => {
            const lvl = d.ActivityLevelId ?? d.ActivityLevel ?? null;
            if (lvl === 1) return 'Easy';
            if (lvl === 2) return 'Moderate';
            if (lvl === 3) return 'Strenuous';
            return d.ActivityLevelName ?? 'Moderate';
        })();

        return {
            id: d.TrekId,
            title: d.Name ?? d.Title ?? '',
            url: d.Url,
            image: gallery[0] ?? getImgUrl(d.CoverImage) ?? '',
            overview: d.OverviewDescription ?? d.Description ?? d.Overview ?? '',
            duration: `${d.DurationDays ?? d.Duration ?? 0} Days`,
            price: Number(d.PriceInUSD ?? d.PriceInUSD) || 0,
            priceNpr: Number(d.PriceInNrs ?? d.PriceInNrs) || 0,
            rating: avgRating,
            reviews: reviewsCount,
            gallery,
            itinerary,
            highlights,
            // Equipment may not be present in DTO; default to empty array
            equipment: Array.isArray(d.Equipment) ? d.Equipment.map((e: any) => ({ category: e.Category ?? e.Group ?? 'General', items: e.Items ?? e.List ?? [] })) : (d.EquipmentList || d.Equipments || []),
            included: inclusions,
            excluded: exclusions,
            videoEmbedUrl: d.VideoLink ?? d.VideoUrl ?? null,
            mapEmbedUrl: d.TrekMap ?? null,
            faqGroups,
            whyUs,
            tripFacts,
            difficulty,
        } as any;
    }, [dto]);

    const [activeItinerary, setActiveItinerary] = useState<number | null>(1);
    // FAQ UX state: selected category, expanded individual faqs, and expand-all toggle
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({});
    const [expandAll, setExpandAll] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);


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

    // initialize FAQ category when trek loads / changes
    useEffect(() => {
        if (!trek) return;
        const keys = Object.keys(trek.faqGroups || {});
        setActiveCategory((prev) => prev ?? (keys.length > 0 ? keys[0] : null));
        setOpenFaqs({});
        setExpandAll(false);
    }, [trek]);

    if (isLoading) {
        return <LoadingSpinner fullPage={true} />;
    }

    if (error || !trek) {
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
        if (!trek.gallery || trek.gallery.length === 0) return;
        setLightboxIndex((prev) => (prev + 1) % trek.gallery.length);
    };

    const prevImage = () => {
        if (!trek) return;
        if (!trek.gallery || trek.gallery.length === 0) return;
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

    // local typed alias for faq groups to avoid 'unknown' inference
    const faqGroups = (trek?.faqGroups || {}) as Record<string, Array<{ question: string; answer: string }>>;

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

                            {/* Highlights (just below Overview) */}
                            {trek.highlights && trek.highlights.length > 0 && (
                                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Highlights</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {trek.highlights.map((h: string, idx: number) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7l10 5v7l-10-5-10 5v-7l10-5z" /></svg>
                                                <p className="text-gray-700 dark:text-gray-300">{h}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                                    {item.image && (
                                                        <div className="mb-4 overflow-hidden rounded-lg shadow-sm">
                                                            <img src={item.image} alt={item.title} className="w-full h-64 object-cover rounded-lg" />
                                                        </div>
                                                    )}



                                                    {item.dailyActivity ? (
                                                        <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                            {item.dailyActivity.split('\n').map((line: string, i: number) => (
                                                                <p key={i} className="mb-2">{line}</p>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                                                    )}
                                                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700 dark:text-gray-300 font-medium mb-4">
                                                        {/* Altitude */}
                                                        {item.altitude ? (
                                                            <div className="flex items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2L2 9l3 8h10l3-8-8-7z" /></svg>
                                                                <span><strong className="text-gray-800 dark:text-gray-100">Altitude:</strong> {item.altitude}m</span>
                                                            </div>
                                                        ) : null}

                                                        {/* Trek Time / Duration */}
                                                        {item.trekTimeHours !== null && typeof item.trekTimeHours !== 'undefined' ? (
                                                            <div className="flex items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a11 11 0 1011 11A11.013 11.013 0 0012 1zm1 12.59V7h-2v6l5 3 1-1.6z" /></svg>
                                                                <span><strong className="text-gray-800 dark:text-gray-100">Duration:</strong> {item.trekTimeHours ? `${item.trekTimeHours} hrs` : item.duration}</span>
                                                            </div>
                                                        ) : null}

                                                        {/* Distance */}
                                                        {item.trekDistanceKM !== null && typeof item.trekDistanceKM !== 'undefined' ? (
                                                            <div className="flex items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12l2-2 4 4 8-8 4 4v6H3z" /></svg>
                                                                <span><strong className="text-gray-800 dark:text-gray-100">Distance:</strong> {item.trekDistanceKM} km</span>
                                                            </div>
                                                        ) : null}

                                                        {/* Meals */}
                                                        {item.mealsIncluded ? (
                                                            <div className="flex items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2v12a4 4 0 004 4h4a4 4 0 004-4V2H6z" /></svg>
                                                                <span><strong className="text-gray-800 dark:text-gray-100">Meals:</strong> {item.mealsIncluded}</span>
                                                            </div>
                                                        ) : null}

                                                        {/* Transport */}
                                                        {item.transportMethod ? (
                                                            <div className="flex items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2l1-3h10l1 3h2v6h-2a2 2 0 01-2 2h-8a2 2 0 01-2-2H3v-6zM5 9a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                                                <span><strong className="text-gray-800 dark:text-gray-100">Transport:</strong> {item.transportMethod}</span>
                                                            </div>
                                                        ) : null}
                                                    </div>
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

                            {/* Why Us */}
                            {trek.whyUs && trek.whyUs.length > 0 && (
                                <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Why Us</h2>
                                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                                        {trek.whyUs.map((w: any) => (
                                            <li key={w.id} className="mb-2">{w.text}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* FAQs grouped by category: left category list + right FAQ panel */}
                            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Frequently Asked Questions</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Categories */}
                                    <div className="lg:col-span-3">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <ul className="space-y-2">
                                                {Object.entries(faqGroups).map(([cat, faqs]) => (
                                                    <li key={cat}>
                                                        <button
                                                            onClick={() => { setActiveCategory(cat); setExpandAll(false); setOpenFaqs({}); }}
                                                            className={`w-full text-left flex items-center gap-3 py-3 px-3 rounded-md transition-colors ${activeCategory === cat ? 'bg-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                                        >
                                                            <span className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-700 rounded-md text-blue-700">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" /></svg>
                                                            </span>
                                                            <div className="flex-1">
                                                                <div className="font-semibold text-sm text-gray-800 dark:text-gray-100">{cat}</div>
                                                                <div className="text-xs text-gray-500">{faqs.length} question{faqs.length !== 1 ? 's' : ''}</div>
                                                            </div>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Right: FAQ list for selected category */}
                                    <div className="lg:col-span-9">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{activeCategory || 'General'}</h3>
                                            <button
                                                onClick={() => {
                                                    const next = !expandAll;
                                                    setExpandAll(next);
                                                    if (!next) setOpenFaqs({});
                                                }}
                                                className="text-sm text-blue-700 hover:underline"
                                            >
                                                {expandAll ? 'Collapse All' : 'Expand All'}
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {(faqGroups && activeCategory && faqGroups[activeCategory] ? faqGroups[activeCategory] : []).map((f: any, i: number) => {
                                                const key = `${activeCategory}-${i}`;
                                                const open = expandAll || !!openFaqs[key];
                                                return (
                                                    <div key={key} className="border dark:border-gray-600 rounded-lg overflow-hidden">
                                                        <button
                                                            onClick={() => {
                                                                if (expandAll) return;
                                                                setOpenFaqs(prev => ({ ...prev, [key]: !prev[key] }));
                                                            }}
                                                            className={`w-full text-left p-4 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 flex justify-between items-center`}
                                                        >
                                                            <div className="text-left">
                                                                <div className="font-medium text-gray-800 dark:text-gray-100">{f.question}</div>
                                                            </div>
                                                            <span className={`transform transition-transform text-blue-700 ${open ? 'rotate-180' : ''}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                            </span>
                                                        </button>
                                                        <div className={`transition-all duration-300 ease-in-out ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                                            <div className="p-4 border-t dark:border-gray-600 text-gray-600 dark:text-gray-300">
                                                                {f.answer ? f.answer.split('\n').map((ln: string, idx: number) => <p key={idx} className="mb-2">{ln}</p>) : <p>No answer provided.</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
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
                                        <Link to={`/trek/${slug}/booking`} className="w-full text-center block bg-blue-700 text-white px-6 py-4 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 text-lg">
                                            Book Now
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