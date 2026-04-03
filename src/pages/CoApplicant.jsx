import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { Users, Plus, Trash2 } from 'lucide-react';

const CoApplicant = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  const { t } = useLanguage();
  
  const [hasCoApplicant, setHasCoApplicant] = useState(!!applicationData.coApplicant?.hasCoApplicant);
  const [coApplicant, setCoApplicant] = useState(applicationData.coApplicant?.details || {
    name: '',
    relationship: '',
    aadhaarNumber: '',
    mobile: '',
    income: '',
  });

  const handleSubmit = () => {
    updateApplicationData({
      coApplicant: {
        hasCoApplicant,
        details: hasCoApplicant ? coApplicant : null,
      },
    });
    navigate('/application/8');
  };

  return (
    <ApplicationLayout stepNumber={7} title={t('Co-Applicant Details')} onContinue={handleSubmit}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">{t('Do you want to add a co-applicant?')}</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setHasCoApplicant(true)}
              className={`flex-1 rounded-2xl border-2 px-6 py-4 transition-all ${
                hasCoApplicant
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 bg-white/5 hover:border-gray-300'
              }`}
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-medium text-gray-900">{t('Yes, Add Co-Applicant')}</p>
              <p className="text-sm text-gray-500">{t('Joint ownership')}</p>
            </button>
            <button
              type="button"
              onClick={() => setHasCoApplicant(false)}
              className={`flex-1 rounded-2xl border-2 px-6 py-4 transition-all ${
                !hasCoApplicant
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 bg-white/5 hover:border-gray-300'
              }`}
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-medium text-gray-900">{t('No, Single Applicant')}</p>
              <p className="text-sm text-gray-500">{t('Individual ownership')}</p>
            </button>
          </div>
        </div>

        {hasCoApplicant && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Co-Applicant Name')}</label>
              <input
                type="text"
                value={coApplicant.name}
                onChange={(e) => setCoApplicant(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('Enter co-applicant name')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Relationship')}</label>
              <select
                value={coApplicant.relationship}
                onChange={(e) => setCoApplicant(prev => ({ ...prev, relationship: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="">{t('Select Relationship')}</option>
                <option value="spouse">{t('Spouse')}</option>
                <option value="parent">{t('Parent')}</option>
                <option value="sibling">{t('Sibling')}</option>
                <option value="child">{t('Child')}</option>
                <option value="other">{t('Other')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Aadhaar Number')}</label>
              <input
                type="text"
                value={coApplicant.aadhaarNumber}
                onChange={(e) => setCoApplicant(prev => ({ ...prev, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                placeholder="123456789012"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Mobile Number')}</label>
              <input
                type="text"
                value={coApplicant.mobile}
                onChange={(e) => setCoApplicant(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                placeholder="9876543210"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Monthly Income (₹)')}</label>
              <input
                type="text"
                value={coApplicant.income}
                onChange={(e) => setCoApplicant(prev => ({ ...prev, income: e.target.value.replace(/[^\d]/g, '') }))}
                placeholder={t('Enter monthly income')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </ApplicationLayout>
  );
};

export default CoApplicant;
