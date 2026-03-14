import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaInstagram, FaTiktok, FaLinkedin } from 'react-icons/fa';
//import { useGetFooterMenuQuery } from '../redux/api/menuAPI';
import LoadingSpinner from './LoadingSpinner';
import { FooterMenu, FooterSection } from '../types/types';

const Footer: React.FC = () => {
  // const { data: footerData, isLoading, error } = useGetFooterMenuQuery(undefined);

  // if (isLoading) return <LoadingSpinner />;
  // if (error) return <div className="text-red-500 text-center p-4">Failed to load footer</div>;

  // const { sections, socialLinks } = footerData || {
  //   sections: [],
  //   socialLinks: []
  // };
  const socialLinks = [
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/territoryhimalaya',
      icon: <FaFacebook className="w-6 h-6" />
    },
    {
      platform: 'Youtube',
      url: 'https://www.youtube.com/@TerritoryHimalaya',
      icon: <FaYoutube className="w-6 h-6" />
    },
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/territoryhimalaya',
      icon: <FaInstagram className="w-6 h-6" />
    },
    {
      platform: 'Tiktok',
      url: 'https://www.tiktok.com/@territoryhimalaya',
      icon: <FaTiktok className="w-6 h-6" />
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/company/territory-himalaya/',
      icon: <FaLinkedin className="w-6 h-6" />
    }
  ];
  const CDN_URL = (import.meta.env.VITE_CDN_PATH || '').replace(/\/+$/, '');
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-4">
              <a href="/" className="hover:text-white">
                <img src={`${CDN_URL}/assets/logo/logo-v-dark.svg`} width={300} />

              </a>
            </h3>
            <p className="mb-4">
              We are a passionate team of travel experts dedicated to creating unforgettable journeys for our clients.
            </p>
            <div className="flex space-x-4">
              {socialLinks?.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors duration-300" aria-label={link.platform}>
                  {link.icon || link.platform}
                </a>
              ))}
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
          <p>&copy; {new Date().getFullYear()} Territory Himalaya. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;