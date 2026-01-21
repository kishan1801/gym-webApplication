import React, { useState } from 'react';
import { PlayIcon, CheckCircleIcon, FireIcon, BoltIcon, HeartIcon, ClockIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const TransformationSection = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  const transformations = [
    {
      name: "Chandra",
      before: "/before1.jpeg",
      after: "/after1.jpeg",
      // time: "12 weeks",
      // weightLoss: "18 lbs",
      category: "Weight Loss",
      quote: "FITLYF made home workouts actually effective!"
    },
    {
      name: "Khadar",
      before: "/before2.jpeg",
      after: "/after2.jpeg",
      // time: "16 weeks",
      // muscleGain: "+8 lbs",
      category: "Muscle Building",
      quote: "No gym needed with proper bodyweight training"
    },
    {
      name: "Somesh",
      before: "/before3.jpeg",
      after: "/after3.jpeg",
      // time: "20 weeks",
      // transformation: "Complete",
      category: "Body Recomposition",
      quote: "Transformed my lifestyle, not just my body"
    },
     {
      name: "Hari",
      before: "/before4.jpeg",
      after: "/after4.jpeg",
      // time: "20 weeks",
      // transformation: "Complete",
      category: "Body Recomposition",
      quote: "Transformed my lifestyle, not just my body"
    }
  ];

  const principles = [
    {
      icon: FireIcon,
      title: "Metabolic Boost",
      description: "HIIT-based workouts that maximize calorie burn for up to 48 hours post-workout",
      color: "from-orange-500/20 to-red-500/20",
      border: "border-orange-500/30"
    },
    {
      icon: BoltIcon,
      title: "Time Efficiency",
      description: "20-30 minute sessions designed for maximum results with minimal time investment",
      color: "from-yellow-500/20 to-amber-500/20",
      border: "border-yellow-500/30"
    },
    {
      icon: HeartIcon,
      title: "Sustainable Progress",
      description: "Gradual progression system that prevents plateaus and ensures continuous improvement",
      color: "from-pink-500/20 to-rose-500/20",
      border: "border-pink-500/30"
    },
    {
      icon: ChartBarIcon,
      title: "Trackable Results",
      description: "Comprehensive progress tracking with weekly assessments and adjustments",
      color: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/30"
    }
  ];

  const testimonials = [
    {
      name: "Jessica L.",
      role: "Busy Professional",
      text: "As someone who hated traditional gyms, FITLYF was a game-changer. 30 minutes a day from home and I've lost 22 pounds in 3 months.",
      duration: "12 weeks"
    },
    {
      name: "David K.",
      role: "Former Athlete",
      text: "The programming is intelligent. I regained my fitness without the joint pain I got from heavy lifting. Best decision ever.",
      duration: "16 weeks"
    },
    {
      name: "Maria S.",
      role: "Working Mom",
      text: "Being able to workout during my baby's nap time saved me. The community support kept me accountable when motivation was low.",
      duration: "20 weeks"
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Real <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary  text-white">Transformations</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Witness the power of effective home workouts. No gym membership required, just dedication and the right guidance.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {[
            { label: 'Average Weight Loss', value: '15.2 lbs', icon: FireIcon, color: 'from-red-500 to-orange-500' },
            { label: 'Time to Results', value: '12 weeks', icon: ClockIcon, color: 'from-blue-500 to-cyan-500' },
            { label: 'Success Rate', value: '94%', icon: CheckCircleIcon, color: 'from-green-500 to-emerald-500' },
            { label: 'Active Members', value: '10K+', icon: UserGroupIcon, color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className={`text-3xl transform group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Video Section */}
        <div className="mb-16 sm:mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                Experience a <span className="text-transparent bg-clip-text text-white mb bg-gradient-to-r from-brand-primary to-brand-secondary">Real FITLYF Workout</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                See exactly what our 30-minute transformational sessions look like
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <ClockIcon className="w-4 h-4" />
              <span>30 min • Beginner Friendly</span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50 group cursor-pointer" onClick={() => setVideoPlaying(true)}>
            <div className="relative pt-[56.25%]">
              {!videoPlaying ? (
                <>
                  <div className="absolute inset-0">
                    <img 
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80" 
                      alt="Workout preview" 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-brand-primary/90 to-brand-secondary/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-2xl">
                        <PlayIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" />
                      </div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                      Full Body • No Equipment
                    </span>
                  </div>
                </>
              ) : (
                <iframe 
                  className="absolute top-0 left-0 w-full h-full" 
                  src="https://www.youtube.com/embed/UBMk30rjy0o?controls=1&autoplay=1&mute=0" 
                  title="FITLYF Real Home Workout Session" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              *Real client workout session - No equipment needed, just bodyweight exercises
            </p>
            <button
              onClick={() => setVideoPlaying(!videoPlaying)}
              className="mt-3 sm:mt-0 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gray-700/50"
            >
              {videoPlaying ? 'Pause Video' : 'Play Workout Demo'}
            </button>
          </div>
        </div>

        {/* Transformation Principles */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r text-white from-brand-primary to-brand-secondary">FITLYF Formula</span>
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
              Science-backed principles that guarantee results at home
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {principles.map((principle, index) => (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02]"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${principle.color} ${principle.border} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <principle.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{principle.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{principle.description}</p>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories Grid */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Real People, <span className="text-transparent bg-clip-text text-white bg-gradient-to-r from-brand-primary to-brand-secondary">Real Results</span>
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
              See how ordinary people achieved extraordinary transformations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {transformations.map((story, index) => (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Before/After Comparison */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 relative overflow-hidden">
                      <img 
                        src={story.before} 
                        alt={`${story.name} before`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-red-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold">
                        BEFORE
                      </div>
                    </div>
                    <div className="flex-1 relative overflow-hidden">
                      <img 
                        src={story.after} 
                        alt={`${story.name} after`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-green-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold">
                        AFTER
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-sm">
                      {story.category}
                    </span>
                  </div>
                </div>

                {/* Story Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold text-lg">{story.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {/* <ClockIcon className="w-4 h-4 text-gray-400" /> */}
                        <span className="text-gray-400 text-sm">{story.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {story.weightLoss && (
                        <div className="text-green-400 font-bold text-lg">{story.weightLoss}</div>
                      )}
                      {story.muscleGain && (
                        <div className="text-blue-400 font-bold text-lg">{story.muscleGain}</div>
                      )}
                      {story.transformation && (
                        <div className="text-brand-primary font-bold text-lg">Transformed!</div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm italic mb-4 leading-relaxed">"{story.quote}"</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            {/* <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /> */}
                          </svg>
                        ))}
                      </div>
                      {/* <span className="text-white text-sm font-medium">5.0</span> */}
                    </div>
                    {/* <button className="text-brand-primary hover:text-brand-secondary text-sm font-medium transition-colors duration-200">
                      Full Story →
                    </button> */}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        {/* <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Voices of <span className="text-transparent bg-clip-text text-white bg-gradient-to-r from-brand-primary to-brand-secondary">Success</span>
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
              Hear directly from our members about their transformation journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-brand-primary text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">"{testimonial.text}"</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">{testimonial.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        </div> */}

        {/* CTA Section */}
        {/* <div className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 sm:p-10 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-secondary/10"></div>
          <div className="relative text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready for Your <span className="text-transparent bg-clip-text text-white bg-gradient-to-r from-brand-primary to-brand-secondary">Transformation?</span>
            </h3>
            <p className="text-gray-300 text-lg sm:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto">
              Join thousands who have transformed their bodies and lives with FITLYF. No gym, no equipment, just real results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
              <button className="group relative bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl text-base sm:text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/40 transform hover:scale-[1.02]">
                Start Free Trial
                <svg className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl text-base sm:text-lg transition-all duration-500 hover:bg-gray-700/50 hover:border-gray-600 transform hover:scale-[1.02]">
                View All Success Stories
              </button>
            </div>
            <p className="text-gray-500 text-sm sm:text-base mt-6 sm:mt-8">
              7-day free trial • Cancel anytime • No equipment needed
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default TransformationSection;