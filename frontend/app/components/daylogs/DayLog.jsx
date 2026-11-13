"use client"

import { TagsList } from "../songs/SongsList";
import { moodColor } from "./DayLogForm";

export default function DayLog({ daylogData }) {
    return (
        <div className="border p-5 flex flex-col gap-4 w-full justify-around"
            style={{ backgroundColor: moodColor(daylogData.mood) }}>
            <div className="flex flex-row justify-between w-full items-center">
                <p className="border bg-black/50 p-1 w-fit rounded-xl text-white text-sm flex items-center h-fit max-w-fit">{new Date(daylogData.created_at).toLocaleString()}</p>
                <p className="text-3xl">{daylogData.mood}</p>
            </div>
            {daylogData?.note && <p className="text-left font-bold">{daylogData.note}</p>}
            {daylogData?.tags?.length > 0 && <TagsList className="pt-0! w-fit! *:text-[10.5px]!" tags={daylogData.tags} />}

        </div>
    )
}
