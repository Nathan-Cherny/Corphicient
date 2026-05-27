"use client";

import axiosClient from "@/app/axiosClient";
import { useState, useEffect } from "react";
import { addSong } from "../songs/SongFunctions";

export default function Form({ formType }) {
  const [form_data, setFormData] = useState({});

  useEffect(() => {
    async function getForm() {
      let data = await axiosClient(formType, {}, null, "GET");
      setFormData(data || {});
    }

    getForm();
  }, [formType]);

  if (!form_data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col border p-5">
      <form onSubmit={(e) => addSong(e)}>
        {form_data.fields?.map((field) => {
          return (
            <div key={field.name} className="p-2 m-2">
              {parseField(field)}
            </div>
          );
        })}
        <input type="submit" value={"Submit"} />
      </form>
    </div>
  );
}

function parseField(field) {
  const nonFormFields = [
    "secondsPlayed"
  ]

  if (nonFormFields.includes(field.name)){return}

  switch (field.type) {
    case "CharField":
      var type = "text";
      break;
    case "IntegerField":
      var type = "number"
      break;
  }

  return (
    <>
      <label htmlFor={field.name}>{field.name}</label>
      <input
        required={field.required}
        className="border mx-5"
        id={field.name}
        type={type}
        name={field.name}
      />
    </>
  );
}
