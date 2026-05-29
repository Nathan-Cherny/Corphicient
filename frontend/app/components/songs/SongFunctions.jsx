"use client";

import { addModel, deleteModel } from "../communication/general";

export function addSong(e){
    return addModel(e, "song")
}

export function deleteSong(id){
    return deleteModel(id, "song")
}