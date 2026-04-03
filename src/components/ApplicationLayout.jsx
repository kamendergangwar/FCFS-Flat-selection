import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
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
  'Booking Confirmed',
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
  const { t } = useLanguage();
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
    <div className="page-enter min-h-[calc(100vh-7rem)] w-full px-1 pb-8 sm:px-4 sm:pb-10">
      <header className={`step-shell step-page-header mx-auto w-full rounded-[1.5rem] px-4 py-4 sm:rounded-[2rem] sm:px-5 sm:py-5 md:px-7 ${fullWidth ? '' : 'max-w-[1480px]'}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <button
              onClick={handleBack}
              className="step-icon-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="step-eyebrow">{t('Application Flow')}</p>
              <h1 className="text-xl font-black tracking-tight step-heading sm:text-2xl">{title}</h1>
              <p className="step-subtle text-sm">{t('Step {current} of {total}', { current: currentStep, total: totalSteps })}</p>
            </div>
          </div>
          <div className="hidden rounded-full step-chip px-4 py-2 text-sm font-semibold lg:block">
            {t('FCFS Flat Booking')}
          </div>
        </div>
      </header>

      <div className={`step-progress-shell step-page-progress mx-auto mt-4 w-full rounded-[1.35rem] px-3 py-3 sm:rounded-[1.75rem] sm:px-4 sm:py-4 md:px-6 ${fullWidth ? '' : 'max-w-[1480px]'}`}>
        <div className="step-progress-track">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {stepNames.slice(1).map((name, index) => (
              <div key={index} className="flex shrink-0 items-center">
                <div
                  className={`step-progress-dot flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold sm:h-9 sm:w-9 sm:text-xs ${
                    index + 1 < currentStep
                      ? 'step-progress-complete'
                      : index + 1 === currentStep
                      ? 'step-progress-current'
                      : 'step-progress-idle'
                  }`}
                  title={t(name)}
                >
                  {index + 1 < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < stepNames.length - 2 && (
                  <div
                    className={`step-progress-connector h-0.5 w-6 shrink-0 sm:w-8 ${
                      index + 1 < currentStep ? 'step-progress-line-complete' : 'step-progress-line-idle'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className={`content-frame step-page-main mx-auto w-full py-5 sm:py-8 ${fullWidth ? '' : 'max-w-[1480px]'}`}>
        <div className="step-shell step-page-body rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6 md:p-8 lg:p-10">
          {!hideSectionHeader && (
            <div className="mb-6 flex flex-col gap-2 border-b pb-5 step-divider sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="step-eyebrow">{t('Section Details')}</p>
                <h2 className="text-xl font-black tracking-tight step-heading sm:text-2xl">{title}</h2>
              </div>
              <p className="text-sm step-subtle sm:text-right">{t('All changes are kept in your session as you continue.')}</p>
            </div>
          )}
          {children}
        </div>

        {!hideDefaultActions && (
          <div className="step-actions-bar mx-auto mt-6 flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={handleBack}
              className="step-secondary-button w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('Back')}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="step-secondary-button w-full sm:w-auto"
            >
              <Save className="w-5 h-5" />
              {t('Save Draft')}
            </button>
            <button
              onClick={handleSaveAndContinue}
              disabled={isSaving || continueDisabled}
              className="step-primary-button w-full disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto"
            >
              {isSaving ? t('Saving...') : t('Save & Continue')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ApplicationLayout;
