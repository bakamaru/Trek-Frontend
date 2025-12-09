import React from 'react';
import { Link } from 'react-router-dom';
//import { useGetFooterMenu } from '../redux/api/menuAPI';
import LoadingSpinner from './LoadingSpinner';
import { FooterMenu, FooterSection } from '../types/types';

const Footer: React.FC = () => {
  //const { data: footerData, isLoading, error } = useGetFooterMenuQuery(undefined);

  // if (isLoading) return <LoadingSpinner />;
  // if (error) return <div className="text-red-500 text-center p-4">Failed to load footer</div>;

  // const { sections, socialLinks } = footerData || {
  //   sections: [],
  //   socialLinks: []
  // };

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-4">
              <Link to="/" className="hover:text-white">
                Territory Himalaya<span className="text-blue-700">Pathways</span>
              </Link>
            </h3>
            <p className="mb-4">
              We are a passionate team of travel experts dedicated to creating unforgettable journeys for our clients.
            </p>
            <div className="flex space-x-4">
              {/* {socialLinks?.map((link, index) => (
                <a key={index} href={link.url} className="hover:text-blue-700 transition-colors duration-300">{link.platform}</a>
              ))} */}
            </div>
          </div>

          {/* Dynamic Sections */}
          {/* {sections?.map((section: FooterSection, index: number) => (
            <div key={index}>
              <h4 className="text-xl font-bold text-white mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className="hover:text-blue-700 transition-colors duration-300">{link.label}</Link>
                    ) : (
                      <a href={link.href} className="hover:text-blue-700 transition-colors duration-300">{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))} */}

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
          <p>&copy; {new Date().getFullYear()} Territory Himalayas. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;