import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { Building, AlertCircle } from 'lucide-react';

const BankDetails = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    bankName: applicationData.bank?.bankName || '',
    accountNumber: applicationData.bank?.accountNumber || '',
    confirmAccountNumber: applicationData.bank?.confirmAccountNumber || '',
    ifscCode: applicationData.bank?.ifscCode || '',
    accountHolderName: applicationData.bank?.accountHolderName || '',
    branchName: applicationData.bank?.branchName || '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bankName) newErrors.bankName = t('Bank name is required');
    if (!formData.accountNumber || formData.accountNumber.length < 9) {
      newErrors.accountNumber = t('Enter a valid account number');
    }
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = t('Account numbers do not match');
    }
    if (!formData.ifscCode || formData.ifscCode.length !== 11) {
      newErrors.ifscCode = t('Enter a valid 11-character IFSC code');
    }
    if (!formData.accountHolderName) newErrors.accountHolderName = t('Account holder name is required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'accountNumber' || name === 'confirmAccountNumber') {
      processedValue = value.replace(/\D/g, '').slice(0, 18);
    } else if (name === 'ifscCode') {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      updateApplicationData({
        bank: {
          ...formData,
          verified: true,
          verifiedAt: new Date().toISOString(),
        },
      });
      navigate('/application/3');
    }
  };

  return (
    <ApplicationLayout stepNumber={2} title={t('Bank Details')} onContinue={handleSubmit}>
      <div className="space-y-6">
        <div className="step-info-panel flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">{t('Bank Account for Refund')}</p>
            <p className="text-sm text-blue-700">{t('This account will be used for refund of EMD if applicable.')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Bank Name')}
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder={t('Enter bank name')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.bankName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Branch Name')}
            </label>
            <input
              type="text"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              placeholder={t('Enter branch name')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Account Number')}
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder={t('Enter account number')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.accountNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Confirm Account Number')}
            </label>
            <input
              type="text"
              name="confirmAccountNumber"
              value={formData.confirmAccountNumber}
              onChange={handleChange}
              placeholder={t('Confirm account number')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.confirmAccountNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.confirmAccountNumber && <p className="text-red-500 text-sm mt-1">{errors.confirmAccountNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('IFSC Code')}
            </label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              placeholder="SBIN0001234"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase ${
                errors.ifscCode ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Account Holder Name')}
            </label>
            <input
              type="text"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              placeholder={t('Enter account holder name')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
          </div>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default BankDetails;
