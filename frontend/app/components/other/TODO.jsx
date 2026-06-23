export default function TODO() {
  return (
    <div className="flex flex-col bg-white p-5 justify-center">
      <div className="flex flex-row w-full justify-center items-center">
        <img
          className="max-w-1/5"
          src="https://archives.bulbagarden.net/media/upload/0/04/PinRSani341.png"
        />
        <h1 className="font-extrabold text-2xl mx-1">Website TODOs</h1>
        <img
          className="max-w-1/5"
          src="https://archives.bulbagarden.net/media/upload/0/04/PinRSani341.png"
        />
      </div>
      <hr className="my-5" />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <h1 className="text-center text-3xl font-bold">Music</h1>
          <ul>
            <li>crop song functionality, crop on add, crop on edit</li>
            <li>Make forms for adding/editing songs and playlists better</li>
            <li>Song cards need to look better - bg color, maybe a picture?</li>
            <li>move delete to be in the edit page for songs and playlists</li>
            <li>show all hotkeys</li>
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <h1 className="text-center text-3xl font-bold">Notes</h1>
          <ul>
            <li>the idea is by next semester im not using the TODO sheet anymore</li>
            <li>Due dates/tasks will be handled by Google Calendar</li>
            <li>TODOs are handled by calendar, Notes should be here and organized by section (health, whatever)</li>
            <li>Passwords here?</li>
            <li>Ugh google contacts to get the birthday calendar</li>
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <h1 className="text-center text-3xl font-bold">Games</h1>
          <ul>
            <li>the footer pokemon could have a rating system so i could overtime have a full tier list</li>
            <li>20 questions is pretty underdeveloped but idk if i wanna work on it</li>
          </ul>
        </div>

        {/* <div className="flex flex-col gap-5">
          <h1 className="text-center text-3xl font-bold">Work</h1>
          <ul>
            <li></li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
