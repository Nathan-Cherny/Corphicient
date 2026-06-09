"use client";

import { PageMain } from "../components/layout/PageMain";

function capitalizeFirstLetter() {
  let toCapitalize = prompt("Capitalize First Letter").split(" ");
  if (!toCapitalize) return;

  toCapitalize = toCapitalize.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  toCapitalize = toCapitalize.join(" ");
  navigator.clipboard.writeText(toCapitalize);
}

function extractIDFromURL() {
  let result = prompt("Extract ID from Google URL");
  if (!result) return;
  let split = result.split("/");
  let id = split[split.length - 2];
  navigator.clipboard.writeText(id);
}

function AI_ify() {
  let yes = prompt("ai-ify").replaceAll("xSoTec", "PLACE");

  if(!yes) return

  for (let i of [
    "Nathan",
    "Jay",
    "Eliana",
    "nathan",
    "jay",
    "stephen",
    "Stephen",
    "Tom",
    "eliana",
  ]) {
    yes = yes.replaceAll(i, "");
  }
  navigator.clipboard.writeText(yes);
}

function loopObjToGlobalObj() {
  let loop = prompt("loopObj -> globalObj");
  if (!loop) return;

  loop = loop.replaceAll("loopObj", "globalObj");
  navigator.clipboard.writeText(loop);
}

function deAI_ify() {
  let ai = prompt("deai-ify").replaceAll("PLACE", "xSoTec");
  if (!ai) return;

  navigator.clipboard.writeText(ai);
}

export default function WorkFunctions() {
  const functions = [
    capitalizeFirstLetter,
    AI_ify,
    deAI_ify,
    loopObjToGlobalObj,
    extractIDFromURL,
  ];

  console.log(functions);

  return (
    <PageMain>
      <div style={{ marginTop: "5%" }}>
        {functions.map((func) => (
          <button className="border m-5 p-5 text-6xl cursor-pointer hover:scale-105" key={func.name} onClick={() => func()}>
            {func.name}
          </button>
        ))}
      </div>
    </PageMain>
  );
}
