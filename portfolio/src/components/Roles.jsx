import { useEffect, useRef, useState } from "react";
import { FLIPS } from "../data.js";
import { reduced } from "../lib/index.js";

// One word flips while the sentence stays put (transform and opacity only).
export default function Roles() {
  const scene = useRef(null);
  const curRef = useRef(0);
  const [cur, setCur] = useState(0);
  const [out, setOut] = useState(null);
  const [snap, setSnap] = useState(false); // jump back below without animating
  const [subOn, setSubOn] = useState(true);
  const [subIdx, setSubIdx] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    let timers = [];
    let interval = 0;
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    const next = () => {
      const c = curRef.current;
      const n = (c + 1) % FLIPS.length;
      curRef.current = n;
      setCur(n);
      setOut(c);
      setSubOn(false);
      later(() => {
        setSubIdx(n);
        setSubOn(true);
      }, 220);
      later(() => {
        setSnap(true);
        setOut(null);
        requestAnimationFrame(() => requestAnimationFrame(() => setSnap(false)));
      }, 500);
    };

    const io = new IntersectionObserver(
      (entries) => {
        // Several entries can arrive together; the last one is the current state.
        const e = entries[entries.length - 1];
        clearInterval(interval);
        if (e.isIntersecting) interval = setInterval(next, 3400);
      },
      { threshold: 0.35 }
    );
    io.observe(scene.current);
    return () => {
      io.disconnect();
      clearInterval(interval);
      timers.forEach(clearTimeout);
      timers = [];
    };
  }, []);

  return (
    <section ref={scene} className="roles" id="roles" aria-label="Roles">
      <div className="roles-in">
        {reduced ? (
          <ul className="roles-static">
            {FLIPS.map((f) => (
              <li key={f.word}>I build {f.word}. {f.sub}</li>
            ))}
          </ul>
        ) : (
          <>
            <h2 className="roles-text" aria-label={`I build ${FLIPS[cur].word}`}>
              <span className="rl" aria-hidden="true">I build</span>
              <span className="flip" aria-hidden="true">
                {FLIPS.map((f, i) => (
                  <span
                    key={f.word}
                    className={`flip-w${i === cur ? " is-on" : ""}${i === out ? " is-out" : ""}${snap ? " reset" : ""}`}
                  >
                    {f.word}
                  </span>
                ))}
              </span>
            </h2>
            <p className="roles-sub" aria-hidden="true" data-on={subOn}>{FLIPS[subIdx].sub}</p>
          </>
        )}
        <div className="more">
          <a className="btn" href="#work">See my work <span className="arrow">→</span></a>
          <a className="btn ghost" href="#contact">Get in touch</a>
        </div>
      </div>
    </section>
  );
}
