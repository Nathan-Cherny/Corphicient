"use client";

// imports from next

import { useState, useEffect, useRef } from "react";
import SongCard, { playSong } from "./SongCard";
import * as Song from "./SongFunctions";
import { getReadableDurationSong } from "../playlists/PlaylistCard";
import { useNotification } from "../layout/notification/NotificationContext";
import FadeOverlay from "../layout/FadeOverlay";
import EditSong from "./EditSong";

import {
  Pause,
  Play,
  Repeat,
  RepeatOff,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  SkipBack,
} from "lucide-react";

/**
 * The part of the Playlist that displays Songs. Manages going from song to song and such
 */
export default function SongsList({
  songs,
  currentSong,
  setCurrentSong,
  settings,
  setUpdate,
}) {
  const currentAudioRef = useRef(null);
  const timeSkip = settings?.timeSkip || 5;
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });
  const notify = useNotification();

  const [songToEdit, setSongToEdit] = useState(null);

  // helper functions

  function togglePause(audio, notify) {
    if (!audio) {
      notify({ message: "Hey, silly, there's no song to play or resume!!" });
      return;
    }
    if (audio.paused) audio.play();
    else audio.pause();
  }

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

  const hotkeysMap = {
    s: (e, audio) => {
      if(!audio) return
      playNextSong();
    },
    0: (e, audio) => {
      if(!audio) return
      audio.currentTime = 0;
    },
    ArrowRight: (e, audio) => {
      if(!audio) return
      audio.currentTime += timeSkip;
    },
    ArrowLeft: (e, audio) => {
      if(!audio) return
      audio.currentTime -= timeSkip;
    },
    l: (e, audio) => {
      if(!audio) return
      if (audio.loop) audio.loop = false;
      else audio.loop = true;
    },
    " ": (e, audio) => {
      if(!audio) return
      e.preventDefault();
      togglePause(audio, notify);
    },
  };

  // use effects

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
      let audio = currentAudioRef.current;
      let key = e.key;

      if (key in hotkeysMap) hotkeysMap[key](e, audio);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSong, getRandomSong]);

  return (
    <div className="flex flex-wrap flex-col justify-center gap-7 ">
      <FadeOverlay isOpen={songToEdit} onClose={() => setSongToEdit(null)}>
        <EditSong
          song={songToEdit}
          onSave={async (id, formData) => {
            await Song.patchSong(id, formData);
          }}
        />
      </FadeOverlay>

      <CurrentSongInfo
        currentAudioRef={currentAudioRef}
        progress={progress}
        currentSong={currentSong}
        notify={notify}
        hotkeysMap={hotkeysMap}
      />
      <div className="grid grid-cols-5 gap-5">
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
            setSongToEdit={setSongToEdit}
          />
        ))}
      </div>
    </div>
  );
}

function CurrentSongInfo({
  currentAudioRef,
  progress,
  currentSong,
  notify,
  hotkeysMap,
}) {
  if (!currentSong) progress = { currentTime: 0, duration: 0 };
  return (
    <div>
      {/* Current Song Info */}
      <div className={`flex flex-row justify-around items-stretch mb-5 *:text-center`}>
        <div className={`${currentSong ? "bg-linear-to-r rounded-xl from-orange-500  via-green-500 to-purple-500 p-1" : "p-1"}`}>
          <img
            onClick={(e) => hotkeysMap[" "](e, currentAudioRef.current)}
            className={`w-150 h-100 p-1 bg-gray-600 object-contain border-black border shadow-2xl rounded-xl cursor-pointer`}
            src={
              currentSong?.thumbnail
                ? `http://localhost:8000${currentSong?.thumbnail}`
                : `http://localhost:8000/media/thumbnail/corphishbop.jpg`
            }
          />
        </div>
        <div className="flex flex-col gap-5 justify-evenly items-center w-100">
          <h1 className="text-3xl">
            Playing <b style={{color: currentSong ? `rgb(${currentSong?.color.split(",").map(c => parseInt(c) - 75).join(",")})` : "black"}}>{currentSong?.name || "N/A"}</b>
          </h1>
          <div className="flex flex-col gap-15 items-center">
            <HotKeyButtons hotkeysMap={hotkeysMap} currentAudioRef={currentAudioRef} />
            <h1>
              Total Time Played:{" "}
              {getReadableDurationSong(currentSong?.secondsPlayed || 0)}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <p>{getReadableDurationSong(progress.currentTime, "small")}</p>
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
        <p>{getReadableDurationSong(progress.duration, "small")}</p>
      </div>
    </div>
  );
}

function HotKeyButtons({hotkeysMap, currentAudioRef}) {
  return <div className="flex flex-row gap-5 *:hover:scale-105 *:border *:p-1 *:rounded-xl *:bg-white/20 *:active:scale-95 *:select-none">
    <h1
      className="cursor-pointer"
      title="Toggle Playing"
      onClick={(e) => hotkeysMap[" "](e, currentAudioRef.current)}
    >
      {currentAudioRef?.current?.paused ? (
        <Play />
      ) : (
        <Pause />
      )}
    </h1>

    <h1
      className="cursor-pointer"
      title="Toggle Loop"
      onClick={(e) => {
        e.preventDefault()
        hotkeysMap["l"](e, currentAudioRef.current);
      } }
    >
      {currentAudioRef?.current?.loop ? <Repeat /> : <RepeatOff />}
    </h1>

    <h1
      className="cursor-pointer"
      title="Start From Beginning"
      onClick={(e) => {
        e.preventDefault()
        hotkeysMap[0](e, currentAudioRef.current);
      } }
    >
      <SkipBack />
    </h1>

    <h1
      className="cursor-pointer"
      title="Play Next Song"
      onClick={(e) => {
        e.preventDefault()
        hotkeysMap["s"](e, currentAudioRef.current);
      } }
    >
      <SkipForward />
    </h1>

    <h1
      className="cursor-pointer"
      title="Skip Backward"
      onClick={(e) => {
        e.preventDefault()
        hotkeysMap["ArrowLeft"](e, currentAudioRef.current);
      } }
    >
      <ArrowLeft />
    </h1>

    <h1
      className="cursor-pointer"
      title="Skip Forward"
      onClick={(e) => {
        e.preventDefault()
        hotkeysMap["ArrowRight"](e, currentAudioRef.current);
      } }
    >
      <ArrowRight />
    </h1>
  </div>;
}

