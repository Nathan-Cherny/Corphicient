"use client";

import { useEffect, useState } from "react";
import Note from "./Note";

export default function NoteList({ notes, onMove }) {
  return (
    <div>
      {notes.map((n) => (
        <Note key={n.note.id} note={n.note} order={n.order} onMove={onMove} />
      ))}
    </div>
  );
}
