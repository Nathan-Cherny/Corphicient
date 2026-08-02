"use client";

import { useState } from "react";
import { useNotification } from "../layout/notification/NotificationContext";

export default function EditSong({ song, onSave }) {
  const notify = useNotification();

  function handleSave(e) {
    e.preventDefault()
    let formData = new FormData(e.currentTarget)
    const plainObject = Object.fromEntries(formData.entries());
    console.log(plainObject)
    return
    onSave?.(song.id, inputName, cropParams);
    notify({ message: `Edited Song ${inputName}!` });
  }

  return (
    <form className="flex flex-col gap-3 bg-white p-5" onSubmit={(e) => handleSave(e)}>
      <div className="flex flex-row justify-center items-center gap-10">
        <h1 className="text-xl text-center">Edit <b>{song.name}</b></h1>
        <input
          className="btn-primary bg-red-200 p-2 rounded-4xl shadow-2xl"
          style={{ cursor: "pointer" }}
          type="submit"
          value={"Save Changes"}
        />

      </div>

      <div className="bg-black/15 w-full p-5">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <label htmlFor="name"><b>Change Name</b></label>
            <input
              name="name"
              type="text"
              defaultValue={song.name}
            />
          </div>

          <CropSong
            song={song}
            src={song.src}
          />

          <div className="flex flex-col gap-3">
            <label htmlFor="name"><b>Change Picture</b></label>
            <img className="w-15 h-15" src={`http://localhost:8000${song.thumbnail}`}/>
            <input
              name="thumbnail"
              type="file"
            />
          </div>

        </div>
      </div>


    </form>
  );
}

function CropSong({song, src }) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="name"><b>Crop Song</b></label>
      <audio className="w-full" src={`http://localhost:8000/${src}`} controls></audio>
      <div className="flex flex-row">
        <input
          name="start"
          placeholder="start"
          type="number"
        />
        <input
          name="end"
          placeholder="end"
          type="number"
        />
      </div>
    </div>
  );
}
