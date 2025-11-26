

import React from 'react';

const VideoPromo: React.FC = () => {
  return (
    <section className="video-promo-bg bg-cover bg-center py-40 relative">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 z-10 relative text-center text-white">
        <button className="bg-white rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-8 group">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-700 transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Enjoy Your Holiday</h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Sit back and relax. We'll take care of everything to make your travel experience unforgettable.
        </p>
      </div>
    </section>
  );
};

export default VideoPromo;