"use client";

import { useEffect, useState } from "react";
import Note from "./Note";

export default function NoteList({ notes, onMove }) {

  return (<div>
    {notes.map((n, i) => (
        <Note key={i} note={n.note} order={n.order} onMove={onMove}/>
    ))}
  </div>);
}
