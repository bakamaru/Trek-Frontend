import React from 'react';
import { useGetContactUsQuery } from '../redux/api/contentAPI';
import LoadingSpinner from '../components/LoadingSpinner';

const Contact: React.FC = () => {
    const { data: contactData, isLoading, error } = useGetContactUsQuery(undefined);

    if (isLoading) return <LoadingSpinner fullPage={true} />;
    if (error) return <div className="pt-20 text-center text-red-500">Failed to load contact info</div>;

    const { title, subtitle, address, email, phone, mapEmbedUrl } = contactData || {
        title: "Contact Us",
        subtitle: "We'd love to hear from you! Whether you have a question about our tours or need help planning your next adventure, we're here to help.",
        address: "123 Travel Lane, Adventure City, 98765",
        email: "hello@heavenlypathways.com",
        phone: "+1 (234) 567-890",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086434444983!2d-122.42172048468135!3d37.78916987975661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809a6bbeb6d3%3A0x440212f1dbaa1843!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1628892693892!5m2!1sen!2s"
    };

    return (
        <div className="pt-20">
            <section className="bg-gray-100 dark:bg-gray-800 py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">{title}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">{subtitle}</p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-100 dark:bg-blue-700/20 p-3 rounded-full"><span className="text-blue-700 text-2xl">📍</span></div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Our Office</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{address}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-100 dark:bg-blue-700/20 p-3 rounded-full"><span className="text-blue-700 text-2xl">✉️</span></div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Email Us</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{email}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-100 dark:bg-blue-700/20 p-3 rounded-full"><span className="text-blue-700 text-2xl">📞</span></div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Call Us</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Send a Message</h2>
                            <form className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                        <input type="text" id="name" className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                        <input type="email" id="email" className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                                    <input type="text" id="subject" className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                                    <textarea id="message" rows={5} className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full bg-blue-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full h-96">
                <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    title="Google Maps Location"
                    className="dark:grayscale dark:invert"
                ></iframe>
            </div>
        </div>
    );
};

export default Contact;