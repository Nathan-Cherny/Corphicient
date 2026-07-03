"use client";

import Form from "../../forms/Forms";

export default function SectionSettings({}) {
  return (
    <div>
      <Form
        formType="get_section_form/"
        nonFormFields={["secondsPlayed", "src", "duration"]}
        submitFunction={() => {console.log("test")}}
        name={"Add Section"}
      />

      <Form
        formType="get_note_form/"
        nonFormFields={[]}
        submitFunction={() => {console.log("test")}}
        name={"Add Note"}
      />
    </div>
  );
}
