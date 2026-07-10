"use client";

import { useEffect, useState } from "react";
import * as NoteFns from "./NoteFunctions";

export default function Note({ note }) {

  return (
    <div className="bg-black/25 p-5 relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          NoteFns.deleteNote(note.id);
        }}
        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        X
      </button>
      
        <h1 className="text-lg underline mb-1">{note.name}</h1>
        <p className="whitespace-pre-line">{note.note}</p>
    </div>
  )
}
