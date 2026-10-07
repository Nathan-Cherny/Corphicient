"use client";

import { useState } from "react";
import { useNotification } from "../layout/notification/NotificationContext";
import { API_BASE_URL } from "@/app/lib/config";
import ColorSelect from "../visual/selectColor";

export default function EditSong({ song, onSave }) {
  const notify = useNotification();

  async function createFileFromUrl(url, filename) {
    const response = await fetch(url);
    const dataBlob = await response.blob();
    const contentType = response.headers.get("content-type") || "";
    return new File([dataBlob], filename, { type: contentType });
  }

  async function handleSave(e) {
    e.preventDefault();
    let formData = new FormData(e.currentTarget);

    const thumbnailFile = formData.get("thumbnail");

    if (thumbnailFile.size === 0) {
      try {
        const file = await createFileFromUrl(
          `${API_BASE_URL}${song.thumbnail}`,
          `${song.thumbnail}`,
        );
        formData.set("thumbnail", file);
      } catch (error) {
        console.log(`error: ${error}`);
      }
    }

    onSave?.(song.id, formData);
    notify({ message: `Edited Song!` });
  }

  return (
    <form
      className="flex flex-col gap-3 bg-white p-5 max-h-150 overflow-y-scroll"
      onSubmit={(e) => handleSave(e)}
      encType="multipart/form-data"
    >
      <div className="flex flex-row justify-center items-center gap-10">
        <h1 className="text-xl text-center">
          Edit <b>{song.name}</b>
        </h1>
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
            <label htmlFor="name">
              <b>Change Name</b>
            </label>
            <input name="name" type="text" defaultValue={song.name} />
          </div>

          <CropSong song={song} src={song.src} />

          <div className="flex flex-col gap-3">
            <label htmlFor="name">
              <b>Change Picture</b>
            </label>
            <img
              className="w-15 h-15"
              src={`${API_BASE_URL}${song.thumbnail}`}
            />
            <input name="thumbnail" type="file" />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="name">
              <b>Change Color</b>
            </label>
            <ColorSelect defaultColor={`rgb(${song.color})`} />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="name">
              <b>Change Album</b>
            </label>
            <input name="album" type="text" defaultValue={song?.album || "N/A"} />
          </div>
        </div>
      </div>
    </form>
  );
}

function CropSong({ song, src }) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="name">
        <b>Crop Song</b>
      </label>
      <audio
        className="w-full"
        src={`${API_BASE_URL}/${src}`}
        controls
      ></audio>
      <div className="flex flex-row">
        <input name="start" placeholder="start" type="number" />
        <input name="end" placeholder="end" type="number" />
      </div>
    </div>
  );
}
