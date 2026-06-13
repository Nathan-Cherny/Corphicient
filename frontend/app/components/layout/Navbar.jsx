"use client";

import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import corphishLogo from "@/public/corphish.png";
import FadeOverlay from "./FadeOverlay";

import {
  Music,
  UserCheck,
  Workflow,
  Joystick,
  ChevronDown,
  ListIcon,
} from "lucide-react";

import Link from "next/link";
import TODO from "../other/TODO";

export default function Navbar() {
  const [navLinks, setNavLinks] = useState([]);
  const pathname = usePathname();
  const [todoOpen, setTodoOpen] = useState(false);

  useEffect(() => {
    let navLinksData = [
      { href: "/music_player", label: "Music Player", icon: Music },
      {
        href: "http://localhost:8000/admin/",
        label: "Admin",
        icon: UserCheck,
        newTab: true,
      },
      {
        href: "/work_functions",
        label: "Work Functions",
        icon: Workflow,
        newTab: true,
      },
      {
        href: "/games",
        label: "Games",
        icon: Joystick,
        newTab: true,
        dropdown: [
          {
            href: "/games/pokemon",
            label: "20 Questions Pkmn!",
            icon: Joystick,
            newTab: true,
          },
        ],
      },
      {
        label: "TODO",
        icon: ListIcon,
        onClick: () => {
          setTodoOpen(true);
        },
      },
    ];

    setNavLinks(navLinksData);
  }, []);

  return (
    <>
      <nav
        style={{ backgroundColor: "rgb(20, 40, 40)" }}
        className="absolute top-0 left-0 right-0 z-50 backdrop-blur-xl after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.75 after:bg-[#00a0b5]"
      >
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
                loading="eager"
                height="auto"
              />
              <span className="hidden sm:inline font-sans">Corphicient</span>
            </Link>

            <div className="flex items-center gap-1">
              {navLinks.map((link) => getHTMLFromLinkData(link, pathname))}
            </div>
          </div>
        </div>
      </nav>
      <FadeOverlay isOpen={todoOpen} onClose={() => setTodoOpen(false)}>
        <TODO />
      </FadeOverlay>
    </>
  );
}

function DropdownNavItem({ link, pathname }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isActive = pathname === link.href;

  return (
    <div ref={ref} className="relative">
      <Link
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          isActive
            ? "text-white bg-green-500/50"
            : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
        )}
        href={link.href}
        target={link.newTab ? "_blank" : "_self"}
      >
        <link.icon className="w-4 h-4" />
        <span className="hidden sm:inline">{link.label}</span>
        <ChevronDown
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0ms",
          }}
          className={cn(
            `w-3 h-3 hidden sm:inline transition-transform duration-200`,
          )}
        />
      </Link>

      {open && (
        <div
          style={{ backgroundColor: "rgb(20, 40, 40)" }}
          className="absolute right-0 top-full mt-1 min-w-40 rounded-xl border border-[#00a0b5]/30 overflow-hidden py-1 z-50"
        >
          {link.dropdown.map((item) => {
            const isSubActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                target={item.newTab ? "_blank" : "_self"}
                onClick={(e) => {
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200",
                  isSubActive
                    ? "text-white bg-green-500/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getHTMLFromLinkData(link, pathname) {
  if (link.onClick) {
    return (
      <div
        onClick={link.onClick}
        key={link.label}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all duration-200 text-zinc-400 hover:text-white hover:bg-zinc-800/50",
        )}
      >
        <link.icon className="w-4 h-4" />
        <span className="hidden sm:inline">{link.label}</span>
      </div>
    );
  }

  if (link.dropdown) {
    return <DropdownNavItem key={link.label} link={link} pathname={pathname} />;
  }

  const isActive = pathname === link.href;
  return (
    <Link
      key={link.label}
      href={link.href}
      target={link.newTab ? "_blank" : "_self"}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
        isActive
          ? "text-white bg-green-500/50"
          : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
      )}
    >
      <link.icon className="w-4 h-4" />
      <span className="hidden sm:inline">{link.label}</span>
    </Link>
  );
}
