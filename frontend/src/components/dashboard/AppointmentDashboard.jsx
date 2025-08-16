import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock, CheckCircle, XCircle, AlertCircle, X, RotateCcw, User, Stethoscope, MapPin, Phone, Video, Heart, Award, Users } from 'lucide-react';

const CombinedAppointmentFilters = ({ filters, onFilterChange, activeTab }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: Filter, color: 'teal', gradient: 'from-teal-500 to-emerald-500' },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'amber', gradient: 'from-amber-500 to-orange-500' },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'blue', gradient: 'from-blue-500 to-teal-500' },
    { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'green', gradient: 'from-green-500 to-emerald-500' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'red', gradient: 'from-red-500 to-pink-500' },
    { value: 'rescheduled', label: 'Rescheduled', icon: RotateCcw, color: 'purple', gradient: 'from-purple-500 to-indigo-500' }
  ];

  const timeRangeOptions = [
    { value: 'all', label: 'All Time', icon: Calendar },
    { value: 'today', label: 'Today', icon: Calendar },
    { value: 'this_week', label: 'This Week', icon: Calendar },
    { value: 'this_month', label: 'This Month', icon: Calendar },
    { value: 'last_month', label: 'Last Month', icon: Calendar },
    { value: 'last_3_months', label: 'Last 3 Months', icon: Calendar }
  ];

  const getStatusStyle = (status) => {
    const statusConfig = statusOptions.find(opt => opt.value === status);
    const color = statusConfig?.color || 'teal';
    
    const colorMap = {
      teal: 'text-teal-700 bg-teal-50 border-teal-200 hover:bg-teal-100',
      amber: 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100',
      blue: 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100',
      green: 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100',
      red: 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100',
      purple: 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100'
    };
    
    return colorMap[color];
  };

  const hasActiveFilters = filters.status !== 'all' || filters.timeRange !== 'all' || filters.search;

  const clearAllFilters = () => {
    onFilterChange({ status: 'all', timeRange: 'all', search: '' });
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Search & Filter</h3>
              <p className="text-teal-100 text-sm">Find your appointments quickly</p>
            </div>
          </div>
          {activeTab === 'all' && (
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  <X size={14} />
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              >
                <Filter className="w-4 h-4" />
                {isExpanded ? 'Less Filters' : 'More Filters'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-b border-teal-50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-teal-400" />
          </div>
          <input
            type="text"
            placeholder="Search by doctor name, symptoms, or specialization..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="block w-full pl-12 pr-12 py-4 border border-teal-200 rounded-xl text-gray-900 placeholder-teal-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-teal-50 hover:bg-white focus:bg-white"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-teal-400 hover:text-teal-600 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {(activeTab === 'all' && (isExpanded || hasActiveFilters)) && (
        <div className="p-6 bg-gradient-to-r from-teal-50 via-emerald-50 to-green-50 border-b border-teal-100">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-teal-800 uppercase tracking-wide flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <div className="p-1.5 bg-teal-100 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-teal-600" />
                  </div>
                  Appointment Status
                </label>
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) => onFilterChange({ status: e.target.value })}
                    className={`w-full appearance-none px-4 py-4 pr-12 border-2 rounded-xl font-medium transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${getStatusStyle(filters.status)}`}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="h-5 w-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {filters.status !== 'all' && (
                  <div className="flex items-center gap-2 text-xs text-teal-700 bg-teal-100 px-3 py-1.5 rounded-full w-fit">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                    <span>Filtering by {statusOptions.find(opt => opt.value === filters.status)?.label}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                  </div>
                  Time Range
                </label>
                <div className="relative">
                  <select
                    value={filters.timeRange}
                    onChange={(e) => onFilterChange({ timeRange: e.target.value })}
                    className="w-full appearance-none px-4 py-4 pr-12 border-2 border-emerald-200 bg-emerald-50 rounded-xl font-medium text-emerald-700 hover:bg-white transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-300"
                  >
                    {timeRangeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {filters.timeRange !== 'all' && (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full w-fit">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span>Filtering by {timeRangeOptions.find(opt => opt.value === filters.timeRange)?.label}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-emerald-50">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-teal-800">Active filters:</span>
            
            {filters.search && (
              <div className="flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium border border-teal-200">
                <Search className="w-3.5 h-3.5" />
                <span>"{filters.search}"</span>
                <button
                  onClick={() => onFilterChange({ search: '' })}
                  className="text-teal-500 hover:text-teal-700 ml-1 hover:bg-teal-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            {filters.status !== 'all' && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
                getStatusStyle(filters.status).replace('hover:bg-', 'bg-').replace('border-', 'border-')
              }`}>
                <span>{statusOptions.find(opt => opt.value === filters.status)?.label}</span>
                <button
                  onClick={() => onFilterChange({ status: 'all' })}
                  className="ml-1 opacity-70 hover:opacity-100 hover:bg-white/50 rounded-full p-0.5 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            {filters.timeRange !== 'all' && (
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200">
                <Calendar className="w-3.5 h-3.5" />
                <span>{timeRangeOptions.find(opt => opt.value === filters.timeRange)?.label}</span>
                <button
                  onClick={() => onFilterChange({ timeRange: 'all' })}
                  className="text-emerald-500 hover:text-emerald-700 ml-1 hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm font-medium bg-white hover:bg-gray-50 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <X className="w-3.5 h-3.5" />
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AppointmentCard = ({ appointment }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: { 
        color: 'bg-teal-100 text-teal-700 border-teal-200', 
        icon: CheckCircle, 
        iconColor: 'text-teal-600',
        gradient: 'from-teal-500 to-emerald-500'
      },
      pending: { 
        color: 'bg-amber-100 text-amber-700 border-amber-200', 
        icon: Clock, 
        iconColor: 'text-amber-600',
        gradient: 'from-amber-500 to-orange-500'
      },
      completed: { 
        color: 'bg-green-100 text-green-700 border-green-200', 
        icon: CheckCircle, 
        iconColor: 'text-green-600',
        gradient: 'from-green-500 to-emerald-500'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-700 border-red-200', 
        icon: XCircle, 
        iconColor: 'text-red-600',
        gradient: 'from-red-500 to-pink-500'
      },
      rescheduled: { 
        color: 'bg-purple-100 text-purple-700 border-purple-200', 
        icon: RotateCcw, 
        iconColor: 'text-purple-600',
        gradient: 'from-purple-500 to-indigo-500'
      }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(appointment.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-teal-200 transform hover:-translate-y-1 cursor-pointer
        ${isHovered ? 'shadow-2xl border-teal-200' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-1 bg-gradient-to-r ${statusConfig.gradient}`}></div>
      
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl flex items-center justify-center border-4 border-teal-100">
                <User size={32} className="text-teal-600" />
              </div>
              <div className={`absolute -bottom-2 -right-2 p-1.5 bg-gradient-to-r ${statusConfig.gradient} rounded-full`}>
                <StatusIcon size= {14} className="text-white" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{appointment.doctor.name}</h3>
                <div className="flex items-center gap-2 text-teal-600 mb-2">
                  <Stethoscope size={16} />
                  <span className="font-medium text-sm">
                    {appointment.specializations.join(', ')}
                  </span>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig.color}`}>
                <StatusIcon size={14} className={statusConfig.iconColor} />
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="font-medium text-gray-900">Consultation for: </span>
                {appointment.symptoms}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600 bg-teal-50 px-3 py-2 rounded-lg border border-teal-100">
                <Calendar size={16} className="text-teal-500" />
                <span className="text-sm font-medium">{appointment.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                <Clock size={16} className="text-emerald-500" />
                <span className="text-sm font-medium">{appointment.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {appointment.mode === 'video' ? (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                  <Video size={12} />
                  Video Consultation
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                  <MapPin size={12} />
                  In-Person Visit
                </span>
              )}
              {appointment.fee && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                  ₹{appointment.fee}
                </span>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-100">
              <div className="space-y-3">
                {appointment.status === 'confirmed' && (
                  <>
                    <button className={`w-full bg-gradient-to-r ${statusConfig.gradient} text-white py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg transform hover:scale-105`}>
                      Join Appointment
                    </button>
                    <button className="w-full border-2 border-teal-500 text-teal-600 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-teal-50">
                      Reschedule
                    </button>
                  </>
                )}
                {appointment.status === 'pending' && (
                  <>
                    <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                      View Details
                    </button>
                    <button className="w-full border-2 border-amber-500 text-amber-600 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-amber-50">
                      Cancel
                    </button>
                  </>
                )}
                {appointment.status === 'completed' && (
                  <>
                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                      View Report
                    </button>
                    <button className="w-full border-2 border-green-500 text-green-600 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-green-50">
                      Book Again
                    </button>
                  </>
                )}
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-600 py-2 px-4 rounded-xl font-medium text-sm transition-all duration-300 hover:bg-gray-50">
                  <Phone size={14} />
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: { name: 'Dr. Sarah Johnson' },
      symptoms: 'Regular checkup and consultation for ongoing treatment plan',
      specializations: ['General Medicine', 'Internal Medicine'],
      status: 'confirmed',
      date: '2024-01-20',
      time: '10:00 AM',
      mode: 'video',
      fee: 800
    },
    {
      id: 2,
      doctor: { name: 'Dr. Michael Chen' },
      symptoms: 'Back pain and muscle tension, physiotherapy consultation',
      specializations: ['Orthopedics', 'Sports Medicine'],
      status: 'pending',
      date: '2024-01-22',
      time: '2:30 PM',
      mode: 'in_person',
      fee: 1200
    },
    {
      id: 3,
      doctor: { name: 'Dr. Emily Rodriguez' },
      symptoms: 'Skin examination and dermatology consultation for acne treatment',
      specializations: ['Dermatology'],
      status: 'completed',
      date: '2024-01-15',
      time: '11:15 AM',
      mode: 'video',
      fee: 650
    },
    {
      id: 4,
      doctor: { name: 'Dr. Rajesh Sharma' },
      symptoms: 'Ayurvedic consultation for digestive issues and wellness plan',
      specializations: ['Ayurveda', 'Digestive Health'],
      status: 'rescheduled',
      date: '2024-01-25',
      time: '4:00 PM',
      mode: 'in_person',
      fee: 900
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    timeRange: 'all',
    search: ''
  });
  const [activeTab, setActiveTab] = useState('all');

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getAppointmentStats = () => {
    const stats = appointments.reduce((acc, appointment) => {
      acc.total++;
      acc[appointment.status] = (acc[appointment.status] || 0) + 1;
      return acc;
    }, { total: 0 });
    return stats;
  };

  const stats = getAppointmentStats();

  const filteredAppointments = appointments.filter(appointment => {
    if (filters.status !== 'all' && appointment.status !== filters.status) {
      return false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        appointment.doctor.name.toLowerCase().includes(searchLower) ||
        appointment.symptoms.toLowerCase().includes(searchLower) ||
        appointment.specializations.some(spec => 
          spec.toLowerCase().includes(searchLower)
        )
      );
    }
    
    if (activeTab === 'upcoming') {
      return ['confirmed', 'pending', 'rescheduled'].includes(appointment.status);
    }
    
    if (activeTab === 'past') {
      return ['completed', 'cancelled'].includes(appointment.status);
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-emerald-300/15 rounded-full blur-3xl animate-bounce delay-200"></div>
          <div className="absolute bottom-16 left-1/3 w-28 h-28 bg-teal-400/10 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-20 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-teal-100 text-sm font-semibold border border-white/20">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                📅 Appointment Management
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                My Appointments
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium text-teal-200 mt-2">
                  Manage Your Healthcare
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-teal-100 max-w-2xl leading-relaxed">
                Track, manage, and organize all your medical appointments in one place with ease.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-teal-200 text-sm">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.confirmed || 0}</div>
                  <div className="text-teal-200 text-sm">Confirmed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.pending || 0}</div>
                  <div className="text-teal-200 text-sm">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.completed || 0}</div>
                  <div className="text-teal-200 text-sm">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-teal-50" viewBox="0 0 1440 48" preserveAspectRatio="none">
            <path d="M0,48 C240,0 480,0 720,24 C960,48 1200,48 1440,24 L1440,48 L0,48 Z"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="space-y-8">
          <CombinedAppointmentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            activeTab={activeTab}
          />

          <div className="bg-white rounded-2xl p-3 shadow-lg border border-teal-100">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'upcoming', label: 'Upcoming', icon: Calendar, count: (stats.confirmed || 0) + (stats.pending || 0) + (stats.rescheduled || 0) },
                { key: 'past', label: 'Past', icon: Clock, count: (stats.completed || 0) + (stats.cancelled || 0) },
                { key: 'all', label: 'All Appointments', icon: Filter, count: stats.total }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 capitalize ${
                      activeTab === tab.key 
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-teal-50'
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <IconComponent size={18} />
                    <div className="flex flex-col items-start">
                      <span>{tab.label}</span>
                      <span className={`text-xs ${
                        activeTab === tab.key ? 'text-teal-100' : 'text-gray-400'
                      }`}>
                        {tab.count} appointment{tab.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Appointment Results
                </h3>
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                  {filteredAppointments.length} found
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-teal-500" />
                  <span>Total: {appointments.length} appointments</span>
                </div>
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                  <Calendar size={16} />
                  Book New
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Book Appointment</h4>
                  <p className="text-teal-100 text-sm">Schedule your next visit</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Heart size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Health Records</h4>
                  <p className="text-emerald-100 text-sm">View your medical history</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Wellness Plan</h4>
                  <p className="text-green-100 text-sm">Track your health goals</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {filteredAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="transform transition-all duration-500"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <AppointmentCard appointment={appointment} />
              </div>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-teal-100 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={40} className="text-teal-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No appointments found
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Try adjusting your search terms or filters to find what you're looking for, or book your first appointment.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setFilters({ status: 'all', timeRange: 'all', search: '' })}
                    className="px-6 py-3 border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                    Book New Appointment
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredAppointments.length > 0 && filteredAppointments.length < appointments.length && (
            <div className="text-center py-8">
              <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <span>Load More Appointments</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </button>
              <p className="mt-4 text-gray-600">
                Showing {filteredAppointments.length} of {appointments.length} appointments
              </p>
            </div>
          )}

          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border-2 border-red-100 p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Phone size={28} className="text-white" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-red-800 mb-2">Emergency Healthcare</h3>
                <p className="text-red-600 mb-4">
                  Need immediate medical assistance? Our emergency helpline is available 24/7.
                </p>
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                  <Phone size={18} />
                  Call Emergency: 1800-XXX-XXXX
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default AppointmentDashboard;