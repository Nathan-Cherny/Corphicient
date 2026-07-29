"use client";

import { PageMain } from "../components/layout/PageMain";
import Section from "../components/notes/section/Section";
import SectionList from "../components/notes/section/SectionList";
import SectionSettings from "../components/notes/section/SectionSettings";

export default function About() {
  return (
    <PageMain>
      <div className="m-20 flex flex-col gap-5 text-center justify-center w-full">
      
        <div className="flex flex-row justify-center gap-5">
          <h1 className="text-6xl">Notes</h1>
        </div>
      
        <SectionList/>
      </div>
    </PageMain>
  );
}
