"use client";

import axiosClient from "@/app/axiosClient";
import { useState, useEffect } from "react";
import EditPlaylist from "../playlists/EditPlaylist";
import SongSelect from "../songs/SongSelect";
import ColorSelect from "../visual/selectColor";

const inputClasses =
  "rounded-lg border border-sky-200 bg-white px-3 py-2 text-sky-950 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200";

export default function Form({
  formType,
  nonFormFields = [],
  submitFunction,
  name,
  children,
}) {
  const [form_data, setFormData] = useState(null);

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
    return (
      <div className="rounded-xl border border-sky-200 bg-white p-5 text-center text-sky-700 shadow-sm">
        Loading...
      </div>
    );
  }

  // go thru each form_data field and add that
  return (
    <section className="flex flex-col content-center items-center rounded-xl border border-sky-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-center text-lg font-semibold text-sky-950">
        {name}
      </h2>
      <form onSubmit={(e) => submitFunction(e)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {form_data.fields?.map((field) => {
            const wide = field.type !== "select" && field.max_length >= 750;
            return (
              <div
                key={field.name}
                className={`flex flex-col gap-1 ${wide ? "sm:col-span-2" : ""}`}
              >
                {parseField(field)}
              </div>
            );
          })}
          {children}
        </div>
        <div className="mt-5 flex justify-end">
          <input
            type="submit"
            value="Submit"
            className="cursor-pointer rounded-lg bg-[#c98f66] px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[#b57a52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c98f66] focus-visible:ring-offset-2"
          />
        </div>
      </form>
    </section>
  );
}

function FieldLabel({ field }) {
  return (
    <label
      htmlFor={field.name}
      className="text-sm font-medium capitalize text-sky-900"
    >
      {field.name.replaceAll("_", " ")}
    </label>
  );
}

function parseField(field) {
  if (field.type == "select") return <SelectInput field={field} />

  if (field.name.includes("color")) return <ColorSelect/>;

  if (field.type == "datetime-local") return <DateInputControlled field={field} />

  if (field.max_length >= 750) return <TextAreaInput field={field} />

  return <DefaultInput field={field}/>
}

function DefaultInput({ field }) {
  return (
    <>
      <FieldLabel field={field} />
      <input
        required={field.required}
        className={inputClasses}
        id={field.name}
        type={field.type}
        name={field.name}
      />
    </>
  );
}

function TextAreaInput({ field }) {
  return (
    <>
      <FieldLabel field={field} />
      <textarea
        required={field.required}
        className={`${inputClasses} min-h-24`}
        id={field.name}
        type={field.type}
        name={field.name}
      />
    </>
  );
}

function SelectInput({ field }) {
  return (
    <>
      <FieldLabel field={field} />
      <select
        defaultValue={[]}
        multiple
        required={field.required}
        className={inputClasses}
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


function DateInputControlled({ field }) {
  function localDateTimeNow() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  const [date, setDate] = useState(localDateTimeNow);

  return (
    <>
      <FieldLabel field={field} />
      <input
        required={field.required}
        className={inputClasses}
        id={field.name}
        type={field.type}
        name={field.name}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </>
  );
}