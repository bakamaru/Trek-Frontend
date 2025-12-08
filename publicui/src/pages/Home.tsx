import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import TopDestinations from '../components/TopDestinations';
import PopularTours from '../components/PopularTours';
import PopularTreks from '../components/PopularTreks';
import VideoPromo from '../components/VideoPromo';
import WhyChooseUs from '../components/WhyChooseUs';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Blog from '../components/Blog';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="Welcome to Territory Himalayas. Discover your next adventure with our curated treks, tours, and travel experiences worldwide."
        context="Territory Himalayas is a leading travel agency offering treks in Nepal, tours in Europe, and beach vacations in Thailand. Best price guaranteed and 24/7 support."
      />
      <Hero />
      <Services />
      <TopDestinations />
      <PopularTours />
      <PopularTreks />
      <VideoPromo />
      <WhyChooseUs />
      <Gallery />
      <Testimonials />
      <Blog />
    </>
  );
};

export default Home;