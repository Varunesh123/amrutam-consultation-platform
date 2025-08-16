import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Clock, Phone, Video, Calendar, Stethoscope, Award, Heart, Users } from 'lucide-react';

// Mock data for demonstration
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    specialization: "Panchakarma Specialist",
    experience: 15,
    rating: 4.8,
    reviewCount: 234,
    consultationFee: 800,
    profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    location: "Mumbai, Maharashtra",
    availability: "Available today",
    consultationModes: ["video", "in_person"],
    bio: "Experienced Ayurvedic practitioner specializing in Panchakarma treatments and holistic healing.",
    languages: ["Hindi", "English", "Marathi"],
    nextAvailable: "Today 4:00 PM"
  },
  {
    id: 2,
    name: "Dr. Priya Nair",
    specialization: "Skin & Hair Care",
    experience: 8,
    rating: 4.9,
    reviewCount: 189,
    consultationFee: 650,
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    location: "Bangalore, Karnataka",
    availability: "Available tomorrow",
    consultationModes: ["video"],
    bio: "Ayurvedic dermatologist with expertise in natural skin and hair treatments.",
    languages: ["English", "Malayalam", "Kannada"],
    nextAvailable: "Tomorrow 10:00 AM"
  },
  {
    id: 3,
    name: "Dr. Amit Gupta",
    specialization: "Digestive Health",
    experience: 12,
    rating: 4.7,
    reviewCount: 156,
    consultationFee: 750,
    profileImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    location: "Delhi, NCR",
    availability: "Available today",
    consultationModes: ["video", "in_person"],
    bio: "Specialist in Ayurvedic gastroenterology and digestive wellness programs.",
    languages: ["Hindi", "English"],
    nextAvailable: "Today 6:30 PM"
  }
];

// Mock filter component (simplified for demo)
const DoctorFilters = ({ filters, onFilterChange, totalCount }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Filter size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <p className="text-teal-100 text-sm">{totalCount} results found</p>
            </div>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">Specialization</label>
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
              <option>All Specializations</option>
              <option>Panchakarma</option>
              <option>Skin & Hair Care</option>
              <option>Digestive Health</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

const DoctorCard = ({ doctor, onBookAppointment }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-teal-200 transform hover:-translate-y-1 cursor-pointer
        ${isHovered ? 'shadow-2xl border-teal-200' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Doctor Image and Basic Info */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={doctor.profileImage}
                alt={doctor.name}
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover border-4 border-teal-100"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {doctor.experience}Y
              </div>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                {/* Name and Specialization */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                  <div className="flex items-center gap-2 text-teal-600 mb-2">
                    <Stethoscope size={16} />
                    <span className="font-medium text-sm">{doctor.specialization}</span>
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900 ml-1">{doctor.rating}</span>
                    <span className="text-gray-500 text-sm">({doctor.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Location and Availability */}
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span className="text-sm">{doctor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-green-500" />
                    <span className="text-sm text-green-600 font-medium">{doctor.availability}</span>
                  </div>
                </div>

                {/* Consultation Modes */}
                <div className="flex items-center gap-2 mb-3">
                  {doctor.consultationModes.includes('video') && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      <Video size={12} />
                      Video
                    </span>
                  )}
                  {doctor.consultationModes.includes('in_person') && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      <Users size={12} />
                      In-Person
                    </span>
                  )}
                </div>

                {/* Languages */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">Languages:</span>
                  <div className="flex gap-1">
                    {doctor.languages.map((lang, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-sm leading-relaxed">{doctor.bio}</p>
              </div>

              {/* Booking Section */}
              <div className="flex-shrink-0 text-right">
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-100">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-gray-900">₹{doctor.consultationFee}</div>
                    <div className="text-sm text-gray-600">Consultation Fee</div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-600">Next Available</div>
                    <div className="font-semibold text-teal-600 text-sm">{doctor.nextAvailable}</div>
                  </div>

                  <button
                    onClick={() => onBookAppointment(doctor.id)}
                    className={`
                      w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg transform hover:scale-105 focus:ring-4 focus:ring-teal-200
                      ${isHovered ? 'shadow-lg scale-105' : ''}
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Calendar size={16} />
                      Book Appointment
                    </div>
                  </button>

                  <button className="w-full mt-2 border border-teal-500 text-teal-600 py-2.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-teal-50">
                    <div className="flex items-center justify-center gap-2">
                      <Phone size={16} />
                      Quick Call
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 transition-opacity duration-300 pointer-events-none
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `}></div>
    </div>
  );
};

const DoctorListing = () => {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    mode: '',
    availability: '',
    location: '',
    sortBy: 'availability'
  });
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleBookAppointment = (doctorId) => {
    alert(`Booking appointment with doctor ${doctorId}`);
  };

  const totalCount = doctors.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-emerald-300/15 rounded-full blur-3xl animate-bounce delay-200"></div>
          <div className="absolute bottom-16 left-1/3 w-28 h-28 bg-teal-400/10 rounded-full blur-xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 left-1/4 transform -translate-x-1/2 animate-float">
            <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
          </div>
          <div className="absolute top-48 right-1/4 transform translate-x-1/2 animate-float delay-1000">
            <div className="w-10 h-10 bg-white/15 rounded-full backdrop-blur-sm flex items-center justify-center">
              <Stethoscope size={18} className="text-white" />
            </div>
          </div>
          <div className="absolute bottom-32 left-1/3 animate-float delay-500">
            <div className="w-6 h-6 bg-white/25 rounded-md backdrop-blur-sm"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-md rounded-full text-teal-100 text-sm font-semibold mb-8 border border-white/20 shadow-lg">
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
              🌿 Trusted Ayurvedic Care
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-teal-200 via-emerald-200 to-green-200 bg-clip-text text-transparent mt-2">
                Ayurvedic Doctor
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Connect with certified Ayurvedic practitioners for personalized wellness, natural healing, and holistic healthcare solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-teal-100 text-sm">
              <div className="flex items-center gap-2">
                <Award size={16} />
                <span>500+ Certified Doctors</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-teal-200 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>50K+ Happy Patients</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-teal-200 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Star size={16} />
                <span>4.8 Average Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-teal-50" viewBox="0 0 1440 48" preserveAspectRatio="none">
            <path d="M0,48 C240,0 480,0 720,24 C960,48 1200,48 1440,24 L1440,48 L0,48 Z"></path>
          </svg>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Search Doctors</h2>
              <p className="text-gray-600">Find the right Ayurvedic specialist for your health needs</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, specialization, or location..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-lg"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                  Search
                </button>
              </div>
            </div>
            
            {/* Popular Searches */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-4 text-center">Popular Specializations</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { name: 'Panchakarma', icon: '🌿', color: 'from-teal-500 to-emerald-500', count: '45+' },
                  { name: 'Skin Care', icon: '✨', color: 'from-emerald-500 to-green-500', count: '32+' },
                  { name: 'Weight Management', icon: '⚖️', color: 'from-green-500 to-teal-500', count: '28+' },
                  { name: 'Arthritis Care', icon: '🦴', color: 'from-teal-400 to-emerald-400', count: '35+' },
                  { name: 'Stress Relief', icon: '🧘', color: 'from-emerald-400 to-green-400', count: '22+' },
                  { name: 'Digestive Health', icon: '🍃', color: 'from-green-400 to-teal-400', count: '40+' }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setSearchQuery(item.name)}
                    className={`group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${item.color} text-white rounded-2xl font-semibold text-sm transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div className="text-left">
                      <div>{item.name}</div>
                      <div className="text-xs opacity-90">{item.count} doctors</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters */}
            <DoctorFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              totalCount={totalCount}
            />

            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-5">
                <h4 className="font-semibold text-white text-lg flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Platform Stats
                </h4>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Users size={16} className="text-teal-500" />
                    Active Doctors
                  </span>
                  <span className="font-bold text-teal-600 text-lg">500+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar size={16} className="text-emerald-500" />
                    Consultations Today
                  </span>
                  <span className="font-bold text-emerald-600 text-lg">150+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Star size={16} className="text-yellow-500" />
                    Average Rating
                  </span>
                  <span className="font-bold text-yellow-600 text-lg">4.8 ⭐</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Heart size={16} className="text-pink-500" />
                    Success Rate
                  </span>
                  <span className="font-bold text-pink-600 text-lg">96%</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact Card */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-100 p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone size={20} className="text-red-600" />
                </div>
                <h4 className="font-semibold text-red-800 mb-2">Emergency Care</h4>
                <p className="text-red-600 text-sm mb-4">Need immediate assistance?</p>
                <button className="w-full bg-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-600 transition-colors">
                  Call Emergency: 1800-XXX-XXXX
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content Area */}
          <div className="lg:col-span-3">
            {/* Results Header with View Toggle */}
            <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="text-teal-600">{totalCount}</span> Doctor{totalCount !== 1 ? 's' : ''} Available
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {searchQuery && `Results for "${searchQuery}"`}
                    {filters.location && ` in ${filters.location}`}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'grid' 
                          ? 'bg-white text-teal-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'list' 
                          ? 'bg-white text-teal-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      List
                    </button>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white min-w-[160px]"
                  >
                    <option value="availability">Earliest Available</option>
                    <option value="rating">Highest Rated</option>
                    <option value="experience">Most Experienced</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Doctor Cards */}
            <div className="space-y-6">
              {doctors.map((doctor, index) => (
                <div
                  key={doctor.id}
                  className="transform transition-all duration-500"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <DoctorCard
                    doctor={doctor}
                    onBookAppointment={handleBookAppointment}
                  />
                </div>
              ))}
            </div>

            {/* Load More Section */}
            <div className="text-center py-12">
              <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <span>Load More Doctors</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </button>
              <p className="mt-4 text-gray-500">
                Showing {doctors.length} of {totalCount} doctors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DoctorListing;