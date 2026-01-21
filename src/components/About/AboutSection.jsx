import React from 'react';

const AboutSection = () => {
  // const milestones = [
  //   { year: '2018', title: 'Journey Begins', description: 'Started as a small fitness studio' },
  //   { year: '2019', title: 'First Expansion', description: 'Moved to 5,000 sq ft facility' },
  //   { year: '2020', title: 'Digital Transformation', description: 'Launched virtual training platform' },
  //   { year: '2022', title: 'Community Growth', description: 'Reached 5,000+ members' },
  //   { year: '2023', title: 'Excellence Award', description: 'Best Gym in the City award' },
  //   { year: '2024', title: 'Future Vision', description: 'Expanding to 3 new locations' }
  // ];

  return (
    <section className=" sm:py-10 md:py-10 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary  text-white">Story & Vision</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            More than a gym - a movement dedicated to transforming lives through sustainable fitness and community support
          </p>
        </div>

        {/* Main Content with Image */}
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12 mb-16 sm:mb-20">
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=80" 
                  alt="FITLYF Premium Facility" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-2xl sm:text-3xl font-bold">Premium Fitness Experience</h3>
                      <p className="text-gray-300 text-sm sm:text-base">Excellence Since 2018</p>
                    </div>
                    <div className="hidden sm:block">
                      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-4 py-2 rounded-xl text-sm font-bold">
                        AWARD WINNING
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-brand-primary"></div>
              <span className="text-brand-primary text-sm font-bold uppercase tracking-wider">Our Journey</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
              Redefining <span className="text-transparent bg-clip-text text-white bg-gradient-to-r from-brand-primary to-brand-secondary">Fitness Excellence</span>
            </h3>
            
            <div className="space-y-6">
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                At <span className="text-brand-primary font-bold">FITLYF</span>, we've built more than just a gym – we've created a holistic wellness ecosystem where every individual's fitness journey is nurtured, supported, and celebrated. Our philosophy centers on sustainable transformation through personalized guidance, cutting-edge facilities, and a community that inspires growth.
              </p>
              
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Since our inception in 2018, we've evolved from a passionate fitness studio into a comprehensive wellness destination, empowering thousands of members to achieve life-changing results. Our state-of-the-art facility features the latest in fitness technology, diverse programming, and expert-led training designed to help you exceed your potential.
              </p>
              
              <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-brand-primary/10 rounded-full blur-3xl"></div>
                <h4 className="text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-brand-primary"></span>
                  Our Philosophy
                </h4>
                <p className="text-gray-300">
                  We believe in <span className="text-brand-primary font-semibold">sustainable fitness evolution</span> – no extreme measures, just proven methodologies, expert mentorship, and a supportive community that helps you build lasting lifestyle habits.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {[
            {
              title: "Our Mission",
              description: "To empower individuals to achieve their highest potential through personalized fitness solutions, continuous education, and a supportive community ecosystem.",
              icon: "🎯",
              gradient: "from-blue-500/20 to-blue-600/20",
              border: "border-blue-500/30",
              accent: "text-blue-400"
            },
            {
              title: "Our Vision",
              description: "To become the premier wellness destination where every individual discovers the tools, guidance, and inspiration to lead a healthier, more fulfilling life.",
              icon: "🔭",
              gradient: "from-purple-500/20 to-purple-600/20",
              border: "border-purple-500/30",
              accent: "text-purple-400"
            },
            {
              title: "Our Values",
              description: "Excellence, Integrity, Community, Innovation, and Empowerment guide every interaction and decision at FITLYF, creating an environment where everyone thrives.",
              icon: "💎",
              gradient: "from-emerald-500/20 to-emerald-600/20",
              border: "border-emerald-500/30",
              accent: "text-emerald-400"
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className={`group relative bg-gradient-to-br ${item.gradient} backdrop-blur-sm border ${item.border} rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`text-3xl ${item.accent}`}>
                  {item.icon}
                </div>
                <h3 className="text-white text-xl sm:text-2xl font-bold">{item.title}</h3>
              </div>
              
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                {item.description}
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-800/50">
                <div className="flex items-center text-gray-400 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 14.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Core Principle</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose FITLYF */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r text-white from-brand-primary to-brand-secondary">FITLYF Difference</span>
            </h3>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
              Discover what sets us apart in your fitness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6">
              {[
                {
                  icon: "🏅",
                  title: "Elite Certified Trainers",
                  description: "Our team holds NASM, ACE, and ISSA certifications with 10+ years average experience in professional coaching.",
                  gradient: "from-blue-500/20 to-blue-600/20"
                },
                {
                  icon: "💎",
                  title: "Premium Equipment Selection",
                  description: "Latest Technogym, Life Fitness, and Hammer Strength machines with regular upgrades and maintenance.",
                  gradient: "from-purple-500/20 to-purple-600/20"
                },
                {
                  icon: "📋",
                  title: "Personalized Programming",
                  description: "Custom workout and nutrition plans based on your unique goals, body composition, and lifestyle factors.",
                  gradient: "from-emerald-500/20 to-emerald-600/20"
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 transition-all duration-500 hover:border-brand-primary/50"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center text-2xl`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: "🤝",
                  title: "Supportive Community",
                  description: "Join a positive, motivating network that celebrates every milestone and supports every challenge.",
                  gradient: "from-orange-500/20 to-orange-600/20"
                },
                {
                  icon: "🎭",
                  title: "Diverse Programming",
                  description: "50+ weekly classes including Yoga, HIIT, Strength Training, Zumba, Pilates, and specialized workshops.",
                  gradient: "from-pink-500/20 to-pink-600/20"
                },
                {
                  icon: "⏰",
                  title: "Flexible Accessibility",
                  description: "Open 5AM to 11PM, 365 days a year with 24/7 digital support and on-demand training options.",
                  gradient: "from-cyan-500/20 to-cyan-600/20"
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 transition-all duration-500 hover:border-brand-primary/50"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center text-2xl`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 sm:p-10 overflow-hidden mb-16 sm:mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-secondary/10"></div>
          <div className="relative">
            <h3 className="text-2xl font-bold text-white text-center mb-8 sm:mb-12">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r text-white from-brand-primary to-brand-secondary">Impact</span> in Numbers
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { value: '5+', label: 'Years of Excellence', icon: '📅' },
                { value: '5000+', label: 'Members Transformed', icon: '😊' },
                { value: '15+', label: 'Elite Trainers', icon: '🏆' },
                { value: '50+', label: 'Weekly Classes', icon: '🎯' }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-500">
                    {stat.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Journey Timeline */}
        {/* <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r  text-white from-brand-primary to-brand-secondary">Journey</span> Timeline
            </h3>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
              Milestones in our pursuit of fitness excellence
            </p>
          </div>
          
          <div className="relative">
             Timeline Line 
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-brand-primary via-brand-secondary to-transparent hidden lg:block"></div>
            
            <div className="space-y-8 lg:space-y-0">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`group relative flex flex-col lg:flex-row items-center lg:items-start ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  
                  <div className="relative z-10">
                    <div className="w-4 h-4 lg:w-6 lg:h-6 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full shadow-2xl shadow-brand-primary/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full animate-ping opacity-20"></div>
                  </div>
                  
                   
                  <div className={`lg:w-5/12 mt-4 lg:mt-0 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div className="group-hover:scale-[1.02] transition-all duration-500 bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
                      <div className="text-brand-primary text-2xl font-bold mb-2">
                        {milestone.year}
                      </div>
                      <h4 className="text-white text-xl font-bold mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-gray-300">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Founder's Message */}
        {/* <div className="relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 sm:p-10 md:p-12 overflow-hidden mb-16 sm:mb-20">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-secondary/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-8 sm:gap-12">
            <div className="md:w-2/5 w-full">
              <div className="relative mx-auto max-w-xs">
                <img 
                  src="https://images.unsplash.com/photo-1563122870-6b0b48a0af09?w=600&q=80" 
                  alt="Arif Khan - Founder" 
                  className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-2xl">
                  FOUNDER
                </div>
              </div>
              <div className="text-center mt-8">
                <h4 className="text-white text-2xl font-bold mb-2">Arif Khan</h4>
                <p className="text-brand-primary text-lg font-medium mb-3">Founder & Head Trainer</p>
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 14.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>NASM, ACE Certified | 12+ Years Experience</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-3/5 w-full">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-8 h-0.5 bg-brand-primary"></div>
                <span className="text-brand-primary text-sm font-bold uppercase tracking-wider">Founder's Message</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Building a Legacy of <span className="text-transparent bg-clip-text text-white bg-gradient-to-r from-brand-primary to-brand-secondary">Transformation</span>
              </h3>
              
              <blockquote className="text-gray-300 text-lg leading-relaxed italic mb-8 border-l-4 border-brand-primary pl-6">
                "Fitness completely transformed my life, and founding FITLYF was my opportunity to help transform yours. We've created more than a gym – we've built a sanctuary where physical transformation meets mental empowerment and community support.
                <br /><br />
                Every day, I'm inspired by the incredible journeys of our members. Your success is our success, and I promise you'll find the guidance, support, and motivation you need to achieve goals you never thought possible."
              </blockquote>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">Rated "Best Gym Experience" by 500+ members</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* CTA Section */}
        {/* <div className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 sm:p-10 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-secondary/10"></div>
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl mb-6 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Begin Your <span className="text-transparent bg-clip-text text-white bg-gradient-to-r from-brand-primary to-brand-secondary">Transformation</span>?
            </h3>
            
            <p className="text-gray-300 text-lg sm:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto">
              Join our community of achievers and experience the FITLYF difference. Your journey to a stronger, healthier, and more confident you starts today.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
              <button className="group relative bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl text-base sm:text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/40 transform hover:scale-[1.02]">
                Book Free Consultation
                <svg className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl text-base sm:text-lg transition-all duration-500 hover:bg-gray-700/50 hover:border-gray-600 transform hover:scale-[1.02]">
                Schedule Facility Tour
              </button>
            </div>
            
            <p className="text-gray-500 text-sm sm:text-base mt-6 sm:mt-8">
              Limited spots available. Begin your transformation journey today!
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default AboutSection;