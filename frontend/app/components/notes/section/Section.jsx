"use client";

import { useEffect, useState } from "react";
import NoteList from "../notes/NoteList";
import FadeOverlay from "../../layout/FadeOverlay";
import Form from "../../forms/Forms";
import { useNotification } from "../../layout/notification/NotificationContext";
import { addNoteToSection } from "../notes/NoteFunctions";

import * as SectionFns from "./SectionFunctions";

import { Palette, PlusIcon, ChevronDown, ChevronUp } from "lucide-react";

export default function Section({ section, setUpdate }) {
  const [addNoteMenuOpen, setAddNoteMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const notify = useNotification();

  if (!section) section = {};

  return (
    <div
      style={{ backgroundColor: section.color }}
      onClick={(e) => {
        if(!e.ctrlKey) return
        setCollapsed(!collapsed);
      }}
      className={`p-5 shadow-2xl rounded-2xl h-full border relative cursor-pointer`}
    >
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
              setUpdate(prev => prev+1)
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation()
              SectionFns.updateSection(e, section.id);
              setUpdate(prev => prev+1)
            }}
          >
            <h1 className="text-xl">Set Color For Section</h1>
            <div className="flex flex-row gap-5 items-center">
              <input
                name="color"
                defaultValue={section.color}
                className="w-20 h-10"
                type="color"
                onChange={(e) => {
                  document.getElementById("colorLabel").innerHTML =
                    e.target.value;
                }}
              />
              <p id="colorLabel">{section.color}</p>
            </div>
            <input type="submit" value={"Submit"} />
          </form>
        </div>
      </FadeOverlay>
      
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setAddNoteMenuOpen(true);
        }}
        className="absolute top-2 right-2 border border-black bg-blue-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        <PlusIcon />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!confirm(`Delete Section ${section.name}?`)) return;
          SectionFns.deleteSection(section.id);
          setUpdate(prev => prev+1)
          notify({ message: `Deleted Section` });
        }}
        className="absolute top-2 right-10 border border-black bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        X
      </button>

      <button
        onClick={(e) => {
          setColorMenuOpen(true);
          e.stopPropagation()
        }}
        className="absolute top-2 right-18 border border-black bg-green-500 text-white w-6 h-6 p-0.5 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        <Palette />
      </button>

      <button
        onClick={(e) => {
          setCollapsed(!collapsed);
        }}
        className="absolute top-2 right-26 border border-black bg-orange-500 text-white w-6 h-6 p-0.5 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        {collapsed ? <ChevronUp/> : <ChevronDown/>}
      </button>

      <h1 className="text-3xl mb-5">{section.name}</h1>

      {collapsed && <NoteList notes={section.notes}></NoteList>}
    </div>
  );
}
