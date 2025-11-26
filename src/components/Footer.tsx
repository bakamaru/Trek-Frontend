import React, { useContext } from 'react';
import { Link } from 'react-router-dom';


const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
             <h3 className="text-3xl font-extrabold text-white mb-4">
                <Link to="/" className="hover:text-white">
                    Heavenly<span className="text-blue-700">Pathways</span>
                </Link>
            </h3>
            <p className="mb-4">
              We are a passionate team of travel experts dedicated to creating unforgettable journeys for our clients.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-700 transition-colors duration-300">FB</a>
              <a href="#" className="hover:text-blue-700 transition-colors duration-300">TW</a>
              <a href="#" className="hover:text-blue-700 transition-colors duration-300">IG</a>
              <a href="#" className="hover:text-blue-700 transition-colors duration-300">LN</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-blue-700 transition-colors duration-300">About Us</Link></li>
              <li><Link to="/tours" className="hover:text-blue-700 transition-colors duration-300">Tours</Link></li>
              <li><Link to="/destinations" className="hover:text-blue-700 transition-colors duration-300">Destinations</Link></li>
              <li><Link to="/blog" className="hover:text-blue-700 transition-colors duration-300">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-blue-700 transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-700 transition-colors duration-300">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors duration-300">Support Center</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">Newsletter</h4>
            <p className="mb-4">Subscribe to our newsletter for the latest travel deals and updates.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 placeholder-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:placeholder-gray-400"
              />
              <button 
                type="submit"
                className="bg-blue-700 text-white px-4 py-2 rounded-r-md font-semibold hover:bg-blue-800 transition-colors duration-300"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 dark:bg-black py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Heavenly Pathways. All Rights Reserved. Created with React & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;