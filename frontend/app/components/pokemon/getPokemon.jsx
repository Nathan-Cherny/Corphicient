"use client";

import { useEffect, useState } from "react";
import { getDexData, genPkmn } from "@/app/games/pokemon/page";

export default function RandomPokemon() {
  const [allPokemon, setAllPokemon] = useState({})
  const [types, setTypes] = useState([])
  const [pokemon, setPokemon] = useState({});
  const [isShiny, setIsShiny] = useState(false);
  const [update, setUpdate] = useState(1)
  const [color, setColor] = useState("white")
  const shinyChance = 8192;

  useEffect(() => {
    async function loadPokemon(){
      let dexData = allPokemon

      if(Object.keys(allPokemon) == 0){
        dexData = await getDexData()
        setAllPokemon(dexData);
      }
      
      let pkmn = genPkmn(setPokemon, dexData)

      const shiny= Math.floor(Math.random() * shinyChance + 1) == 1;
      setIsShiny(shiny);

      if(shiny){
        alert(`YOU FOUND A SHINY ${pokemon.name}!! THE CHANCE FOR THAT IS 1/${shinyChance} OR ${(1/shinyChance) * 100}%`)
      }

      setPkmnColor(pkmn.color, setColor)
      setTypes(pkmn.types || [])
    }
    
    loadPokemon()
    
  }, [update]);
  
  if (!pokemon) return null; 

  const shinySegment = isShiny ? "-shiny" : "";

  const src = `https://play.pokemonshowdown.com/sprites/gen5ani${shinySegment}/${pokemon.name?.toLowerCase()}.gif`;

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px"}} >
      {/* Image (gen5 sprite) */}
      <img onClick={() => {setUpdate(update + 1)}} className="h-25 py-5 hover:cursor-pointer hover:box-border transition" src={src} alt={pokemon.id} />
      {/* Pokemon Info */}
      <div className="flex flex-col h-full text-center text-sm" style={{ color: `${color}` }}>
        <p>{pokemon.name}</p>
        <hr className="w-full my-1" />
        <div className="flex flex-row gap-3 items-center justify-center">
          <p>№: {pokemon.num || "N/A"}</p>
          <div className="flex flex-col justify-center">
            <img src={`https://play.pokemonshowdown.com/sprites/types/${types[0]}.png`} />
            {types[1] && <img src={`https://play.pokemonshowdown.com/sprites/types/${types[1]}.png`} />}
          </div>
        </div>
      </div>
    </div>
  )
}

function setPkmnColor(color, setColor){
  color = color.toLowerCase()

  const map = {
    "blue": "aqua",
    "black": "gray",
    "purple": "lightpurple",
    "green": "lime"
  }

  let parsedColor = map[color] ? map[color] : color
  
  setColor(parsedColor)

}