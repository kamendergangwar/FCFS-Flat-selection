import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem, removeItem } from '../utils/indexedDB';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const DEFAULT_APP_DATA = {
  currentStep: 0,
  kyc: null,
  bank: null,
  pmay: null,
  personal: null,
  employment: null,
  category: null,
  coApplicant: null,
  documents: null,
  emdPaid: false,
  flatSelected: null,
  flatLocked: null,
  bookingConfirmed: false,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [applicationData, setApplicationData] = useState(DEFAULT_APP_DATA);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Hydrate state from IndexedDB on mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [savedUser, savedAppData] = await Promise.all([
          getItem('user'),
          getItem('applicationData'),
        ]);

        if (cancelled) return;

        if (savedUser) {
          const parsed = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser;
          setUser(parsed);
          setIsAuthenticated(true);
        }

        if (savedAppData) {
          const parsed = typeof savedAppData === 'string' ? JSON.parse(savedAppData) : savedAppData;
          setApplicationData((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.warn('[AuthContext] Failed to hydrate from IndexedDB', err);
      } finally {
        if (!cancelled) setIsAuthReady(true);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    removeItem('user');
  }, []);

  const updateApplicationData = useCallback((data) => {
    setApplicationData((prev) => {
      const newData = { ...prev, ...data };
      setItem('applicationData', JSON.stringify(newData));
      return newData;
    });
  }, []);

  const getProgress = () => {
    const steps = [
      applicationData.kyc,
      applicationData.bank,
      applicationData.pmay,
      applicationData.personal,
      applicationData.employment,
      applicationData.category,
      applicationData.coApplicant,
      applicationData.documents,
      applicationData.emdPaid,
      applicationData.flatSelected,
      applicationData.flatLocked,
      applicationData.bookingConfirmed,
    ];
    const completed = steps.filter(Boolean).length;
    return Math.round((completed / steps.length) * 100);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthReady,
        login,
        logout,
        applicationData,
        updateApplicationData,
        getProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
