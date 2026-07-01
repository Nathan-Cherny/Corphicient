"use client";

import { useEffect, useState } from "react";

export default function Section({ section }) {

  console.log(section?.notes[0].name)

  if(!section) section = {}

  return (
    <div>
      <p>{section.name}</p> 
      <p>{section?.notes?.[0].name}</p> 
    </div>
  )
}
