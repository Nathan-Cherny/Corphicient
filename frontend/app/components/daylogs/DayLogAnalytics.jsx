
"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import axiosClient from "@/app/axiosClient";

import "./DayLogAnalytics.css";

const COLORS = [
  "#44BBBB",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#FF6699",
  "#A3A3A3",
  "#B07AA1",
  "#59A14F",
];

// Format a Date as a local YYYY-MM-DD string.
function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

export default function DayLogAnalytics({ }) {
  const [dayLogs, setDaylogs] = useState([]);
  const [error, setError] = useState("");
  const daylog_request = ["get_daylogs/", null, "", "GET"];

  useEffect(() => {
    async function allDaylogs() {
      const res = await axiosClient(...daylog_request);
      setDaylogs(res || []);
    }

    allDaylogs();
  }, []);


  // Group mood entries by calendar day.
  const dailyMood = {};

  // Count occurrences of every tag.
  const tagCounts = {};

  // Find the earliest log and earliest log containing tags.
  let earliestLogDate = null;
  let earliestTaggedDate = null;

  for (const log of dayLogs) {
    if (!log.created_at) continue;

    const date = new Date(log.created_at);

    if (Number.isNaN(date.getTime())) continue;

    const dateKey = toDateKey(date);

    if (!earliestLogDate || dateKey < earliestLogDate) {
      earliestLogDate = dateKey;
    }

    if (!dailyMood[dateKey]) {
      dailyMood[dateKey] = {
        total: 0,
        count: 0,
      };
    }

    const mood = Number(log.mood);

    if (Number.isFinite(mood)) {
      dailyMood[dateKey].total += mood;
      dailyMood[dateKey].count += 1;
    }

    const tags = Array.isArray(log.tags) ? log.tags : [];

    if (tags.some(
      (tag) => typeof tag === "string" && tag.trim()
    )) {
      if (!earliestTaggedDate || dateKey < earliestTaggedDate) {
        earliestTaggedDate = dateKey;
      }
    }

    for (const tag of tags) {
      if (typeof tag !== "string" || !tag.trim()) continue;

      const normalizedTag = tag.trim();

      tagCounts[normalizedTag] =
        (tagCounts[normalizedTag] || 0) + 1;
    }
  }

  // Start at the first tagged day, falling back to the first
  // log if no tags exist. Include every day through today.
  const startKey = earliestTaggedDate || earliestLogDate;

  const moodData = [];

  if (startKey) {
    const [year, month, day] = startKey.split("-").map(Number);

    const startDate = new Date(dayLogs[dayLogs.length - 1].created_at)
    const today = new Date();

    for (
      const current = new Date(startDate);
      current <= today;
      current.setDate(current.getDate() + 1)
    ) {
      const dateKey = toDateKey(current);
      const entry = dailyMood[dateKey];

      moodData.push({
        date: dateKey,
        label: formatDate(dateKey),
        mood:
          entry && entry.count > 0
            ? Number((entry.total / entry.count).toFixed(2))
            : null,
        entries: entry?.count || 0,
      });
    }
  }

  // Sort the most common tags first.
  const tagData = Object.entries(tagCounts)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const totalTagOccurrences = tagData.reduce(
    (sum, tag) => sum + tag.count,
    0
  );

  if (error) {
    return <p role="alert">Error: {error}</p>;
  }

  return (
    <div className="daylog-analytics">
      <section className="analytics-card">
        <h2>Average Mood Over Time</h2>

        <p className="analytics-description">
          Daily average mood
        </p>

        {moodData.length === 0 ? (
          <p>No day logs available yet.</p>
        ) : (
          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={moodData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#dddddd"
                />

                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const [, month, day] = value.split("-");
                    return `${Number(month)}/${Number(day)}`;
                  }}
                  minTickGap={30}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  allowDecimals
                />

                <Tooltip
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value) => [
                    value == null ? "No entries" : value,
                    "Average mood",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="mood"
                  name="Average mood"
                  stroke="#44BBBB"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="analytics-footnote">
          Mood scale: 0–10. Days without entries are left blank.
        </p>
      </section>

      <section className="analytics-card">
        <h2>Most Common Tags</h2>

        <p className="analytics-description">

        </p>

        {tagData.length === 0 ? (
          <p>No tags available yet.</p>
        ) : (
          <>
            <div className="analytics-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tagData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(1)}%`
                    }
                    labelLine
                  >
                    {tagData.map((tag, index) => (
                      <Cell
                        key={tag.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, name) => [
                      `${value} occurrence(s)`,
                      name,
                    ]}
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <p className="analytics-footnote">
              Total tag occurrences: {totalTagOccurrences}
            </p>

            <div className="tag-frequency-list">
              {tagData.map((tag) => (
                <div
                  className="tag-frequency-row"
                  key={tag.name}
                >
                  <span>{tag.name}</span>

                  <span>
                    {tag.count}{" "}
                    {tag.count === 1 ? "occurrence" : "occurrences"}
                    {" · "}
                    {(
                      (tag.count / totalTagOccurrences) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
