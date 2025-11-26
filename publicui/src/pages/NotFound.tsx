
import React, { useContext } from 'react';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
      <SEO title="Page Not Found" description="The page you are looking for does not exist." />
      <div className="mb-4">
          <h1 className="text-9xl font-extrabold text-blue-700 opacity-20 dark:opacity-40">404</h1>
      </div>
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 -mt-16 mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a href={"/"} className="bg-blue-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 shadow-lg">
          Back to Homepage
      </a>
    </div>
  );
};
export default NotFound;
