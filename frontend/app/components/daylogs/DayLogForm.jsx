"use client"

import { useState, useEffect } from "react";
import axiosClient from "@/app/axiosClient";
import { addModel } from "../communication/communication";

export default function DayLogForm() {
    const [form_data, setFormData] = useState(null);

    return (
        <form onSubmit={(e) => {
            addModel(e, "daylog")
            e.target.reset()
        }}>
            <div className="p-5 flex flex-col justify-center gap-5 w-fit">
                <div className="flex-row gap-5 items-center">
                    <h3>Mood</h3>
                    <div className="flex flex-row items-center gap-5">
                        <input name="mood" className="border p-1" type="range" min={0} max={10} step={"0.5"} defaultValue={5} onChange={(e) => {
                            document.getElementById("outputMood").innerHTML = e.target.value
                        }} />
                        <output id="outputMood">5</output>
                    </div>
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