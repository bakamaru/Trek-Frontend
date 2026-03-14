

import React from 'react';


const Services: React.FC = () => {
  const SERVICES_DATA = [];
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service, index) => (
            <div key={index} className="flex items-start space-x-6 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div>{service.icon}</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;