"use client";

// imports from next

import { useState, useEffect, useRef } from "react";
import SongCard, { playSong } from "./SongCard";

/**
 * The part of the Playlist that displays Songs. Manages going from song to song and such
 */
export default function SongsList({ songs, currentSong, setCurrentSong, settings }) {
  const currentAudioRef = useRef(null)
  const timeSkip = settings?.timeSkip || 5

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
    const handleKeyDown = (e) => {
      if (!currentSong) return;
      switch (e.key){
        case "s":
          playNextSong()
          break
        case "0":
          currentAudioRef.current.currentTime = 0
          break
        case "ArrowRight":
          currentAudioRef.current.currentTime += 5;
          break
        case "ArrowLeft":
          currentAudioRef.current.currentTime -= 5;
          break
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSong, getRandomSong]);

  return (
    <div className="flex flex-wrap flex-col justify-center m-20 gap-7">
      <p>
        <i>Total Duration</i>: {getTotalDuration(songs)}
      </p>
      <div className="flex flex-row flex-wrap justify-center gap-5">
        {songs.map((song, i) => (
            <SongCard
              key={i}
              song={song}
              isCurrentSong={currentSong?.id == song.id}
              setCurrentSong={setCurrentSong}
              onSongEnd={playNextSong}
              onAudioRef={(ref) => { currentAudioRef.current = ref; }} // this allows the currentAudioRef to change if a new song becomes currentSong
            />
        ))}
      </div>
    </div>
  );
}

function getTotalDuration(songs){
  let totalSeconds = songs.map((song) => song.duration).reduce((acc, current) => acc + current, 0)
  let timeData = convertSeconds(totalSeconds)
  return `${timeData["hours"]} hours, ${timeData["minutes"]} minutes, ${timeData["seconds"]} seconds`
}

// this looks familar...
function convertSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  const seconds = Math.floor(totalSeconds % 60);

  return { hours, minutes, seconds };
}