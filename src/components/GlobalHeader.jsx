import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, CircleHelp, Languages, LayoutDashboard, LogOut, Moon, SunMedium } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import HeaderLogoScene from './HeaderLogoScene';

const logoSrc = `${import.meta.env.BASE_URL}maho-logo.png`;

const getPageLabel = (pathname) => {
  if (pathname === '/login') {
    return 'Secure login';
  }
  if (pathname === '/dashboard') {
    return 'Application dashboard';
  }
  if (pathname.startsWith('/application/')) {
    return 'Flat booking workflow';
  }
  return 'MHDC booking portal';
};

const GlobalHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };

    window.addEventListener('pointerdown', handleClickOutside);
    return () => window.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  return (
    <header className="relative z-30 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex w-full flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="header-logo-wrap flex items-center self-start px-1 py-1 lg:self-auto">
          <HeaderLogoScene />
          <img src={logoSrc} alt="MHDC logo" className="header-logo" />
        </div>

        <div className="header-card flex w-full flex-wrap items-center justify-center gap-2 rounded-[1.5rem] px-3 py-3 text-sm sm:justify-end sm:gap-3 sm:rounded-full sm:px-4 lg:w-auto">
          <button
            type="button"
            onClick={toggleTheme}
            className="header-button header-button-icon header-button-theme"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="header-button header-button-language"
            aria-label="Change language"
            title="Change language"
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">Language</span>
          </button>
          <button
            type="button"
            className="header-button header-button-help"
            aria-label="Help"
            title="Help"
          >
            <CircleHelp className="h-4 w-4" />
            <span className="hidden sm:inline">Help</span>
          </button>
          {isAuthenticated ? (
            <div className="header-account-menu w-full sm:w-auto" ref={accountMenuRef}>
              <button
                type="button"
                className="header-button header-button-account w-full justify-center sm:w-auto"
                onClick={() => setIsAccountOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isAccountOpen}
              >
                My Account
                <ChevronDown className={`h-4 w-4 transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAccountOpen ? (
                <div className="header-account-dropdown" role="menu">
                  <div className="header-account-item header-account-item-static">
                    <span className="header-subtext">{user?.mobile ? `+91 ${user.mobile}` : 'Signed in'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/dashboard');
                      setIsAccountOpen(false);
                    }}
                    className="header-account-item"
                    role="menuitem"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="header-account-item"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <span className="sr-only">Guest header actions</span>
          )}
        </div>
      </div>
      <div className="mt-4 w-full header-divider" />
    </header>
  );
};

export default GlobalHeader;
