import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { CreditCard, CheckCircle, Lock, AlertCircle } from 'lucide-react';

const EMDPayment = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const emdAmount = 5000; // ₹5,000 EMD

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentSuccess(true);
    
    updateApplicationData({
      emdPaid: true,
      emdPaidAt: new Date().toISOString(),
      emdAmount: emdAmount,
    });

    setTimeout(() => {
      navigate('/application/11');
    }, 2000);
  };

  const paymentMethods = [
    { id: 'netbanking', name: 'Net Banking', icon: CreditCard },
    { id: 'debitcard', name: 'Debit Card', icon: CreditCard },
    { id: 'creditcard', name: 'Credit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: CreditCard },
  ];

  return (
    <ApplicationLayout stepNumber={10} title="EMD Payment">
      <div className="space-y-6">
        <div className="step-info-panel flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Earnest Money Deposit (EMD)</p>
            <p className="text-sm text-blue-700">Pay ₹{emdAmount.toLocaleString()} to proceed with flat selection. This amount will be adjusted in the final payment.</p>
          </div>
        </div>

        {!paymentSuccess ? (
          <>
            <div className="step-note rounded-2xl p-6 text-center">
              <p className="text-gray-500 mb-2">EMD Amount</p>
              <p className="text-4xl font-bold text-gray-900">₹{emdAmount.toLocaleString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`cursor-pointer rounded-2xl border-2 p-4 text-center transition-all ${
                        paymentMethod === method.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 bg-white/5 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <Icon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{method.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing || !paymentMethod}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay ₹{emdAmount.toLocaleString()}
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Secure payment powered by Razorpay
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Your EMD of ₹{emdAmount.toLocaleString()} has been received.</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to flat selection...</p>
          </div>
        )}
      </div>
    </ApplicationLayout>
  );
};

export default EMDPayment;
