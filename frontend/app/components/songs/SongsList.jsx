"use client";

// imports from next

import { useState, useEffect, useRef } from "react";
import SongCard, { playSong } from "./SongCard";
import * as Song from "./SongFunctions";
import { getReadableDurationSong } from "../playlists/PlaylistCard";
import { useNotification } from "../layout/notification/NotificationContext";
import FadeOverlay from "../layout/FadeOverlay";
import EditSong from "./EditSong";
import AudioVisualizer from "./AudioVisualizer";

import { API_BASE_URL } from "@/app/lib/config";

import {
  Pause,
  Edit,
  Play,
  Repeat,
  RepeatOff,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  SkipBack,
  XCircle
} from "lucide-react";
import { mapSongColorToLowerTint } from "../visual/colors";

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
    // current song isn't defined here
    setCurrentSong((prev) => {
      const otherSongs = songs.filter((s) => s.id !== prev.id);
      if (otherSongs.length == 0) return;
      return getRandomSong(otherSongs);
    });
  };

  const getRandomSong = (otherSongs) => {
    return otherSongs[Math.floor(Math.random() * otherSongs.length)];
  };

  const hotkeysMap = {
    s: (e, audio) => {
      if (!audio) return;
      playNextSong();
    },
    0: (e, audio) => {
      if (!audio) return;
      audio.currentTime = 0;
    },
    ArrowRight: (e, audio) => {
      if (!audio) return;
      audio.currentTime += timeSkip;
    },
    ArrowLeft: (e, audio) => {
      if (!audio) return;
      audio.currentTime -= timeSkip;
    },
    l: (e, audio) => {
      if (!audio) return;
      if (audio.loop) audio.loop = false;
      else audio.loop = true;
    },
    x: (e, audio) => {
      setCurrentSong(null)
    },
    " ": (e, audio) => {
      if (!audio) return;
      e.preventDefault();
      togglePause(audio, notify);
    },
  };

  // use effects

  useEffect(() => {
    const audio = currentAudioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const duration = audio.duration;
      const position = audio.currentTime;

      // Update your React progress bar
      setProgress({
        currentTime: position,
        duration: Number.isFinite(duration) ? duration : 0,
      });

      // Update the OS/browser Media Session
      if (
        "mediaSession" in navigator &&
        "setPositionState" in navigator.mediaSession &&
        Number.isFinite(duration) &&
        duration > 0 &&
        Number.isFinite(position)
      ) {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate: audio.playbackRate,
          position: Math.min(position, duration),
        });
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("durationchange", updateProgress);
    audio.addEventListener("seeked", updateProgress);
    audio.addEventListener("ratechange", updateProgress);

    if (currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.name,
        album: currentSong.album,
        artwork: [
          {
            src:
              API_BASE_URL +
              (currentSong.thumbnail ||
                "/media/thumbnail/corphishbop.jpg"),
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      });
    }

    // Initialize immediately if metadata is already available
    updateProgress();

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("durationchange", updateProgress);
      audio.removeEventListener("seeked", updateProgress);
      audio.removeEventListener("ratechange", updateProgress);
    };
  }, [currentSong]);

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

  useEffect(() => {
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      const audio = currentAudioRef.current;
      if (!audio || details.seekTime == null) return;

      audio.currentTime = details.seekTime;
    });

    navigator.mediaSession.setActionHandler("previoustrack", (e) => {
      hotkeysMap["0"](e, currentAudioRef.current);
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      playNextSong();
    });

    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      hotkeysMap["ArrowLeft"](e, currentAudioRef.current)
    });

    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      hotkeysMap["ArrowRight"](e, currentAudioRef.current)
    });
  }, []);

  const songAlbums = ["All", ...Array.from(new Set(songs.map(song => song.album).filter(s => !!s)))]

  return (
    <div className="flex flex-wrap flex-col justify-center gap-0">
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
        setProgress={setProgress}
        setSongToEdit={setSongToEdit}
      />

      <div className="flex flex-col gap-5 border bg-black/20 rounded-xl shadow-x mt-5">
        <div className="mt-5 text-center bg-white/50 mx-5 p-5 rounded-xl border">
          <label htmlFor="albumFilter">Album</label>
          <select onClick={(e) => {
            let album = e.target.value
            
          }}>
            {songAlbums.map(sa => 
              <option key={sa} className="text-center" value={sa}>{sa}</option>
            )}
          </select>
        </div>
        <div className="grid grid-cols-5 gap-5 p-5">
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
    </div>
  );
}

function CurrentSongInfo({
  currentAudioRef,
  progress,
  currentSong,
  notify,
  hotkeysMap,
  setProgress,
  setSongToEdit
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const displayTime = isDragging
    ? dragProgress * progress.duration
    : progress.currentTime;

  // Calculate width percentage
  const displayPercentage = progress.duration
    ? (displayTime / progress.duration) * 100
    : 0;

  const dragProgressRef = useRef(0);
  const progressBarRef = useRef(null);

  const updateScrubPosition = (e) => {
    if (!progressBarRef.current) return 0;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    const ratio = Math.max(0, Math.min(1, clickX / rect.width));

    // Keep both the UI state and an immediately-readable value
    dragProgressRef.current = ratio;
    setDragProgress(ratio);

    return ratio;
  };

  const handlePointerDown = (e) => {
    if (!progress.duration) return;

    setIsDragging(true);

    e.currentTarget.setPointerCapture(e.pointerId);

    updateScrubPosition(e);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !progress.duration) return;

    updateScrubPosition(e);
  };

  const handlePointerUp = (e) => {
    if (!isDragging || !progress.duration || !currentAudioRef.current) {
      return;
    }

    // Read the latest position directly from the ref
    const ratio = dragProgressRef.current;
    const newTime = ratio * progress.duration;

    // Immediately synchronize React's progress state
    setProgress({
      currentTime: newTime,
      duration: progress.duration,
    });

    // Seek the actual audio
    currentAudioRef.current.currentTime = newTime;

    // Now switch back from dragProgress to progress.currentTime
    setIsDragging(false);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  if (!currentSong) progress = { currentTime: 0, duration: 0 };
  const color = mapSongColorToLowerTint(currentSong)

  return (
    <div
      className="bg-black/20 p-5 rounded-xl shadow-lg border-2"
      style={{ borderColor: color }}
    >
      <div
        className={`flex flex-row justify-between items-stretch mb-5 *:text-center p-5`}
      >
        <div className="flex items-stretch">
          <div
            className={`p-1 rounded-xl hover:scale-101`}
            style={{
              backgroundColor: color
            }}
          >
            <img
              onClick={(e) => hotkeysMap[" "](e, currentAudioRef.current)}
              className={`w-120 h-100 bg-gray-600 object-contain border-black border p-1 shadow-2xl rounded-xl cursor-pointer`}
              src={
                currentSong?.thumbnail
                  ? `${API_BASE_URL}${currentSong?.thumbnail}`
                  : `${API_BASE_URL}/media/thumbnail/corphishbop.jpg`
              }
            />
          </div>
          <AudioVisualizer
            currentAudioRef={currentAudioRef}
            currentSong={currentSong}
          />
        </div>
        <div
          className="flex relative border rounded-xl shadow-lg flex-col justify-evenly items-center w-100"
          style={{ backgroundColor: mapSongColorToLowerTint(currentSong, 150, 0.1) }}
        >
          <h1 className="text-4xl">
            <b
              style={{
                color: color,
                WebkitTextStrokeWidth: "1px",
                WebkitTextStrokeColor: mapSongColorToLowerTint(currentSong, -50, 1)
              }}
            >
              {currentSong?.name || "N/A"}
            </b>
          </h1>

          {currentSong && <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="absolute top-1 right-1 text-black w-4 h-4 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
          >
            <Edit size={24} onClick={() => setSongToEdit(currentSong)} />
          </button>}

          <div className="flex flex-col gap-5 items-center px-3">
            <HotKeyButtons
              hotkeysMap={hotkeysMap}
              currentAudioRef={currentAudioRef}
            />
            <div className="flex flex-col gap-2 border-t-2 w-full pt-5 [&>h3]:flex [&>h3]:flex-row [&>h3]:justify-between">
              <h3 className="">
                <b>Total Time Played</b> <p>{getReadableDurationSong(currentSong?.secondsPlayed || 0, "small")}</p>
              </h3>
              <h3>
                <b>Date Added</b><p>{currentSong?.date_created ? new Date(currentSong.date_created).toLocaleString() : "N/A"}</p>
              </h3>
              <h3>
                <b>Album</b> <p>{currentSong?.album || "N/A"}</p>
              </h3>

            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <p className="select-none">{getReadableDurationSong(displayTime, "small")}</p>

        <div
          ref={progressBarRef}
          // Added touch-none to prevent page scrolling on mobile while scrubbing
          className="w-full h-2 rounded-full bg-gray-700 cursor-pointer relative overflow-hidden touch-none border"

          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp} // Failsafe if the browser interrupts the drag
        >
          <div
            className="h-full border-gray-300 border rounded-xl"
            style={{
              width: `${displayPercentage}%`,
              backgroundColor: mapSongColorToLowerTint(currentSong, Math.trunc(displayPercentage), 1)
            }}
          />
        </div>

        <p className="select-none">{getReadableDurationSong(progress.duration, "small")}</p>
      </div>
    </div >
  );
}

function HotKeyButtons({ hotkeysMap, currentAudioRef }) {
  const iconSize = 16
  return (
    <div className="flex flex-row gap-5 content-center flex-wrap bg-black/10 p-5 rounded-xl *:hover:scale-105 *:border *:p-1 *:rounded-xl *:bg-white/20 *:active:scale-95 *:select-none">
      <h1
        className="cursor-pointer"
        title="Toggle Playing"
        onClick={(e) => hotkeysMap[" "](e, currentAudioRef.current)}
      >
        {currentAudioRef?.current?.paused ? <Play size={iconSize} /> : <Pause size={iconSize} />}
      </h1>

      <h1
        className="cursor-pointer"
        title="Toggle Loop"
        onClick={(e) => {
          e.preventDefault();
          hotkeysMap["l"](e, currentAudioRef.current);
        }}
      >
        {currentAudioRef?.current?.loop ? <Repeat size={iconSize} /> : <RepeatOff size={iconSize} />}
      </h1>

      <h1
        className="cursor-pointer"
        title="Start From Beginning"
        onClick={(e) => {
          e.preventDefault();
          hotkeysMap[0](e, currentAudioRef.current);
        }}
      >
        <SkipBack size={iconSize} />
      </h1>

      <h1
        className="cursor-pointer"
        title="Play Next Song"
        onClick={(e) => {
          e.preventDefault();
          hotkeysMap["s"](e, currentAudioRef.current);
        }}
      >
        <SkipForward size={iconSize} />
      </h1>

      <h1
        className="cursor-pointer"
        title="Skip Backward"
        onClick={(e) => {
          e.preventDefault();
          hotkeysMap["ArrowLeft"](e, currentAudioRef.current);
        }}
      >
        <ArrowLeft size={iconSize} />
      </h1>

      <h1
        className="cursor-pointer"
        title="Skip Forward"
        onClick={(e) => {
          e.preventDefault();
          hotkeysMap["ArrowRight"](e, currentAudioRef.current);
        }}
      >
        <ArrowRight size={iconSize} />
      </h1>

      <h1
        className="cursor-pointer"
        title="Remove Current Song"
        onClick={(e) => {
          e.preventDefault();
          hotkeysMap["x"](e, currentAudioRef.current);
        }}
      >
        <XCircle size={iconSize} />
      </h1>
    </div>
  );
}
