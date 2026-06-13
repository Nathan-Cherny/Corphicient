"use client";

// imports from next

import { useState, useEffect, useRef } from "react";
import SongCard, { playSong } from "./SongCard";
import { getReadableDurationSong } from "../playlists/PlaylistCard";

/**
 * The part of the Playlist that displays Songs. Manages going from song to song and such
 */
export default function SongsList({
  songs,
  currentSong,
  setCurrentSong,
  settings,
}) {
  const currentAudioRef = useRef(null);
  const timeSkip = settings?.timeSkip || 5;
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });

  const playNextSong = () => {
    setCurrentSong((prev) => {
      const otherSongs = songs.filter((s) => s.id != currentSong.id);
      if (otherSongs.length == 0) return;
      return getRandomSong(otherSongs);
    });
  };

  const getRandomSong = (otherSongs) => {
    return otherSongs[Math.floor(Math.random() * otherSongs.length)];
  };

  useEffect(() => {
    const audio = currentAudioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress({
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      });
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);

    // initialize immediately in case metadata already loaded
    updateProgress();

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [currentAudioRef.current, currentSong]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!currentSong) return;
      switch (e.key) {
        case "s":
          playNextSong();
          break;
        case "0":
          currentAudioRef.current.currentTime = 0;
          break;
        case "ArrowRight":
          currentAudioRef.current.currentTime += 5;
          break;
        case "ArrowLeft":
          currentAudioRef.current.currentTime -= 5;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSong, getRandomSong]);

  return (
    <div className="flex flex-wrap flex-col justify-center gap-7 ">
      <CurrentSongProgressBar
        currentAudioRef={currentAudioRef}
        progress={progress}
        currentSong={currentSong}
      />
      <div className="flex flex-row flex-wrap justify-center gap-5">
        {songs.map((song, i) => (
          <SongCard
            key={i}
            song={song}
            isCurrentSong={currentSong?.id == song.id}
            setCurrentSong={setCurrentSong}
            onSongEnd={playNextSong}
            onAudioRef={(ref) => {
              currentAudioRef.current = ref;
            }} // this allows the currentAudioRef to change if a new song becomes currentSong
          />
        ))}
      </div>
    </div>
  );
}

function CurrentSongProgressBar({ currentAudioRef, progress, currentSong }) {

  return (
    <div>
      <div className="flex flex-row gap-5">
        <h1>Playing <b>{currentSong?.name || "N/A"}</b></h1>
        <h1>{getReadableDurationSong(progress.currentTime, "small")} / {getReadableDurationSong(progress.duration, "small")}</h1>
      </div>
      <div
        className="w-full h-2 rounded-full bg-gray-700 cursor-pointer relative overflow-hidden"
        onClick={(e) => {
          if (!currentAudioRef.current || !progress.duration) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = clickX / rect.width;
          currentAudioRef.current.currentTime = ratio * progress.duration;
        }}
      >
        <div
          className="h-full bg-linear-to-r from-green-500 via-teal-500 to-blue-500"
          style={{
            width: `${progress.duration ? (progress.currentTime / progress.duration) * 100 : 0}%`,
          }}
        />
      </div>
    </div>
  );
}
