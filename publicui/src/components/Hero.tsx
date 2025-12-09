import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGetBannerItemsByKeyQuery } from '../redux/api/bannerAPI';
import LoadingSpinner from './LoadingSpinner';
import BannerSlideItem from './common/BannerSlideItem';

type BannerItemDto = {
  BannerId: number;
  BannerItemId: number;
  Heading: string;
  SubHeading: string;
  CTAText: string;
  CTALink: string;
  ContentPosition: string; // 'left' | 'center' | 'right' (string for safety)
  Animation: string;       // 'fade' | 'slide-up' | 'zoom-in' | 'slide-right' etc.
  OverlayOpacity: number;
  ImageUrl: string;
  IsImageDirectUrl: boolean;
  DisplayOrder: number;
};

type BannerResponse = {
  Code: number;
  Message: string;
  Data: BannerItemDto[];
  Errors?: any[];
};

const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Flight' | 'Hotel' | 'Car Rent'>('Flight');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const autoPlayRef = useRef<number | null>(null);

  const { data: heroDataRaw, isLoading, error } = useGetBannerItemsByKeyQuery("landing");

  const heroData = heroDataRaw as BannerResponse | undefined;
  const slides: BannerItemDto[] = [...(heroData?.Data ?? [])].sort(
    (a, b) => (a.DisplayOrder ?? 0) - (b.DisplayOrder ?? 0)
  );

  // Fallback slide if no data
  const fallbackSlide: BannerItemDto = {
    BannerId: 0,
    BannerItemId: 0,
    Heading: "Amazing and Beautiful Nepal",
    SubHeading: "",
    CTAText: "",
    CTALink: "#",
    ContentPosition: "center",
    Animation: "fade",
    OverlayOpacity: 40,
    ImageUrl: "",
    IsImageDirectUrl: true,
    DisplayOrder: 0,
  };

  const displaySlides = slides.length ? slides : [fallbackSlide];
  const activeSlide = displaySlides[activeSlideIndex % displaySlides.length] || fallbackSlide;

  // Auto-play slider with toggle
  useEffect(() => {
    if (!displaySlides.length) return;

    if (isAutoPlay) {
      autoPlayRef.current = window.setInterval(() => {
        setActiveSlideIndex((prev) => (prev + 1) % displaySlides.length);
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    };
  }, [displaySlides.length, isAutoPlay]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [displaySlides.length]);

  const handleDotClick = (index: number) => {
    setActiveSlideIndex(index);
    setIsAutoPlay(false);
  };

  const handlePrev = () => {
    setActiveSlideIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
    setIsAutoPlay(false);
  };

  const handleNext = () => {
    setActiveSlideIndex((prev) => (prev + 1) % displaySlides.length);
    setIsAutoPlay(false);
  };

  const getContentAlignClass = (position: string | undefined) => {
    switch (position) {
      case 'left':
        return 'items-start text-left';
      case 'right':
        return 'items-end text-right';
      case 'center':
      default:
        return 'items-center text-center';
    }
  };

  const getAnimationClass = (animation: string | undefined) => {
    switch (animation) {
      case 'slide-up':
        return 'animate-slide-up';
      case 'slide-right':
        return 'animate-fade-in-left';
      case 'zoom-in':
        return 'animate-zoom-in';
      case 'fade':
      default:
        return 'animate-slide-up';
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'Flight':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Location</label>
              <input
                type="text"
                placeholder="Where are you from?"
                className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">To</label>
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Date</label>
              <input
                type="date"
                className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:[color-scheme:dark]"
              />
            </div>
            <Link
              to="/flights"
              className="w-full text-center bg-blue-700 text-white p-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 h-[50px] flex items-center justify-center"
            >
              Search
            </Link>
          </div>
        );
      case 'Hotel':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Location</label>
              <input
                type="text"
                placeholder="Enter a destination or hotel"
                className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Check in</label>
              <input
                type="date"
                className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:[color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Check out</label>
              <input
                type="date"
                className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:[color-scheme:dark]"
              />
            </div>
            <Link
              to="/hotels"
              className="w-full text-center bg-blue-700 text-white p-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 h-[50px] flex items-center justify-center"
            >
              Search
            </Link>
          </div>
        );
      case 'Car Rent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Picking up</label>
              <input
                type="text"
                placeholder="Enter a location"
                className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Dropping off</label>
              <input
                type="text"
                placeholder="Enter a location"
                className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Date</label>
              <input
                type="date"
                className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:[color-scheme:dark]"
              />
            </div>
            <Link
              to="/cars"
              className="w-full text-center bg-blue-700 text-white p-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 h-[50px] flex items-center justify-center"
            >
              Search
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">Failed to load hero content</div>;

  const alignClass = getContentAlignClass(activeSlide.ContentPosition);
  const animationClass = getAnimationClass(activeSlide.Animation);
  const overlayOpacity = (activeSlide.OverlayOpacity ?? 40) / 100;

  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Slides */}
      <div className="absolute inset-0 z-0">
        {displaySlides.map((slide, idx) => (
          <BannerSlideItem key={(slide.BannerItemId || idx).toString()} data={slide} isActive={idx === activeSlideIndex} />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 transition-all hover:scale-105 z-20"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 transition-all hover:scale-105 z-20"
      >
        ›
      </button>

      <div className={`container mx-auto px-4 z-10 mt-20 flex flex-col justify-center h-full ${alignClass} text-white pointer-events-none`}>
        <div className="max-w-3xl mx-auto pointer-events-none">

          {/* Search Tabs + Forms (kept commented for now) */}
          {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl max-w-5xl mx-auto text-left">
            <div className="flex border-b dark:border-gray-700 mb-6">
              {(['Flight', 'Hotel', 'Car Rent'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-6 font-semibold text-lg transition-colors duration-300 ${activeTab === tab
                    ? 'border-b-4 border-blue-700 text-gray-800 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {renderForm()}
          </div> */}

          {/* content placeholder (non-interactive) */}
        
        </div>
      </div>

      {/* Dots moved below slider (absolute footer) */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="flex justify-center mt-6 space-x-2">
            {displaySlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${activeSlideIndex === idx ? 'bg-white w-6' : 'bg-white/50 w-2'
                  }`}
              />
            ))}
          </div>
        </div>
      )}
    
    </section>
  );
};

export default Hero;
