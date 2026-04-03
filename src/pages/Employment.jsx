import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { Briefcase, DollarSign } from 'lucide-react';

const Employment = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  
  const [formData, setFormData] = useState({
    employmentType: applicationData.employment?.employmentType || '',
    occupation: applicationData.employment?.occupation || '',
    employerName: applicationData.employment?.employerName || '',
    monthlyIncome: applicationData.employment?.monthlyIncome || '',
    workExperience: applicationData.employment?.workExperience || '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
    if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Monthly income is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'monthlyIncome') {
      processedValue = value.replace(/[^\d]/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      updateApplicationData({ employment: formData });
      navigate('/application/6');
    }
  };

  return (
    <ApplicationLayout stepNumber={5} title="Employment Details" onContinue={handleSubmit}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Salaried', 'Self Employed', 'Business', 'Retired'].map((type) => (
              <label
                key={type}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all text-center ${
                  formData.employmentType === type
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="employmentType"
                  value={type}
                  checked={formData.employmentType === type}
                  onChange={handleChange}
                  className="sr-only"
                />
                <Briefcase className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{type}</span>
              </label>
            ))}
          </div>
          {errors.employmentType && <p className="text-red-500 text-sm mt-2">{errors.employmentType}</p>}
        </div>

        {formData.employmentType === 'Salaried' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employer Name</label>
              <input
                type="text"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                placeholder="Company name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Your designation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {formData.employmentType === 'Self Employed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                placeholder="Business name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nature of Business</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Business type"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income (₹)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              placeholder="Enter monthly income"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.monthlyIncome && <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience (Years)</label>
          <select
            name="workExperience"
            value={formData.workExperience}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          >
            <option value="">Select Experience</option>
            <option value="0-1">0-1 Years</option>
            <option value="1-3">1-3 Years</option>
            <option value="3-5">3-5 Years</option>
            <option value="5-10">5-10 Years</option>
            <option value="10+">10+ Years</option>
          </select>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default Employment;
