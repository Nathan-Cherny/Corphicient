"use client";

export default function EditSong({song}) {
  return (
    <div className="flex flex-col gap-3 bg-white p-5">
      <h1>Edit {song.name}</h1>
    </div>
  );
}
