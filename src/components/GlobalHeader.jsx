import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, CircleHelp, Languages, LayoutDashboard, LogOut, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import HeaderLogoScene from './HeaderLogoScene';

const logoSrc = `${import.meta.env.BASE_URL}maho-logo.png`;

const GlobalHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { isMarathi, toggleLanguage, t } = useLanguage();
  const { theme, themes, setThemeById } = useTheme();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const isLoginPage = location.pathname === '/login';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountOpen(false);
        setIsThemeOpen(false);
      }
    };

    window.addEventListener('pointerdown', handleClickOutside);
    return () => window.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsAccountOpen(false);
    setIsThemeOpen(false);
  }, [location.pathname]);

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
            className="header-button header-button-language"
            aria-label={isMarathi ? t('Switch to English') : t('Switch to Marathi')}
            title={isMarathi ? t('Switch to English') : t('Switch to Marathi')}
            onClick={toggleLanguage}
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{isMarathi ? 'मराठी' : 'English'}</span>
          </button>
          <button
            type="button"
            className="header-button header-button-help"
            aria-label={t('Help')}
            title={t('Help')}
          >
            <CircleHelp className="h-4 w-4" />
            <span className="hidden sm:inline">{t('Help')}</span>
          </button>
          {!isAuthenticated && isLoginPage ? (
            <div className="header-account-menu w-full sm:w-auto" ref={accountMenuRef}>
              <button
                type="button"
                className="header-button header-button-theme w-full justify-center sm:w-auto"
                onClick={() => setIsThemeOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isThemeOpen}
              >
                <Palette className="h-4 w-4" />
                <span>{t('Change Theme')}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
              </button>
              {isThemeOpen ? (
                <div className="header-account-dropdown" role="menu">
                  <div className="theme-picker">
                    <div className="theme-picker__grid">
                      {themes.map((themeOption) => (
                        <button
                          key={themeOption.id}
                          type="button"
                          onClick={() => setThemeById(themeOption.id)}
                          className={`theme-picker__option ${theme === themeOption.id ? 'theme-picker__option--active' : ''}`}
                        >
                          <div className={`theme-picker__swatch theme-picker__swatch--${themeOption.id}`}>
                            {themeOption.icon}
                          </div>
                          <div>
                            <div className="theme-picker__label">{t(themeOption.label)}</div>
                            <div className="theme-picker__desc">{t(themeOption.description)}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
          {isAuthenticated ? (
            <div className="header-account-menu w-full sm:w-auto" ref={accountMenuRef}>
              <button
                type="button"
                className="header-button header-button-account w-full justify-center sm:w-auto"
                onClick={() => {
                  setIsAccountOpen((open) => !open);
                  setIsThemeOpen(false);
                }}
                aria-haspopup="menu"
                aria-expanded={isAccountOpen}
              >
                {t('My Account')}
                <ChevronDown className={`h-4 w-4 transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAccountOpen ? (
                <div className="header-account-dropdown" role="menu">
                  <div className="header-account-item header-account-item-static">
                    <span className="header-subtext">{user?.mobile ? `+91 ${user.mobile}` : t('Signed in')}</span>
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
                    {t('Dashboard')}
                  </button>

                  {/* Theme Picker */}
                  <div className="theme-picker__divider" />
                  <button
                    type="button"
                    onClick={() => setIsThemeOpen((open) => !open)}
                    className="header-account-item"
                    role="menuitem"
                    aria-expanded={isThemeOpen}
                  >
                    <Palette className="h-4 w-4" />
                    {t('Change Theme')}
                    <ChevronDown className={`ml-auto h-3.5 w-3.5 transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isThemeOpen ? (
                    <div className="theme-picker">
                      <div className="theme-picker__grid">
                        {themes.map((themeOption) => (
                          <button
                            key={themeOption.id}
                            type="button"
                            onClick={() => setThemeById(themeOption.id)}
                            className={`theme-picker__option ${theme === themeOption.id ? 'theme-picker__option--active' : ''}`}
                          >
                            <div className={`theme-picker__swatch theme-picker__swatch--${themeOption.id}`}>
                              {themeOption.icon}
                            </div>
                            <div>
                              <div className="theme-picker__label">{t(themeOption.label)}</div>
                              <div className="theme-picker__desc">{t(themeOption.description)}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="theme-picker__divider" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="header-account-item"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('Logout')}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <span className="sr-only">{t('Language')}</span>
          )}
        </div>
      </div>
      <div className="mt-4 w-full header-divider" />
    </header>
  );
};

export default GlobalHeader;
