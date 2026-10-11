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

// FilterPlaylists hold no songs; they have preset song filters (see DEFAULT_FILTERS in SongFilter.jsx)
export async function addFilterPlaylist(name, filters) {
    let payload = { name: name, playlist_type: "filter", filters: filters }
    return axiosClient("add_playlist/", payload, null, "POST")
}

export async function patchFilterPlaylist(id, name, filters) {
    let payload = { name: name, filters: filters }
    return axiosClient(`playlists/${id}/update/`, payload, null, "PATCH")
}

export function isFilterPlaylist(playlist) {
    return playlist?.playlist_type === "filter"
}