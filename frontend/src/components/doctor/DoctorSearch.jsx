// src/components/doctor/DoctorSearch.jsx
import React from 'react';
import { Search, X } from 'lucide-react';

const DoctorSearch = ({ value, onChange, placeholder }) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="doctor-search">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-search-btn"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;