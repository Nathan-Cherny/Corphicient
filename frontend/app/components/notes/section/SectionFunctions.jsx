"use client";

import { addModel, deleteModel } from "../../communication/communication";
import axiosClient from "@/app/axiosClient";

export function addSection(e){
    return addModel(e, "section")
}

export function deleteSection(id){
    return deleteModel(id, "section")
}