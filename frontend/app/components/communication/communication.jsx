"use client"

import axiosClient from "@/app/axiosClient";

// extraFields: optional { name: value } pairs appended to the form data
export async function addModel(e, model, extraFields = {}){
    e.preventDefault()
    let payload = new FormData(e.target)
    for (const [key, value] of Object.entries(extraFields)) {
        payload.append(key, value)
    }
    let response = await axiosClient(`add_${model}/`, payload, null, "POST", true);
    return response
}

export async function deleteModel(id, model){
    let response = await axiosClient(`delete_${model}/${id}/`, null, null, "DELETE");
    return response
}
