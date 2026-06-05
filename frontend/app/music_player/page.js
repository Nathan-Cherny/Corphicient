"use client";

import Form from ".././components/forms/Forms";
import { addSong } from ".././components/songs/SongFunctions";
import { addPlaylist } from ".././components/playlists/PlaylistFunctions";

import PlaylistList from ".././components/playlists/PlaylistList";
import { PageMain } from "../components/layout/PageMain";
import { useEffect } from "react";

export default function Music() {
  return (
    <PageMain>
      <PlaylistList />
      <Form formType="get_song_form" nonFormFields={["secondsPlayed", "src", "duration"]} submitFunction={addSong}/>
      <Form formType="get_playlist_form" submitFunction={addPlaylist}/>
    </PageMain>
  );
}
