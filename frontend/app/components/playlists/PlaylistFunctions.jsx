"use client";

import { addModel, deleteModel } from "../communication/communication";

export function addPlaylist(e){
    return addModel(e, "playlist")
}

export function deletePlaylist(id){
    return deleteModel(id, "playlist")
}