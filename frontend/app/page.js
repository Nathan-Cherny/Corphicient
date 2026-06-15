"use client";

import { PageMain } from "./components/layout/PageMain";

export default function Home() {
  return (
    <PageMain>
      <div className="m-20 flex flex-col gap-5 text-center justify-center w-1/3">
        <h1 className="text-4xl font-extrabold">Corphicient!</h1>
        <hr/>
        <div className="flex flex-row items-center gap-5">
          <div className="flex flex-col items-center gap-3">
            <h3 className="font-bold text-xl">Welcome to Corphicient, my one-stop-shop for everything productivity related.</h3>
          </div>
          <img className="h-full w-full" src="https://play.pokemonshowdown.com/sprites/gen5ani/corphish.gif"/>
        </div>
        <h3>What I love about programming, and what made me choose it as my career, is the ability to design anything I want and have it be practical.</h3>
        <h3>If I'm unsatisfied with, for example, YouTube's music playing abilities functionalities, I code and use my own, with full control and capacity to build whatever I think is best for me personally.</h3>
        <h3>Over the years, I've built lots of these kinds of productivity apps - some from scratch, some using preexisting frameworks. While these work, and have all been pivotal for my success, I've always aspired to have one centralized location for, everything!</h3>
        <h1 className="text-2xl">That's where Corphish comes into play!</h1>
        <div className="flex flex-row items-center gap-5">
          <img className="w-1/2" src="https://i.ytimg.com/vi/S0ihoKOhV1A/maxresdefault.jpg"/>
          <h2>Corphish is a goofy and quite unremarkable pokemon. But his dorky demeanor is charming, and combining the words 'Corphish' with 'Efficient' just sounded to good to pass up.</h2>
        </div>
        <h3>Corphicient is my way to have everything that I need be in one place. Easily accessible, easily customizable, and easily useable.</h3>
        <h3>With my days in college coming to an end, I realize just how important an organized productivity system is to being, well, productive. My hope is that Corphicient will help me continue to succeed even outside of college.</h3>
        <h3>Corphicient is also a way for me to continue learning about programming. It's my first big project with Django, and I'm pushing myself to tackle what's outside my comfort zone.</h3>
        <h3>Specifically, my goals for Corphicient are to:</h3>
        <div className="flex flex-row items-center gap-5">
          <ul className="list-disc flex flex-col text-left gap-4 text-sm">
            <li>Make at least <b>1</b> commit every day for as long as I can to continue progress</li>
            <li>Have a functional music player, TODO list, note taker, finance manager, etc all built into one place</li>
            <li>Push myself to learn unfamiliar topics and not stick to what I'm comfortable with</li>
            <li>Have fun programming!</li>
          </ul>
          <img className="w-1/2" src="https://preview.redd.it/opinions-on-ashs-corphish-v0-06k8v1nrvywc1.jpeg?auto=webp&s=b6aa098f7f28e16be087d9672273e3e49bd56bc9" />
        </div>
      </div>
    </PageMain>
  );
}
