"use client";

import Form from "../../forms/Forms";
import { addSection } from "./SectionFunctions";
import { addNote } from "../notes/NoteFunctions";
import { useState } from "react";
import FadeOverlay from "../../layout/FadeOverlay";

export default function SectionSettings({}) {
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  return (
    <>
      <button
        className="bg-amber-400 px-5 rounded-2xl shadow-2xl border hover:scale-105 transition-all duration-150 cursor-pointer"
        onClick={() => setSettingsMenuOpen(true)}
      >
        Settings
      </button>
      <FadeOverlay
        isOpen={settingsMenuOpen}
        onClose={() => setSettingsMenuOpen(false)}
      >
        <SectionSettingsMenu />
      </FadeOverlay>
    </>
  );
}

function SectionSettingsMenu({}) {
  return (
  <div className="p-5 bg-white">
    <Form
      formType="get_section_form/"
      nonFormFields={["secondsPlayed", "src", "duration"]}
      submitFunction={addSection}
      name={"Add Section"}
    />

    <Form
      formType="get_note_form/"
      nonFormFields={[]}
      submitFunction={addNote}
      name={"Add Note"}
    />
  </div>);
}
