"use client"

import { useState, useEffect, useRef } from "react";
import axiosClient from "@/app/axiosClient";
import { addModel } from "../communication/communication";
import { TagsList } from "../songs/SongsList";

const MOOD_MIN = 0
const MOOD_MAX = 10
const MOOD_STEP = 0.5
const DEFAULT_MOOD = 5

// red (0) -> orange -> yellow -> green (10)
function moodColor(mood) {
    const hue = ((mood - MOOD_MIN) / (MOOD_MAX - MOOD_MIN)) * 120
    return `hsl(${hue}, 85%, 42%)`
}

export default function DayLogForm({ onAdded }) {
    const [mood, setMood] = useState(DEFAULT_MOOD);
    const [tags, setTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const sliderRef = useRef(null);

    const createRange = (min, max, step = 1) =>
        Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + (i * step));

    // the tags themselves live in backend/daylog/tags.py (gitignored)
    useEffect(() => {
        async function getTags() {
            try {
                const res = await axiosClient("get_daylog_tags/", null, "", "GET")
                setAvailableTags(res?.tags || [])
            } catch {
                setAvailableTags([])
            }
        }

        getTags()
    }, [])

    async function handleSubmit(e) {
        const form = e.currentTarget
        try {
            await addModel(e, "daylog", { tags: JSON.stringify(tags) })
        } catch {
            return // axiosClient already logged it; keep what was typed
        }

        form.reset()
        setMood(DEFAULT_MOOD)
        setTags([])
        onAdded?.()
    }

    function focusSliderUnlessSpecific(e) {
        if (e.target.closest("textarea, input, button, [data-tags]")) return
        sliderRef.current?.focus({ preventScroll: true })
    }

    const color = moodColor(mood)
    const percent = ((mood - MOOD_MIN) / (MOOD_MAX - MOOD_MIN)) * 100

    return (
        <form onSubmit={handleSubmit} onClick={focusSliderUnlessSpecific}>
            <div className="p-5 flex flex-col gap-6 w-full max-w-xl mx-auto text-left bg-white/30 rounded-2xl">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between items-center">
                        <h3 className="text-lg font-semibold">Mood</h3>
                        <output
                            className="min-w-16 text-center text-2xl font-bold text-white rounded-full px-4 py-1 shadow-md transition-colors"
                            style={{ backgroundColor: color }}
                        >
                            {mood}
                        </output>
                    </div>

                    <input
                        ref={sliderRef}
                        name="mood"
                        className="mood-slider"
                        style={{ "--mood-color": color, "--mood-percent": `${percent}%` }}
                        type="range"
                        min={MOOD_MIN}
                        max={MOOD_MAX}
                        step={MOOD_STEP}
                        value={mood}
                        onChange={(e) => setMood(parseFloat(e.target.value))}
                        list="steplist"
                    />

                    <datalist id="steplist">
                        {createRange(MOOD_MIN, MOOD_MAX, MOOD_STEP).map(num => (
                            <option key={num} value={num} label={`${num / MOOD_MAX}%`}></option>
                        ))}
                    </datalist>

                    <div className="flex flex-row justify-between text-sm opacity-70">
                        <span>0</span>
                        <span>10</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Note</h3>
                    <textarea
                        className="border border-black/30 bg-white/70 rounded-xl p-3 min-h-24 focus:outline-none focus:ring-2 focus:ring-black/40"
                        name="note"
                        placeholder="Note"
                    ></textarea>
                </div>

                <DayLogTagManager tags={tags} setTags={setTags} availableTags={availableTags} />

                <input
                    className="cursor-pointer bg-black/50 text-white font-semibold rounded-full py-2 shadow-md hover:scale-[1.02] transition"
                    type="submit"
                    value={"Add"}
                />
            </div>
        </form>
    )
}

// Same idea as TagManager in SongsList: chips on the log, click one to remove it.
// The difference is that tags are picked from the list defined in backend/daylog/tags.py.
function DayLogTagManager({ tags, setTags, availableTags }) {
    const unusedTags = availableTags.filter(tag => !tags.includes(tag))

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Tags</h3>

            {availableTags.length == 0 && (
                <p className="text-sm opacity-70">
                    No tags yet. Add some to <code>backend/daylog/tags.py</code>.
                </p>
            )}

            {tags.length > 0 && (
                <TagsList
                    className="flex-wrap pt-0!"
                    tags={tags}
                    tagOnClick={(e) => setTags(tags.filter(tag => tag != e.currentTarget.textContent.trim()))}
                />
            )}

            {unusedTags.length > 0 && (
                <div className="flex flex-row flex-wrap gap-2">
                    {unusedTags.map(tag => (
                        <button
                            type="button"
                            key={tag}
                            className="bg-white/70 border border-black/30 rounded-2xl px-3 py-1 cursor-pointer hover:scale-105 transition"
                            onClick={() => setTags(prev => [...prev, tag])}
                        >
                            + {tag}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
