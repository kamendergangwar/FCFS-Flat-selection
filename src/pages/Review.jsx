import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { CheckCircle, FileText, CreditCard, User, Briefcase, FolderOpen } from 'lucide-react';

const Review = () => {
  const navigate = useNavigate();
  const { applicationData } = useAuth();
  const profilePhoto = applicationData.documents?.photo?.previewUrl || null;

  const sections = [
    {
      title: 'KYC Details',
      icon: FileText,
      data: applicationData.kyc,
      fields: ['fullName', 'panNumber', 'aadhaarNumber', 'dateOfBirth'],
    },
    {
      title: 'Bank Details',
      icon: CreditCard,
      data: applicationData.bank,
      fields: ['bankName', 'branchName', 'accountNumber', 'accountHolderName'],
    },
    {
      title: 'PMAY Eligibility',
      icon: CheckCircle,
      data: applicationData.pmay,
      fields: ['incomeRange', 'hasPuccaHouse', 'selectedScheme', 'eligibilityCategory'],
    },
    {
      title: 'Personal Details',
      icon: User,
      data: applicationData.personal,
      fields: ['gender', 'maritalStatus', 'email', 'address', 'city', 'state', 'pincode'],
    },
    {
      title: 'Employment',
      icon: Briefcase,
      data: applicationData.employment,
      fields: ['employmentType', 'employerName', 'monthlyIncome'],
    },
    {
      title: 'Category',
      icon: CheckCircle,
      data: applicationData.category,
      fields: ['category'],
    },
    {
      title: 'Co-Applicant',
      icon: User,
      data: applicationData.coApplicant,
      fields: ['hasCoApplicant', 'name', 'relationship'],
    },
    {
      title: 'Documents',
      icon: FolderOpen,
      data: applicationData.documents,
      fields: ['uploadedAt'],
    },
  ];

  const handleSubmit = () => {
    navigate('/application/10');
  };

  return (
    <ApplicationLayout stepNumber={9} title="Review & Submit" onContinue={handleSubmit}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-amber-800 font-medium">Please review all details before submitting</p>
          <p className="text-sm text-amber-700">Once submitted, you cannot make changes. Contact support for corrections.</p>
        </div>

        <div className="space-y-4">
          {profilePhoto && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-gray-900">Applicant Photo</p>
              <img
                src={profilePhoto}
                alt="Applicant passport photograph"
                className="h-28 w-28 rounded-2xl object-cover border border-gray-200"
              />
            </div>
          )}
          {sections.map((section) => {
            const Icon = section.icon;
            const isComplete = section.data && Object.keys(section.data).length > 0;
            
            return (
              <div key={section.title} className="overflow-hidden rounded-2xl border border-gray-200">
                <div className={`flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between ${isComplete ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon className={`w-5 h-5 ${isComplete ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-medium text-gray-900">{section.title}</span>
                  </div>
                  {isComplete ? (
                    <span className="text-green-600 text-sm flex items-center gap-1 sm:self-auto">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">Pending</span>
                  )}
                </div>
                
                {isComplete && (
                  <div className="border-t p-4 bg-white">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {section.fields.map((field) => {
                        let value = section.data[field];
                        if (!value) return null;
                        if (field === 'uploadedAt') {
                          value = new Date(value).toLocaleDateString();
                        }
                        if (field === 'monthlyIncome') {
                          value = `₹${Number(value).toLocaleString()}`;
                        }
                        if (field === 'annualIncome') {
                          value = `₹${Number(value).toLocaleString()}`;
                        }
                        if (field === 'incomeRange') {
                          value = {
                            'below-25000': 'Below Rs. 25,000',
                            '25000-50000': 'Rs. 25,000 to Rs. 50,000',
                            'above-50000': 'Above Rs. 50,000',
                          }[value] || value;
                        }
                        if (field === 'hasPuccaHouse') {
                          value = value === 'yes' ? 'Yes' : 'No';
                        }
                        if (field === 'selectedScheme') {
                          value = value === 'pmay' ? 'PMAY' : 'Non-PMAY';
                        }
                        if (field === 'hasCoApplicant') {
                          value = value ? 'Yes' : 'No';
                        }
                        return (
                          <div key={field}>
                            <p className="text-xs text-gray-500 uppercase">{field.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-sm font-medium text-gray-900">{value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="step-note p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded mt-0.5" />
            <span className="text-sm text-gray-700">
              I declare that all the information provided by me is true and accurate. 
              I have read and understood the terms and conditions of the FCFS Flat Booking Scheme.
            </span>
          </label>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default Review;
