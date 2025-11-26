import React from 'react';

const TeamMember: React.FC<{ image: string; name: string; role: string; }> = ({ image, name, role }) => (
    <div className="text-center">
        <img src={image} alt={name} className="w-40 h-40 rounded-full mx-auto mb-4 object-cover shadow-lg" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{name}</h3>
        <p className="text-gray-500 dark:text-gray-400">{role}</p>
    </div>
);

const About: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="bg-gray-100 dark:bg-gray-800 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">About Heavenly Pathways</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">Your journey begins here. We are dedicated to crafting unforgettable travel experiences tailored just for you.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                At Heavenly Pathways, our mission is to make travel accessible, enjoyable, and enriching for everyone. We believe that travel is more than just visiting new places; it's about creating lasting memories, forging new connections, and discovering yourself along the way. We handle all the details, so you can focus on the adventure.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                From epic mountain treks to relaxing beach getaways, our expert team combines deep local knowledge with a passion for excellence to design your perfect trip. We are committed to responsible tourism and supporting the communities we visit.
              </p>
            </div>
            <div>
              <img src="https://picsum.photos/seed/about-mission/600/400" alt="Travelers enjoying a view" className="rounded-lg shadow-xl"/>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-12">Meet Our Expert Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  <TeamMember image="https://picsum.photos/seed/team1/200/200" name="John Doe" role="Founder & CEO" />
                  <TeamMember image="https://picsum.photos/seed/team2/200/200" name="Jane Smith" role="Head of Tours" />
                  <TeamMember image="https://picsum.photos/seed/team3/200/200" name="Peter Jones" role="Lead Trekking Guide" />
                  <TeamMember image="https://picsum.photos/seed/team4/200/200" name="Emily White" role="Customer Relations" />
              </div>
          </div>
      </section>

    </div>
  );
};

export default About;