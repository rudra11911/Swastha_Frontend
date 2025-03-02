import { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const useAlerts = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  
  const addAlert = (alert) => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...alert
    };
    setAlerts(prev => [newAlert, ...prev]);
  };
  
  const markAsRead = (id) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };
  
  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  const value = {
    alerts,
    addAlert,
    markAsRead,
    removeAlert
  };
  
  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};