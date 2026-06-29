"use client";

import { PageMain } from "../components/layout/PageMain";
import Section from "../components/notes/section/Section";
import SectionList from "../components/notes/section/SectionList";
import SectionSettings from "../components/notes/section/SectionSettings";

export default function About() {
  return (
    <PageMain>
      <div className="m-20 flex flex-col gap-5 text-center justify-center w-1/3">
        <h1>Notes</h1>
        <p>This will be where I take notes</p>
        <p>Create sections for notes and for each section easily add, modify notes</p>
        <p>Ex: section for 'health' that has when i last took a shot or something</p>
        <p>Ex: section for 'classes' that has info on where all my classes are</p>
        <p>Ex: section for 'passwords' that has all my passwords (OBVIOUSLY DONT UPLOAD THE JSON TO GITHUB LOL)</p>
        <p>allow searching for notes so i can find a password among all my passwords</p>
        <p>this isn't the same as TODO, that's on google calendar because there's dates specifically tied to each todo. this is more of just memory</p>
      
        <SectionList/>
        <Section/>
        <SectionSettings/>
      </div>
    </PageMain>
  );
}
