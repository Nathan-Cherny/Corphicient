import Pokemon from "../pokemon/getPokemon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const repo = "https://github.com/Nathan-Cherny/Corphicient"

  return (
    <footer className="w-full mt-auto" style={{
      backgroundColor: "#0f1f1f",
      borderTop: "3px solid transparent",
      backgroundImage: "linear-gradient(#0f1f1f, #0f1f1f), linear-gradient(90deg, #ef4444, #ffffff, #ef4444)",
      backgroundOrigin: "border-box",
      backgroundClip: "padding-box, border-box",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "20px 32px",
        gap: "32px",
      }}>
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
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.85}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "75px",
            height: "75px",
            borderRadius: "50%",
            backgroundColor: "#1a2f2f",
            border: "1px solid #2a4444",
            flexShrink: 0,
          }}>
            <FontAwesomeIcon icon={faGithub} style={{ width: "50px", height: "50px" }} />
          </div>
        </a>

        {/* Awesome Pocket Monsters */}
        <Pokemon />
        
      </div>

    </footer>
  );
}