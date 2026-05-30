"use client";

import Form from "./components/forms/Forms";
import { addSong } from "./components/songs/SongFunctions";
import { addPlaylist } from "./components/playlists/PlaylistFunctions";
import SongsList from "./components/songs/SongsList";

import { useEffect, useState } from "react";
import PlaylistList from "./components/playlists/PlaylistList";

export default function Home() {
  return (
    <div>
      <PlaylistList />
      <Form formType="get_song_form" nonFormFields={["secondsPlayed", "src"]} submitFunction={addSong}/>
      <Form formType="get_playlist_form" submitFunction={addPlaylist}/>
    </div>
  );
}
