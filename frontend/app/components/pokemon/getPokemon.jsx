"use client";

import { useEffect, useState } from "react";
import { getDexData, genPkmn } from "@/app/games/pokemon/page";

export default function RandomPokemon() {
  const [allPokemon, setAllPokemon] = useState({})
  const [pokemon, setPokemon] = useState({});
  const [isShiny, setIsShiny] = useState(false);
  const [update, setUpdate] = useState(1)
  const shinyChance = 8192;

  useEffect(() => {
    async function loadPokemon(){
      let dexData = allPokemon

      if(Object.keys(allPokemon) == 0){
        dexData = await getDexData()
        setAllPokemon(dexData);
      }
      
      genPkmn(setPokemon, dexData)

      const shiny= Math.floor(Math.random() * shinyChance + 1) == 1;
      setIsShiny(shiny);

      if(shiny){
        alert(`YOU FOUND A SHINY ${pokemon.name}!! THE CHANCE FOR THAT IS 1/${shinyChance} OR ${(1/shinyChance) * 100}%`)
      }
    }
    
    loadPokemon()
    
  }, [update]);
  
  if (!pokemon) return null; 

  const shinySegment = isShiny ? "-shiny" : "";

  const src = `https://play.pokemonshowdown.com/sprites/gen5ani${shinySegment}/${pokemon.name?.toLowerCase()}.gif`;

  return <img onClick={() => {setUpdate(update + 1)}} className="h-25 py-5 hover:cursor-pointer hover:box-border transition" src={src} alt={pokemon.id} />;
}