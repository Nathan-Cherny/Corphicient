"use client";

import FadeOverlay from "../layout/FadeOverlay";
import { useState } from "react";

import Form from "../forms/Forms";
import { addSong } from "../songs/SongFunctions";
import SongDownloadProgress from "../songs/SongDownloadProgress";
import { addPlaylist } from "./PlaylistFunctions";

export default function PlaylistListSettings({ settings, setSettings }) {
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  return (
    <>
      <button
        className="rounded-xl border border-sky-200 bg-sky-100 px-6 py-3 font-medium text-sky-900 shadow-md transition-all duration-150 hover:scale-105 hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer"
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
  const [songProgress, setSongProgress] = useState(null);

  return (
    <div className="w-full max-w-3xl max-h-[90vh] overflow-scroll rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="text-center text-2xl font-semibold text-sky-950">
        Settings
      </h1>

      <div className="mt-6 flex flex-col items-stretch gap-5 rounded-xl bg-sky-50 p-5">
        <Form
          formType="get_song_form"
          nonFormFields={["secondsPlayed", "src", "duration", "color"]}
          submitFunction={(e) => {
            setSongProgress({ status: "starting", progress: 0 });
            addSong(e, setSongProgress)
              .then((e) =>
                alert(`Successfully downloaded ${e.name} (id: ${e.id})`),
              )
              .catch((error) =>
                alert(
                  `${error.status} (${error.code}) Error downloading song: ${error.message}\n\n${error.stack}\n\n`,
                ),
              )
              .finally(() => setSongProgress(null));
          }}
          name="Add song"
        />
        <SongDownloadProgress state={songProgress} />
        <Form
          formType="get_playlist_form"
          submitFunction={addPlaylist}
          name="Add playlist"
        />

        <section className="flex flex-col gap-3 rounded-xl border border-sky-200 bg-white p-5 shadow-sm">
          <h2 className="text-center text-lg font-semibold text-sky-950">
            Timeskip
          </h2>
          <input
            type="number"
            className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-sky-950 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            onChange={(e) =>
              setSettings({ ...settings, timeSkip: e.target.valueAsNumber })
            }
            defaultValue={settings.timeSkip}
          />
        </section>
      </div>
    </div>
  );
}