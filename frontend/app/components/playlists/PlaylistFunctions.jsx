"use client";

import { addModel, deleteModel } from "../communication/general";

export function addPlaylist(e){
    return addModel(e, "playlist")
}

export function deletePlaylist(id){
    return deleteModel(id, "playlist")
}