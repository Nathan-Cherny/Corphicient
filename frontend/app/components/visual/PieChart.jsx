"use client";

import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { getReadableDurationSong } from "../playlists/PlaylistCard";

export default function PieChartVis({ data, playlistName }) {
  return (
    <div className="w-full h-100 flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {playlistName}
      </h2>

      {/* 3. Wrap with ResponsiveContainer for fluid scaling */}
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0} // Change to a higher number (e.g., 60) for a Donut Chart
            outerRadius={100}
            paddingAngle={.5}
            label={(e) => e.name}
            nameKey="name"
            dataKey="secondsPlayed"
          ></Pie>

          {/* Interactive tooltips and labels */}
          <Tooltip formatter={(value) => [`${getReadableDurationSong(value)}`, "Time Played"]} />
          {/* <Legend verticalAlign="bottom" height={36} /> */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
