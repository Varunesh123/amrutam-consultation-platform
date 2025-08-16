import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Star, Filter, Calendar, Users, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import Loading from '../components/common/Loading';
import { getMockDoctorsFromSpec } from '../utils/getMockDoctorsFromSpec';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);

  const specializations = [
    'General Consultation',
    'Panchakarma',
    'Skin & Hair Care',
    'Women\'s Health',
    'Joint & Muscle Care',
    'Digestive Health',
    'Mental Wellness',
    'Respiratory Care'
  ];

  const fallbackDoctors = [
    {
      id: '1',
      name: 'Dr. Rajesh Sharma',
      specialization: 'Panchakarma Specialist',
      experience: '15 years',
      rating: 4.8,
      reviews: 234,
      nextAvailable: 'Today 2:00 PM',
      mode: ['Online', 'In-person'],
      languages: ['Hindi', 'English'],
      consultationFee: 500
    },
    {
      id: '2',
      name: 'Dr. Priya Patel',
      specialization: 'Women\'s Health Expert',
      experience: '12 years',
      rating: 4.9,
      reviews: 189,
      nextAvailable: 'Tomorrow 10:00 AM',
      mode: ['Online'],
      languages: ['Hindi', 'English', 'Gujarati'],
      consultationFee: 600
    },
    {
      id: '3',
      name: 'Dr. Arjun Kumar',
      specialization: 'Skin & Hair Care',
      experience: '10 years',
      rating: 4.7,
      reviews: 156,
      nextAvailable: 'Today 4:30 PM',
      mode: ['Online', 'In-person'],
      languages: ['Hindi', 'English', 'Tamil'],
      consultationFee: 450
    }
  ];

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await doctorService.getDoctors();
      const doctorsWithSlots = await Promise.all(
        response.map(async (doctor) => {
          try {
            const slot = await appointmentService.getNextAvailableSlot(doctor.id);
            return { ...doctor, nextAvailable: slot?.startTime || 'Not available' };
          } catch {
            return { ...doctor, nextAvailable: 'Not available' };
          }
        })
      );

      setDoctors(doctorsWithSlots);
      setUsingFallback(false);
    } catch (err) {
      if ((err.message.includes('Network Error') || err.message.includes('CORS')) && retryCount < 3) {
        // Retry logic
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchDoctors();
        }, 2000);
      } else {
        // If server fails, load mock data from OpenAPI spec
        setError('Unable to connect to the server. Using OpenAPI sample data.');
        const mockDoctors = await getMockDoctorsFromSpec();
        setDoctors(mockDoctors);
        setUsingFallback(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || 
                                 doctor.specialization.includes(selectedSpecialization);
    const matchesMode = !selectedMode || doctor.mode.includes(selectedMode);
    
    return matchesSearch && matchesSpecialization && matchesMode;
  });

  const handleBookNow = (doctorId) => {
    navigate(`/book/${doctorId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-emerald-600">
                🌿 Amrutam
              </div>
              <nav className="hidden md:flex space-x-8">
                <button 
                  onClick={() => navigate('/slot-picker')} 
                  className="text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Slot Picker
                </button>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Appointments
                </button>
                <button 
                  onClick={() => navigate('/doctors')} 
                  className="text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Find Doctors
                </button>
                <button 
                  onClick={() => navigate('/about')} 
                  className="text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  About Amrutam
                </button>
                {isAuthenticated && (
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    My Appointments
                  </button>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate('/register')} 
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => navigate('/profile')} 
                  className="text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  {user?.name || 'Profile'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Journey to Natural Healing
              <span className="text-emerald-600"> Starts Here</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with certified Ayurvedic doctors for personalized consultations. 
              Experience the ancient wisdom of Ayurveda with modern convenience.
            </p>
            
            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search doctors or specializations..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <select 
                    className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select 
                    className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                  >
                    <option value="">All Modes</option>
                    <option value="Online">Online</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>
              </div>
              <button 
                className="mt-4 w-full md:w-auto bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                onClick={() => navigate('/doctors')}
              >
                <Filter className="inline h-5 w-5 mr-2" />
                Search Doctors
              </button>
            </div>
            {usingFallback && (
              <p className="text-center text-yellow-600 mt-4">
                Showing sample data due to server connectivity issues.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <Users className="h-12 w-12 mx-auto mb-4" />
              <div className="text-3xl font-bold">{doctors.length || '1000+'}</div>
              <div className="text-emerald-100">Certified Doctors</div>
            </div>
            <div>
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <div className="text-3xl font-bold">50000+</div>
              <div className="text-emerald-100">Consultations</div>
            </div>
            <div>
              <Shield className="h-12 w-12 mx-auto mb-4" />
              <div className="text-3xl font-bold">100%</div>
              <div className="text-emerald-100">Secure & Private</div>
            </div>
            <div>
              <Award className="h-12 w-12 mx-auto mb-4" />
              <div className="text-3xl font-bold">4.8</div>
              <div className="text-emerald-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Ayurvedic Doctors
            </h2>
            <p className="text-lg text-gray-600">
              Consult with our experienced and certified practitioners
            </p>
            {usingFallback && (
              <p className="text-yellow-600">
                Showing sample doctors due to server issues. Please try again later.
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No doctors found matching your criteria.</p>
              </div>
            )}
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-emerald-600 font-medium">{doctor.specialization}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Award className="h-4 w-4 mr-2" />
                    <span>{doctor.experience} experience</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-gray-900 font-semibold">{doctor.rating}</span>
                    <span className="text-gray-500 ml-1">({doctor.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-emerald-600 font-medium">Next: {doctor.nextAvailable}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{doctor.mode.join(', ')}</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{doctor.consultationFee}</span>
                      <span className="text-gray-500 text-sm">/consultation</span>
                    </div>
                    <button 
                      onClick={() => handleBookNow(doctor.id)}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                      disabled={usingFallback}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/doctors')} 
              className="bg-white border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-semibold"
            >
              View All Doctors
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started with your Ayurvedic consultation in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Find Your Doctor</h3>
              <p className="text-gray-600">
                Search and filter doctors by specialization, availability, and consultation mode
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Appointment</h3>
              <p className="text-gray-600">
                Select your preferred time slot and confirm your booking with secure payment
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Consult & Heal</h3>
              <p className="text-gray-600">
                Connect with your doctor online or in-person for personalized Ayurvedic treatment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-emerald-400 mb-4">
                🌿 Amrutam
              </div>
              <p className="text-gray-400">
                Connecting you with authentic Ayurvedic healing for a healthier, balanced life.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => navigate('/doctors')} 
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Find Doctors
                  </button>
                </li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Specializations</a></li>
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="hover:text-emerald-400 transition-colors"
                  >
                    About Amrutam
                  </button>
                </li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@amrutam.co.in</li>
                <li>📞 +91 98765 43210</li>
                <li>📍 Mumbai, India</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Amrutam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;