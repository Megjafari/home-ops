import { useEffect, useRef } from "react";
import { createZoom } from "../lib/zoom.js";
import { createShader } from "../lib/shader.js";
import { reduced } from "../lib/index.js";
import { GITHUB, LINKEDIN, EMAIL, STATUS } from "../data.js";
import { GithubIcon, LinkedinIcon, MailIcon } from "./Icons.jsx";

export default function Hero() {
  const track = useRef(null);
  const sticky = useRef(null);
  const canvas = useRef(null);
  const glow = useRef(null);
  const extras = useRef(null);
  const shader = useRef(null);

  useEffect(() => {
    const zoom = createZoom({
      track: track.current,
      sticky: sticky.current,
      canvas: canvas.current,
      glow: glow.current,
      extras: extras.current,
    });
    const light = createShader(shader.current, track.current);
    return () => {
      zoom.destroy();
      light.destroy();
    };
  }, []);

  return (
    <section ref={track} className={`zoom-track${reduced ? " static" : ""}`} aria-label="Introduction">
      <div ref={sticky} className="zoom-sticky">
        <h1 className="sr-only">Meghdad Jafari, fullstack developer</h1>
        <div ref={glow} className="zoom-glow" aria-hidden="true">
          <canvas ref={shader} className="shader" />
        </div>
        <canvas ref={canvas} className="zoom-canvas" aria-hidden="true" />
        <div ref={extras} className="zoom-extras">
          <div className="hero-links">
            <a href={GITHUB} aria-label="GitHub"><GithubIcon /><span className="lbl">GitHub</span></a>
            <a href={LINKEDIN} aria-label="LinkedIn"><LinkedinIcon /><span className="lbl">LinkedIn</span></a>
            <a href={`mailto:${EMAIL}`} aria-label="Email"><MailIcon /><span className="lbl">Email</span></a>
          </div>
          <p className="hero-sub"><span className="dot" /><span>{STATUS}</span></p>
          <p className="hero-note"><span className="dot" /><span>{STATUS}</span></p>
          <span className="cue" aria-hidden="true">Scroll<i /></span>
        </div>
      </div>
    </section>
  );
}
