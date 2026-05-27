import React, { createContext, useContext } from 'react';

/**
 * AuthContext stubé : pas de backend, pas d'auth. On expose les mêmes clés
 * que l'original (user, isAuthenticated, isLoading*, authError, etc.) pour
 * que le reste du code marche sans modif.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const value = {
    user: null,
    isAuthenticated: false,
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authError: null,
    appPublicSettings: { id: 'stub', public_settings: {} },
    logout: () => {},
    navigateToLogin: () => {
      console.warn('[stub] navigateToLogin — pas de backend, on reste sur la page');
    },
    checkAppState: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
