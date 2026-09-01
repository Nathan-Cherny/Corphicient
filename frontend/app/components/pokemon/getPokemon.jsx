"use client";

import { useEffect, useState } from "react";
import { getDexData, genPkmn } from "@/app/games/pokemon/page";

export default function RandomPokemon() {
  const [allPokemon, setAllPokemon] = useState({});
  const [rootMediaFolder, setRootMediaFolder] = useState("ani");
  const [chance, setChance] = useState(8191);
  const [types, setTypes] = useState([]);
  const [pokemon, setPokemon] = useState({});
  const [isShiny, setIsShiny] = useState(false);
  const [update, setUpdate] = useState(1);
  const [color, setColor] = useState("white");
  const shinyChance = 8192;

  useEffect(() => {
    async function loadPokemon() {
      let dexData = allPokemon;

      if (Object.keys(allPokemon) == 0) {
        dexData = await getDexData();
        setAllPokemon(dexData);
      }

      let pkmn = genPkmn(setPokemon, dexData);

      let pkmnChance = Math.floor(Math.random() * shinyChance + 1);
      setChance(pkmnChance);

      const shiny = chance == 1;
      setIsShiny(shiny);

      if (shiny) {
        alert(
          `YOU FOUND A SHINY ${pkmn.name}!! THE CHANCE FOR THAT IS 1/${shinyChance} OR ${(1 / shinyChance) * 100}%`,
        );
      }

      setPkmnColor(pkmn.color, setColor);
      setTypes(pkmn.types || []);
    }

    loadPokemon();
  }, [update]);

  function switchAni() {
    if (rootMediaFolder == "ani") {
      setRootMediaFolder("gen5ani");
    } else {
      setRootMediaFolder("ani");
    }
  }

  if (!pokemon) return null;

  const shinySegment = isShiny ? "-shiny" : "";

  const src = getSrc(
    rootMediaFolder,
    shinySegment,
    pokemon.name?.toLowerCase(),
  );

  console.log(pokemon)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "15px",
      }}
      title={chance}
    >
      {/* Image */}
      <div className="flex flex-col justify-start">
        <img
          onClick={(e) => {
            if(e.shiftKey){
              switchAni()
            }
            else{
              setUpdate(update + 1);
            }
          }}
          onMouseOver={switchAni}
          onError={(e) => {e.target.src = `https://play.pokemonshowdown.com/sprites/ani/corphish.gif`}}
          onMouseLeave={switchAni}
          className="h-25 py-5 hover:cursor-pointer hover:box-border transition"
          src={src}
          alt={pokemon.id}
        />
        {/* <button
          onClick={switchAni}
          className="text-gray-400 text-sm border-gray-400 border"
        >
          {rootMediaFolder}
        </button> */}
      </div>
      {/* Pokemon Info */}
      <div
        className="flex flex-col h-full text-center text-sm"
        style={{ color: `${color}` }}
      >
        <a
          href={`https://pokemondb.net/pokedex/${pokemon?.name?.replaceAll(" ", "-").replaceAll(".", "")}`}
          target="_blank"
        >
          {pokemon.name}
        </a>
        <hr className="w-full my-1" />

        {/* Number and Types */}
        <div className="flex flex-row gap-3 items-center justify-center">
          <p>№: {pokemon.num || "N/A"}</p>
          <div className="flex flex-col justify-center">
            <img
              src={`https://play.pokemonshowdown.com/sprites/types/${types[0]}.png`}
            />
            {types[1] && (
              <img
                src={`https://play.pokemonshowdown.com/sprites/types/${types[1]}.png`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Stats, off to the side */}
      {pokemon.baseStats && (
        <div
          className="flex flex-col items-end text-[7.5px]"
          style={{ color: `${color}` }}
        >
          {Object.keys(pokemon.baseStats).map((s) =>
            getStatBar(s, pokemon.baseStats),
          )}
        </div>
      )}
    </div>
  );
}

function getStatBar(stat, baseStats) {
  return (
    <div key={stat} className="flex flex-row items-center gap-x-3 flex-1">
      <p>{stat}: </p> <ProgressBar value={baseStats[stat]} max={255} />
    </div>
  );
}

function setPkmnColor(color, setColor) {
  color = color.toLowerCase();

  const map = {
    blue: "aqua",
    black: "gray",
    purple: "lightpurple",
    green: "lime",
  };

  let parsedColor = map[color] ? map[color] : color;

  setColor(parsedColor);
}

function ProgressBar({ value, max }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-25 h-full bg-transparent">
      <div
        className="h-2.5 transition-all duration-300"
        style={{
          width: `${percentage}%`,
          background: getColorFromValue(value),
        }}
      ></div>
    </div>
  );
}

function getColorFromValue(value) {
  if (value > 224) {
    return "fuchsia";
  } else if (value > 199) {
    return "mediumpurple";
  } else if (value > 174) {
    return "#2196F3";
  } else if (value > 149) {
    return "deepskyblue";
  } else if (value > 124) {
    return "aquamarine";
  } else if (value > 99) {
    return "lightgreen";
  } else if (value > 74) {
    return "yellow";
  } else if (value > 49) {
    return "orange";
  } else if (value > 24) {
    return "red";
  } else {
    return "darkred";
  }
}

function getSrc(rootMediaFolder, shinySegment, pokemonName) {
  const src = `https://play.pokemonshowdown.com/sprites/${rootMediaFolder}${shinySegment}/${pokemonName}.gif`;
  return src;
}
