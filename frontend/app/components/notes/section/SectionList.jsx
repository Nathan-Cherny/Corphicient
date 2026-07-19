"use client";

import axiosClient from "@/app/axiosClient";
import Section from "./Section";
import { useEffect, useState } from "react";

export default function SectionList({}) {
  const [update, setUpdate] = useState(0)
  const request = ["get_sections/", null, "", "GET"];
  const [sections, setSections] = useState([]);

  useEffect(() => {
    async function allSections() {
      const res = await axiosClient(...request);
      setSections(res || []);
    }

    allSections();
  }, [update]);

  return (
    <div className="grid grid-cols-2 gap-5">
      {sections.map((s, i) => (
        <div className="w-full h-full" key={i}>
          <Section setUpdate={setUpdate} section={s}/>
        </div>
      ))}
    </div>
  )
}
