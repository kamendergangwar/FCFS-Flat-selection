import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { User, MapPin, Phone, Mail } from 'lucide-react';

const PersonalDetails = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    gender: applicationData.personal?.gender || '',
    maritalStatus: applicationData.personal?.maritalStatus || '',
    email: applicationData.personal?.email || '',
    address: applicationData.personal?.address || '',
    city: applicationData.personal?.city || '',
    state: applicationData.personal?.state || '',
    pincode: applicationData.personal?.pincode || '',
    nationality: applicationData.personal?.nationality || 'Indian',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.gender) newErrors.gender = t('Gender is required');
    if (!formData.maritalStatus) newErrors.maritalStatus = t('Marital status is required');
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('Valid email is required');
    }
    if (!formData.address) newErrors.address = t('Address is required');
    if (!formData.city) newErrors.city = t('City is required');
    if (!formData.state) newErrors.state = t('State is required');
    if (!formData.pincode || formData.pincode.length !== 6) {
      newErrors.pincode = t('Valid 6-digit pincode is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'pincode') {
      processedValue = value.replace(/\D/g, '').slice(0, 6);
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      updateApplicationData({ personal: formData });
      navigate('/application/5');
    }
  };

  return (
    <ApplicationLayout stepNumber={4} title={t('Personal Details')} onContinue={handleSubmit}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Gender')}</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">{t('Select Gender')}</option>
              <option value="male">{t('Male')}</option>
              <option value="female">{t('Female')}</option>
              <option value="other">{t('Other')}</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Marital Status')}</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.maritalStatus ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">{t('Select Marital Status')}</option>
              <option value="single">{t('Single')}</option>
              <option value="married">{t('Married')}</option>
              <option value="divorced">{t('Divorced')}</option>
              <option value="widowed">{t('Widowed')}</option>
            </select>
            {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Email Address')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('your@email.com')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Nationality')}</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Address')}</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={t('Enter your full address')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('City')}</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder={t('Enter city')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('State')}</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder={t('Enter state')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Pincode')}</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="123456"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.pincode ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
          </div>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default PersonalDetails;
