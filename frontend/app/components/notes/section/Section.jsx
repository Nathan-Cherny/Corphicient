"use client";

import axiosClient from "@/app/axiosClient";
import { useEffect, useState } from "react";
import Form from "../../forms/Forms";

export default function Section({}) {
  const request = ["get_section_form/", null, "", "GET"];
  const [sections, setSections] = useState([]);

  useEffect(() => {
    async function allSections() {
      const res = await axiosClient(...request);
      setSections(res || []);
    }

    allSections();
  }, [request[0]]);


  console.log(sections)

  return (
    <div>
      <p>test</p> 
    </div>
  )
}
