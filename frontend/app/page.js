"use client";

import axiosClient from "./axiosClient";
import Form from "./components/forms/parseForm";
import SongsList from "./components/songs/SongsList";

import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div>
      <SongsList request={["songs/", null, "", "GET"]} />
      <button onClick={() => addSong()}>add</button>
      <Form formType="get_song_form"/>
    </div>
  );
}
