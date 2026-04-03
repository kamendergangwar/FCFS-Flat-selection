import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Home,
  User,
  Users,
  Briefcase,
  FolderOpen,
  Clock3,
  Building,
  ArrowRight,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, applicationData } = useAuth();
  const { t, formatDate } = useLanguage();

  const applicantName = applicationData.kyc?.fullName || user?.name || t('New User');
  const profilePhoto = applicationData.documents?.photo?.previewUrl || null;
  const mobile = user?.mobile || '7017425639';
  const applicationId = mobile.slice(-5) || '26539';
  const barcode = `2602${mobile}`;
  const lastUpdated = formatDate(new Date(), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const documents = [
    ['Passport Photo', !!applicationData.documents?.photo],
    ['Signature', !!applicationData.documents?.signature],
    ['PAN Card', !!applicationData.documents?.panCard],
    ['Aadhaar Front', !!applicationData.documents?.aadhaarFront],
    ['Aadhaar Back', !!applicationData.documents?.aadhaarBack],
  ];

  const flatSteps = [
    { label: 'KYC', done: !!applicationData.kyc, route: '/application/1' },
    { label: 'Bank Details', done: !!applicationData.bank, route: '/application/2' },
    { label: 'PMAY Eligibility', done: !!applicationData.pmay, route: '/application/3' },
    { label: 'Personal Details', done: !!applicationData.personal, route: '/application/4' },
    { label: 'Employment', done: !!applicationData.employment, route: '/application/5' },
    { label: 'Category & Co-Applicant', done: !!applicationData.category && !!applicationData.coApplicant, route: '/application/6' },
    { label: 'Documents', done: !!applicationData.documents, route: '/application/8' },
    { label: 'Review', done: !!applicationData.documents, route: '/application/9' },
    { label: 'EMD Payment', done: !!applicationData.emdPaid, route: '/application/10' },
    { label: 'Flat Selection', done: !!applicationData.flatSelected, route: '/application/11' },
    { label: 'Flat Lock', done: !!applicationData.flatLocked, route: '/application/12' },
    { label: 'Confirmation & Booking', done: !!applicationData.bookingConfirmed, route: '/application/13' },
  ];

  const globalActiveRoute = flatSteps.find((step) => !step.done)?.route ?? null;

  const stages = [
    {
      id: 1,
      title: 'Registration & Eligibility',
      tone: 'emerald',
      status: applicationData.kyc && applicationData.bank && applicationData.pmay ? 'Completed' : 'In progress',
      chipTone: applicationData.kyc && applicationData.bank && applicationData.pmay ? 'complete' : 'active',
      route: '/application/1',
      substeps: [
        { label: 'KYC', done: !!applicationData.kyc, route: '/application/1' },
        { label: 'Bank Details', done: !!applicationData.bank, route: '/application/2' },
        { label: 'PMAY Eligibility', done: !!applicationData.pmay, route: '/application/3' },
      ],
      body: (
        <div className="space-y-3">
          <div className="dashboard-mini-card">
            <p className="dashboard-mini-label">{t('KYC')}</p>
            <p className="dashboard-mini-value">{applicationData.kyc ? t('Completed') : t('Pending')}</p>
          </div>
          <div className="dashboard-mini-card">
            <p className="dashboard-mini-label">{t('Bank Details')}</p>
            <p className="dashboard-mini-value">{applicationData.bank?.bankName || t('Pending')}</p>
          </div>
          <div className="dashboard-mini-card">
            <p className="dashboard-mini-label">PMAY</p>
            <p className="dashboard-mini-value">{applicationData.pmay?.eligibilityCategory ? t(applicationData.pmay.eligibilityCategory) : t('Not checked')}</p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Applicant Details',
      tone: 'cyan',
      status: applicationData.personal && applicationData.employment && applicationData.category ? 'Completed' : 'In progress',
      chipTone: applicationData.personal && applicationData.employment && applicationData.category ? 'complete' : 'active',
      route: '/application/4',
      substeps: [
        { label: 'Personal Details', done: !!applicationData.personal, route: '/application/4' },
        { label: 'Employment', done: !!applicationData.employment, route: '/application/5' },
        { label: 'Category & Co-Applicant', done: !!applicationData.category && !!applicationData.coApplicant, route: '/application/6' },
      ],
      body: (
        <div className="space-y-3">
          <div className="dashboard-mini-card">
            <p className="dashboard-mini-label">{t('Primary Applicant')}</p>
            <p className="dashboard-mini-value">{applicantName}</p>
          </div>
          <div className="dashboard-mini-card">
            <p className="dashboard-mini-label">{t('Email')}</p>
            <p className="dashboard-mini-value">{applicationData.personal?.email || t('your@email.com')}</p>
          </div>
          <div className="dashboard-mini-card">
            <p className="dashboard-mini-label">{t('Category')}</p>
            <p className="dashboard-mini-value">{applicationData.category?.category ? t({
              general: 'General',
              obc: 'OBC',
              sc: 'SC',
              st: 'ST',
              ews: 'EWS',
            }[applicationData.category.category] || applicationData.category.category) : t('Not selected')}</p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Documents & Review',
      tone: 'violet',
      status: applicationData.documents ? 'In progress' : 'Pending',
      chipTone: applicationData.documents ? 'active' : 'pending',
      route: '/application/8',
      substeps: [
        { label: 'Documents', done: !!applicationData.documents, route: '/application/8' },
        { label: 'Review', done: !!applicationData.documents, route: '/application/9' },
        { label: 'EMD Payment', done: !!applicationData.emdPaid, route: '/application/10' },
      ],
      body: (
        <div className="space-y-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="dashboard-mini-label dashboard-mini-label--inline">{t('Uploaded Documents')}</p>
            <span className="dashboard-inline-status dashboard-stage__status dashboard-stage__status--active">
              {documents.filter(([, done]) => done).length}/{documents.length}
            </span>
          </div>
          {documents.map(([label, done]) => (
            <div key={label} className="dashboard-list-row">
              <span>{t(label)}</span>
              <span className={`dashboard-list-pill ${done ? 'dashboard-list-pill-complete' : 'dashboard-list-pill-pending'}`}>
                {done ? t('Done') : t('Pending')}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 4,
      title: 'Flat Booking',
      tone: 'slate',
      status: applicationData.bookingConfirmed ? 'Completed' : applicationData.flatSelected || applicationData.flatLocked ? 'In progress' : 'Pending',
      chipTone: applicationData.bookingConfirmed ? 'complete' : applicationData.flatSelected || applicationData.flatLocked ? 'active' : 'pending',
      route: '/application/11',
      substeps: [
        { label: 'Flat Selection', done: !!applicationData.flatSelected, route: '/application/11' },
        { label: 'Flat Lock', done: !!applicationData.flatLocked, route: '/application/12' },
        { label: 'Confirmation & Booking', done: !!applicationData.bookingConfirmed, route: '/application/13' },
      ],
      body: (
        <div className="space-y-3">
          <div className="dashboard-mini-card">
            <p className="dashboard-mini-label">{t('Preferred Flat')}</p>
            <p className="dashboard-mini-value">{applicationData.flatSelected?.id || t('Not selected')}</p>
          </div>
          <div className="dashboard-mini-card">
            <p className="dashboard-mini-label">{t('Lock Status')}</p>
            <p className="dashboard-mini-value">{applicationData.flatLocked ? t('Locked') : t('Awaiting selection')}</p>
          </div>
          <div className="dashboard-mini-card">
            <p className="dashboard-mini-label">{t('Booking')}</p>
            <p className="dashboard-mini-value">{applicationData.bookingConfirmed ? t('Confirmed') : t('Not confirmed')}</p>
          </div>
        </div>
      ),
    },
  ];

  const nextStep = !applicationData.kyc
    ? 'KYC'
    : !applicationData.bank
      ? 'Bank Details'
      : !applicationData.pmay
        ? 'PMAY Eligibility'
      : !applicationData.personal
        ? 'Personal Details'
        : !applicationData.employment
          ? 'Employment'
          : !applicationData.category
            ? 'Category'
            : !applicationData.coApplicant
              ? 'Co-Applicant'
          : !applicationData.documents
            ? 'Documents'
            : !applicationData.emdPaid
              ? 'EMD Payment'
              : !applicationData.flatSelected
                ? 'Flat Selection'
                : !applicationData.flatLocked
                  ? 'Flat Lock'
                  : applicationData.bookingConfirmed
                    ? 'Completed'
                    : 'Confirmation Payment';

  const activeRoute = flatSteps.find((step) => !step.done)?.route || '/dashboard';

  return (
    <div className="page-enter w-full px-1 pb-8 sm:px-4 sm:pb-10">
      <section className="dashboard-board">
        <div className="dashboard-board__header">
          <div>
            <p className="dashboard-board__eyebrow">{t('FCFS Booking Portal')}</p>
            <h1 className="dashboard-board__title">{t('Application Dashboard')}</h1>
            <p className="dashboard-board__subtitle">{t('Track every verified step, upload status, and booking milestone in one place.')}</p>
          </div>
          <div className="dashboard-board__date">
            <CalendarDays className="h-5 w-5" />
            <span>{t('Last updated:')}</span>
            <strong>{lastUpdated}</strong>
          </div>
        </div>

        <div className="dashboard-summary-strip">
          <div className="dashboard-summary-main">
            <div className="dashboard-profile">
              <div className="dashboard-avatar">
                {profilePhoto ? (
                  <img src={profilePhoto} alt={`${applicantName} profile`} className="dashboard-avatar__image" />
                ) : (
                  <User className="h-10 w-10" />
                )}
              </div>
              <div>
                <h2 className="dashboard-profile__name">{applicantName}</h2>
                <p className="dashboard-profile__meta">{t('Applicant ID: {id}', { id: applicationId })}</p>
                <p className="dashboard-profile__meta">{t('Age: 35 | Mobile: +91 {mobile}', { mobile })}</p>
              </div>
            </div>

            <div className="dashboard-barcode-block dashboard-barcode-block--inline">
              <p className="dashboard-mini-label">{t('Registration No.')}</p>
              <div className="dashboard-barcode" />
              <p className="dashboard-barcode__text">{barcode}</p>
            </div>
          </div>

          <div className="dashboard-summary-actions">
            <button
              type="button"
              onClick={() => navigate(activeRoute)}
              className="dashboard-fee-button"
            >
              {t(nextStep)}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="dashboard-workflow">
          <div className="dashboard-workflow__track">
            {stages.map((stage) => (
              <div key={stage.id} className={`dashboard-stage dashboard-stage--${stage.tone}`}>
                <div className="dashboard-stage__head">
                  <div className="dashboard-stage__number">{stage.id}</div>
                  <span className={`dashboard-stage__status dashboard-stage__head-status dashboard-stage__status--${stage.chipTone}`}>
                    {t(stage.status)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(stage.route)}
                  className="dashboard-stage__title"
                >
                  {t(stage.title)}
                </button>

                <div className="dashboard-stage__chips">
                  {stage.substeps.map((item) => {
                    const isCompleted = item.done;
                    const isActive = !item.done && item.route === globalActiveRoute;
                    const stateClass = isCompleted
                      ? 'dashboard-stepper__node--complete'
                      : isActive
                        ? 'dashboard-stepper__node--active'
                        : 'dashboard-stepper__node--pending';

                    return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => isActive && navigate(item.route)}
                      disabled={!isActive}
                      className={`dashboard-stepper__node ${stateClass} ${isActive ? 'dashboard-stepper__node--clickable' : ''}`}
                    >
                      <span className="dashboard-stepper__label">{t(item.label)}</span>
                    </button>
                  )})}
                </div>

                <div className="dashboard-stage__body">{stage.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-bottom-grid">
          <section className="dashboard-bottom-card">
            <p className="dashboard-bottom-card__eyebrow">{t('Alerts')}</p>
            <h3 className="dashboard-bottom-card__title">{t('Notifications')}</h3>
            <div className="dashboard-alert dashboard-alert--warning">
              <p className="dashboard-alert__title">{t('Action required')}</p>
              <p className="dashboard-alert__text">{t('Please complete {step} to continue your application.', { step: t(nextStep) })}</p>
            </div>
          </section>

          <section className="dashboard-bottom-card">
            <p className="dashboard-bottom-card__eyebrow">{t('Snapshot')}</p>
            <h3 className="dashboard-bottom-card__title">{t('Application Summary')}</h3>
            <div className="dashboard-summary-list">
              <div className="dashboard-summary-list__row">
                <span>{t('User mobile')}</span>
                <strong>+91 {mobile}</strong>
              </div>
              <div className="dashboard-summary-list__row">
                <span>{t('Current step')}</span>
                <strong>{t(nextStep)}</strong>
              </div>
              <div className="dashboard-summary-list__row">
                <span>{t('Flat selected')}</span>
                <strong>{applicationData.flatSelected ? t('Yes') : t('No')}</strong>
              </div>
              <div className="dashboard-summary-list__row">
                <span>{t('Booking confirmed')}</span>
                <strong>{applicationData.bookingConfirmed ? t('Yes') : t('No')}</strong>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
