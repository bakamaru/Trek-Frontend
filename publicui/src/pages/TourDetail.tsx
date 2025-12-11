import React, { useContext, useState, useEffect } from 'react';
import { TourDetail as TourDetailType } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { Link, useParams } from 'react-router-dom';



const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface TourDetailProps {
  //tourId: string;
}

const TourDetail: React.FC<TourDetailProps> = () => {
  const [tour, setTour] = useState<TourDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { slug } = useParams();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const foundTour:any = {};//TOURS_DETAIL_DATA.find(t => t.id === slug);
      setTour(foundTour || null);
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
  }, [lightboxOpen, lightboxIndex, tour]);

  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (!tour) {
    return (
      <div className="pt-20 h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Tour Not Found</h1>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    if (!tour) return;
    setLightboxIndex((prev) => (prev + 1) % tour.gallery.length);
  };

  const prevImage = () => {
    if (!tour) return;
    setLightboxIndex((prev) => (prev - 1 + tour.gallery.length) % tour.gallery.length);
  };

  const Lightbox = () => (
    lightboxOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
        <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors" onClick={() => setLightboxOpen(false)} aria-label="Close lightbox">&times;</button>
        <button className="absolute left-4 sm:left-10 text-white text-4xl hover:text-gray-300 transition-colors" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Previous image">&#8249;</button>
        <img src={tour.gallery[lightboxIndex]} alt={`Tour gallery image ${lightboxIndex + 1}`} className="max-h-[90vh] max-w-[90vw] object-contain" onClick={(e) => e.stopPropagation()} />
        <button className="absolute right-4 sm:right-10 text-white text-4xl hover:text-gray-300 transition-colors" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Next image">&#8250;</button>
      </div>
    )
  );

  return (
    <div className="pt-20 bg-gray-50 dark:bg-gray-800">
      <SEO
        title={tour.title}
        description={`Experience ${tour.title} in ${tour.location}. ${tour.duration} tour starting from $${tour.price}.`}
        image={tour.image}
        context={`${tour.title} is a ${tour.duration} tour in ${tour.location} costing $${tour.price}. Overview: ${tour.overview}`}
      />
      <Lightbox />
      {/* Hero Section */}
      <section
        className="h-[50vh] bg-cover bg-center flex items-end text-white relative"
        style={{ backgroundImage: `url(${tour.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="container mx-auto px-4 z-10 pb-12">
          <h1 className="text-5xl lg:text-6xl font-extrabold">{tour.title}</h1>
          <div className="flex flex-wrap items-center mt-4 gap-x-4 gap-y-2">
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < tour.rating} />
                ))}
              </div>
              <span className="text-white ml-2">({tour.reviews} reviews)</span>
            </div>
            <span className="text-lg hidden md:inline">|</span>
            <span className="text-lg">{tour.duration}</span>
            <span className="text-lg hidden md:inline">|</span>
            <span className="text-lg">{tour.location}</span>
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
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Tour Overview</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{tour.overview}</p>
              </div>

              {/* Cost Includes/Excludes */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">What's Included</h3>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-600 dark:text-gray-300"><svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">What's Excluded</h3>
                  <ul className="space-y-2">
                    {tour.excluded.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-600 dark:text-gray-300"><svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Gallery */}
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tour.gallery.map((imgSrc, index) => (
                    <div key={index} className="cursor-pointer overflow-hidden rounded-lg group" onClick={() => openLightbox(index)}>
                      <img src={imgSrc} alt={`Tour gallery image ${index + 1}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              {tour.mapEmbedUrl && (
                <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Location Map</h2>
                  <div className="overflow-hidden rounded-lg">
                    <iframe src={tour.mapEmbedUrl} width="100%" height="450" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="rounded-lg dark:grayscale dark:invert"></iframe>
                  </div>
                </div>
              )}

              {/* FAQs */}
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {tour.faqs.map((faq, index) => (
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
                {/* Booking Card */}
                <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg border dark:border-gray-600">
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    From <span className="text-blue-700">${tour.price.toLocaleString()}</span>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400"> / person</span>
                  </p>
                  <div className="my-6">
                    <Link to={`/tour/${tour.id}/booking`} className="w-full text-center block bg-blue-700 text-white px-6 py-4 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 text-lg">
                      Book This Tour
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

export default TourDetail;