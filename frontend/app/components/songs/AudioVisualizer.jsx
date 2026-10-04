"use client";

import { useEffect, useRef } from "react";
import { mapSongColorToLowerTint } from "../visual/colors";

const BAR_COUNT = 10;
const MIN_BIN = 1; // skip the DC bin
const MAX_BIN = 180; // ~15 kHz at 44.1 kHz with fftSize 512; nothing musical above this
const MIN_LENGTH = 6; // percent of the strip's width, so idle bars still show as little stubs

// Splits the lower part of the spectrum into BAR_COUNT log-spaced ranges, since
// pitch is perceived logarithmically (equal-width ranges would put almost every
// bar in the treble where there's little energy).
function buildBinRanges(binCount) {
  const maxBin = Math.min(MAX_BIN, binCount);
  const ratio = maxBin / MIN_BIN;
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const start = Math.floor(MIN_BIN * ratio ** (i / BAR_COUNT));
    const end = Math.floor(MIN_BIN * ratio ** ((i + 1) / BAR_COUNT));
    return [start, Math.max(start + 1, end)];
  });
}


/**
 * A stack of horizontal bars driven by the audio that's actually playing. Each
 * bar grows from the thumbnail's right border toward the right as its slice of
 * the spectrum gets louder. Treble is at the top, bass at the bottom. Widths are
 * written straight to the DOM each frame so React doesn't re-render at 60fps.
 */
export default function AudioVisualizer({ currentAudioRef, currentSong }) {
  const barRefs = useRef([]);

  useEffect(() => {
    const bars = barRefs.current;
    const setAllLengths = (percent) =>
      bars.forEach((bar) => {
        if (bar) bar.style.width = `${percent}%`;
      });

    setAllLengths(MIN_LENGTH);

    const audio = currentAudioRef.current;
    if (!audio || !currentSong) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let frame = null;
    let analyser = null;

    const draw = (ranges, data) => {
      analyser.getByteFrequencyData(data);

      // bar i in the DOM is frequency range i (bass first)
      ranges.forEach(([start, end], freqIndex) => {
        const bar = bars[freqIndex];
        if (!bar) return;

        // Use the loudest bin in the range, not the average: treble bars span many
        // bins, and averaging would dilute a strong peak into a barely-moving bar.
        let peak = 0;
        for (let bin = start; bin < end; bin++) {
          if (data[bin] > peak) peak = data[bin];
        }
        const loudness = peak / 255;

        // highs carry less energy than bass, so lift them a little
        const tilt = 1 + (freqIndex / (BAR_COUNT - 1)) * 0.8;
        const level = Math.min(1, loudness ** 1.3 * tilt);

        bar.style.width = `${MIN_LENGTH + level * (100 - MIN_LENGTH)}%`;
      });

      frame = requestAnimationFrame(() => draw(ranges, data));
    };

    const start = async () => {
      if (analyser) return;
      const node = await connectAudio(audio);
      if (!node || cancelled) return;
      analyser = node;
      draw(
        buildBinRanges(analyser.frequencyBinCount),
        new Uint8Array(analyser.frequencyBinCount),
      );
    };

    // If the audio context wasn't allowed to start yet, try again on the next play
    const onPlay = () => {
      resumeAudioContext();
      start();
    };

    start();
    audio.addEventListener("play", onPlay);

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      audio.removeEventListener("play", onPlay);
      setAllLengths(MIN_LENGTH);
    };
  }, [currentSong, currentAudioRef]);

  const color = mapSongColorToLowerTint(currentSong)

  // flex-col-reverse puts the first bar (bass) at the bottom and treble at the top
  return (
    <div
      aria-hidden="true"
      className="flex w-24 py-2.5 min-w-0 shrink flex-col-reverse items-start gap-0.5"
    >
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          className="min-h-0 flex-1 rounded-r-lg border-2"
          // React only rewrites style keys whose value changed, so the width the
          // draw loop sets each frame isn't clobbered by re-renders
          style={{ backgroundColor: mapSongColorToLowerTint(currentSong, i * 10), width: `${MIN_LENGTH}%`, borderLeftColor: mapSongColorToLowerTint(currentSong, i * 10) }}
        />
      ))}
    </div>
  );
}

// Shared Web Audio graph for the song visualizer.
//
// Every song has its own <audio> element, but they all feed one AudioContext and
// one AnalyserNode, so the visualizer only has to listen to a single place.
//
// Gotchas this file handles:
//  - createMediaElementSource() can only be called once per element, and once an
//    element is routed through the graph its sound ONLY comes out via the graph.
//    That's why the WeakMap exists, and why the analyser connects to the destination.
//  - A suspended AudioContext would silence any routed element, so we only route an
//    element once the context is confirmed running. If it isn't (e.g. Safari before a
//    user gesture), the song keeps playing normally and the visualizer just stays idle.

let ctx = null;
let analyser = null;
const sources = new WeakMap();

export async function connectAudio(audio) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!audio || !AudioContextClass) return null;

  if (!ctx) {
    ctx = new AudioContextClass();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.8;
    analyser.connect(ctx.destination);
  }

  if (ctx.state !== "running") {
    try {
      await ctx.resume();
    } catch {
      // not allowed yet; handled below
    }
  }
  if (ctx.state !== "running") return null;

  if (!sources.has(audio)) {
    try {
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      sources.set(audio, source);
    } catch (error) {
      // e.g. the element is already attached to an older context after a hot reload
      console.warn("Audio visualizer unavailable for this song:", error);
      return null;
    }
  }

  return analyser;
}

export function resumeAudioContext() {
  if (ctx && ctx.state !== "running") {
    ctx.resume().catch(() => {});
  }
}
