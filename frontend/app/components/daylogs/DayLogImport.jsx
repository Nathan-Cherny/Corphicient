"use client"

import { useState } from "react";
import axiosClient from "@/app/axiosClient";

const MOOD_MIN = 0
const MOOD_MAX = 10

// Accepts a list of daylogs, a single daylog, or { "daylogs": [...] }.
// Each daylog looks like: { "mood": 7.5, "note": "text", "tags": ["work"], "created_at": "2026-01-02T03:04:05Z" }
// (only "mood" is required; tags have to exist in backend/daylog/tags.py)
export function parseDayLogs(text) {
    let parsed
    try {
        parsed = JSON.parse(text)
    } catch (err) {
        return { logs: [], errors: [`That isn't valid JSON: ${err.message}`] }
    }

    if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.daylogs)) {
        parsed = parsed.daylogs
    }
    if (parsed && !Array.isArray(parsed) && typeof parsed === "object") {
        parsed = [parsed]
    }
    if (!Array.isArray(parsed)) {
        return { logs: [], errors: ["Expected a list of daylog objects."] }
    }
    if (parsed.length === 0) {
        return { logs: [], errors: ["The list is empty."] }
    }

    const errors = []
    const logs = parsed.map((log, i) => {
        const label = `#${i + 1}`

        if (!log || typeof log !== "object" || Array.isArray(log)) {
            errors.push(`${label}: not an object`)
            return log
        }

        const mood = log.mood
        if (typeof mood !== "number" || !Number.isFinite(mood) || mood < MOOD_MIN || mood > MOOD_MAX) {
            errors.push(`${label}: mood must be a number from ${MOOD_MIN} to ${MOOD_MAX}`)
        }
        if (log.note != null && typeof log.note !== "string") {
            errors.push(`${label}: note must be text`)
        }
        if (log.tags != null && (!Array.isArray(log.tags) || !log.tags.every(tag => typeof tag === "string"))) {
            errors.push(`${label}: tags must be a list of strings`)
        }
        if (log.created_at != null && Number.isNaN(new Date(log.created_at).getTime())) {
            errors.push(`${label}: created_at isn't a valid date`)
        }

        // only send what the backend knows about; leave out nulls so the model defaults apply
        const clean = { mood }
        if (log.note != null) clean.note = log.note
        if (log.tags != null) clean.tags = log.tags
        if (log.created_at != null) clean.created_at = log.created_at
        return clean
    })

    return { logs, errors }
}

// turns whatever the backend sent back into lines to show
function describeServerError(err) {
    const data = err?.response?.data
    if (!data) return [err?.message || "Couldn't reach the backend."]

    const lines = []
    if (data.detail) lines.push(data.detail)

    for (const { index, errors } of data.errors || []) {
        for (const [field, messages] of Object.entries(errors)) {
            lines.push(`#${index + 1}: ${field}: ${[].concat(messages).join(" ")}`)
        }
    }

    return lines.length > 0 ? lines : ["The backend rejected the import."]
}

export default function DayLogImport({ onImported }) {
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [problems, setProblems] = useState([]);
    const [message, setMessage] = useState("");

    // live count so you can see the paste was understood before you hit Import
    const preview = text.trim() ? parseDayLogs(text) : null
    const validCount = preview && preview.errors.length === 0 ? preview.logs.length : 0

    async function handleImport(e) {
        e.preventDefault()
        setMessage("")

        const { logs, errors } = parseDayLogs(text)
        if (errors.length > 0) {
            setProblems(errors)
            return
        }

        setBusy(true)
        setProblems([])
        try {
            // all or nothing: the backend saves every log or none of them
            const res = await axiosClient("add_daylogs/", logs, null, "POST")
            setMessage(`Imported ${res?.created ?? logs.length} daylog${logs.length === 1 ? "" : "s"}.`)
            setText("")
            onImported?.()
        } catch (err) {
            // axiosClient already logged it; nothing was saved, so keep the pasted text
            setProblems(describeServerError(err))
        } finally {
            setBusy(false)
        }
    }

    return (
        <details className="w-full max-w-xl mx-auto text-left bg-white/30 rounded-2xl p-5">
            <summary className="cursor-pointer text-lg font-semibold">Import daylogs (JSON)</summary>

            <form onSubmit={handleImport} className="flex flex-col gap-3 mt-4">
                <p className="text-sm opacity-70">
                    Paste a list like{" "}
                    <code>{`[{"mood": 7.5, "note": "text", "tags": ["work"], "created_at": "2026-01-02T03:04:05Z"}]`}</code>.
                    Only <code>mood</code> is required. If any log is invalid, nothing is imported.
                </p>

                <textarea
                    className="border border-black/30 bg-white/70 rounded-xl p-3 min-h-40 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black/40"
                    placeholder="Paste JSON here"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value)
                        setProblems([])
                        setMessage("")
                    }}
                    spellCheck={false}
                />

                {validCount > 0 && (
                    <p className="text-sm">Ready to import {validCount} daylog{validCount === 1 ? "" : "s"}.</p>
                )}

                {problems.length > 0 && (
                    <ul className="text-sm bg-red-100 border border-red-400 rounded-xl p-3 max-h-40 overflow-y-auto list-disc list-inside">
                        {problems.slice(0, 50).map((problem, i) => <li key={i}>{problem}</li>)}
                        {problems.length > 50 && <li>…and {problems.length - 50} more</li>}
                    </ul>
                )}

                {message && <p className="text-sm font-semibold">{message}</p>}

                <button
                    type="submit"
                    disabled={busy || !text.trim()}
                    className="cursor-pointer bg-black/50 text-white font-semibold rounded-full py-2 shadow-md hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {busy ? "Importing..." : "Import"}
                </button>
            </form>
        </details>
    )
}
