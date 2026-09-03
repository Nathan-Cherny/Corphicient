"use client";

import FadeOverlay from "../layout/FadeOverlay";
import { useState } from "react";

import Form from "../forms/Forms";
import { addSong } from "../songs/SongFunctions";
import { addPlaylist } from "./PlaylistFunctions";

export default function PlaylistListSettings({ settings, setSettings }) {
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  return (
    <>
      <button
        className="bg-gray-400 p-5 rounded-2xl shadow-2xl border hover:scale-105 transition-all duration-150 cursor-pointer"
        onClick={() => setSettingsMenuOpen(true)}
      >
        Settings
      </button>
      <FadeOverlay
        isOpen={settingsMenuOpen}
        onClose={() => setSettingsMenuOpen(false)}
      >
        <SettingsMenu settings={settings} setSettings={setSettings} />
      </FadeOverlay>
    </>
  );
}

function SettingsMenu({ settings, setSettings }) {
  return (
    <div className="p-15 bg-white">
      <h1 className="text-2xl text-center">Settings</h1>
      <div className="bg-black/15 flex flex-col gap-5 items-stretch p-5 mt-5">
        <Form
          formType="get_song_form"
          nonFormFields={["secondsPlayed", "src", "duration", "color"]}
          submitFunction={(e) => {
            addSong(e)
              .then((e) => alert(JSON.stringify(e)`Successfully downloaded ${e.name} (id: ${e.id})`))
              .catch((error) => alert(`${error.status} (${error.code}) Error downloading song: ${error.message}\n\n${error.stack}\n\n`));
          }}
          name={"Add Song"}
        />
        <Form
          formType="get_playlist_form"
          submitFunction={addPlaylist}
          name={"Add Playlist"}
        />
        <div className="flex flex-col border p-5">
          <h1>Timeskip</h1>
          <input
            type="number"
            onChange={(e) => {
              settings.timeSkip = e.target.valueAsNumber;
              setSettings(settings);
            }}
            defaultValue={settings.timeSkip}
          ></input>
        </div>
      </div>
    </div>
  );
}
