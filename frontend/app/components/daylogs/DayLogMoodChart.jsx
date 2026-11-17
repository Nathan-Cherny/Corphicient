"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { moodColor } from "./DayLogForm";

const MOOD_MIN = 0;
const MOOD_MAX = 10;
const MOOD_STEP = 0.5;

const RANGE_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last year" },
  { value: "custom", label: "Custom range" },
];

// Format a Date as a local YYYY-MM-DD string (same format as <input type="date">).
function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Turn the selected range into inclusive start/end date keys. null means "no limit".
function getBounds(range, customStart, customEnd) {
  if (range === "all") {
    return { start: null, end: null };
  }

  if (range === "custom") {
    return { start: customStart || null, end: customEnd || null };
  }

  const days = Number(range);
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));

  return { start: toDateKey(start), end: null };
}

// Every mood the form can produce (0, 0.5, ... 10), so empty moods still show as 0 bars.
const BASE_MOODS = Array.from(
  { length: (MOOD_MAX - MOOD_MIN) / MOOD_STEP + 1 },
  (_, i) => MOOD_MIN + i * MOOD_STEP
);

export default function DayLogMoodChart({ dayLogs }) {
  const [range, setRange] = useState("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const invalidRange =
    range === "custom" &&
    customStart !== "" &&
    customEnd !== "" &&
    customStart > customEnd;

  const { chartData, shownCount, totalCount } = useMemo(() => {
    const { start, end } = getBounds(range, customStart, customEnd);
    const counts = new Map(BASE_MOODS.map((mood) => [mood, 0]));

    let shown = 0;
    let total = 0;

    for (const log of dayLogs) {
      const mood = Number(log.mood);
      const date = new Date(log.created_at);

      if (!Number.isFinite(mood) || Number.isNaN(date.getTime())) continue;

      total += 1;

      const dateKey = toDateKey(date);

      if (start && dateKey < start) continue;
      if (end && dateKey > end) continue;

      // Group by the exact mood. Anything off the usual 0.5 grid (e.g. imported
      // data) gets its own bar instead of being rounded into a neighbour.
      counts.set(mood, (counts.get(mood) || 0) + 1);
      shown += 1;
    }

    const data = [...counts.entries()]
      .sort(([a], [b]) => a - b)
      .map(([mood, count]) => ({ mood, count }));

    return {
      chartData: invalidRange ? [] : data,
      shownCount: invalidRange ? 0 : shown,
      totalCount: total,
    };
  }, [dayLogs, range, customStart, customEnd, invalidRange]);

  return (
    <section className="analytics-card">
      <h2>Daylogs by Mood</h2>

      <p className="analytics-description">
        How many daylogs you have recorded at each mood.
      </p>

      <div className="analytics-range-controls">
        <label className="analytics-range-field">
          <span>Range</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {range === "custom" && (
          <>
            <label className="analytics-range-field">
              <span>From</span>
              <input
                type="date"
                value={customStart}
                max={customEnd || undefined}
                onChange={(e) => setCustomStart(e.target.value)}
              />
            </label>

            <label className="analytics-range-field">
              <span>To</span>
              <input
                type="date"
                value={customEnd}
                min={customStart || undefined}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </label>
          </>
        )}
      </div>

      {invalidRange && (
        <p role="alert" className="analytics-range-error">
          The start date must be on or before the end date.
        </p>
      )}

      {totalCount === 0 ? (
        <p>No day logs available yet.</p>
      ) : (
        <div className="analytics-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#dddddd" />

              <XAxis
                dataKey="mood"
                tick={{ fontSize: 11 }}
                minTickGap={2}
                label={{
                  value: "Mood",
                  position: "insideBottom",
                  offset: -12,
                }}
              />

              <YAxis
                allowDecimals={false}
                label={{
                  value: "Number of recordings",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />

              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.06)" }}
                labelFormatter={(value) => `Mood ${value}`}
                formatter={(value) => [
                  `${value} ${value === 1 ? "recording" : "recordings"}`,
                  "Daylogs",
                ]}
              />

              <Bar dataKey="count" name="Daylogs" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.mood} fill={moodColor(entry.mood)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="analytics-footnote">
        Showing {shownCount} of {totalCount} daylogs.
      </p>
    </section>
  );
}
