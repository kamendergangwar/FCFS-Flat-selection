import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, ArrowRight, Loader2, MapPin, Home, BedDouble } from 'lucide-react';

const logoSrc = `${import.meta.env.BASE_URL}maho-logo.png`;

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('mobile'); // 'mobile' | 'otp'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const slides = [
    {
      title: 'Wardha Road Residences',
      location: 'Wardha Road, Nagpur',
      image:
        'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
      meta: 'Premium apartment towers inspired by Nagpur growth corridors and family-focused layouts.',
    },
    {
      title: 'Civil Lines Homes',
      location: 'Civil Lines, Nagpur',
      image:
        'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
      meta: 'Elegant urban residences with landscaped arrival courts and contemporary facade design.',
    },
    {
      title: 'Besa Smart Living',
      location: 'Besa, Nagpur',
      image:
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      meta: 'Modern homes shaped for everyday comfort, clean circulation, and easy booking discovery.',
    },
    {
      title: 'Manish Nagar Heights',
      location: 'Manish Nagar, Nagpur',
      image:
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      meta: 'Warm residential towers designed for compact family living and quick city access.',
    },
    {
      title: 'Trimurti Nagar Homes',
      location: 'Trimurti Nagar, Nagpur',
      image:
        'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
      meta: 'Bright apartment blocks with practical layouts, balconies, and neighborhood connectivity.',
    },
    {
      title: 'Pratap Nagar Residences',
      location: 'Pratap Nagar, Nagpur',
      image:
        'https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1200&q=80',
      meta: 'Urban homes with modern fronts, visitor lounges, and landscaped setbacks.',
    },
    {
      title: 'Shankar Nagar Living',
      location: 'Shankar Nagar, Nagpur',
      image:
        'https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=1200&q=80',
      meta: 'Refined residential clusters built around comfort, daylight, and smooth daily movement.',
    },
    {
      title: 'Friends Colony Homes',
      location: 'Friends Colony, Nagpur',
      image:
        'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1200&q=80',
      meta: 'Contemporary mid-rise apartments with calm entry courts and premium family spaces.',
    },
    {
      title: 'Laxmi Nagar Towers',
      location: 'Laxmi Nagar, Nagpur',
      image:
        'https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=1200&q=80',
      meta: 'Elegant housing options with strong street presence and efficient floor plans.',
    },
    {
      title: 'Dharampeth Residences',
      location: 'Dharampeth, Nagpur',
      image:
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      meta: 'Premium apartment living with elevated interiors and a polished neighborhood experience.',
    },
    {
      title: 'Sadar Urban Homes',
      location: 'Sadar, Nagpur',
      image:
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      meta: 'Fresh residential inventory with strong accessibility and aspirational community appeal.',
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const handleSendOTP = (e) => {
    e.preventDefault();
    setError('');
    
    if (!mobile || mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      login({
        mobile,
        name: 'New User',
        createdAt: new Date().toISOString(),
      });
      navigate('/dashboard');
    }, 1500);
  };

  const handleResendOTP = () => {
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setError('OTP resent successfully!');
    }, 1000);
  };

  return (
    <div className="content-frame page-enter mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl items-center justify-center p-4">
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="login-side-panel hidden rounded-[2.25rem] p-8 lg:block">
          <p className="step-eyebrow">Priority Access</p>
          <h1 className="text-3xl font-black tracking-tight step-heading">Explore homes and complete your booking in one guided flow.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 step-subtle">
            Browse featured residences, complete verification, and move from shortlist to booking confirmation from one connected dashboard.
          </p>

          <div className="login-carousel mt-8">
            <div className="login-carousel__viewport">
              {slides.map((slide, index) => (
                <article
                  key={slide.title}
                  className={`login-carousel__slide ${index === activeSlide ? 'login-carousel__slide--active' : ''}`}
                >
                  <div
                    className="login-carousel__image"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                  <div className="login-carousel__overlay" />
                  <div className="login-carousel__content">
                    <div className="login-carousel__pill">
                      <Home className="h-4 w-4" />
                      Featured Residence
                    </div>
                    <h2 className="login-carousel__title">{slide.title}</h2>
                    <div className="login-carousel__meta">
                      <span>
                        <MapPin className="h-4 w-4" />
                        {slide.location}
                      </span>
                      <span>
                        <BedDouble className="h-4 w-4" />
                        Ready to explore
                      </span>
                    </div>
                    <p className="login-carousel__description">{slide.meta}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="login-carousel__footer">
              <div className="login-carousel__dots">
                {slides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`login-carousel__dot ${index === activeSlide ? 'login-carousel__dot--active' : ''}`}
                    aria-label={`Show ${slide.title}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </section>

        <section className="login-card w-full rounded-[2.25rem] p-8 shadow-[0_32px_90px_rgba(15,23,42,0.16)]">
          <div className="mb-8 text-center">
            <img src={logoSrc} alt="MHDC logo" className="login-brand-logo mx-auto mb-4" />
            <p className="mt-2 text-slate-500">
              {step === 'mobile' ? 'Enter your mobile number to continue' : 'Enter the OTP sent to your mobile'}
            </p>
          </div>

          {step === 'mobile' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="step-note">
                <p className="text-sm font-semibold text-slate-900">Use your registered mobile number</p>
                <p className="mt-1 text-sm text-slate-500">We will send a 6-digit code to verify your access.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full rounded-2xl border border-gray-300 py-4 pl-10 pr-4 transition-all"
                  />
                </div>
              </div>

              {error && <p className="form-error text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="step-primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="step-note">
                <p className="text-sm font-semibold text-slate-900">Verification in progress</p>
                <p className="mt-1 text-sm text-slate-500">A verification code was sent to +91 {mobile}. Enter it below to continue.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit OTP"
                  className="w-full rounded-2xl border border-gray-300 px-4 py-4 text-center text-2xl tracking-[0.45em] transition-all"
                  autoFocus
                />
                <p className="mt-3 text-center text-sm text-gray-500">
                  OTP sent to +91 {mobile}
                </p>
              </div>

              {error && <p className="form-error text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="step-primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="step-secondary-button"
                >
                  Didn't receive OTP? Resend
                </button>
                <button
                  type="button"
                  onClick={() => setStep('mobile')}
                  className="step-secondary-button"
                >
                  Change mobile number
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-400">
            By continuing, you agree to our Terms & Conditions
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
