import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

const FlatLock = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  
  const [timeLeft, setTimeLeft] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const flatLocked = applicationData.flatLocked;

  useEffect(() => {
    if (flatLocked?.expiresAt) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expires = new Date(flatLocked.expiresAt).getTime();
        const diff = expires - now;

        if (diff <= 0) {
          setTimeLeft('Expired');
          clearInterval(interval);
        } else {
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [flatLocked]);

  const handleProceedToPayment = () => {
    navigate('/application/13');
  };

  const handleCancelBooking = () => {
    if (confirm('Are you sure you want to cancel? Your EMD will be forfeited.')) {
      updateApplicationData({
        flatSelected: null,
        flatLocked: null,
        emdPaid: false,
      });
      navigate('/dashboard');
    }
  };

  if (!flatLocked) {
    return (
      <ApplicationLayout stepNumber={12} title="Flat Lock">
        <div className="text-center py-8">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Flat Selected</h3>
          <p className="text-gray-600 mb-4">Please select a flat to proceed.</p>
          <button
            onClick={() => navigate('/application/11')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Go to Flat Selection
          </button>
        </div>
      </ApplicationLayout>
    );
  }

  return (
    <ApplicationLayout stepNumber={12} title="Flat Lock Status">
      <div className="space-y-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Flat Locked for 24 Hours</p>
            <p className="text-sm text-amber-700">Complete your confirmation payment before the timer expires.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-900 p-8 text-center">
          <p className="text-gray-400 text-sm mb-2">Time Remaining</p>
          <p className="text-4xl font-bold text-white font-mono">{timeLeft}</p>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Locked Flat Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Flat Number</p>
              <p className="font-semibold text-gray-900">{flatLocked.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-semibold text-gray-900">{flatLocked.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Area</p>
              <p className="font-semibold text-gray-900">{flatLocked.area}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-semibold text-gray-900">₹{flatLocked.price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCancelBooking}
            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Cancel Booking
          </button>
          <button
            onClick={handleProceedToPayment}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default FlatLock;
