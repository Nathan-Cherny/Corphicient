"use client";

import { useEffect, useState } from "react";
import NoteList from "../notes/NoteList";

export default function Section({ section }) {

  if(!section) section = {}

  return (
    <div className="bg-white/50 p-5">
      <h1 className="text-3xl mb-5">{section.name}</h1> 
      <NoteList notes={section.notes}></NoteList>
    </div>
  )
}
