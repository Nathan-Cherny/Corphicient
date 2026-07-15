"use client";

import { useEffect, useState } from "react";
import NoteList from "../notes/NoteList";
import FadeOverlay from "../../layout/FadeOverlay";
import Form from "../../forms/Forms";
import { useNotification } from "../../layout/notification/NotificationContext";
import { addNoteToSection } from "../notes/NoteFunctions";

import * as SectionFns from "./SectionFunctions";

import { Palette, PlusIcon } from "lucide-react";

export default function Section({ section }) {
  const [addNoteMenuOpen, setAddNoteMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const notify = useNotification();

  if (!section) section = {};

  return (
    <div className="bg-white/50 p-5 h-full border relative">
      <FadeOverlay
        isOpen={addNoteMenuOpen}
        onClose={() => setAddNoteMenuOpen(false)}
      >
        <div className="bg-white p-5">
          <Form
            formType="get_note_form/"
            nonFormFields={[]}
            submitFunction={(e) => {
              addNoteToSection(e, section.id);
              notify({ message: `Added Note` });
            }}
            name={`Add Note To ${section.name}`}
          />
        </div>
      </FadeOverlay>

      <FadeOverlay
        isOpen={colorMenuOpen}
        onClose={() => setColorMenuOpen(false)}
      >
        <div className="bg-white p-5 flex flex-col items-center">
          <h1>Set Color For Section</h1>
          <input defaultValue={"red"} className="w-20 h-10" type="color"/>
          <input type="submit" value={"Submit"} />
        </div>
      </FadeOverlay>

      <button
        onClick={(e) => {
          setAddNoteMenuOpen(true);
        }}
        className="absolute top-2 right-2 bg-blue-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        <PlusIcon />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!confirm("Delete Section?")) return
          SectionFns.deleteSection(section.id);
          notify({ message: `Deleted Section` });
        }}
        className="absolute top-2 right-10 bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        X
      </button>

      <button
        onClick={(e) => {
          setColorMenuOpen(true);
        }}
        className="absolute top-2 right-18 bg-green-500 text-white w-6 h-6 p-0.5 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        <Palette />
      </button>

      <h1 className="text-3xl mb-5">{section.name}</h1>
      <NoteList notes={section.notes}></NoteList>
    </div>
  );
}
