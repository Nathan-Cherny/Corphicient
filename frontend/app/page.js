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
        <h1>What do I need to do?</h1>
        <p>tasks for today</p>
        <p>deadlines coming up soon</p>
        <p>maybe a fun fact</p>

        {sections.filter(s => s.name == "Today").map((s) => (
          <div className="w-full h-full" key={s.id}>
            <Section setUpdate={setUpdate} section={s} collapse={true} />
          </div>
        ))}
      </div>
    </PageMain>
  );
}
