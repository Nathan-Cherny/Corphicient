"use client";

import axios from "axios";
import { PageMain } from "@/app/components/layout/PageMain";
import { useEffect, useState } from "react";

export default function Pokemon() {
  const [allPokemon, setAllPokemon] = useState({});
  const [typeChart, setTypeChart] = useState({});
  const [pokemon, setPokemon] = useState("");
  const [effectiveness, setEffectiveness] = useState(1);

  useEffect(() => {
    async function getDexData() {
      const res = await axios.get(
        "https://play.pokemonshowdown.com/data/pokedex.js",
      );

      const objectText = res.data
        .replace("exports.BattlePokedex =", "")
        .trim()
        .replace(/;$/, "");

      const pokedex = Function(`return (${objectText})`)();

      setAllPokemon(pokedex);
    }

    async function getTypeData() {
      const res = await axios.get(
        "https://play.pokemonshowdown.com/data/typechart.js",
      );

      const objectText = res.data
        .replace("exports.BattleTypeChart =", "")
        .trim()
        .replace(/;$/, "");

      const typeData = Function(`return (${objectText})`)();

      setTypeChart(typeData);
    }

    getDexData();
    getTypeData();
  }, []);

  useEffect(() => genPkmn(setPokemon, allPokemon), [allPokemon])

  return (
    <PageMain>
      <div style={{ marginTop: "5%" }}>
        <button onClick={() => genPkmn(setPokemon, allPokemon)}>Get Pokemon</button>
        <p>{pokemon.name}</p>
        <input
          id="supereffective"
          onChange={() =>
            calcEffectiveness(pokemon, typeChart, setEffectiveness)
          }
          placeholder="Is this type supereffective?"
        />
        <p>Effectiveness: {effectiveness}</p>
      </div>
    </PageMain>
  );
}

function genPkmn(setPokemon, allPokemon) {
  var keys = Object.keys(allPokemon);
  let chosen = allPokemon[keys[Math.floor(Math.random() * keys.length)]]
  if(!chosen) return 
  setPokemon(chosen);
}

function calcEffectiveness(pokemon, typeChart, setEffectiveness) {
  if (!pokemon) return;

  let effectiveness = 1;

  let pokemonTypes = pokemon.types;
  let qType = document.getElementById("supereffective").value;
  qType = qType.charAt(0).toUpperCase() + qType.slice(1);

  for (let type of pokemonTypes) {
    let testEffective = typeChart[type.toLowerCase()].damageTaken[qType];
    let specificEffectiveness = 1;
    if (testEffective == 1) specificEffectiveness = 2;
    if (testEffective == 2) specificEffectiveness = 0.5;
    effectiveness *= specificEffectiveness;
  }

  setEffectiveness(effectiveness);
}
