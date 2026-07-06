"use client";

import { addModel, deleteModel } from "../../communication/communication";
import axiosClient from "@/app/axiosClient";

export function addNote(e){
    return addModel(e, "note")
}

export function deleteNote(id){
    return deleteModel(id, "note")
}

export function addNoteToSection(e, id){
    async function sectionAddNote(){
        e.preventDefault()
        let payload = new FormData(e.target)
        let response = await axiosClient(`section/${id}/add_note/`, payload, null, "POST");
        return response
    }

    return sectionAddNote(e, id)
}
