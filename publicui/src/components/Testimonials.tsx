import React, { useState, useEffect } from 'react';
import { useGetActiveTestimonialsQuery } from '../redux/api/testimonialAPI';
import LoadingSpinner from './LoadingSpinner';

// Match your backend Testimonial model
type ApiTestimonial = {
  Id: number;
  Name: string;
  ThumbnailImage: string;
  Description: string;
  ShortDescription: string;
  Designation: string;
  Email: string;
  Url: string;
  ShowInHome: boolean;
  IsApproved: boolean;
};

type TestimonialApiResponse = {
  Code: number;
  Message: string;
  Data: ApiTestimonial[];
  Errors?: any[];
};

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: rawData, isLoading, error } = useGetActiveTestimonialsQuery({
    offset: 1,
    limit: 5,
    query: "",
  });

  const response = rawData as TestimonialApiResponse | undefined;
  const testimonials: ApiTestimonial[] = response?.Data ?? [];

  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

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
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real stories from our satisfied travelers.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.Id ?? index} className="w-full flex-shrink-0 px-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                  <p className="text-gray-600 dark:text-gray-300 italic text-lg mb-6">
                    "
                    {testimonial.ShortDescription || testimonial.Description}
                    "
                  </p>
                  <img
                    src={
                      testimonial.ThumbnailImage ||
                      'https://via.placeholder.com/150?text=User'
                    }
                    alt={testimonial.Name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-200 object-cover"
                  />
                  <h4 className="font-bold text-xl text-gray-800 dark:text-gray-100">
                    {testimonial.Name}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    {testimonial.Designation}
                  </p>
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
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentIndex === index
                  ? 'bg-blue-700'
                  : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
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
