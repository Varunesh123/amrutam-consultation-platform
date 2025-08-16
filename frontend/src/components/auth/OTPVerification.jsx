// OTP Verification Component
const OTPVerification = ({ email, onSuccess, onResend }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      addNotification({
        type: 'error',
        message: 'Please enter complete OTP'
      });
      return;
    }
    
    setLoading(true);
    try {
      // Mock verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      addNotification({
        type: 'success',
        message: 'OTP verified successfully!'
      });
      onSuccess?.();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Invalid OTP. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTimeLeft(60);
      addNotification({
        type: 'success',
        message: 'OTP sent successfully!'
      });
      onResend?.();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to resend OTP'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      <div className="mb-6">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-gray-600">
          We've sent a 6-digit code to{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>
      
      <div className="flex justify-center space-x-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        ))}
      </div>
      
      <button
        onClick={handleVerify}
        disabled={loading || otp.join('').length < 6}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 mb-4"
      >
        {loading ? <Loading size="small" text="" /> : 'Verify OTP'}
      </button>
      
      <div className="text-sm text-gray-600">
        {timeLeft > 0 ? (
          <p>Resend code in {timeLeft}s</p>
        ) : (
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};