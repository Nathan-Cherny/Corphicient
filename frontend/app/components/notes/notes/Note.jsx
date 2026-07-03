"use client";

import { useEffect, useState } from "react";

export default function Note({ note }) {

  return (
    <div className="border">
        <p>{note.name}</p>
        <p>{note.note}</p>
    </div>
  )
}
