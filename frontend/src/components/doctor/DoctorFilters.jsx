import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, X, Star, MapPin, Clock, User, DollarSign, Stethoscope } from 'lucide-react';

// Mock doctorService for demo
const mockDoctorService = {
  getSpecializations: async () => [
    { id: 1, name: 'Panchakarma', count: 45 },
    { id: 2, name: 'Skin & Hair Care', count: 32 },
    { id: 3, name: 'Weight Management', count: 28 },
    { id: 4, name: 'Arthritis & Joint Care', count: 35 },
    { id: 5, name: 'Digestive Health', count: 40 },
    { id: 6, name: 'Mental Wellness', count: 22 },
    { id: 7, name: 'Women\'s Health', count: 30 },
    { id: 8, name: 'Respiratory Care', count: 18 }
  ]
};

const DoctorFilters = ({ filters = {}, onFilterChange, totalCount = 0 }) => {
  const [specializations, setSpecializations] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    fetchSpecializations();
  }, []);

  useEffect(() => {
    // Count active filters
    const count = Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const fetchSpecializations = async () => {
    try {
      const response = await mockDoctorService.getSpecializations();
      setSpecializations(response);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      specialization: '',
      mode: '',
      availability: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      experience: '',
      rating: '',
      sortBy: 'availability'
    });
  };

  const clearSpecificFilter = (key) => {
    handleFilterChange(key, '');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Filter size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <p className="text-teal-100 text-sm">
                {activeFiltersCount} active • {totalCount} results
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              >
                <X size={14} />
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
            >
              {isExpanded ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Specialization Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope size={18} className="text-teal-600" />
              <label className="text-sm font-semibold text-gray-800">Specialization</label>
            </div>
            <div className="relative">
              <select
                value={filters.specialization || ''}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 appearance-none text-sm"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec.id} value={spec.name}>
                    {spec.name} ({spec.count})
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
            {filters.specialization && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                  {filters.specialization}
                  <button
                    onClick={() => clearSpecificFilter('specialization')}
                    className="hover:bg-teal-200 rounded-full p-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Consultation Mode Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-emerald-600" />
              <label className="text-sm font-semibold text-gray-800">Consultation Mode</label>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: '', label: 'All Modes', icon: '🔄' },
                { value: 'video', label: 'Video Call', icon: '📹' },
                { value: 'in_person', label: 'In-Person', icon: '🏥' }
              ].map((mode) => (
                <label key={mode.value} className={`
                  flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                  ${filters.mode === mode.value 
                    ? 'border-teal-500 bg-teal-50 text-teal-700' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                `}>
                  <input
                    type="radio"
                    name="mode"
                    value={mode.value}
                    checked={filters.mode === mode.value}
                    onChange={(e) => handleFilterChange('mode', e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-lg">{mode.icon}</span>
                  <span className="text-sm font-medium">{mode.label}</span>
                  {filters.mode === mode.value && (
                    <div className="ml-auto w-2 h-2 bg-teal-500 rounded-full"></div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-green-600" />
              <label className="text-sm font-semibold text-gray-800">Availability</label>
            </div>
            <div className="relative">
              <select
                value={filters.availability || ''}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 appearance-none text-sm"
              >
                <option value="">Any time</option>
                <option value="today">Available today</option>
                <option value="tomorrow">Available tomorrow</option>
                <option value="this_week">This week</option>
                <option value="next_week">Next week</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />
              <label className="text-sm font-semibold text-gray-800">Location</label>
            </div>
            <div className="relative">
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Enter city or area"
                className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
              />
              <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
              {filters.location && (
                <button
                  onClick={() => clearSpecificFilter('location')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-purple-600" />
              <label className="text-sm font-semibold text-gray-800">Consultation Fee</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { min: 0, max: 500, label: 'Under ₹500' },
                { min: 500, max: 1000, label: '₹500-1000' },
                { min: 1000, max: 2000, label: '₹1000-2000' },
                { min: 2000, max: null, label: 'Above ₹2000' }
              ].map((range, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleFilterChange('minPrice', range.min.toString());
                    handleFilterChange('maxPrice', range.max ? range.max.toString() : '');
                  }}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-full hover:border-teal-500 hover:text-teal-600 transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User size={18} className="text-indigo-600" />
              <label className="text-sm font-semibold text-gray-800">Minimum Experience</label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: '', label: 'Any' },
                { value: '1', label: '1+ years' },
                { value: '3', label: '3+ years' },
                { value: '5', label: '5+ years' },
                { value: '10', label: '10+ years' },
                { value: '15', label: '15+ years' }
              ].map((exp) => (
                <button
                  key={exp.value}
                  onClick={() => handleFilterChange('experience', exp.value)}
                  className={`
                    p-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:shadow-sm
                    ${filters.experience === exp.value 
                      ? 'border-teal-500 bg-teal-50 text-teal-700' 
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-yellow-600" />
              <label className="text-sm font-semibold text-gray-800">Minimum Rating</label>
            </div>
            <div className="space-y-2">
              {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                <label key={rating} className={`
                  flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                  ${filters.rating === rating.toString() 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                `}>
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={filters.rating === rating.toString()}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{rating}+ & above</span>
                  {filters.rating === rating.toString() && (
                    <div className="ml-auto w-2 h-2 bg-yellow-500 rounded-full"></div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Applied Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-teal-800">
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
                </span>
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorFilters;