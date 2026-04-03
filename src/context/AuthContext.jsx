import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [applicationData, setApplicationData] = useState({
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
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('user'));
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const savedAppData = localStorage.getItem('applicationData');
    if (savedAppData) {
      setApplicationData(JSON.parse(savedAppData));
    }
    setIsAuthReady(true);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateApplicationData = (data) => {
    const newData = { ...applicationData, ...data };
    setApplicationData(newData);
    localStorage.setItem('applicationData', JSON.stringify(newData));
  };

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
