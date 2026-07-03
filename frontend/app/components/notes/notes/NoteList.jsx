"use client";

import { useEffect, useState } from "react";
import Note from "./Note";

export default function NoteList({ notes }) {
  console.log(notes);

  return (<div>
    {notes.map((n, i) => (
        <Note key={i} note={n}/>
    ))}
  </div>);
}
