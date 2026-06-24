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
      <h1>Edit {song.name}</h1>

      <button
        onClick={handleSave}
        className="btn-primary bg-red-200 p-2"
        style={{ cursor: "pointer" }}
      >
        Save changes
      </button>

      <div className="flex flex-row gap-5">
        <label htmlFor="name">Change Name</label>
        <input
          name="name"
          type="text"
          onChange={(e) => setInputName(e.target.value)}
          value={inputName}
        />
      </div>

      <CropSong cropParams={cropParams} setCropParams={setCropParams} />
    </div>
  );
}

function CropSong({ cropParams, setCropParams }) {
  return (
    <div className="flex flex-row gap-5">
      <label htmlFor="name">Crop Song</label>
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
  );
}
