"use client";

import { useEffect, useState } from "react";

export default function Note({ note }) {

  return (
    <div className="bg-black/25 p-5">
        <h1 className="text-lg underline mb-1">{note.name}</h1>
        <p>{note.note}</p>
    </div>
  )
}
