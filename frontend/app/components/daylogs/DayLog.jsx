"use client"

import { TagsList } from "../songs/SongsList";
import { moodColor } from "./DayLogForm";

export default function DayLog({ daylogData }) {
    return (
        <div className="border p-5 flex flex-col gap-5 w-full"
            style={{ backgroundColor: moodColor(daylogData.mood) }}>
            <div className="flex flex-row justify-evenly">
                <p className="border bg-black/50 p-1 rounded-xl text-white text-sm flex items-center h-fit max-w-fit">{new Date(daylogData.created_at).toLocaleDateString()}<br />{new Date(daylogData.created_at).toLocaleTimeString()}</p>
                <p>{daylogData.mood}</p>
            </div>
            <div className="flex flex-row justify-evenly">
                {daylogData?.note && <p>{daylogData.note}</p>}
                {daylogData?.tags?.length > 0 && <TagsList className="pt-0! w-fit! *:text-[10.5px]!" tags={daylogData.tags} />}
            </div>

        </div>
    )
}
