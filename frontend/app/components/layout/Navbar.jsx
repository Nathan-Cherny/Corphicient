"use client";

import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import corphishLogo from "@/public/corphish.png";
import Pokemon from "../pokemon/getPokemon";

import { Music, UserCheck } from "lucide-react";

import Link from "next/link";

export default function Navbar() {
  const [navLinks, setNavLinks] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    let navLinksData = [
      { href: "/music_player", label: "Music Player", icon: Music },
      {
        href: "http://localhost:8000/admin/",
        label: "Admin",
        icon: UserCheck,
        newTab: true,
      },
    ];

    setNavLinks(navLinksData);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "i":
          let result = prompt("Extract ID from Google URL");
          let split = result.split("/");
          let id = split[split.length - 2];
          navigator.clipboard.writeText(id);
          break;
        case "x":
          let yes = prompt("ai-ify").replaceAll("xSoTec", "PLACE");
          for (let i of [
            "Nathan",
            "Jay",
            "Eliana",
            "nathan",
            "jay",
            "stephen",
            "Stephen",
            "Tom",
            "eliana",
          ]) {
            yes = yes.replaceAll(i, "");
          }
          navigator.clipboard.writeText(yes);
          break
        case "z":
          let ai = prompt("deai-ify").replaceAll("PLACE", "xSoTec");
          navigator.clipboard.writeText(ai);
          break
        case "g":
          let loop = prompt("loopObj -> globalObj");
          loop = loop.replaceAll("loopObj", "globalObj")
          navigator.clipboard.writeText(loop);
          break
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.75 after:bg-[#00a0b5]">
        <div className="max-w-11/12 mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-1/8 py-1">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-white font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
            >
              <Image
                src={corphishLogo}
                alt="Corphish Logo"
                width={75}
                height={75}
              />
              <span className="hidden sm:inline font-sans">Corphicient</span>
            </Link>

            <div className="flex items-center gap-1">
              {navLinks.map((link) => getHTMLFromLinkData(link, pathname))}
            </div>

            <div>
              <Pokemon />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

function getHTMLFromLinkData(link, pathname) {
  const isActive = pathname === link.href;

  return (
    <Link
      key={link.href}
      href={link.href}
      target={link.newTab ? "_blank" : "_self"}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
        isActive
          ? "text-white  bg-green-500/50"
          : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
      )}
    >
      <link.icon className="w-4 h-4"></link.icon>
      <span className="hidden sm:inline">{link.label}</span>
    </Link>
  );
}
