"use client";

import { addModel, deleteModel } from "../communication/communication";
import axiosClient from "@/app/axiosClient";
import { API_BASE_URL } from "@/app/lib/config";

function newJobId() {
  // crypto.randomUUID needs a secure context (https or localhost)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Opens a server-sent-events stream for a download and calls onProgress with
// { status: "downloading" | "processing" | "done" | "error", progress: 0-100, message? }
function subscribeToSongProgress(jobId, onProgress) {
  const source = new EventSource(`${API_BASE_URL}/song_progress/${jobId}/`);

  source.onmessage = (event) => {
    const state = JSON.parse(event.data);
    onProgress(state);
    // The server ends the stream after these; close so EventSource doesn't reconnect
    if (state.status === "done" || state.status === "error") source.close();
  };

  return source;
}

// onProgress is optional. The returned promise still resolves with the created song.
export async function addSong(e, onProgress) {
  const jobId = newJobId();
  const source = onProgress ? subscribeToSongProgress(jobId, onProgress) : null;

  try {
    return await addModel(e, "song", { job_id: jobId });
  } finally {
    source?.close();
  }
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
