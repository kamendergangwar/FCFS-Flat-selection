import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Category = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  
  const [formData, setFormData] = useState({
    category: applicationData.category?.category || '',
    casteCertificate: applicationData.category?.casteCertificate || false,
    incomeCertificate: applicationData.category?.incomeCertificate || false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Please select a category';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      updateApplicationData({ category: formData });
      navigate('/application/7');
    }
  };

  const categories = [
    { id: 'general', name: 'General', description: 'Open category' },
    { id: 'obc', name: 'OBC', description: 'Other Backward Classes' },
    { id: 'sc', name: 'SC', description: 'Scheduled Caste' },
    { id: 'st', name: 'ST', description: 'Scheduled Tribe' },
    { id: 'ews', name: 'EWS', description: 'Economically Weaker Section' },
  ];

  return (
    <ApplicationLayout stepNumber={6} title="Category Selection" onContinue={handleSubmit}>
      <div className="space-y-6">
        <div className="step-info-panel flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Category Reservation</p>
            <p className="text-sm text-blue-700">Select your category as per your caste certificate. This will determine your quota.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Category</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                  formData.category === cat.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white/5 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={formData.category === cat.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.category === cat.id ? 'border-indigo-600' : 'border-gray-300'
                  }`}>
                    {formData.category === cat.id && (
                      <div className="w-3 h-3 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{cat.name}</p>
                    <p className="text-sm text-gray-500">{cat.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
        </div>

        {['sc', 'st', 'obc'].includes(formData.category) && (
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.casteCertificate}
                onChange={(e) => setFormData(prev => ({ ...prev, casteCertificate: e.target.checked }))}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <span className="text-gray-700">I have a valid caste certificate</span>
            </label>
          </div>
        )}

        {formData.category === 'ews' && (
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.incomeCertificate}
                onChange={(e) => setFormData(prev => ({ ...prev, incomeCertificate: e.target.checked }))}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <span className="text-gray-700">I have a valid income certificate (income below ₹8 Lakhs)</span>
            </label>
          </div>
        )}
      </div>
    </ApplicationLayout>
  );
};

export default Category;
