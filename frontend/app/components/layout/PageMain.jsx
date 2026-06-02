"use client";

import { useEffect, useState } from "react";

import Navbar from "./Navbar";

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
    <>

      <div
        style={{ backgroundColor: bgColor }}
        className="relative z-10 pt-18 flex min-h-screen text-wrap flex-col items-center pb-15 px-15 bg-black"
      >
        <Navbar />

        <main
          className="grow w-full m-0 p-5"
        >
          {children}
        </main>
      </div>
    </>
  );
}

const getBackgroundColor = () => {

  return `rgba(255, 255, 255, 0.75)`;
};