"use client";

import { addModel, deleteModel } from "../../communication/communication";
import axiosClient from "@/app/axiosClient";

export function addNote(e){
    return addModel(e, "note")
}

export function deleteNote(id){
    return deleteModel(id, "note")
}