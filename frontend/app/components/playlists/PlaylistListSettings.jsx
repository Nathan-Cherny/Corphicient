"use client";

import FadeOverlay from "../layout/FadeOverlay";
import { useState } from "react";

export default function PlaylistListSettings({}) {
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  return (
    <>
      <button
        className="bg-amber-400 p-5 rounded-2xl shadow-2xl border hover:scale-105 transition-all duration-150 cursor-pointer"
        onClick={() => setSettingsMenuOpen(true)}
      >
        Settings
      </button>
      <FadeOverlay
        isOpen={settingsMenuOpen}
        onClose={() => setSettingsMenuOpen(false)}
      >
        <SettingsMenu />
      </FadeOverlay>
    </>
  );
}

function SettingsMenu() {
  return (
    <div className="p-15 bg-white flex flex-col">
      <h1>Settings</h1>
      <p>hey now</p>
    </div>
  );
}
