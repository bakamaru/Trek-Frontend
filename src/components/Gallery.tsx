
import React, { useState, useEffect, useCallback } from 'react';
import { GALLERY_IMAGES } from '../const/constants';

const Gallery: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % GALLERY_IMAGES.length);
  }, []);

  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  // Generate HD URL by doubling dimensions in the picsum URL
  const getHdUrl = (url: string) => {
    return url.replace(/(\d+)\/(\d+)$/, (match, w, h) => {
      return `${parseInt(w) * 2}/${parseInt(h) * 2}`;
    });
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800" id="gallery">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Our Gallery</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">A glimpse into the beautiful moments from our tours.</p>
        </div>
        
        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
            {GALLERY_IMAGES.map((image, index) => (
                <div 
                    key={image.id} 
                    className="mb-4 break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                    onClick={() => openLightbox(index)}
                >
                    <img
                        className="w-full h-auto object-cover transition-transform duration-500 transform group-hover:scale-105"
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors focus:outline-none"
            onClick={closeLightbox}
            aria-label="Close Gallery"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
          
          {/* Previous Button */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 text-white/70 hover:text-white transition-colors focus:outline-none hidden sm:block"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 text-white/70 hover:text-white transition-colors focus:outline-none hidden sm:block"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Next Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Container */}
          <div className="relative max-w-full max-h-full p-4" onClick={(e) => e.stopPropagation()}>
             <img 
              key={currentIndex} // Force re-render for animation if needed
              src={getHdUrl(GALLERY_IMAGES[currentIndex].src)} 
              alt={GALLERY_IMAGES[currentIndex].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain shadow-2xl rounded-sm"
            />
            <div className="absolute bottom-0 left-0 right-0 text-center transform translate-y-full pt-4">
                <p className="text-white text-lg font-medium tracking-wide">
                    {GALLERY_IMAGES[currentIndex].alt}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    {currentIndex + 1} / {GALLERY_IMAGES.length}
                </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
