import React from 'react';
import { MdChevronRight } from 'react-icons/md';

export type BannerItemDto = {
  BannerId?: number;
  BannerItemId?: number;
  Heading?: string;
  SubHeading?: string;
  CTAText?: string;
  CTALink?: string;
  ContentPosition?: string; // 'left' | 'center' | 'right'
  Animation?: string; // 'fade' | 'slide-up' | 'zoom-in' | 'slide-right'
  OverlayOpacity?: number;
  ImageUrl?: string;
  IsImageDirectUrl?: boolean;
  DisplayOrder?: number;
};

export default function BannerSlideItem({ data, isActive }: { data?: BannerItemDto; isActive: boolean }) {
  if (!isActive || !data) return null;

  const getAnimClass = (delayStr: string) => {
    switch (data.Animation) {
      case 'slide-up':
        return `animate-slide-up ${delayStr}`;
      case 'slide-right':
        return `animate-fade-in-left ${delayStr}`;
      case 'zoom-in':
        return `animate-zoom-in ${delayStr}`;
      case 'fade':
        return `animate-slide-up ${delayStr}`;
      default:
        return `animate-slide-up ${delayStr}`;
    }
  };

  const alignClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[data.ContentPosition as string || 'center'];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 bg-slate-900">
        {data.ImageUrl ? (
          <img
            src={data.ImageUrl}
            alt={data.Heading}
            className="w-full h-full object-cover animate-[zoomIn_10s_ease-out_forwards]"
            key={data.ImageUrl}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1920x1080?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/50">No Image</div>
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-500"
          style={{ opacity: (data.OverlayOpacity ?? 40) / 100 }}
        />
      </div>

      {/* Content Container */}
      <div className={`relative h-full container mx-auto px-6 md:px-12 flex flex-col justify-center z-10 ${alignClass}`}>
        <div className="max-w-3xl">
          {/* Animated Heading */}
          <h1
            key={`h-${data.BannerItemId}`}
            className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg ${getAnimClass(
              ''
            )}`}
          >
            {data.Heading}
          </h1>

          {/* Animated Subheading */}
          <p
            key={`s-${data.BannerItemId}`}
            className={`text-lg md:text-2xl text-slate-200 mb-8 font-light drop-shadow-md ${getAnimClass('delay-100')}`}
          >
            {data.SubHeading}
          </p>

          {/* Animated CTA */}
          {data.CTAText && (
            <div key={`b-${data.BannerItemId}`} className={`${getAnimClass('delay-200')}`}>
                  <a
                    href={data.CTALink || '#'}
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 hover:scale-105 hover:shadow-xl transition-all duration-300 group"
                  >
                {data.CTAText}
                <MdChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
