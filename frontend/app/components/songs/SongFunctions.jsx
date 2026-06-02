"use client";

import { addModel, deleteModel } from "../communication/communication";

export function addSong(e){
    return addModel(e, "song")
}

export function deleteSong(id){
    return deleteModel(id, "song")
}