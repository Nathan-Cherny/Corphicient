"use client"

import { useState, useEffect } from "react";
import axiosClient from "@/app/axiosClient";
import { addModel } from "../communication/communication";

export default function DayLogForm() {
    const [form_data, setFormData] = useState(null);

    return (
        <form onSubmit={(e) => {
            addModel(e, "daylog")
        }}>
            <div className="p-5 flex flex-col justify-center gap-5 w-fit">
                <div className="flex-row gap-5 items-center">
                    <h3>Mood</h3>
                    <input name="mood" className="border p-1" type="number" min={1} max={10} defaultValue={5} />
                </div>
                <div className="flex-row gap-5 items-center">
                    <h3>Note</h3>
                    <textarea className="border p-1" name="note"></textarea>
                </div>
                <input type="submit" value={"Add"} />
            </div>

        </form>
    )
}