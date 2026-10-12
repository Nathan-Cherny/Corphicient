"use client";

// imports from next
import axiosClient from "../../axiosClient";
import { useEffect, useState, useSyncExternalStore } from "react";
import PlaylistCard from "./PlaylistCard";
import PlaylistListSettings from "./PlaylistListSettings";
import { isFilterPlaylist } from "./PlaylistFunctions";
import { useSongFilterSpecs } from "../songs/SongFilter";
import { describeFilters } from "../songs/SongFilterFunctions";
import { SlidersHorizontal } from "lucide-react";

export default function PlaylistList({}) {
  const request = ["playlists/", null, "", "GET"];

  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const filterSpecs = useSongFilterSpecs();
  // Looked up by id (rather than stored) so it refreshes whenever the playlists are refetched.
  // That's what keeps a filter playlist current when songs are added, edited or removed.
  const activePlaylist = playlists.find((pl) => pl.id === activePlaylistId) ?? null;
  const [currentSong, setCurrentSong] = useState(null);
  const [prevCurrentSong, setPrevCurrentSong] = useState(null);
  const [currentSongDate, setCurrentSongDate] = useState(null);

  const [update, setUpdate] = useState(0);

  const [settings, setSettings] = useState({
    timeSkip: 5,
  });

  const anom = true;

  useEffect(() => {
    async function allPlaylists() {
      const res = await axiosClient(...request);

      setPlaylists(structuredClone(res || []));
    }

    allPlaylists();
  }, [update]);

  useEffect(() => {
    let date = new Date();

    if (prevCurrentSong) {
      axiosClient(
        `songs/${prevCurrentSong?.id}/add_time_played/`,
        { amount: (date - currentSongDate) / 1000 },
        null,
        "PUT",
        false,
      );
    }

    setCurrentSongDate(new Date());
    setPrevCurrentSong(currentSong);

    setUpdate((prev) => prev + 1);
    document.title =
      currentSong && !anom
        ? `${currentSong.name} | ${activePlaylist?.name} | Corphicient`
        : "Corphicient";
  }, [currentSong]);

  return (
    <div className="flex flex-col flex-wrap justify-center m-20 gap-7">
      <div
        id="playlistButtonBar"
        className="flex flex-row gap-10 justify-center"
      >
        {playlists.map((pl, i) => (
          <button
            onClick={() =>
              changePlaylist(
                pl.id,
                playlists,
                setCurrentSong,
                activePlaylist,
                setActivePlaylistId,
              )
            }
            key={i}
            id={pl.id}
            title={
              isFilterPlaylist(pl)
                ? `Filter playlist: ${describeFilters(filterSpecs, pl.filters).join(", ") || "all songs"}`
                : undefined
            }
            className={`flex flex-row items-center gap-2 border bg-blue-50 p-5 hover:scale-105 hover:cursor-pointer ${pl?.id === activePlaylist?.id ? "bg-yellow-500 border-2 font-bold" : ""}`}
          >
            {isFilterPlaylist(pl) && <SlidersHorizontal size={16} />}
            {pl.name}
          </button>
        ))}
        <PlaylistListSettings
          settings={settings}
          setSettings={setSettings}
          onPlaylistsChanged={() => setUpdate((prev) => prev + 1)}
        />
      </div>

      {activePlaylist && (
        <PlaylistCard
          playlist={activePlaylist}
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          settings={settings}
          setUpdate={setUpdate}
        />
      )}
    </div>
  );
}

function findPlaylist(id, playlists) {
  return playlists.find((pl) => pl.id === id);
}

function changePlaylist(
  id,
  playlists,
  setCurrentSong,
  activePlaylist,
  setActivePlaylistId,
) {
  if (activePlaylist && id == activePlaylist.id) {
    return;
  }
  setCurrentSong(null);
  setActivePlaylistId(findPlaylist(id, playlists)?.id ?? null);
}
