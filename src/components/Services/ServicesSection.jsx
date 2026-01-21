import React, { useState } from 'react';

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      title: "Personal Training",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      description: "1-on-1 coaching tailored to your specific goals and fitness level.",
      details: [
        "Custom workout plans designed by certified trainers",
        "Form correction and technique optimization",
        "Progress tracking and regular assessments",
        "Nutrition guidance and accountability",
        "Flexible scheduling options"
      ],
      features: [
        "Initial fitness assessment",
        "Personalized workout plans",
        "Bi-weekly progress reviews",
        "Nutrition consultation",
        "Unlimited messaging support"
      ],
      duration: "Minimum 3 months commitment",
      trainers: ["Golden Arif", "Tabraiz", "Naveed"]
    },
    {
      id: 2,
      title: "Online Coaching",
      icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
      description: "Professional guidance from anywhere, anytime with our virtual training platform.",
      details: [
        "Live virtual training sessions via Zoom",
        "Custom workout plans accessible through our app",
        "Video form analysis and feedback",
        "Weekly check-ins and progress tracking",
        "Access to exclusive online community"
      ],
      features: [
        "Weekly live sessions",
        "Custom mobile app access",
        "Video library with 500+ workouts",
        "Nutrition tracking tools",
        "24/7 chat support"
      ],
      duration: "Flexible monthly plans",
      trainers: ["Golden Aquib", "Naveed"]
    },
    {
      id: 3,
      title: "Weight Management",
      icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
      description: "Structured programs for sustainable weight loss or gain with proven results.",
      details: [
        "Comprehensive body composition analysis",
        "Customized diet plans based on metabolic rate",
        "Progress monitoring with regular weigh-ins",
        "Behavior modification strategies",
        "Support group and community access"
      ],
      features: [
        "Weekly body measurements",
        "Custom meal plans",
        "Metabolic rate testing",
        "Weekly coaching calls",
        "Recipe guides and shopping lists"
      ],
      duration: "12-week transformation program",
      trainers: ["Tabraiz", "Golden Arif"]
    },
    {
      id: 4,
      title: "Muscle Building",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      description: "Strategic hypertrophy training for maximum muscle growth and strength gains.",
      details: [
        "Periodized training programs for optimal growth",
        "Progressive overload tracking",
        "Supplementation guidance",
        "Recovery optimization strategies",
        "Strength testing and milestone tracking"
      ],
      features: [
        "Customized workout splits",
        "Strength progression tracking",
        "Supplement recommendations",
        "Recovery protocol guidance",
        "Monthly progress photos"
      ],
      duration: "Minimum 6 months recommended",
      trainers: ["Golden Arif", "Tabraiz"]
    },
    {
      id: 5,
      title: "Group Classes",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      description: "Energetic group workouts in a motivating community environment.",
      details: [
        "HIIT, Yoga, Zumba, and Strength classes",
        "Experienced group fitness instructors",
        "Motivational music and atmosphere",
        "All fitness levels welcome",
        "Unlimited class access packages"
      ],
      features: [
        "30+ weekly classes",
        "Expert instructors",
        "State-of-the-art sound system",
        "Separate men's and women's changing rooms",
        "Towel service included"
      ],
      duration: "Monthly unlimited classes",
      trainers: ["Naveed", "Golden Aquib"]
    },
    {
      id: 6,
      title: "AI Diet Plans",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      description: "Personalized nutrition plans powered by artificial intelligence and expert analysis.",
      details: [
        "AI-powered meal planning based on goals",
        "Macro and micronutrient tracking",
        "Food preference and allergy accommodation",
        "Grocery shopping assistance",
        "Recipe database with calorie counts"
      ],
      features: [
        "Personalized meal plans",
        "Macro tracking app",
        "Weekly grocery lists",
        "Recipe adjustments",
        "Progress monitoring"
      ],
      duration: "Flexible subscription",
      trainers: ["All Certified Nutritionists"]
    },
    {
      id: 7,
      title: "Senior Fitness",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      description: "Age-appropriate fitness programs focusing on mobility, balance, and strength.",
      details: [
        "Low-impact exercise programs",
        "Balance and fall prevention training",
        "Arthritis-friendly workouts",
        "Social exercise groups",
        "Progress monitoring for health improvements"
      ],
      features: [
        "Gentle strength training",
        "Balance improvement exercises",
        "Flexibility and mobility work",
        "Social group activities",
        "Health parameter tracking"
      ],
      duration: "Ongoing programs",
      trainers: ["Specialized Senior Trainers"]
    },
    {
      id: 8,
      title: "Sports Performance",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      description: "Sport-specific training for athletes to enhance performance and prevent injuries.",
      details: [
        "Sport-specific conditioning programs",
        "Speed and agility training",
        "Injury prevention protocols",
        "Recovery optimization",
        "Performance testing and analysis"
      ],
      features: [
        "Vertical jump improvement",
        "Speed and agility drills",
        "Sport-specific conditioning",
        "Injury prevention",
        "Recovery protocols"
      ],
      duration: "Season-based programs",
      trainers: ["Golden Arif", "Tabraiz"]
    }
  ];

  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-950  sm:py-10 md:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Professional Header */}
        <div className="text-center mb-16 sm:mb-20 md:mb-24">
          <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6 sm:mb-8"></div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary  text-white">Fitness Services</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
            Transform your fitness journey with our comprehensive suite of professional services, 
            designed to deliver exceptional results through expert guidance and cutting-edge methodologies.
          </p>
        </div>

        {/* Professional Services Grid - Simplified */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`group relative bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/70 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
                selectedService?.id === service.id ? 'ring-2 ring-brand-primary' : ''
              }`}
              onClick={() => setSelectedService(service)}
            >
              {/* Service Icon and Content */}
              <div className="p-6 sm:p-8">
                {/* Icon Badge */}
                <div className="relative mb-6 sm:mb-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                    </svg>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-brand-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-3 font-light leading-relaxed">
                  {service.description}
                </p>
                
                {/* Duration */}
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium">
                      {service.duration}
                    </p>
                  </div>
                  <button className="group/btn relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/50 group-hover/btn:bg-brand-primary/20 rounded-full flex items-center justify-center transition-all duration-500">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary group-hover/btn:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-full opacity-0 group-hover/btn:opacity-100 blur transition-opacity duration-500 -z-10"></div>
                  </button>
                </div>

                {/* Quick Features */}
                <div className="space-y-2">
                  {service.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-400 text-xs sm:text-sm">
                      <svg className="w-4 h-4 text-brand-primary mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Professional Service Details Panel - Simplified without image */}
        {selectedService && (
          <div className="mb-16 sm:mb-20 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 sm:p-8 md:p-10">
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-2xl">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={selectedService.icon} />
                    </svg>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl blur opacity-30 -z-10"></div>
                </div>
                <div className="ml-4 sm:ml-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {selectedService.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-sm sm:text-base font-medium">
                      {selectedService.duration}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                {selectedService.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
                <div>
                  <h4 className="text-white font-bold text-lg sm:text-xl mb-4 flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-brand-primary"></span>
                    Program Details
                  </h4>
                  <ul className="space-y-3 sm:space-y-4">
                    {selectedService.details.map((detail, index) => (
                      <li key={index} className="flex items-start text-gray-300 text-sm sm:text-base">
                        <svg className="w-5 h-5 text-brand-primary mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 14.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-bold text-lg sm:text-xl mb-4 flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-brand-primary"></span>
                    Features Included
                  </h4>
                  <ul className="space-y-3 sm:space-y-4">
                    {selectedService.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-gray-300 text-sm sm:text-base">
                        <svg className="w-5 h-5 text-brand-primary mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-8 sm:mb-10">
                <h4 className="text-white font-bold text-lg sm:text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-brand-primary"></span>
                  Expert Trainers
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {selectedService.trainers.map((trainer, index) => (
                    <span 
                      key={index} 
                      className="relative bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm border border-brand-primary/30 group/trainer overflow-hidden"
                    >
                      <span className="relative z-10">{trainer}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/40 to-brand-secondary/40 transform -translate-x-full group-hover/trainer:translate-x-0 transition-transform duration-500"></div>
                    </span>
                  ))}
                </div>
              </div>

              {/* <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button className="flex-1 group/btn relative bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 sm:py-4 px-6 rounded-xl text-base sm:text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/30 transform hover:scale-[1.02]">
                  <span className="relative z-10">Enroll Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary to-brand-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                </button>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="flex-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white font-bold py-3 sm:py-4 px-6 rounded-xl text-base sm:text-lg transition-all duration-500 hover:bg-gray-700/50 hover:border-gray-600 transform hover:scale-[1.02]"
                >
                  View All Services
                </button>
              </div> */}
            </div>
          </div>
        )}

        {/* Professional Process Section */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r text-white from-brand-primary to-brand-secondary">Proven Process</span>
            </h3>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
              A structured approach to ensure your success at every stage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            {[
              {
                step: "01",
                title: "Comprehensive Assessment",
                description: "Detailed evaluation of your fitness level, goals, and preferences",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              },
              {
                step: "02",
                title: "Personalized Strategy",
                description: "Custom program design tailored to your specific objectives",
                icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              },
              {
                step: "03",
                title: "Expert Implementation",
                description: "Professional guidance through every step of your journey",
                icon: "M13 10V3L4 14h7v7l9-11h-7z"
              },
              {
                step: "04",
                title: "Progress Optimization",
                description: "Continuous monitoring and adjustments for maximum results",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              }
            ].map((step, index) => (
              <div key={index} className="group relative bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 p-6 sm:p-8 rounded-2xl transition-all duration-500 hover:border-brand-primary/50 hover:scale-[1.02]">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-2xl">
                  {step.step}
                </div>
                
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                </div>
                
                <h4 className="text-white font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-center group-hover:text-brand-primary transition-colors duration-300">
                  {step.title}
                </h4>
                <p className="text-gray-400 text-sm sm:text-base text-center leading-relaxed">
                  {step.description}
                </p>
                
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional CTA */}
        <div className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 sm:p-10 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-secondary/10"></div>
          <div className="relative text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Begin Your <span className="text-transparent bg-clip-text bg-gradient-to-r text-white from-brand-primary to-brand-secondary">Transformation</span>
            </h3>
            <p className="text-gray-300 text-lg sm:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto">
              Schedule a complimentary consultation with our expert team to discuss your goals 
              and create a personalized roadmap for your success
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
              <button className="group relative bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl text-base sm:text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/40 transform hover:scale-[1.02]">
                <span className="relative z-10">Schedule Free Consultation</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              </button>
              <button className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl text-base sm:text-lg transition-all duration-500 hover:bg-gray-700/50 hover:border-gray-600 transform hover:scale-[1.02]">
                <span className="relative z-10">Call: +91 9390147883</span>
              </button>
            </div>
            <p className="text-gray-500 text-sm sm:text-base mt-6 sm:mt-8">
              Limited spots available. Book your consultation today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;