"use client";

import Form from "./components/forms/Forms";
import { addSong } from "./components/songs/SongFunctions";
import { addPlaylist } from "./components/playlists/PlaylistFunctions";

import PlaylistList from "./components/playlists/PlaylistList";
import Pokemon from "./components/pokemon/getPokemon";

export default function Home() {
  return (
    <div>
      <Pokemon/>
      <PlaylistList />
      <Form formType="get_song_form" nonFormFields={["secondsPlayed", "src"]} submitFunction={addSong}/>
      <Form formType="get_playlist_form" submitFunction={addPlaylist}/>
    </div>
  );
}
