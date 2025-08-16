import React from 'react';
import { Filter, Calendar, Clock, CheckCircle } from 'lucide-react';

const AppointmentFilters = ({ filters, onFilterChange, activeTab }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status', icon: Filter },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { value: 'completed', label: 'Completed', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', icon: CheckCircle },
    { value: 'rescheduled', label: 'Rescheduled', icon: Calendar }
  ];

  const timeRangeOptions = [
    { value: 'all', label: 'All Time', icon: Calendar },
    { value: 'today', label: 'Today', icon: Calendar },
    { value: 'this_week', label: 'This Week', icon: Calendar },
    { value: 'this_month', label: 'This Month', icon: Calendar },
    { value: 'last_month', label: 'Last Month', icon: Calendar },
    { value: 'last_3_months', label: 'Last 3 Months', icon: Calendar }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100';
      case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100';
      case 'rescheduled': return 'text-purple-600 bg-purple-50 border-purple-100 hover:bg-purple-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100 hover:bg-gray-100';
    }
  };

  if (activeTab !== 'all') {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white rounded-xl p-4 shadow-sm border border-teal-100">
      {/* Status Filter */}
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
          <Filter size={14} className="text-teal-500" />
          Status
        </label>
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className={`w-full sm:w-48 appearance-none px-3 py-2 pr-8 border rounded-md text-sm font-medium transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${getStatusColor(filters.status)}`}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
          <Calendar size={14} className="text-teal-500" />
          Time Range
        </label>
        <div className="relative">
          <select
            value={filters.timeRange}
            onChange={(e) => onFilterChange({ timeRange: e.target.value })}
            className="w-full sm:w-48 appearance-none px-3 py-2 pr-8 border border-gray-100 rounded-md text-sm font-medium text-gray-600 bg-gray-50 transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:bg-white hover:border-gray-200"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {(filters.status !== 'all' || filters.timeRange !== 'all') && (
        <div className="flex flex-col gap-1">
          <div className="h-5"></div> {/* Spacer */}
          <button
            onClick={() => onFilterChange({ status: 'all', timeRange: 'all' })}
            className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-100 rounded-md hover:bg-gray-50 hover:text-gray-800 transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentFilters;