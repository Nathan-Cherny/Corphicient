"use client"

import axiosClient from "@/app/axiosClient";

export async function addModel(e, model){
    e.preventDefault()
    let payload = new FormData(e.target)
    let response = await axiosClient(`add_${model}/`, payload, null, "POST", true);
    return response
}

export async function deleteModel(id, model){
    let response = await axiosClient(`delete_${model}/${id}/`, null, null, "DELETE");
    return response
}
