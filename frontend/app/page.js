"use client";

import { useEffect, useState } from "react";
import { PageMain } from "./components/layout/PageMain";
import axiosClient from "./axiosClient";
import Section from "./components/notes/section/Section";
import DayLog from "./components/daylogs/DayLog";
import DayLogForm from "./components/daylogs/DayLogForm";
import DayLogAnalytics from "./components/daylogs/DayLogAnalytics";

export default function Home() {
  const section_request = ["get_sections/", null, "", "GET"];
  const daylog_request = ["get_daylogs/", null, "", "GET"];

  const [sections, setSections] = useState([]);
  const [daylogs, setDaylogs] = useState([]);
  const [dadjoke, setDadJoke] = useState("");
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    async function allSections() {
      const res = await axiosClient(...section_request);
      setSections(res || []);
    }

    allSections();
  }, [update]);

  useEffect(() => {
    async function dadJoke() {
      const res = await fetch("/api/dad-joke");
      if (res.status != 200) {
        setDadJoke("");
        return;
      }

      const joke = (await res.json())["joke"];
      setDadJoke(joke || "");
    }

    dadJoke();
  }, [update]);

  return (
    <PageMain>
      <div className="m-20">
        <div className="flex flex-col justify-center items-center gap-5">
          <h1 className="text-5xl text-center font-light">
            {new Date().toLocaleDateString()}
          </h1>
          <h3>{dadjoke}</h3>
        </div>
        <hr className="mb-10 mt-7.5 w-full" />

        <div className="flex flex-col gap-5">
          <div className="flex flex-row items-stretch gap-15 *:h-full">
            <div className="flex w-full flex-col grow border text-center rounded-2xl bg-blue-500 shadow-2xl p-5">
              <h1 className="text-3xl mb-5">Add Daylog</h1>
              {<DayLogForm />}
            </div>

            {sections
              .filter((s) => s.id == 10)
              .map((s) => (
                <div className="overflow-y-scroll" key={s.id}>
                  <Section
                    className={""}
                    setUpdate={setUpdate}
                    section={s}
                    collapse={true}
                  />
                </div>
              ))}
          </div>

          <div className="flex flex-col border text-center rounded-2xl bg-amber-400 shadow-2xl p-5">
            <h1 className="text-3xl mb-5">Tasks</h1>
            <iframe
              className="w-full"
              src="https://calendar.google.com/calendar/embed?src=natec3632%40gmail.com&ctz=America%2FNew_York&mode=WEEK"
              width="400"
              height="600"
            ></iframe>
          </div>

          <div className="flex flex-col border text-center rounded-2xl w-full bg-purple-400 shadow-2xl p-5">
            <h1 className="text-3xl mb-5">GitHub</h1>
            <iframe
              src="https://jandi.firejune.io/Nathan-Cherny?tz=America/New_York&scheme=light"
              width="100%"
              height="250"
              className="bg-transparent"
            ></iframe>
          </div>

          <h1>Day Log Analytics</h1>

          <DayLogAnalytics  />
        </div>
      </div>
    </PageMain>
  );
}
