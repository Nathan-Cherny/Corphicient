"use client"

import { useState, useEffect, useRef } from "react";
import axiosClient from "@/app/axiosClient";
import { addModel } from "../communication/communication";
import { TagsList } from "../songs/SongsList";

const MOOD_MIN = 0
const MOOD_MAX = 10
const MOOD_STEP = 0.5
const DEFAULT_MOOD = 5

// 20 blocks: block 1 is 0.5, block 20 is 10. Clicking the lowest block again while it's the
// only one selected sets the mood to 0 (there is no "block 0").
const MOOD_BLOCKS = Array.from(
    { length: (MOOD_MAX - MOOD_MIN) / MOOD_STEP },
    (_, i) => MOOD_MIN + (i + 1) * MOOD_STEP
)

// red (0) -> orange -> yellow -> green (10)
export function moodColor(mood) {
    const hue = ((mood - MOOD_MIN) / (MOOD_MAX - MOOD_MIN)) * 120
    return `hsl(${hue}, 85%, 42%)`
}

export default function DayLogForm({ onAdded }) {
    const [mood, setMood] = useState(DEFAULT_MOOD);
    const [hoverMood, setHoverMood] = useState(null);
    const [tags, setTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const blocksRef = useRef(null);

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
        setHoverMood(null)
        setTags([])
        onAdded?.()
    }

    // Clicking empty space on the form focuses the mood blocks (so arrow keys change the mood).
    // Clicking the note, a tag or a button leaves focus on that instead.
    function focusMoodUnlessSpecific(e) {
        if (e.target.closest("textarea, input, button, [data-tags]")) return
        blocksRef.current?.focus({ preventScroll: true })
    }

    function selectMood(value) {
        // clicking the lowest block while it's the only one lit drops the mood to 0
        setMood(prev => (value === MOOD_STEP && prev === MOOD_STEP ? MOOD_MIN : value))
    }

    function handleMoodKeyDown(e) {
        const moves = { ArrowRight: MOOD_STEP, ArrowUp: MOOD_STEP, ArrowLeft: -MOOD_STEP, ArrowDown: -MOOD_STEP }

        if (e.key in moves) {
            e.preventDefault()
            setMood(prev => Math.min(MOOD_MAX, Math.max(MOOD_MIN, prev + moves[e.key])))
        } else if (e.key === "Home") {
            e.preventDefault()
            setMood(MOOD_MIN)
        } else if (e.key === "End") {
            e.preventDefault()
            setMood(MOOD_MAX)
        }
    }

    // while hovering a block, the badge and the lit blocks preview that value
    const shownMood = hoverMood ?? mood
    const color = moodColor(shownMood)

    return (
        <form onSubmit={handleSubmit} onClick={focusMoodUnlessSpecific}>
            <div className="p-5 flex flex-col gap-6 w-full max-w-xl mx-auto text-left bg-white/30 rounded-2xl">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between items-center">
                        <h3 className="text-lg font-semibold">Mood</h3>
                        <output
                            className="min-w-16 text-center text-2xl font-bold text-white rounded-full px-4 py-1 shadow-md transition-colors"
                            style={{ backgroundColor: color }}
                        >
                            {shownMood}
                        </output>
                    </div>

                    {/* the form value; the blocks below just set it */}
                    <input type="hidden" name="mood" value={mood} />

                    <div
                        ref={blocksRef}
                        role="slider"
                        tabIndex={0}
                        aria-label="Mood"
                        aria-valuemin={MOOD_MIN}
                        aria-valuemax={MOOD_MAX}
                        aria-valuenow={mood}
                        className="flex flex-row gap-1 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-black/40 bg-black/25"
                        onKeyDown={handleMoodKeyDown}
                        onMouseLeave={() => setHoverMood(null)}
                    >
                        {MOOD_BLOCKS.map(value => {
                            const lit = value <= shownMood
                            const hovered = value === hoverMood

                            return (
                                <div
                                    key={value}
                                    title={value}
                                    className="flex-1 h-10 rounded-md cursor-pointer border transition-all duration-100"
                                    style={{
                                        // every block keeps its own hue; unlit ones are just faded
                                        backgroundColor: moodColor(value),
                                        opacity: lit ? 1 : 0.2,
                                        transform: hovered ? "scaleY(1.2)" : "none",
                                        boxShadow: hovered ? "0 2px 8px rgba(0, 0, 0, 0.4)" : "none",
                                    }}
                                    onMouseEnter={() => setHoverMood(value)}
                                    onClick={() => selectMood(value)}
                                />
                            )
                        })}
                    </div>

                    <div className="flex flex-row justify-between text-sm opacity-70">
                        <span>0.5</span>
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
        <div className="flex flex-col gap-2" data-tags>
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
