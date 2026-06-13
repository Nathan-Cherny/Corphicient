import Pokemon from "../pokemon/getPokemon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect } from "react";

export default function Footer() {
  const [lastCommit, setLastCommit] = useState(null);
  const repo = "https://github.com/Nathan-Cherny/Corphicient";

  useEffect(() => {
    async function lastCommit() {
      setLastCommit(await getLastCommit());
    }

    lastCommit();
  }, []);

  console.log(lastCommit);

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
        </a>

        {/* Awesome Pocket Monsters */}
        <Pokemon />

        {lastCommit && (
          <div
            className="text-white flex flex-col items-center text-sm"
            onClick={() => window.open(lastCommit[0].html_url)}
          >
            <h2>Last Commit</h2>
            <hr className="w-full"/>
            <p>
              {new Date(lastCommit[0].commit.author.date).toLocaleString()}
            </p>
            <div className="flex flex-row items-center gap-3">
              <div className="flex flex-col items-center">
                <img
                  className="h-7.5 w-7.5"
                  src={lastCommit[0].committer.avatar_url}
                />
                <p>{lastCommit[0].commit.committer.name}</p>
              </div>
              <p>{lastCommit[0].commit.message}</p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

async function getLastCommit() {
  let res = await fetch(
    `https://api.github.com/repos/Nathan-Cherny/Corphicient/commits?per_page=1`,
  );
  return await res.json();
}
