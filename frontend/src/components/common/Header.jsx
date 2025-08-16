import React, { useContext, useState } from 'react';
import { User, UserCheck, CalendarIcon, Settings, LogOut, Menu } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';

// Header Component
const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-green-600">
              🌿 Amrutam
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-green-600">Find Doctors</a>
            <a href="#" className="text-gray-700 hover:text-green-600">Consultations</a>
            <a href="#" className="text-gray-700 hover:text-green-600">About</a>
            {isAuthenticated && (
              <a href="#" className="text-gray-700 hover:text-green-600">My Appointments</a>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 bg-green-50 rounded-lg px-3 py-2"
                >
                  <User className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                    <div className="py-1">
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Profile
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Appointments
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </a>
                      <button 
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-2">
                <button className="text-green-600 hover:text-green-700 font-medium">
                  Login
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Sign Up
                </button>
              </div>
            )}
            
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;