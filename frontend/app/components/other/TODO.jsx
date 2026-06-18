export default function TODO() {
  return (
    <div className="flex flex-col bg-white p-5 justify-center">
      <div className="flex flex-row w-full justify-center items-center">
        <img className="max-w-1/5" src="https://archives.bulbagarden.net/media/upload/0/04/PinRSani341.png" />
        <h1 className="font-extrabold text-2xl mx-1">Website TODOs</h1>
        <img className="max-w-1/5" src="https://archives.bulbagarden.net/media/upload/0/04/PinRSani341.png" />
      </div>
      <hr className="my-5"/>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <h1 className="text-center text-3xl font-bold">Music</h1>
          <ul>
            <li>Big thing is making fadedisplays for EDITING songs and playlists.</li>
            <li>every song and playlist has an edit button, click it, you can delete / change names / crop song / change whatever for that song or playlist</li>
            <br/>
            <li>Make forms for adding songs and playlists better</li>
            <li>Song cards need to look better - bg color, maybe a picture?</li>
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <h1 className="text-center text-3xl font-bold">Pokemon Games</h1>
          <ul>
            <li>I mean, i know what to do, just work on it if im bored :)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
