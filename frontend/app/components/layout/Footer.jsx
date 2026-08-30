"use client";

import Pokemon from "../pokemon/getPokemon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect } from "react";
import FadeOverlay from "./FadeOverlay";
import { getReadableDurationSong } from "../playlists/PlaylistCard";

import { ArrowDownFromLine, ArrowUpFromLine, File } from "lucide-react";

export default function Footer() {
  const [lastCommit, setLastCommit] = useState(null);
  const repo = "https://github.com/Nathan-Cherny/Corphicient";
  const [allCommitsOpen, setAllCommitsOpen] = useState(false);

  useEffect(() => {
    async function lastCommit() {
      try {
        setLastCommit(await getCommits(false, true));
      } catch (e) {
        console.log(`Couldn't get lastCommit: ${e.message}`);
        setLastCommit(null);
      }
    }

    lastCommit();
  }, []);

  return (
    <footer
      className="w-full mt-auto"
      style={{
        backgroundColor: "#0f1f1f",
        borderTop: "3px solid orangered",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "960px",
          margin: "0 auto",
          padding: "20px 32px",
          gap: "32px",
        }}
      >
        {/* GitHub */}
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            color: "#e2e8f0",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.85)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "75px",
              height: "75px",
              borderRadius: "50%",
              backgroundColor: "#1a2f2f",
              border: "1px solid #2a4444",
              flexShrink: 0,
            }}
          >
            <FontAwesomeIcon
              icon={faGithub}
              style={{ width: "50px", height: "50px" }}
            />
          </div>
          <i className="text-[7.5px] text-center">
            Just 1 Commit A Day :) Have Fun!
          </i>
        </a>

        {/* GitHub last commit */}
        {lastCommit && (
          <div
            className="text-white flex flex-col items-center opacity-90 text-xs hover:opacity-100 cursor-pointer"
            onClick={() => window.open(lastCommit.html_url)}
          >
            <div className="flex flex-col">
              <h2 className="text-center text-xl">Last Commit</h2>
              <p>
                {new Date(lastCommit.commit.author.date).toLocaleString()} |{" "}
                <b>
                  {Math.floor(
                    getHoursBetween(
                      new Date(),
                      new Date(lastCommit.commit.author.date),
                    ),
                  )}
                </b>{" "}
                hour(s) ago
              </p>
            </div>
            <hr className="w-full my-2.5" />
            <div className="flex flex-row items-center gap-3 w-full text-center justify-between">
              <div
                className="flex flex-col items-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open("https://www.github.com/Nathan-Cherny");
                }}
              >
                <img
                  className="h-7.5 w-7.5"
                  src={lastCommit.committer.avatar_url}
                />
                <p className="text-[10px]">
                  {lastCommit?.commit.committer.name}
                </p>
              </div>
              <p className="w-1/2">{lastCommit?.commit.message}</p>
              <div className="flex flex-col items-center text-[10px] gap-1">
                <div className="text-green-500 w-full justify-around flex items-center gap-5">
                  <ArrowUpFromLine className="w-3 h-3" />{" "}
                  <p>{lastCommit?.stats.additions}</p>
                </div>
                <div className="text-red-500 w-full justify-around flex items-center gap-5">
                  <ArrowDownFromLine className="w-3 h-3" />{" "}
                  <p>{lastCommit?.stats.deletions}</p>
                </div>
                <div className="text-orange-500 w-full justify-around flex items-center gap-5">
                  <File className="w-3 h-3" /> <p>{lastCommit?.files.length}</p>
                </div>
              </div>
            </div>
            <hr className="w-full my-2.5" />
            <h3
              className="hover:scale-105 duration-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAllCommitsOpen(true);
              }}
            >
              See all commits...
            </h3>
          </div>
        )}

        <FadeOverlay
          isOpen={allCommitsOpen}
          onClose={() => setAllCommitsOpen(false)}
        >
          <GetAllCommits />
        </FadeOverlay>

        {/* Awesome Pocket Monsters */}
        <Pokemon />
      </div>
    </footer>
  );
}

async function getCommits(all) {
  if (!all) {
    const response = await fetch(
      "https://api.github.com/repos/Nathan-Cherny/Corphicient/commits?per_page=1",
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const [commit] = await response.json();

    const details = await fetch(
      `https://api.github.com/repos/Nathan-Cherny/Corphicient/commits/${commit.sha}`,
    );

    if (!details.ok) {
      throw new Error(`GitHub API error: ${details.status}`);
    }

    return details.json();
  }

  const commits = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://api.github.com/repos/Nathan-Cherny/Corphicient/commits?per_page=100&page=${page}`,
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const pageCommits = await response.json();

    commits.push(...pageCommits);

    if (pageCommits.length < 100) {
      break;
    }

    page++;
  }

  return commits;
}

const getHoursBetween = (date1, date2) =>
  Math.abs(date1 - date2) / (1000 * 60 * 60);

function GetAllCommits() {
  const [allCommits, setAllCommits] = useState(null);

  useEffect(() => {
    async function allCommits() {
      let res = await getCommits(true);
      let commits = {};
      res.forEach((r) => {
        let date = new Date(r.commit.author.date);
        const options = {
          timeZone: "America/New_York", // Your specified timezone
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        };

        const formatter = new Intl.DateTimeFormat("en-CA", options);

        date = formatter.format(date).split(",")[0];
        let msg = r.commit.message;

        if (!commits[date]) {
          commits[date] = [{ msg: msg, url: r.html_url }];
        } else {
          commits[date].push({ msg: msg, url: r.html_url });
        }
      });
      setAllCommits(commits);
    }

    allCommits();
  }, []);

  if (!allCommits)
    return (
      <div className="p-5 bg-white rounded-2xl text-center">
        <h1 className="text-black text-2xl">Loading...</h1>
      </div>
    );

  let dates = Object.keys(allCommits);
  let datesInBetween = getDatesInRange(dates[dates.length - 1], dates[0]);

  let daysWithAtLeast1Commit = datesInBetween.filter(
    (d) => allCommits[d]?.length > 0,
  ).length;
  let totalDays = datesInBetween.length;
  let percentage = daysWithAtLeast1Commit / totalDays;

  return (
    <div className="bg-white flex flex-col p-2 justify-center text-center rounded-2xl max-h-120">
      <h1 className="text-4xl">All Commits</h1>
      <div className="flex flex-row text-sm justify-center gap-5">
        <p>
          <b>{daysWithAtLeast1Commit}</b> days with at least 1 commit out of{" "}
          <b>{totalDays}</b> Total Days
        </p>
        <p>
          <b>{(percentage * 100).toFixed(2)}%</b> Of Days Committed
        </p>
      </div>
      <div className="grid grid-cols-7 overflow-y-scroll">
        {datesInBetween.reverse().map((d) => (
          <div key={d} title={`${allCommits[d]?.map(c => `\n${c.msg}`)}`} className="group relative inline-block">
            <div
              className="w-full h-25 flex text-center flex-col items-center justify-center border border-white"
              style={{
                backgroundColor: `rgb(0, ${getGreenForNumber(allCommits[d])}, 0)`,
                color:
                  getGreenForNumber(allCommits[d]) > 150 ? "black" : "white",
              }}
            >
              <h2>{d}</h2>
              <p>{allCommits[d]?.length || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getDatesInRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate).toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function getGreenForNumber(number) {
  number = !number ? 0 : number.length;
  let boost = number > 0 ? 2 : 0;
  let green = boost * number * 20;
  return green;
}
