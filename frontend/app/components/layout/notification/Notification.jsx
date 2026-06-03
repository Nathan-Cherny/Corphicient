"use client";

import { useEffect, useState } from "react";

export default function NotificationBanner({
  message,
  color,
  duration,
  show = true,
  onClose,
}) {
  const [visible, setVisible] = useState(show);
  const [render, setRender] = useState(show); // controls DOM presence

  const colorMap = (color) => {
    const bgColor = `rgb(${color.join(", ")})`
    const bgColorEnd = `rgb(${color.map((c) => c*2).join(", ")})`
    const borderColor = `rgb(${color.map((c) => c/3).join(", ")})`
    const textColor = `rgb(${color.map((c) => c/2).join(", ")})`

    return {
      borderWidth: 2,

      backgroundColor: bgColor,
      background: `linear-gradient(45deg,${bgColor} 0%,  ${bgColorEnd} 100%)`,
      borderColor: borderColor,
      textColor: textColor,
    }
  }

  const styles = colorMap(color)

  useEffect(() => {
    if (show) {
      setRender(true);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false); // triggers fade out

        // wait for animation before unmounting
        setTimeout(() => {
          setRender(false);
          onClose && onClose();
        }, 300); // match transition duration
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!render) return null;


  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-50
        w-full max-w-7/12
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
    >
      <div
        style={styles}
        className={`
          shadow-xl rounded-2xl px-5 py-4
        `}
      >
        <p className="text-center font-bold text-2xl">{message}</p>
      </div>
    </div>
  );
}