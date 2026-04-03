import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { CreditCard, CheckCircle, Lock, AlertCircle, Building } from 'lucide-react';

const ConfirmationPayment = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  const { t, formatNumber } = useLanguage();
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const flatLocked = applicationData.flatLocked;
  const emdPaid = applicationData.emdPaid || 0;
  const totalPrice = flatLocked?.price || 0;
  const balanceDue = totalPrice - emdPaid;

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert(t('Please select a payment method'));
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentSuccess(true);
    
    updateApplicationData({
      bookingConfirmed: true,
      bookingConfirmedAt: new Date().toISOString(),
      finalPayment: balanceDue,
    });

    setTimeout(() => {
      navigate('/application/14');
    }, 2000);
  };

  const paymentMethods = [
    { id: 'netbanking', name: t('Net Banking'), icon: CreditCard },
    { id: 'debitcard', name: t('Debit Card'), icon: CreditCard },
    { id: 'creditcard', name: t('Credit Card'), icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: CreditCard },
  ];

  if (!flatLocked) {
    return (
      <ApplicationLayout stepNumber={13} title={t('Confirmation Payment')}>
        <div className="text-center py-8">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('No Flat Selected')}</h3>
          <p className="text-gray-600 mb-4">{t('Please select a flat first.')}</p>
          <button
            onClick={() => navigate('/application/11')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            {t('Go to Flat Selection')}
          </button>
        </div>
      </ApplicationLayout>
    );
  }

  return (
    <ApplicationLayout stepNumber={13} title={t('Confirmation Payment')}>
      <div className="space-y-6">
        <div className="step-info-panel flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">{t('Final Payment')}</p>
            <p className="text-sm text-blue-700">{t('Pay the remaining amount to confirm your booking.')}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="step-note rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5" />
            {t('Payment Summary')}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('Flat Price ({id})', { id: flatLocked.id })}</span>
              <span className="font-medium text-gray-900">₹{formatNumber(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('EMD Paid')}</span>
              <span className="font-medium text-green-600">-₹{formatNumber(emdPaid)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold text-gray-900">{t('Balance Due')}</span>
              <span className="font-bold text-xl text-indigo-600">₹{formatNumber(balanceDue)}</span>
            </div>
          </div>
        </div>

        {!paymentSuccess ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t('Select Payment Method')}</label>
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
                  {t('Processing Payment...')}
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  {t('Pay ₹{amount}', { amount: formatNumber(balanceDue) })}
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              {t('Secure payment powered by Razorpay')}
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('Payment Successful!')}</h3>
            <p className="text-gray-600">{t('Your booking has been confirmed!')}</p>
            <p className="text-sm text-gray-500 mt-2">{t('Redirecting...')}</p>
          </div>
        )}
      </div>
    </ApplicationLayout>
  );
};

export default ConfirmationPayment;
