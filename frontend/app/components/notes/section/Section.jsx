"use client";

import { useEffect, useState } from "react";
import NoteList from "../notes/NoteList";
import FadeOverlay from "../../layout/FadeOverlay";
import Form from "../../forms/Forms";
import { useNotification } from "../../layout/notification/NotificationContext";
import { addNoteToSection } from "../notes/NoteFunctions";

import * as SectionFns from "./SectionFunctions";

import { PlusIcon } from "lucide-react";

export default function Section({ section }) {
  const [addNoteMenuOpen, setAddNoteMenuOpen] = useState(false);
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

      <h1 className="text-3xl mb-5">{section.name}</h1>
      <NoteList notes={section.notes}></NoteList>
    </div>
  );
}
