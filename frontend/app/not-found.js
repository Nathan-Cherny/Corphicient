"use client";

import { useEffect, useState } from "react";
import { PageMain } from "./components/layout/PageMain";
import axiosClient from "./axiosClient";
import Section from "./components/notes/section/Section";
import { usePathname } from "next/navigation";
import corphishSad from "@/public/corphish-sad.png";
import Image from "next/image";

export default function Home() {
  return (
    <PageMain>
      <div className="my-auto mx-0">
        <div className="flex flex-row gap-5 w-full justify-around items-center">
          <Image src={corphishSad} className="max-w-75" alt="corphish so sad" />
          <div className="text-center flex flex-col gap-10">
            <h1 className="text-5xl font-bold">Page Not Found!</h1>
            <p>
              Sorry but I couldn't find the page with pathname{" "}
              <span className="font-bold">"{usePathname()}" </span> - maybe try
              using the navbar!
            </p>
          </div>
        </div>
      </div>
    </PageMain>
  );
}
