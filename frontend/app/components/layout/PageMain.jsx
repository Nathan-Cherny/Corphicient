"use client";

import Footer from "./Footer";
import Navbar from "./Navbar";
import { NotificationProvider } from "./notification/NotificationContext";

export function PageMain({ children }) {

  return (
    <NotificationProvider>
      <div
        className="relative z-10 flex min-h-screen flex-col w-full bg-linear-to-r from-cyan-500 to-blue-500"
      >
        <Navbar />

        <main className="flex flex-col items-center grow px-15 pb-15">{children}</main>

        <Footer/>
      </div>
    </NotificationProvider>
  );
}
