"use client"

import { TagsList } from "../songs/SongsList";

export default function DayLog({ daylogData }) {
    return (
        <div className="border p-5 flex flex-row gap-5 w-fit">
            <p>{new Date(daylogData.created_at).toLocaleString()}</p>
            <p>{daylogData.mood}</p>

            {daylogData?.note && <p>{daylogData.note}</p>}
            {daylogData?.tags?.length > 0 && <TagsList className="pt-0! w-fit! *:max-h-fit" tags={daylogData.tags} />}
        </div>
    )
}
