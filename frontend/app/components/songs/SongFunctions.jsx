"use client";

import { addModel, deleteModel } from "../communication/communication";
import axiosClient from "@/app/axiosClient";

export function addSong(e) {
  return addModel(e, "song");
}

export function deleteSong(id) {
  return deleteModel(id, "song");
}

export async function patchSong(id, formData) {
  // if(cropParams[0] && cropParams[1]){
  //   let payload = formData

  //   let response = await axiosClient(`songs/${id}/crop/`, payload, null, "PATCH")
  // }

  let payload = formData
  console.log(formData.get('thumbnail'))

  let response = await axiosClient(
    `songs/${id}/update/`,
    payload,
    null,
    "PATCH",
    true
  );
  return response;
}
