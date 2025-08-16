import { useState } from "react";
import { Calendar, MapPin, Star } from "lucide-react";

// Appointment List Component
const AppointmentList = () => {
  const [appointments] = useState([
    {
      id: 'APT001',
      doctorName: 'Dr. Rajesh Sharma',
      specialization: 'Panchakarma Specialist',
      dateTime: '2025-08-15 10:00 AM',
      mode: 'Online',
      status: 'Upcoming',
      fee: 500,
      rating: 4.8
    },
    {
      id: 'APT002',
      doctorName: 'Dr. Priya Nair',
      specialization: 'Skin & Hair Specialist',
      dateTime: '2025-08-10 2:30 PM',
      mode: 'In-person',
      status: 'Completed',
      fee: 750,
      rating: 4.9
    },
    {
      id: 'APT003',
      doctorName: 'Dr. Amit Patel',
      specialization: 'General Consultation',
      dateTime: '2025-08-08 11:15 AM',
      mode: 'Online',
      status: 'Cancelled',
      fee: 400,
      rating: null
    }
  ]);
  
  const [filter, setFilter] = useState('All');
  
  const filteredAppointments = appointments.filter(apt => 
    filter === 'All' || apt.status === filter
  );
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          My Appointments
        </h2>
        
        <div className="flex space-x-2">
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredAppointments.map(appointment => (
          <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {appointment.doctorName}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{appointment.specialization}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {appointment.dateTime}
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {appointment.mode}
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-green-600 font-medium">₹{appointment.fee}</span>
                  </div>
                  
                  {appointment.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {appointment.rating}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-0">
                {appointment.status === 'Upcoming' && (
                  <>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Join Call
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                      Reschedule
                    </button>
                  </>
                )}
                
                {appointment.status === 'Completed' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    View Report
                  </button>
                )}
                
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No appointments found
          </h3>
          <p className="text-gray-600 mb-4">
            You don't have any {filter === 'All' ? '' : filter.toLowerCase()} appointments yet.
          </p>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Book New Appointment
          </button>
        </div>
      )}
    </div>
  );
};
export default AppointmentList;