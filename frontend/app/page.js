"use client";

import { useEffect, useState } from "react";
import { PageMain } from "./components/layout/PageMain";
import axiosClient from "./axiosClient";
import Section from "./components/notes/section/Section";

export default function Home() {
  const request = ["get_sections/", null, "", "GET"];
  const [sections, setSections] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    async function allSections() {
      const res = await axiosClient(...request);
      setSections(res || []);
    }

    allSections();
  }, [update]);

  return (
    <PageMain>
      <div className="m-20">
        <h1 className="text-5xl text-center font-light">{new Date().toLocaleDateString()}</h1>
        <hr className="my-10 w-full"/>
        
        <div className="flex flex-row items-stretch gap-15 *:h-full">
          {sections.filter(s => s.name == "Today").map((s) => (
            <div className="w-full h-full" key={s.id}>
              <Section setUpdate={setUpdate} section={s} collapse={true} />
            </div>
          ))}

          <div className="flex flex-col border text-center rounded-2xl bg-amber-400 shadow-2xl p-5">
            <h1 className="text-3xl mb-5">Deadlines</h1>
            <div className="border h-full">
            </div>
          </div>

          <div className="flex flex-col border text-center rounded-2xl bg-amber-400 shadow-2xl p-5 w-fit">
            <h1 className="text-3xl mb-5">Tasks</h1>
            <iframe src="https://calendar.google.com/calendar/embed?src=natec3632%40gmail.com&ctz=America%2FNew_York&mode=AGENDA" width="400" height="600"></iframe>
          </div>
        </div>


      </div>
    </PageMain>
  );
}
