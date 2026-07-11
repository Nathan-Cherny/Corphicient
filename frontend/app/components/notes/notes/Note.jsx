"use client";

import { useEffect, useState } from "react";
import * as NoteFns from "./NoteFunctions";

export default function Note({ note }) {
  return (
    <form className="bg-black/25 p-5 relative" id={`${note.id}-form`} onSubmit={(e) => {
      NoteFns.updateNote(e, note.id)
    }}>
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
      <textarea
        name="note"
        defaultValue={note.note}
        onKeyDown={(e) => {
          if(e.key == "Enter" && !e.shiftKey){
            e.preventDefault()
            e.currentTarget.form?.requestSubmit()
          }
        }}
        className="field-sizing-content w-full bg-black/5 p-5"
      />
    </form>
  );
}
