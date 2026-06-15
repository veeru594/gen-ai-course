import { useState } from "react";
import "./JourneyVideo.css";

/* The cinematic course opener for Module 01. Poster-gated: the 14 MB MP4 is
   not fetched until the student clicks play, so it never costs a Foundations
   page load. Framed as a "before we begin" motivator, not a numbered lesson —
   it spans infrastructure the curriculum doesn't formally teach. */
export function JourneyVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      className="journey-video"
      aria-label="Intro video: the journey of one request"
    >
      <p className="meta journey-video-eyebrow">Before we begin</p>
      <h2 className="journey-video-title">The journey of one request</h2>
      <p className="journey-video-lede">
        What actually happens between pressing Enter and seeing the first word —
        the entire path your prompt travels through the internet and the model,
        and all the way back. Ninety-six seconds. Watch it once before the
        lessons start.
      </p>

      <div className="journey-video-frame">
        {playing ? (
          <video
            className="journey-video-el"
            src="/llm-journey.mp4"
            poster="/llm-journey-poster.png"
            controls
            autoPlay
            playsInline
          />
        ) : (
          <button
            type="button"
            className="journey-video-poster"
            style={{ backgroundImage: "url(/llm-journey-poster.png)" }}
            onClick={() => setPlaying(true)}
            aria-label="Play the intro video — the journey of one request, 1 minute 36 seconds"
          >
            <span className="journey-video-scrim" aria-hidden="true" />
            <span className="journey-video-play" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 34 34">
                <path d="M12 8 L26 17 L12 26 Z" fill="currentColor" />
              </svg>
            </span>
            <span className="journey-video-dur meta" aria-hidden="true">
              1:36
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
