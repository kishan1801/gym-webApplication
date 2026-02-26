import React, { useState, useEffect, useMemo } from "react";
import API from "../../api";

const TrainersSection = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [activeSpecialty, setActiveSpecialty] = useState("all");
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/trainers");

      if (response.data.success && response.data.trainers) {
        setTrainers(response.data.trainers);
      }
    } catch (err) {
      console.error("Error fetching trainers:", err);
      setError("Failed to load trainers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Get image URL helper
  // Get image URL helper - FIXED
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null; // Return null instead of Unsplash URL

    // If already a full URL, return as is
    if (imagePath.startsWith("http")) return imagePath;

    // For local paths
    return `https://fitlyfy.onrender.com${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  // Transform database data to match UI structure
  const transformTrainerData = (trainer) => {
    return {
      id: trainer._id,
      _id: trainer._id,
      name: trainer.name,
      title: `${trainer.specialization} Specialist`,
      specialty: trainer.specialization,
      experience: `${trainer.experience}+ years`,
      yearsExperience: trainer.experience,
      certifications: trainer.certifications || [],
      bio:
        trainer.bio ||
        `${trainer.name} is a certified ${trainer.specialization.toLowerCase()} trainer with ${trainer.experience} years of experience.`,
      achievements: [
        `Certified ${trainer.specialization} Specialist`,
        `${trainer.experience} years professional experience`,
        `${trainer.ratings?.totalReviews || 0}+ satisfied clients`,
        "International certification holder",
      ],
      trainingStyle: trainer.availability
        ? `Available: ${trainer.availability}`
        : "Flexible scheduling available",
      quote: getTrainerQuote(trainer.specialization),
      image: getImageUrl(trainer.profileImage),
      rating: trainer.ratings?.average || 4.5,
      clients:
        trainer.ratings?.totalReviews || Math.floor(Math.random() * 200) + 50,
      specialties: getSpecialties(trainer.specialization),
      availability: trainer.availability || "Flexible hours available",
      social: {
        instagram: trainer.socialLinks?.instagram || "",
        youtube: trainer.socialLinks?.youtube || "",
        twitter: trainer.socialLinks?.twitter || "",
        linkedin: trainer.socialLinks?.linkedin || "",
        website: trainer.socialLinks?.website || "",
      },
      email: trainer.email,
      phone: trainer.phone,
      hourlyRate: trainer.hourlyRate,
      isActive: trainer.isActive,
      category: trainer.category || "professional",
    };
  };

  // Helper function to get quotes based on specialization
  const getTrainerQuote = (specialization) => {
    const quotes = {
      Yoga: "Yoga is not about touching your toes. It's about what you learn on the way down.",
      Cardio:
        "Your body can stand almost anything. It's your mind you have to convince.",
      "Strength Training":
        "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
      CrossFit:
        "Champions aren't made in gyms. Champions are made from something they have deep inside them.",
      Pilates: "Physical fitness is the first requisite of happiness.",
      Zumba:
        "Dance like nobody's watching, but make sure you're burning calories while doing it!",
      MMA: "The pain you feel today will be the strength you feel tomorrow.",
      Swimming:
        "In the water, you find freedom. In training, you find discipline.",
      Dance:
        "Movement is a medicine for creating change in a person's physical, emotional, and mental states.",
      Nutrition:
        "Good nutrition is the foundation of fitness. You can't out-train a bad diet.",
      "Weight Loss":
        "Transformation is not a future event. It is a present activity.",
      "Senior Fitness": "Age is just a number. Fitness is for everyone.",
    };
    return (
      quotes[specialization] ||
      "Fitness is not about being better than someone else. It's about being better than you used to be."
    );
  };

  // Helper function to get specialties based on specialization
  const getSpecialties = (specialization) => {
    const specialtiesMap = {
      Yoga: [
        "Yoga Therapy",
        "Mobility Training",
        "Stress Management",
        "Posture Correction",
        "Mindfulness",
      ],
      Cardio: [
        "Fat Loss",
        "Metabolic Conditioning",
        "Endurance Training",
        "Group Fitness",
        "HIIT",
      ],
      "Strength Training": [
        "Powerlifting",
        "Olympic Lifting",
        "Athletic Performance",
        "Functional Training",
        "Muscle Building",
      ],
      CrossFit: [
        "Functional Fitness",
        "High-Intensity Training",
        "Gymnastics",
        "Weightlifting",
        "Competition Prep",
      ],
      Pilates: [
        "Core Strength",
        "Posture Improvement",
        "Rehabilitation",
        "Flexibility",
        "Injury Prevention",
      ],
      Zumba: [
        "Dance Fitness",
        "Cardio Dance",
        "Latin Dance",
        "Group Coordination",
        "Rhythm Training",
      ],
      MMA: [
        "Combat Sports",
        "Self-Defense",
        "Conditioning",
        "Technique Training",
        "Fight Prep",
      ],
      Swimming: [
        "Swim Technique",
        "Endurance Swimming",
        "Water Safety",
        "Competitive Swimming",
        "Triathlon Training",
      ],
      Dance: [
        "Choreography",
        "Rhythm Training",
        "Dance Styles",
        "Performance Skills",
        "Flexibility",
      ],
      Nutrition: [
        "Weight Management",
        "Sports Nutrition",
        "Meal Planning",
        "Dietary Guidance",
        "Metabolic Health",
      ],
      "Weight Loss": [
        "Body Transformation",
        "Metabolic Conditioning",
        "Nutrition Coaching",
        "Accountability",
        "Lifestyle Change",
      ],
      "Senior Fitness": [
        "Mobility Training",
        "Balance Improvement",
        "Strength Building",
        "Health Optimization",
        "Gentle Exercise",
      ],
    };
    return (
      specialtiesMap[specialization] || [
        specialization,
        "Personal Training",
        "Fitness Coaching",
        "Goal Setting",
        "Progress Tracking",
      ]
    );
  };

  // Calculate specialties for filter
  const getSpecialtiesList = () => {
    const allSpecialties = [...new Set(trainers.map((t) => t.specialization))];

    const specialties = [
      { id: "all", name: "All Trainers", count: trainers.length, icon: "👥" },
    ];

    allSpecialties.forEach((spec) => {
      const iconMap = {
        Yoga: "🧘‍♀️",
        Cardio: "🏃‍♂️",
        "Strength Training": "💪",
        CrossFit: "🔥",
        Pilates: "🤸‍♀️",
        Zumba: "💃",
        MMA: "🥊",
        Swimming: "🏊‍♂️",
        Dance: "🕺",
        Nutrition: "🥗",
        "Weight Loss": "⚖️",
        "Senior Fitness": "👴",
      };

      specialties.push({
        id: spec.toLowerCase().replace(/\s+/g, "-"),
        name: spec,
        count: trainers.filter((t) => t.specialization === spec).length,
        icon: iconMap[spec] || "🏋️‍♂️",
      });
    });

    return specialties;
  };

  const specialties = getSpecialtiesList();

  // Filter trainers based on active specialty and search query
  const filteredTrainers = useMemo(() => {
    return trainers
      .filter((trainer) => {
        if (activeSpecialty !== "all") {
          const specId = trainer.specialization
            .toLowerCase()
            .replace(/\s+/g, "-");
          if (specId !== activeSpecialty) return false;
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            trainer.name.toLowerCase().includes(query) ||
            trainer.specialization.toLowerCase().includes(query) ||
            trainer.certifications?.some((cert) =>
              cert.toLowerCase().includes(query),
            ) ||
            trainer.bio?.toLowerCase().includes(query)
          );
        }

        return true;
      })
      .map(transformTrainerData);
  }, [trainers, searchQuery, activeSpecialty]);

  const handleBookSession = (trainer) => {
    alert(
      `Booking session with ${trainer.name}.\nEmail: ${trainer.email}\nPhone: ${trainer.phone}\nRate: $${trainer.hourlyRate}/hour\n\nOur team will contact you shortly!`,
    );
  };

  // Calculate stats
  const calculateStats = () => {
    if (trainers.length === 0)
      return { avgExperience: 0, totalCerts: 0, totalClients: 0, avgRating: 0 };

    const avgExperience = Math.round(
      trainers.reduce((sum, t) => sum + t.experience, 0) / trainers.length,
    );
    const totalCerts = trainers.reduce(
      (sum, t) => sum + (t.certifications?.length || 0),
      0,
    );
    const totalClients = trainers.reduce(
      (sum, t) => sum + (t.ratings?.totalReviews || 0),
      0,
    );
    const avgRating =
      trainers.reduce((sum, t) => sum + (t.ratings?.average || 0), 0) /
      trainers.length;

    return {
      avgExperience,
      totalCerts,
      totalClients,
      avgRating: avgRating.toFixed(1),
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Elite{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary">
                Training Experts
              </span>
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
              Loading our world-class fitness professionals...
            </p>
          </div>

          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-transparent border-t-brand-primary rounded-full animate-spin absolute top-0"></div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Loading expert trainers...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Elite{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary">
                Training Experts
              </span>
            </h2>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="relative bg-gradient-to-br from-red-900/20 to-red-950/20 backdrop-blur-sm border border-red-800/50 rounded-2xl p-8 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500/10 rounded-full blur-3xl"></div>
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Unable to Load Trainers
                </h3>
                <p className="text-gray-300 text-sm mb-6">{error}</p>
                <button
                  onClick={fetchTrainers}
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-8 rounded-xl text-sm font-bold hover:shadow-2xl hover:shadow-brand-primary/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (trainers.length === 0) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Elite{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary">
                Training Experts
              </span>
            </h2>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 overflow-hidden">
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Trainers Coming Soon
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  We're assembling an elite team of fitness professionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className=" sm:py-10 md:py-10 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r  text-white from-brand-primary via-white to-brand-secondary">
                Elite Trainers
              </span>
            </h2>

            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              Certified professionals with proven expertise and passion for
              transforming lives through personalized fitness guidance
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {[
              {
                label: "Years Avg Experience",
                value: `${stats.avgExperience}+`,
                icon: "📅",
              },
              {
                label: "Total Certifications",
                value: `${stats.totalCerts}+`,
                icon: "🏆",
              },
              {
                label: "Happy Clients",
                value: `${stats.totalClients}+`,
                icon: "😊",
              },
              { label: "Average Rating", value: stats.avgRating, icon: "⭐" },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl transform group-hover:scale-110 transition-transform duration-500">
                    {stat.icon}
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

          {/* Search and Filters */}
          <div className="mb-12 sm:mb-16">
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search trainers by name, specialty, or certification..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 py-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="lg:w-48">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 py-4 text-center">
                  <div className="text-white text-2xl font-bold">
                    {filteredTrainers.length}
                  </div>
                  <div className="text-gray-400 text-sm">Trainers Found</div>
                </div>
              </div>
            </div>

            {/* Specialty Filters */}
            <div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-center">
                Filter by <span className="text-brand-primary">Specialty</span>
              </h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {specialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    onClick={() => setActiveSpecialty(specialty.id)}
                    className={`group relative px-4 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                      activeSpecialty === specialty.id
                        ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-2xl shadow-brand-primary/30"
                        : "bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-gray-400 hover:text-white hover:border-gray-700"
                    }`}
                  >
                    <span className="text-lg">{specialty.icon}</span>
                    <span className="text-sm font-medium">
                      {specialty.name}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        activeSpecialty === specialty.id
                          ? "bg-white/20"
                          : "bg-gray-800"
                      }`}
                    >
                      {specialty.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trainers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20">
            {filteredTrainers.map((trainer) => (
              <div
                key={trainer.id}
                className="group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                onClick={() => setSelectedTrainer(trainer)}
              >
                {/* Trainer Image with Overlay */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-2xl">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="font-bold text-sm">
                        {trainer.rating}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {!trainer.isActive && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold">
                        Unavailable
                      </span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        trainer.category === "expert"
                          ? "bg-gradient-to-r from-yellow-600 to-yellow-800 text-white"
                          : trainer.category === "senior"
                            ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
                            : "bg-gradient-to-r from-brand-primary to-brand-secondary text-white"
                      }`}
                    >
                      {trainer.category === "expert"
                        ? "EXPERT"
                        : trainer.category === "senior"
                          ? "SENIOR"
                          : "PRO"}
                    </span>
                  </div>

                  {/* Name and Title */}
                  <div className="absolute bottom-4 right-4 text-right">
                    <h3 className="text-white text-xl font-bold">
                      {trainer.name}
                    </h3>
                    <p className="text-brand-primary text-sm">
                      {trainer.title}
                    </p>
                  </div>
                </div>

                {/* Trainer Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Specialty
                      </p>
                      <p className="text-white font-semibold text-base">
                        {trainer.specialty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Experience
                      </p>
                      <p className="text-white font-semibold text-base">
                        {trainer.experience}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {trainer.bio}
                  </p>

                  {/* Certifications */}
                  {trainer.certifications.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                        Credentials
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {trainer.certifications
                          .slice(0, 2)
                          .map((cert, index) => (
                            <span
                              key={index}
                              className="text-xs bg-brand-primary/20 text-brand-primary px-2 py-1 rounded"
                            >
                              {cert.length > 20
                                ? cert.substring(0, 20) + "..."
                                : cert}
                            </span>
                          ))}
                        {trainer.certifications.length > 2 && (
                          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                            +{trainer.certifications.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Session Rate - Display only */}
                  {/* <div className="pt-4 border-t border-gray-800/50">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Session Rate</p>
                      <p className="text-white font-bold text-lg">${trainer.hourlyRate}/hr</p>
                    </div>
                  </div> */}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Trainer Details Modal */}
          {selectedTrainer && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-gray-900/50 backdrop-blur-sm rounded-full p-2 hover:bg-gray-800 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Trainer Header */}
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img
                    src={selectedTrainer.image}
                    alt={selectedTrainer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
                      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                        <div>
                          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            {selectedTrainer.name}
                          </h3>
                          <p className="text-brand-primary text-xl sm:text-2xl">
                            {selectedTrainer.title}
                          </p>
                          <div className="flex items-center gap-3 mt-4">
                            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
                              <span className="text-yellow-500">★</span>
                              <span className="text-white font-bold">
                                {selectedTrainer.rating}
                              </span>
                              <span className="text-gray-400">
                                ({selectedTrainer.clients} clients)
                              </span>
                            </div>
                            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                              <span className="text-white">
                                {selectedTrainer.experience} Experience
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {/* <div className="text-4xl font-bold text-white mb-1">${selectedTrainer.hourlyRate}</div>
                          <div className="text-gray-400 text-sm">per hour session</div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trainer Details */}
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Bio */}
                      <div>
                        <h4 className="text-xl font-bold text-white mb-4">
                          About {selectedTrainer.name.split(" ")[0]}
                        </h4>
                        <p className="text-gray-300 text-base leading-relaxed">
                          {selectedTrainer.bio}
                        </p>
                      </div>

                      {/* Philosophy */}
                      <div>
                        <h5 className="text-white font-bold text-lg mb-3">
                          Training Philosophy
                        </h5>
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
                          <p className="text-gray-300 italic text-lg mb-2">
                            "{selectedTrainer.quote}"
                          </p>
                          <p className="text-gray-400 text-sm">
                            {selectedTrainer.trainingStyle}
                          </p>
                        </div>
                      </div>

                      {/* Qualifications */}
                      <div>
                        <h5 className="text-white font-bold text-lg mb-4">
                          Key Qualifications
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedTrainer.achievements.map(
                            (achievement, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="w-6 h-6 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 14.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <span className="text-gray-300 text-sm flex-1">
                                  {achievement}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                      {/* Specialties */}
                      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
                        <h5 className="text-white font-bold text-lg mb-4">
                          Areas of Expertise
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedTrainer.specialties.map(
                            (specialty, index) => (
                              <span
                                key={index}
                                className="bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 text-white px-3 py-2 rounded-xl text-sm font-medium"
                              >
                                {specialty}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Certifications */}
                      {selectedTrainer.certifications.length > 0 && (
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
                          <h5 className="text-white font-bold text-lg mb-4">
                            Certifications
                          </h5>
                          <ul className="space-y-3">
                            {selectedTrainer.certifications.map(
                              (cert, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-3"
                                >
                                  <svg
                                    className="w-4 h-4 text-brand-primary flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-gray-300 text-sm flex-1">
                                    {cert}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
                        <h5 className="text-white font-bold text-lg mb-4">
                          Contact Information
                        </h5>
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                              Email
                            </p>
                            <p className="text-white text-base break-all">
                              {selectedTrainer.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                              Phone
                            </p>
                            <p className="text-white text-base">
                              {selectedTrainer.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                              Availability
                            </p>
                            <p className="text-white text-base">
                              {selectedTrainer.availability}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Social Links */}
                      {(selectedTrainer.social.instagram ||
                        selectedTrainer.social.twitter ||
                        selectedTrainer.social.linkedin) && (
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
                          <h5 className="text-white font-bold text-lg mb-4">
                            Connect
                          </h5>
                          <div className="flex gap-4">
                            {selectedTrainer.social.instagram && (
                              <a
                                href={`https://instagram.com/${selectedTrainer.social.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-pink-500 transition-all duration-300 transform hover:scale-110"
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.980.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                              </a>
                            )}
                            {selectedTrainer.social.twitter && (
                              <a
                                href={`https://twitter.com/${selectedTrainer.social.twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                              </a>
                            )}
                            {selectedTrainer.social.linkedin && (
                              <a
                                href={selectedTrainer.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Buttons - Removed Book Session button */}
                  <div className="mt-8 pt-8 border-t border-gray-800/50">
                    <button
                      onClick={() => setSelectedTrainer(null)}
                      className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white font-bold py-4 px-6 rounded-xl text-base hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Close & View All Trainers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Why Choose Our Trainers */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Why Train With{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r text-white from-brand-primary to-brand-secondary">
                  Our Experts
                </span>
              </h3>
              <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
                Discover what sets our elite training professionals apart
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: "Certified Excellence",
                  description:
                    "All trainers hold international certifications and undergo continuous education to stay at the forefront of fitness science.",
                  icon: "🏅",
                  color: "from-blue-500/20 to-blue-600/20",
                  border: "border-blue-500/30",
                },
                {
                  title: "Proven Results",
                  description:
                    "Track record of successful transformations across diverse fitness goals with measurable, sustainable results.",
                  icon: "📈",
                  color: "from-green-500/20 to-green-600/20",
                  border: "border-green-500/30",
                },
                {
                  title: "Personalized Approach",
                  description:
                    "Customized training plans based on comprehensive individual assessment and evolving goals.",
                  icon: "🎯",
                  color: "from-purple-500/20 to-purple-600/20",
                  border: "border-purple-500/30",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02]"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} ${feature.border} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h4 className="text-white font-bold text-xl mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          {/* <div className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 sm:p-10 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-secondary/10"></div>
            <div className="relative text-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Start Your Journey With <span className="text-transparent bg-clip-text text-white bg-gradient-to-r from-brand-primary to-brand-secondary">Expert Guidance</span>
              </h3>
              <p className="text-gray-300 text-lg sm:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto">
                Book a complimentary trial session with any of our trainers to experience personalized fitness coaching
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                <button 
                  onClick={() => {
                    if (trainers.length > 0) {
                      const randomTrainer = trainers[Math.floor(Math.random() * trainers.length)];
                      const transformed = transformTrainerData(randomTrainer);
                      handleBookSession(transformed);
                    }
                  }}
                  className="group relative bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl text-base sm:text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/40 transform hover:scale-[1.02]"
                >
                  Book Free Trial Session
                  <svg className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl text-base sm:text-lg transition-all duration-500 hover:bg-gray-700/50 hover:border-gray-600 transform hover:scale-[1.02]">
                  Schedule Full Assessment
                </button>
              </div>
              <p className="text-gray-500 text-sm sm:text-base mt-6 sm:mt-8">
                Limited trial spots available. Book your session today!
              </p>
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default TrainersSection;
