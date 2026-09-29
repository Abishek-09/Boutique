import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const ADMIN_STORAGE_KEY = 'maison_admin_auth';
const CUSTOMER_STORAGE_KEY = 'maison_customer_auth';

export const AuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      if (sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true') {
        return {
          name: 'Aaradhya Sharma',
          email: 'admin@boutique.demo',
          role: 'Boutique Director & Store Manager',
        };
      }
    } catch (e) {}
    return null;
  });

  const [customerUser, setCustomerUser] = useState(() => {
    const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      id: 'CUST-001',
      name: 'Ananya Verma',
      email: 'ananya.verma@example.com',
      phone: '+91 98765 43210',
      addresses: [
        {
          id: 'addr-1',
          name: 'Ananya Verma',
          phone: '+91 98765 43210',
          addressLine: 'Flat 402, Lotus Residency, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: true,
        },
      ],
    };
  });

  useEffect(() => {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerUser));
  }, [customerUser]);

  const loginAdmin = (email, password) => {
    if (email === 'admin@boutique.demo' && password === 'admin123') {
      setIsAdminAuthenticated(true);
      const user = {
        name: 'Aaradhya Sharma',
        email: 'admin@boutique.demo',
        role: 'Boutique Director & Store Manager',
      };
      setAdminUser(user);
      try {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      } catch (e) {}
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Use admin@boutique.demo / admin123' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (e) {}
  };

  const updateCustomerProfile = (updates) => {
    setCustomerUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin,
        customerUser,
        updateCustomerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
