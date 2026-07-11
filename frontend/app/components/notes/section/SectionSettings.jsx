"use client";

import Form from "../../forms/Forms";
import { addSection } from "./SectionFunctions";
import { addNote } from "../notes/NoteFunctions";
import { useState } from "react";
import FadeOverlay from "../../layout/FadeOverlay";
import { useNotification } from "../../layout/notification/NotificationContext";

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
  const notify = useNotification();

  return (
  <div className="p-5 bg-white">
    <Form
      formType="get_section_form/"
      nonFormFields={[]}
      submitFunction={(e) => {addSection(e); notify({message: `Added Section`})}}
      name={"Add Section"}
    />

    <Form
      formType="get_note_form/"
      nonFormFields={[]}
      submitFunction={(e) => {addNote(e); notify({message: `Added Note`})}}
      name={"Add Note"}
    />
  </div>);
}
