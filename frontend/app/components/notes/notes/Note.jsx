"use client";

import { useEffect, useState } from "react";
import * as NoteFns from "./NoteFunctions";
import { useNotification } from "../../layout/notification/NotificationContext";

export default function Note({ note }) {
  const notify = useNotification();

  return (
    <form
      className="bg-white/25 p-5 relative border mt-5"
      id={`${note.id}-form`}
      onClick={(e) => {e.preventDefault(); e.stopPropagation();}}
      onSubmit={(e) => {
        var res = NoteFns.updateNote(e, note.id);
        notify({ message: `Updated Note '${note.name}'` });
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          NoteFns.deleteNote(note.id);
          notify({message: `Deleted Note`})
        }}
        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        X
      </button>

      <input
        name="name"
        className="text-lg mb-1 w-11/12 text-center"
        defaultValue={note.name}
        onKeyDown={(e) => {
          if (e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
      />
      <textarea
        name="note"
        defaultValue={note.note}
        onKeyDown={(e) => {
          if (e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
        className="field-sizing-content w-full border-black border-t  p-5"
      />
    </form>
  );
}
