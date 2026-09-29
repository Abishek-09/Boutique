import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [demoMode, setDemoMode] = useState(true);
  const recentToastsRef = React.useRef(new Map());

  const showToast = useCallback((message, type = 'info') => {
    if (!message) return;
    const now = Date.now();
    const lastTime = recentToastsRef.current.get(message);
    if (lastTime && now - lastTime < 1200) {
      // Synchronously deduplicate identical messages within 1.2s window
      return;
    }
    recentToastsRef.current.set(message, now);

    const id = `${now}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
      if (recentToastsRef.current.get(message) === now) {
        recentToastsRef.current.delete(message);
      }
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{ showToast, demoMode, setDemoMode }}>
      {children}
      {/* Global Toast Renderer */}
      <div className="toast-container" role="region" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ marginLeft: 'auto', opacity: 0.6, fontSize: '16px', lineHeight: 1 }}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
