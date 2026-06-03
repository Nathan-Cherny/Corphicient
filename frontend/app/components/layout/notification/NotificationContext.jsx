"use client";

import { createContext, useContext, useState } from "react";
import NotificationBanner from "./Notification";
const NotificationContext = createContext(null);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used inside a PageMain / NotificationProvider");
  }
  return ctx;
}

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const notify = ({ message, color=[0, 160, 160], duration = 3000 }) => {
    setNotification({ message, color, duration });
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      {notification && (
        <NotificationBanner
          {...notification}
          onClose={() => setNotification(null)}
        />
      )}
    </NotificationContext.Provider>
  );
}