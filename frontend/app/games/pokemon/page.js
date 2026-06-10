"use client";

import axios from "axios";
import { PageMain } from "@/app/components/layout/PageMain";
import { useEffect } from "react";

export default function Pokemon() {
  useEffect(() => {
    async function getData() {
      let pokedex = await axios.get(
        "https://play.pokemonshowdown.com/data/pokedex.js",
      );
      let pokedexData = `{"data": ${pokedex.data.split("=")[1].trim().slice(0, -1)}}`
      console.log(pokedexData)
      console.log(JSON.parse(pokedexData))
    }

    getData()
  }, []);

  return (
    <PageMain>
      <h1 className="mt-5">yo</h1>
    </PageMain>
  );
}
