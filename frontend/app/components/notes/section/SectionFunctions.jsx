"use client";

import { addModel, deleteModel } from "../../communication/communication";
import axiosClient from "@/app/axiosClient";

export function addSection(e){
    return addModel(e, "section")
}

export function deleteSection(id){
    return deleteModel(id, "section")
}

export function updateSection(e, id) {

  async function sectionUpdate() {
    e.preventDefault();

    let response = await axiosClient(
      `section/${id}/update/`,
      new FormData(e.currentTarget),
      null,
      "PATCH",
    );
    return response;
  }

  return sectionUpdate();
}