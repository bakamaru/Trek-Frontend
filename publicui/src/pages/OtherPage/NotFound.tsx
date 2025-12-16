import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEOMetadata from "../../components/SEO";

const NotFound: React.FC = () => {
  return (
    <>
      <SEOMetadata
        title="Page Not Found - Territory Himalayas"
        description="The page you are looking for does not exist. Return to Territory Himalayas to continue your adventure."
      />

      <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
        {/* Background Decor Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1.5 }}
            className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-blue-400 rounded-full blur-[100px] dark:bg-blue-900"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-teal-400 rounded-full blur-[80px] dark:bg-teal-900"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          >
            {/* Mountain Silhouette SVG (Custom made for 404 theme) */}
            <svg className="w-64 h-64 mx-auto text-blue-600 dark:text-blue-500 mb-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M21 19.5H3l5.83-11.67L12 14l4.17-8.33L21 19.5z" // Simple mountain path
              />
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                strokeWidth="0.5"
                d="M6 19.5L12 8l6 11.5" // Inner detail
              />
            </svg>

          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400 mb-4"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6"
          >
            Lost in the Himalayas?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-10"
          >
            The path you are looking for seems to have been covered by snow. Let's get you back to safety.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/"
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
            >
              Back to Base Camp
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-full font-bold hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-blue-500 shadow-sm"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
