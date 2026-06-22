"use client";

import axiosClient from "@/app/axiosClient";
import { useState, useEffect } from "react";
import EditPlaylist from "../playlists/EditPlaylist";
import SongSelect from "../songs/SongSelect";

export default function Form({
  formType,
  nonFormFields = [],
  submitFunction,
  name,
  children,
}) {
  const [form_data, setFormData] = useState({});

  // get the form data
  useEffect(() => {
    async function getForm() {
      let data = await axiosClient(formType, {}, null, "GET");
      data.fields = data.fields?.filter(
        (field) => !nonFormFields.includes(field.name),
      );
      setFormData(data || {});
    }

    getForm();
  }, [formType]);

  if (!form_data) {
    return <div>Loading...</div>;
  }

  // go thru each form_data field and add that
  return (
    <div className="flex flex-col border p-5">
      <h1 className="text-center text-xl">{name}</h1>
      <form
        onSubmit={(e) => submitFunction(e)}
        className="flex items-center flex-col"
      >
        {form_data.fields?.map((field) => {
          return (
            <>
              <div key={field.name} className="p-2 m-2">
                {parseField(field)}
              </div>
            </>
          );
        })}
        {children}
        <input type="submit" value={"Submit"} />
      </form>
    </div>
  );
}

function parseField(field) {
  if (field.type == "select") {
    return (
      <>
        <label htmlFor={field.name}>{field.name}</label>
        <select
          multiple
          required={field.required}
          className="border mx-5"
          id={field.name}
          name={field.name}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </>
    );
  }

  return (
    <>
      <label htmlFor={field.name}>{field.name}</label>
      <input
        required={field.required}
        className="border mx-5"
        id={field.name}
        type={field.type}
        name={field.name}
      />
    </>
  );
}
