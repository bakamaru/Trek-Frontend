

import React from 'react';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white bg-blue-700 rounded-full p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);


const WhyChooseUs: React.FC = () => {
  const features = [
    '24/7 Support',
    'Best Price Guarantee',
    'Handpicked Hotels',
    'Expert Travel Agents'
  ];
  const CDN_URL = (import.meta.env.VITE_CDN_PATH || '').replace(/\/+$/, '');
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img src={`${CDN_URL}/assets/bg/h_cus.jpg?w=800&h=800&mode=crop`} alt="Why choose us" className="rounded-lg shadow-2xl w-full h-auto" />
            <div className="absolute -bottom-8 -right-8 bg-blue-700 text-white p-8 rounded-lg shadow-xl w-64 hidden md:block">
              <p className="text-4xl font-extrabold">100%</p>
              <p className="text-lg font-semibold">Satisfaction Rate</p>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">Why Choose Us</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              We are committed to providing you with the best travel experience. Our team of experts works tirelessly to create personalized itineraries that match your interests and budget.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckIcon />
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <a href="/contact-us" className="bg-blue-700 text-white px-8 py-4 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;