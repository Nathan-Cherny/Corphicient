"use client";

import Form from "../../forms/Forms";

export default function SectionSettings({}) {
  return (
    <div>
      <Form
        formType="get_section_form/"
        nonFormFields={["secondsPlayed", "src", "duration"]}
        submitFunction={() => {console.log("test")}}
        name={"Add Song"}
      />
    </div>
  );
}
