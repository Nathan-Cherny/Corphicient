"use client";

import { useEffect, useState } from "react";

export default function Section({ section }) {

  console.log(section)

  if(!section) section = {}

  return (
    <div>
      <p>{section.name}</p> 
      <p>{section.note}</p> 
    </div>
  )
}
