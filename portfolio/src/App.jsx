import { useEffect, useState } from "react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Roles from "./components/Roles.jsx";
import { About, Blog, Footer, Homelab, Projects, Skills } from "./components/Sections.jsx";
import { clamp, reduced } from "./lib/index.js";

// hero: the name on the shader. ink: the colored scene. page: the rest of the page.
function useNavState() {
  const [state, setState] = useState("hero");

  useEffect(() => {
    const update = () => {
      const roles = document.getElementById("roles");
      const track = document.querySelector(".zoom-track");
      if (!roles || !track) return;
      const r = roles.getBoundingClientRect();
      const range = track.offsetHeight - track.firstElementChild.clientHeight;
      const p = range > 0 && !reduced ? clamp(-track.getBoundingClientRect().top / range, 0, 1) : 0;
      const navY = 38;
      const next = r.bottom < navY ? "page" : r.top <= navY || p > 0.62 ? "ink" : "hero";
      setState((s) => (s === next ? s : next));
      document.documentElement.classList.toggle("hero-active", r.top > 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return state;
}

// Elements with .rv slide and fade in the first time they scroll into view.
function useRevealOnScroll() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  const navState = useNavState();
  useRevealOnScroll();

  useEffect(() => {
    document.documentElement.classList.toggle("reduced", reduced);
  }, []);

  return (
    <>
      <div className="bg" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <Nav state={navState} />
      <main id="top">
        <Hero />
        <Roles />
        <Projects />
        <Homelab />
        <Blog />
        <About />
        <Skills />
      </main>
      <Footer />
    </>
  );
}
