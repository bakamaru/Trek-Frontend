import React, { useState, useEffect } from 'react';
import { useGetTestimonialsQuery } from '../redux/api/contentAPI';
import LoadingSpinner from './LoadingSpinner';
import { Testimonial } from '../types/types';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: testimonials, isLoading, error } = useGetTestimonialsQuery(undefined);

  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [testimonials]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">Failed to load testimonials</div>;
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">What Our Client Say</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Real stories from our satisfied travelers.</p>
        </div>

        <div className="relative max-w-3xl mx-auto overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial: Testimonial, index: number) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                  <p className="text-gray-600 dark:text-gray-300 italic text-lg mb-6">"{testimonial.quote}"</p>
                  <img src={testimonial.image} alt={testimonial.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-200" />
                  <h4 className="font-bold text-xl text-gray-800 dark:text-gray-100">{testimonial.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentIndex === index ? 'bg-blue-700' : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;