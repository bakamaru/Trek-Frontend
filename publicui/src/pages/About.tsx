import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About Us - Territory Himalayas | Our Story & Mission"
        description="Discover Territory Himalayas, a team of passionate trekkers dedicated to providing authentic, safe, and unforgettable adventures in the Nepal Himalayas."
      />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://backend.territoryhimalaya.com/assets/bg/mountainrange.jpg?w=1800&h=500&mode=crop"
            alt="Himalayan Peaks"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1 px-3 rounded-full bg-blue-600/20 text-blue-300 backdrop-blur-sm border border-blue-500/30 text-sm font-semibold tracking-wide uppercase mb-4"
          >
            Since 2015
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Adventures That <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Define You</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto"
          >
            We don't just guide treks; we curate life-changing journeys into the heart of the Himalayas.
          </motion.p>
        </div>
      </div>

      {/* Narrative Section - Our Story */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://backend.territoryhimalaya.com/assets/bg/mountainrange.jpg?w=800&h=600&mode=crop"
                  alt="Trekker looking at mountains"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Decorative blob or shape behind */}
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl -z-10"></div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                More Than Just A Trekking Company
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                <p>
                  Territory Himalayas was born from a simple passion: to share the raw, untamed beauty of Nepal with the world. What started as a small group of friends exploring local trails has grown into a premier adventure travel company, but our core spirit remains unchanged.
                </p>
                <p>
                  We believe that travel changes you. It challenges your limits, opens your mind to new cultures, and connects you with nature in its purest form. Every itinerary we craft is designed to offer not just a vacation, but a transformative experience.
                </p>
                <div className="pt-4 border-l-4 border-blue-500 pl-6">
                  <p className="italic text-gray-800 dark:text-gray-200 font-medium text-xl">
                    "Our goal is to ensure every footprint we leave behind is one of respect, and every memory you take home is one of joy."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Travel With Us?</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              We combine local expertise with world-class safety standards to bring you the best of the Himalayas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Safety First</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your safety is our priority. Our guides are trained in wilderness first aid, and we carry comprehensive medical kits and communication devices on every trek.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Local Experts</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Born and raised in the mountains, our team possesses intimate knowledge of the trails, culture, and hidden gems that others miss.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Sustainable Travel</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We are committed to eco-friendly practices. We support local communities, minimize waste, and ensure our treks have a positive impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Preview */}
      <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet The Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">The people who make your journey possible.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="text-center group">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-gray-800">
                <img src="#" alt="Member" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bikram Lamichhane</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium">Founder & Lead Guide</p>
            </div>


            {/* <div className="text-center group">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-gray-800">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop" alt="Member" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sarah Jenkins</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium">Operations Manager</p>
            </div>

          
            <div className="text-center group">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-gray-800">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop" alt="Member" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">John Doe</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium">Customer Experience</p>
            </div>

          
            <div className="text-center group">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-gray-800">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop" alt="Member" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Maya Gurung</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium">Senior Trek Leader</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 relative is-dark">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://backend.territoryhimalaya.com/assets/bg/mountainrange.jpg?w=1800&h=500&mode=crop"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Join us for an unforgettable experience in the Himalayas. Your journey of a lifetime begins with a single step.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="px-8 py-3.5 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              Contact Us
            </Link>
            <Link to="/" className="px-8 py-3.5 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
              Explore Treks
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;