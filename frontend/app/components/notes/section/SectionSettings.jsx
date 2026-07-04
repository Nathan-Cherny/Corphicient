"use client";

import Form from "../../forms/Forms";
import { addSection } from "./SectionFunctions";
import { addNote } from "../notes/NoteFunctions";

export default function SectionSettings({}) {
  return (
    <div>
      <Form
        formType="get_section_form/"
        nonFormFields={["secondsPlayed", "src", "duration"]}
        submitFunction={addNote}
        name={"Add Section"}
      />

      <Form
        formType="get_note_form/"
        nonFormFields={[]}
        submitFunction={addSection}
        name={"Add Note"}
      />
    </div>
  );
}
