// Appointment Details Component
const AppointmentDetails = ({ appointmentId }) => {
  const [appointment] = useState({
    id: 'APT001',
    bookingId: 'BK20250815001',
    doctorName: 'Dr. Rajesh Sharma',
    doctorImage: '👨‍⚕️',
    specialization: 'Panchakarma Specialist',
    experience: '15 years',
    rating: 4.8,
    dateTime: '2025-08-15 10:00 AM',
    duration: '30 minutes',
    mode: 'Online',
    status: 'Upcoming',
    fee: 500,
    consultationNotes: 'General health checkup and lifestyle consultation',
    symptoms: ['Stress', 'Digestion issues', 'Sleep problems'],
    prescriptions: [
      {
        medicine: 'Ashwagandha Churna',
        dosage: '1 tsp twice daily',
        duration: '15 days'
      },
      {
        medicine: 'Triphala Tablet',
        dosage: '2 tablets before bed',
        duration: '30 days'
      }
    ]
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-green-50 border-b border-green-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">{appointment.doctorImage}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {appointment.doctorName}
                </h1>
                <p className="text-green-600 font-medium">{appointment.specialization}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    {appointment.rating} • {appointment.experience} experience
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                appointment.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                appointment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {appointment.status}
              </span>
            </div>
          </div>
        </div>
        
        {/* Appointment Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Appointment Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{appointment.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-medium">{appointment.dateTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{appointment.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode:</span>
                    <span className="font-medium">{appointment.mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="font-medium text-green-600">₹{appointment.fee}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Consultation Notes</h3>
                <p className="text-gray-600">{appointment.consultationNotes}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Reported Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {appointment.symptoms.map((symptom, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Prescriptions */}
          {appointment.prescriptions.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Prescriptions</h3>
              <div className="space-y-3">
                {appointment.prescriptions.map((prescription, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{prescription.medicine}</h4>
                        <p className="text-sm text-gray-600">{prescription.dosage}</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="text-sm font-medium text-blue-600">
                          Duration: {prescription.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="border-t pt-6 mt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {appointment.status === 'Upcoming' && (
                <>
                  <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium">
                    Join Consultation
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium">
                    Reschedule
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 font-medium">
                    Cancel
                  </button>
                </>
              )}
              
              {appointment.status === 'Completed' && (
                <>
                  <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium">
                    Download Report
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium">
                    Book Follow-up
                  </button>
                </>
              )}
              
              <button className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 font-medium">
                Share Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AppointmentDetails;