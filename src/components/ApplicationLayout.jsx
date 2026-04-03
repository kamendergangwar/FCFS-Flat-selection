import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Check
} from 'lucide-react';

const stepNames = [
  'Login',
  'KYC',
  'Bank Details',
  'PMAY Eligibility',
  'Personal Details',
  'Employment',
  'Category',
  'Co-Applicant',
  'Documents',
  'Review & Submit',
  'EMD Payment',
  'Flat Selection',
  'Flat Lock',
  'Confirmation Payment',
  'Booking Confirmed'
];

const ApplicationLayout = ({
  children,
  stepNumber,
  title,
  onContinue,
  onSave,
  continueDisabled = false,
  hideDefaultActions = false,
  hideSectionHeader = false,
  fullWidth = false,
}) => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const currentStep = parseInt(stepNumber);
  const totalSteps = 14;

  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    if (onContinue) {
      await onContinue();
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (currentStep < totalSteps) {
        updateApplicationData({ currentStep: currentStep + 1 });
        navigate(`/application/${currentStep + 1}`);
      } else {
        navigate('/dashboard');
      }
    }
    setIsSaving(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (onSave) {
      await onSave();
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsSaving(false);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/application/${currentStep - 1}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="page-enter min-h-[calc(100vh-7rem)] w-full px-2 pb-10 sm:px-4">
      <header className={`step-shell step-page-header mx-auto w-full rounded-[2rem] px-5 py-5 md:px-7 ${fullWidth ? '' : 'max-w-[1480px]'}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="step-icon-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="step-eyebrow">Application Flow</p>
              <h1 className="text-2xl font-black tracking-tight step-heading">{title}</h1>
              <p className="step-subtle">Step {currentStep} of {totalSteps}</p>
            </div>
          </div>
          <div className="hidden rounded-full step-chip px-4 py-2 text-sm font-semibold lg:block">
            FCFS Flat Booking
          </div>
        </div>
      </header>

      <div className={`step-progress-shell step-page-progress mx-auto mt-4 w-full rounded-[1.75rem] px-4 py-4 md:px-6 ${fullWidth ? '' : 'max-w-[1480px]'}`}>
        <div className="step-progress-track">
          <div className="flex items-center gap-2 overflow-x-auto">
            {stepNames.slice(1).map((name, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`step-progress-dot flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    index + 1 < currentStep
                      ? 'step-progress-complete'
                      : index + 1 === currentStep
                      ? 'step-progress-current'
                      : 'step-progress-idle'
                  }`}
                  title={name}
                >
                  {index + 1 < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < stepNames.length - 2 && (
                  <div
                    className={`step-progress-connector h-0.5 w-8 ${
                      index + 1 < currentStep ? 'step-progress-line-complete' : 'step-progress-line-idle'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className={`content-frame step-page-main mx-auto w-full py-8 ${fullWidth ? '' : 'max-w-[1480px]'}`}>
        <div className="step-shell step-page-body rounded-[2rem] p-6 md:p-8 lg:p-10">
          {!hideSectionHeader && (
            <div className="mb-6 flex flex-col gap-2 border-b pb-5 step-divider sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="step-eyebrow">Section Details</p>
                <h2 className="text-2xl font-black tracking-tight step-heading">{title}</h2>
              </div>
              <p className="text-sm step-subtle">All changes are kept in your session as you continue.</p>
            </div>
          )}
          {children}
        </div>

        {!hideDefaultActions && (
          <div className="step-actions-bar mx-auto mt-6 flex w-full flex-col gap-4 sm:flex-row">
            <button
              onClick={handleBack}
              className="step-secondary-button"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="step-secondary-button"
            >
              <Save className="w-5 h-5" />
              Save Draft
            </button>
            <button
              onClick={handleSaveAndContinue}
              disabled={isSaving || continueDisabled}
              className="step-primary-button disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save & Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ApplicationLayout;
