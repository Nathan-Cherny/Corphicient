"use client";

import { addModel, deleteModel } from "../communication/communication";
import axiosClient from "@/app/axiosClient";

export function addPlaylist(e){
    return addModel(e, "playlist")
}

export function deletePlaylist(id){
    return deleteModel(id, "playlist")
}

export async function patchPlaylist(id, selected, name) {
    let payload = { songs: selected, name: name }
    let response = await axiosClient(`playlists/${id}/update/`, payload, null, "PATCH");
    return response
}