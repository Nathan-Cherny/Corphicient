"use client";

import { addModel, deleteModel } from "../communication/communication";
import axiosClient from "@/app/axiosClient";

export function addSong(e) {
  return addModel(e, "song");
}

export function deleteSong(id) {
  return deleteModel(id, "song");
}

export async function patchSong(id, name, cropParams) {
  if(cropParams[0] && cropParams[1]){
    let payload = {
      cropParams
    }

    let response = await axiosClient(`songs/${id}/crop/`, payload, null, "PATCH")
    console.log(response)
  }

  let payload = { name: name };
  let response = await axiosClient(
    `songs/${id}/update/`,
    payload,
    null,
    "PATCH",
  );
  return response;
}
