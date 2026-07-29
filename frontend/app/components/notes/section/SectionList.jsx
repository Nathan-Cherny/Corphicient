"use client";

import axiosClient from "@/app/axiosClient";
import Section from "./Section";
import { useEffect, useState } from "react";
import SectionSettings from "./SectionSettings";

export default function SectionList({}) {
  const [update, setUpdate] = useState(0);
  const request = ["get_sections/", null, "", "GET"];
  const [sections, setSections] = useState([]);
  const [allCollapse, setAllCollapse] = useState(null);

  useEffect(() => {
    async function allSections() {
      const res = await axiosClient(...request);
      setSections(res || []);
    }

    allSections();
  }, [update]);

  return (
    <div>
      <div className="flex flex-row justify-center items-center *:m-5 *:py-2">
        <button
          onClick={() => setAllCollapse(false)}
          className="px-5 bg-red-500/25 shadow-2xl rounded-2xl cursor-pointer border-red-500 border"
        >
          Collapse All
        </button>
        <button
          onClick={() => setAllCollapse(true)}
          className="px-5 bg-blue-500/25 shadow-2xl rounded-2xl cursor-pointer border-blue-500 border"
        >
          Expand All
        </button>
        <SectionSettings className="py-2"/>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {sections.map((s) => (
          <div className="w-full h-full" key={s.id}>
            <Section setUpdate={setUpdate} section={s} collapse={allCollapse} />
          </div>
        ))}
      </div>
    </div>
  );
}
