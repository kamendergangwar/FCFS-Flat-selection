import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { FileText, CreditCard, AlertCircle } from 'lucide-react';

const KYC = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    panNumber: applicationData.kyc?.panNumber || '',
    aadhaarNumber: applicationData.kyc?.aadhaarNumber || '',
    fullName: applicationData.kyc?.fullName || '',
    dateOfBirth: applicationData.kyc?.dateOfBirth || '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('Full name is required');
    }
    
    if (!formData.panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      newErrors.panNumber = t('Enter a valid PAN number (e.g., ABCDE1234F)');
    }
    
    if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
      newErrors.aadhaarNumber = t('Enter a valid 12-digit Aadhaar number');
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t('Date of birth is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'panNumber') {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    } else if (name === 'aadhaarNumber') {
      processedValue = value.replace(/\D/g, '').slice(0, 12);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      updateApplicationData({
        kyc: {
          ...formData,
          verified: true,
          verifiedAt: new Date().toISOString(),
        },
      });
      navigate('/application/2');
    }
  };

  return (
    <ApplicationLayout stepNumber={1} title={t('KYC Verification')} onContinue={handleSubmit}>
      <div className="space-y-6">
        <div className="step-info-panel flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">{t('Important')}</p>
            <p className="text-sm text-blue-700">{t('Please enter your PAN and Aadhaar details as per official documents.')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Full Name as per PAN')}
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={t('Enter your full name')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Date of Birth')}
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('PAN Number')}
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase ${
                  errors.panNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Aadhaar Number')}
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                placeholder="123456789012"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                  errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.aadhaarNumber && <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>}
          </div>
        </div>

        <div className="step-note mt-6 p-4">
          <p className="text-sm text-gray-600">
            <strong>{t('Note:')}</strong> {t('Your KYC details will be verified with the respective government databases. Please ensure all information is accurate to avoid rejection.')}
          </p>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default KYC;
