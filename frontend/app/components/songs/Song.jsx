"use client"

import axiosClient from "@/app/axiosClient";

export async function addSong(e){
    e.preventDefault()
    let payload = new FormData(e.target)
    let response = await axiosClient("add_song/", payload, null, "POST");
    return response
}

export async function deleteSong(song_id){
    let response = await axiosClient(`delete_song/${song_id}/`, null, null, "DELETE");
    return response
}