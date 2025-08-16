import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-green-400 mb-4">🌿 Amrutam</h3>
            <p className="text-gray-300 text-sm">
              Your trusted platform for authentic Ayurvedic consultations with certified doctors.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-green-400">Find Doctors</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400">Book Consultation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400">About Ayurveda</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400">Health Tips</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-green-400">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +91 1800-XXX-XXXX
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                support@amrutam.co.in
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Mumbai, India
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Amrutam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;