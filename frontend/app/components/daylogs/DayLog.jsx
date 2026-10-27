"use client"

import { TagsList } from "../songs/SongsList";

export default function DayLog({ daylogData }) {
    return (
        <div className="border p-5 flex flex-row gap-5 w-full">
            <p className="border bg-black/50 p-1 rounded-xl text-white text-sm flex items-center h-fit max-w-fit">{new Date(daylogData.created_at).toLocaleDateString()}<br/>{new Date(daylogData.created_at).toLocaleTimeString()}</p>
            <p>{daylogData.mood}</p>

            {daylogData?.note && <p>{daylogData.note}</p>}
            {daylogData?.tags?.length > 0 && <TagsList className="pt-0! w-fit! *:text-[10px]!" tags={daylogData.tags} />}
        </div>
    )
}
