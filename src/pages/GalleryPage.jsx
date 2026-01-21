import React, { useState } from 'react';

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const galleryCategories = [
    { id: 'all', name: 'All Facilities', count: 12, icon: '🏋️‍♂️' },
    { id: 'equipment', name: 'Premium Equipment', count: 4, icon: '💪' },
    { id: 'training', name: 'Training Areas', count: 4, icon: '🔥' },
    { id: 'classes', name: 'Group Classes', count: 3, icon: '👥' },
    { id: 'facilities', name: 'Amenities', count: 3, icon: '✨' }
  ];

  const galleryItems = [
    { 
      id: 1, 
      title: "State-of-the-Art Equipment", 
      category: 'equipment',
      description: 'Our facility features the latest generation fitness machines with advanced biometric tracking technology, touchscreen interfaces, and virtual training integration for a fully connected workout experience.',
      features: ['AI-powered workout tracking', 'Wireless connectivity', 'Real-time performance analytics', 'Adjustable resistance systems']
    },
    { 
      id: 2, 
      title: "Personal Training Zone", 
      category: 'training',
      description: 'Dedicated one-on-one training sessions with our expert certified coaches in a private, fully-equipped zone designed for personalized attention and maximum results.',
      features: ['Private consultation rooms', 'Customized workout plans', 'Progress tracking stations', 'Recovery assessment tools']
    },
    { 
      id: 3, 
      title: "Strength Training Area", 
      category: 'equipment',
      description: 'Comprehensive free weights section featuring Olympic-grade barbells, premium dumbbells up to 150lbs, and specialized strength training equipment for all fitness levels.',
      features: ['Olympic lifting platforms', 'Power racks with safety systems', 'Adjustable benches', 'Kettlebell stations']
    },
    { 
      id: 4, 
      title: "Cardio Zone", 
      category: 'equipment',
      description: 'Advanced cardio machines equipped with individual entertainment systems, virtual reality running tracks, and immersive training programs to keep your workouts engaging.',
      features: ['Treadmills with VR integration', 'Ellipticals with heart rate zones', 'Stair climbers', 'Rowing machines with performance tracking']
    },
    { 
      id: 5, 
      title: "Functional Training Space", 
      category: 'training',
      description: 'Dynamic area featuring versatile equipment for functional movement patterns, including TRX systems, battle ropes, plyometric boxes, and agility training tools.',
      features: ['Suspension training zones', 'Turf running area', 'Plyometric stations', 'Agility ladder setups']
    },
    { 
      id: 6, 
      title: "Group Fitness Studio", 
      category: 'classes',
      description: 'Spacious, climate-controlled studio with professional sound systems, mood lighting, and sprung flooring for various group fitness classes throughout the day.',
      features: ['Studio cycling', 'HIIT classes', 'Dance fitness', 'Mind-body sessions']
    },
    { 
      id: 7, 
      title: "Luxury Spa & Sauna", 
      category: 'facilities',
      description: 'Premium relaxation and recovery facilities including infrared saunas, steam rooms, and hydrotherapy pools to enhance muscle recovery and promote wellness.',
      features: ['Infrared sauna cabins', 'Aromatherapy steam rooms', 'Cold plunge pools', 'Hydrotherapy massage stations']
    },
    { 
      id: 8, 
      title: "Yoga & Meditation Studio", 
      category: 'classes',
      description: 'Serene space designed for yoga and mindfulness practices with natural lighting, premium mats, props, and ambient sound systems for complete mental and physical harmony.',
      features: ['Heated yoga sessions', 'Meditation classes', 'Pilates reformer area', 'Breathwork workshops']
    },
    { 
      id: 9, 
      title: "CrossFit & High-Intensity Zone", 
      category: 'training',
      description: 'Dedicated high-intensity functional training area with competition-grade equipment, rig systems, and specialized flooring for intense workout sessions.',
      features: ['Competition rigs', 'Rowing ergometers', 'Gymnastics rings', 'Strongman equipment']
    },
    { 
      id: 10, 
      title: "Premium Locker Rooms", 
      category: 'facilities',
      description: 'Luxurious changing facilities featuring private cabins, premium toiletries, grooming stations, and towel service for maximum comfort and convenience.',
      features: ['Private changing cabins', 'Steam-infused showers', 'Vanity stations', 'Valet lockers']
    },
    { 
      id: 11, 
      title: "HIIT Training Zone", 
      category: 'training',
      description: 'Specialized area designed for high-intensity interval training with interval timing systems, specialized flooring, and quick-access equipment stations.',
      features: ['Interval timing displays', 'Shock-absorbent flooring', 'Equipment quick-change stations', 'Performance tracking boards']
    },
    { 
      id: 12, 
      title: "Nutrition & Recovery Bar", 
      category: 'facilities',
      description: 'Healthy nutrition station offering protein shakes, recovery drinks, healthy snacks, and supplement consultation services to support your fitness goals.',
      features: ['Protein shake bar', 'Recovery drink station', 'Healthy snack options', 'Nutrition consultation desk']
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  // Item Detail Modal Component
  const ItemDetailModal = () => {
    if (!selectedItem) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
        onClick={() => setSelectedItem(null)}
      >
        <div 
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute -top-12 right-0 text-white hover:text-brand-primary transition-colors duration-300 z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 md:p-8">
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 text-brand-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
                {selectedItem.category === 'equipment' ? 'Premium Equipment' : 
                 selectedItem.category === 'training' ? 'Training Area' : 
                 selectedItem.category === 'classes' ? 'Group Classes' : 'Amenities'}
              </span>
              <h3 className="text-white text-3xl font-bold mb-4">{selectedItem.title}</h3>
            </div>
            
            <div className="mb-8">
              <h4 className="text-white text-xl font-semibold mb-4">Description</h4>
              <p className="text-gray-300 text-lg leading-relaxed">{selectedItem.description}</p>
            </div>
            
            <div>
              <h4 className="text-white text-xl font-semibold mb-4">Key Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedItem.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 bg-gray-800/50 rounded-xl p-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-6 rounded-xl hover:shadow-2xl hover:shadow-brand-primary/30 transition-all duration-300">
                  Schedule Facility Tour
                </button>
                <button className="bg-gray-800/50 border border-gray-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300">
                  Ask Questions
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-20">
      <section className="sm:py-10 md:py-10 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Explore Our <span className="text-transparent bg-clip-text  text-white bg-gradient-to-r from-brand-primary via-white to-brand-secondary">Premium Facilities</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              Discover our world-class fitness environment equipped with cutting-edge technology and luxurious amenities
            </p>
          </div>

          {/* Category Filters */}
          <div className="mb-8 sm:mb-12">
            <h3 className="text-white font-bold text-xl sm:text-2xl mb-6 text-center">
              Browse by <span className="text-brand-primary">Category</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {galleryCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`group relative px-5 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-2xl shadow-brand-primary/30'
                      : 'bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-gray-400 hover:text-white hover:border-gray-700'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm sm:text-base font-medium">{category.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeCategory === category.id 
                      ? 'bg-white/20' 
                      : 'bg-gray-800'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Facilities Grid */}
          <div className="mb-12 sm:mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-brand-primary/50"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{item.category === 'equipment' ? '💪' : 
                                              item.category === 'training' ? '🔥' : 
                                              item.category === 'classes' ? '👥' : '✨'}</span>
                    <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full">
                      {item.category === 'equipment' ? 'Equipment' : 
                       item.category === 'training' ? 'Training' : 
                       item.category === 'classes' ? 'Classes' : 'Amenities'}
                    </span>
                  </div>
                  
                  <h3 className="text-white text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="bg-gray-800/70 text-gray-300 text-xs px-3 py-1.5 rounded-full">
                        {feature}
                      </span>
                    ))}
                    {item.features.length > 2 && (
                      <span className="bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 text-brand-primary text-xs px-3 py-1.5 rounded-full">
                        +{item.features.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-brand-primary text-sm font-bold hover:text-white transition-colors duration-300">
                      View Details →
                    </button>
                    <span className="text-gray-500 text-xs">Click to explore</span>
                  </div>
                  
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Virtual Tour Section - RESTORED */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Experience Our <span className="text-transparent text-white bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Virtual Tour</span>
              </h3>
              <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
                Take a 360° virtual tour of our world-class facilities from anywhere
              </p>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50">
              <div className="relative pt-[56.25%]">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/gey73xiS8F4?controls=1&modestbranding=1&rel=0&autoplay=0&mute=1"
                  title="FITLYF Virtual Tour"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm p-6 sm:p-8">
                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                  <div>
                    <h4 className="text-white text-xl sm:text-2xl font-bold mb-2">FITLYF Virtual Experience</h4>
                    <p className="text-gray-400 text-sm sm:text-base">Explore our facilities through this immersive 360° virtual tour</p>
                  </div>
                  <button className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-6 rounded-xl text-sm sm:text-base hover:shadow-2xl hover:shadow-brand-primary/30 transition-all duration-300 transform hover:scale-[1.02]">
                    Start Virtual Tour
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Facility Highlights */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Facility <span className="text-transparent bg-clip-text bg-gradient-to-r text-white from-brand-primary to-brand-secondary">Highlights</span>
              </h3>
              <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
                Key features that make our fitness center stand out
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: "24/7 Access",
                  description: "Round-the-clock access with advanced security systems and biometric entry",
                  icon: "🕒",
                  features: ["Secure biometric access", "24-hour CCTV monitoring", "Emergency response systems"]
                },
                {
                  title: "Expert Staff",
                  description: "Certified trainers and wellness experts available for personalized guidance",
                  icon: "👨‍🏫",
                  features: ["Nationally certified trainers", "Nutrition specialists", "Physical therapists"]
                },
                {
                  title: "Clean & Sanitized",
                  description: "Hospital-grade cleaning protocols and air purification systems",
                  icon: "✨",
                  features: ["UV sterilization", "HEPA air filtration", "Self-cleaning equipment"]
                }
              ].map((highlight, index) => (
                <div key={index} className="group bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02] hover:border-brand-primary/50">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
                    {highlight.icon}
                  </div>
                  <h4 className="text-white text-xl font-bold mb-3">{highlight.title}</h4>
                  <p className="text-gray-400 text-sm mb-6">{highlight.description}</p>
                  <div className="space-y-2">
                    {highlight.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visit Us CTA */}
          {/* <div className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 sm:p-10 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-secondary/10"></div>
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Experience Excellence <span className="text-transparent bg-clip-text text-white bg-gradient-to-r from-brand-primary to-brand-secondary">In Person</span>
              </h3>
              
              <p className="text-gray-300 text-lg sm:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto">
                Schedule a personal tour and experience our world-class facilities firsthand. 
                Meet our trainers and explore the environment that will transform your fitness journey.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                <button className="group relative bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl text-base sm:text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/40 transform hover:scale-[1.02]">
                  Schedule Personal Tour
                  <svg className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl text-base sm:text-lg transition-all duration-500 hover:bg-gray-700/50 hover:border-gray-600 transform hover:scale-[1.02]">
                  Request Brochure
                </button>
              </div>
              
              <p className="text-gray-500 text-sm sm:text-base mt-6 sm:mt-8">
                Tour slots fill quickly - Book your visit today!
              </p>
            </div>
          </div> */}
        </div>
      </section>

      {/* Item Detail Modal */}
      <ItemDetailModal />
    </div>
  );
};

export default GalleryPage;