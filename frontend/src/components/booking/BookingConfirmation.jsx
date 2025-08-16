// Booking Confirmation Component
const BookingConfirmation = ({ bookingDetails, onViewAppointments, onBookAnother }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      <div className="mb-6">
        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Appointment Confirmed!
        </h2>
        <p className="text-gray-600">
          Your consultation has been successfully booked.
        </p>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Booking ID</p>
            <p className="text-lg font-semibold text-gray-900">{bookingDetails.bookingId}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Doctor</p>
            <p className="text-lg font-semibold text-gray-900">{bookingDetails.doctorName}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Date & Time</p>
            <p className="text-lg font-semibold text-gray-900">{bookingDetails.dateTime}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Mode</p>
            <p className="text-lg font-semibold text-gray-900">{bookingDetails.mode}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Consultation Fee</p>
            <p className="text-lg font-semibold text-green-600">₹{bookingDetails.fee}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Confirmed
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
          <div className="text-left">
            <h4 className="font-medium text-blue-900 mb-1">Important Notes:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You'll receive a confirmation email and SMS shortly</li>
              <li>• Join the consultation 5 minutes before the scheduled time</li>
              <li>• Keep your medical history ready for better consultation</li>
              <li>• Cancellation is allowed up to 24 hours before appointment</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onViewAppointments}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium"
        >
          View My Appointments
        </button>
        <button
          onClick={onBookAnother}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 font-medium"
        >
          Book Another Appointment
        </button>
      </div>
    </div>
  );
};
export default BookingConfirmation;