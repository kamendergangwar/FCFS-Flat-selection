import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const getEligibilityResult = ({ incomeRange, hasPuccaHouse }) => {
  if (!incomeRange || !hasPuccaHouse) {
    return null;
  }

  if (hasPuccaHouse === 'yes') {
    return {
      status: 'non-pmay-only',
      title: 'Eligible for Non-PMAY Booking',
      description: 'Applicants who already own a pucca house can continue with the non-PMAY booking option only.',
      options: ['non-pmay'],
      eligibilityCategory: 'Non-PMAY Only',
    };
  }

  if (incomeRange === 'above-50000') {
    return {
      status: 'non-pmay-only',
      title: 'Eligible for Non-PMAY Booking',
      description: 'Applicants with monthly income above Rs. 50,000 can continue with the non-PMAY booking option only.',
      options: ['non-pmay'],
      eligibilityCategory: 'Non-PMAY Only',
    };
  }

  return {
    status: 'both',
    title: 'Eligible for PMAY and Non-PMAY',
    description: 'You can choose either PMAY or Non-PMAY to continue.',
    options: ['pmay', 'non-pmay'],
    eligibilityCategory:
      incomeRange === 'below-25000'
        ? 'EWS/LIG - Eligible for PMAY and Non-PMAY'
        : 'MIG-I - Eligible for PMAY and Non-PMAY',
  };
};

const PMAY = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  
  const [formData, setFormData] = useState({
    incomeRange: applicationData.pmay?.incomeRange || '',
    hasPuccaHouse: applicationData.pmay?.hasPuccaHouse || '',
    selectedScheme: applicationData.pmay?.selectedScheme || '',
  });
  const [eligibility, setEligibility] = useState(() => {
    const existing = getEligibilityResult({
      incomeRange: applicationData.pmay?.incomeRange || '',
      hasPuccaHouse: applicationData.pmay?.hasPuccaHouse || '',
    });
    return existing;
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkEligibility = () => {
    setIsChecking(true);
    setTimeout(() => {
      const result = getEligibilityResult(formData);
      setEligibility(result);
      setFormData((prev) => ({
        ...prev,
        selectedScheme: result?.options.length === 1 ? result.options[0] : prev.selectedScheme,
      }));
      setIsChecking(false);
    }, 1500);
  };

  const handleSubmit = () => {
    if (!eligibility || !formData.selectedScheme) {
      return;
    }

    updateApplicationData({
      pmay: {
        ...formData,
        eligible: eligibility.status === 'both',
        eligibilityCategory: eligibility.eligibilityCategory,
        checkedAt: new Date().toISOString(),
      },
    });
    navigate('/application/4');
  };

  return (
    <ApplicationLayout
      stepNumber={3}
      title="PMAY Eligibility Check"
      onContinue={handleSubmit}
      continueDisabled={!eligibility || !formData.selectedScheme}
    >
      <div className="space-y-6">
        <div className="step-info-panel flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">PMAY Subsidy Scheme</p>
            <p className="text-sm text-blue-700">Answer the questions below to check whether you qualify for PMAY subsidy.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is your monthly household income?
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="incomeRange"
                value="below-25000"
                checked={formData.incomeRange === 'below-25000'}
                onChange={(e) => setFormData(prev => ({ ...prev, incomeRange: e.target.value, selectedScheme: '' }))}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-gray-700">Below Rs. 25,000</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="incomeRange"
                value="25000-50000"
                checked={formData.incomeRange === '25000-50000'}
                onChange={(e) => setFormData(prev => ({ ...prev, incomeRange: e.target.value, selectedScheme: '' }))}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-gray-700">Rs. 25,000 to Rs. 50,000</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="incomeRange"
                value="above-50000"
                checked={formData.incomeRange === 'above-50000'}
                onChange={(e) => setFormData(prev => ({ ...prev, incomeRange: e.target.value, selectedScheme: '' }))}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-gray-700">Above Rs. 50,000</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Do you already own a pucca house?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="hasPuccaHouse"
                value="yes"
                checked={formData.hasPuccaHouse === 'yes'}
                onChange={(e) => setFormData(prev => ({ ...prev, hasPuccaHouse: e.target.value, selectedScheme: '' }))}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="hasPuccaHouse"
                value="no"
                checked={formData.hasPuccaHouse === 'no'}
                onChange={(e) => setFormData(prev => ({ ...prev, hasPuccaHouse: e.target.value, selectedScheme: '' }))}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={checkEligibility}
          disabled={isChecking || !formData.incomeRange || !formData.hasPuccaHouse}
          className="step-primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChecking ? 'Checking Eligibility...' : 'Check Eligibility'}
        </button>

        {eligibility && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">{eligibility.title}</p>
              <p className="text-sm text-green-700">{eligibility.description}</p>
            </div>
          </div>
        )}

        {eligibility && !isChecking && (
          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-800">Select one option to continue</p>
                <p className="text-sm text-gray-600">Your next steps will follow the scheme you choose here.</p>
              </div>
            </div>
            <div className="space-y-3">
              {eligibility.options.includes('pmay') && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="selectedScheme"
                    value="pmay"
                    checked={formData.selectedScheme === 'pmay'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, selectedScheme: e.target.value }))}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-gray-700">Continue with PMAY</span>
                </label>
              )}
              {eligibility.options.includes('non-pmay') && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="selectedScheme"
                    value="non-pmay"
                    checked={formData.selectedScheme === 'non-pmay'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, selectedScheme: e.target.value }))}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-gray-700">Continue with Non-PMAY</span>
                </label>
              )}
            </div>
          </div>
        )}
      </div>
    </ApplicationLayout>
  );
};

export default PMAY;
