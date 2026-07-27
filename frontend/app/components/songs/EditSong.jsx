"use client";

import { useState } from "react";
import { useNotification } from "../layout/notification/NotificationContext";

export default function EditSong({ song, onSave }) {
  const notify = useNotification();
  const [inputName, setInputName] = useState(song.name);
  const [cropParams, setCropParams] = useState([null, null]);

  function handleSave() {
    onSave?.(song.id, inputName, cropParams);
    notify({ message: `Edited Song ${inputName}!` });
  }

  return (
    <div className="flex flex-col gap-3 bg-white p-5">
      <div className="flex flex-row justify-center items-center gap-10">
        <h1 className="text-xl text-center">Edit <b>{song.name}</b></h1>
        <button
          onClick={handleSave}
          className="btn-primary bg-red-200 p-2 rounded-4xl shadow-2xl"
          style={{ cursor: "pointer" }}
        >
          Save changes
        </button>

      </div>

      <div className="bg-black/15 w-full p-5">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <label htmlFor="name"><b>Change Name</b></label>
            <input
              name="name"
              type="text"
              onChange={(e) => setInputName(e.target.value)}
              value={inputName}
            />
          </div>

          <CropSong
            cropParams={cropParams}
            setCropParams={setCropParams}
            src={song.src}
          />
        </div>
      </div>


    </div>
  );
}

function CropSong({ cropParams, setCropParams, src }) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="name"><b>Crop Song</b></label>
      <audio className="w-full" src={`http://localhost:8000/${src}`} controls></audio>
      <div className="flex flex-row">
        <input
          name="start"
          placeholder="start"
          type="number"
          onChange={(e) => setCropParams([e.target.value, cropParams[1]])}
        />
        <input
          name="end"
          placeholder="end"
          type="number"
          onChange={(e) => setCropParams([cropParams[0], e.target.value])}
        />
      </div>
    </div>
  );
}
