"use client";

import PlaylistList from ".././components/playlists/PlaylistList";
import { PageMain } from "../components/layout/PageMain";

export default function Music() {
  return (
    <PageMain>
      <PlaylistList />
    </PageMain>
  );
}
