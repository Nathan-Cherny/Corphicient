"use client"

export default function DayLog({ daylogData }) {
    return (
        <div className="border p-5 flex flex-row gap-5 w-fit">
            <p>{new Date(daylogData.created_at).toLocaleString()}</p>
            <p>{daylogData.mood}</p>
            
            {daylogData?.note && <p>{daylogData.note}</p>}
        </div>
    )
}