"use client";

import Form from "../forms/Forms";

export default function EditSong({ song }) {
  return (
    <div className="flex flex-col gap-3 bg-white p-5">
      <Form
        formType="get_song_form"
        nonFormFields={["secondsPlayed", "src", "duration"]}
        submitFunction={() => {
          console.log("test");
        }}
        name={`Edit ${song.name}`}
      >
        <CropSong/>
      </Form>
    </div>
  );
}

function CropSong(){
  return <div>crop</div>
}