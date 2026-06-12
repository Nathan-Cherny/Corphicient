"use client";

import Footer from "./Footer";
import Navbar from "./Navbar";
import { NotificationProvider } from "./notification/NotificationContext";
import { useState, useEffect } from "react";

export function PageMain({ children }) {
  const [bgColor, setBGColor] = useState(getBackgroundColor(0));

  useEffect(() => {
    const handleScroll = () => {
      setBGColor(getBackgroundColor(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <NotificationProvider>
      <div
        style={{ backgroundColor: bgColor }}
        className="relative z-10 pt-18 flex min-h-screen flex-col w-full"
      >
        <Navbar />

        <main className="flex flex-col items-center grow px-15 pb-15">{children}</main>

        <Footer/>
      </div>
    </NotificationProvider>
  );
}

const getBackgroundColor = () => {
  return `rgba(175, 200, 200, 1)`;
};
