import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, Building, Download, Share2, Home, Receipt, CalendarDays } from 'lucide-react';

const BookingConfirmed = () => {
  const navigate = useNavigate();
  const { applicationData } = useAuth();
  const { t, formatDate, formatNumber } = useLanguage();

  const flatLocked = applicationData.flatLocked;
  const bookingDate = applicationData.bookingConfirmedAt 
    ? formatDate(applicationData.bookingConfirmedAt, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : formatDate(new Date());
  const applicationId = `FCFS-${(flatLocked?.id || Date.now().toString()).toString().replace(/[^0-9A-Z]/gi, '').slice(-8).toUpperCase()}`;

  return (
    <div className="content-frame page-enter mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl items-center justify-center p-4">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="step-shell rounded-[2.25rem] p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
            <div>
              <p className="step-eyebrow">{t('Booking Complete')}</p>
              <h1 className="text-4xl font-black tracking-tight step-heading">{t('Booking Confirmed')}</h1>
              <p className="mt-2 text-base leading-7 step-subtle">{t('Your flat has been successfully reserved in the FCFS booking flow.')}</p>
            </div>
          </div>

          {flatLocked && (
            <div className="mb-6 rounded-[1.75rem] border border-white/10 bg-white/6 p-6">
              <div className="mb-5 flex items-center gap-3">
                <Building className="h-6 w-6 text-cyan-300" />
                <span className="text-2xl font-black step-heading">{flatLocked.id}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl step-note p-4">
                  <p className="text-sm step-subtle">{t('Type')}</p>
                  <p className="mt-2 text-lg font-bold step-heading">{t(flatLocked.type)}</p>
                </div>
                <div className="rounded-2xl step-note p-4">
                  <p className="text-sm step-subtle">{t('Area')}</p>
                  <p className="mt-2 text-lg font-bold step-heading">{flatLocked.area}</p>
                </div>
                <div className="rounded-2xl step-note p-4">
                  <p className="text-sm step-subtle">{t('Total Price')}</p>
                  <p className="mt-2 text-lg font-bold step-heading">₹{formatNumber(flatLocked.price)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl step-note p-5">
              <div className="mb-2 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-cyan-400" />
                <p className="text-sm step-subtle">{t('Booking Date')}</p>
              </div>
              <p className="text-lg font-bold step-heading">{bookingDate}</p>
            </div>
            <div className="rounded-2xl step-note p-5">
              <div className="mb-2 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-violet-400" />
                <p className="text-sm step-subtle">{t('Application ID')}</p>
              </div>
              <p className="text-lg font-bold step-heading">{applicationId}</p>
            </div>
          </div>
        </section>

        <section className="app-card rounded-[2.25rem] p-8">
          <p className="step-eyebrow">{t('Next Actions')}</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-950">{t('Everything is ready.')}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {t('A confirmation email has been sent to your registered address. You can now download your receipt or return to the dashboard.')}
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="font-semibold text-emerald-800">{t('Receipt generated')}</p>
              <p className="mt-1 text-sm text-emerald-700">{t('Your payment and booking details are ready to export.')}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{t('Share your confirmation')}</p>
              <p className="mt-1 text-sm text-slate-500">{t('Send your booking summary to family members or keep it for records.')}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <button className="step-primary-button w-full">
              <Download className="w-5 h-5" />
              {t('Download Receipt')}
            </button>
            <button className="step-secondary-button w-full">
              <Share2 className="w-5 h-5" />
              {t('Share Confirmation')}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="step-secondary-button w-full"
            >
              <Home className="w-5 h-5" />
              {t('Go to Dashboard')}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingConfirmed;
