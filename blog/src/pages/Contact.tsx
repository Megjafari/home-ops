import { useState } from "react";
import { EMAIL, PORTFOLIO_URL } from "../components/Nav";

const links = [
  { label: "Portfolio", href: PORTFOLIO_URL },
  { label: "GitHub", href: "https://github.com/Megjafari" },
  { label: "LinkedIn", href: "https://linkedin.com/in/meghdad-jafari" },
];

export default function Contact() {
  const [state, setState] = useState<"" | "ok" | "fail">("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setState("ok");
    } catch {
      setState("fail");
    }
    setTimeout(() => setState(""), 1600);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 sm:pt-36">
      <h1 className="text-[clamp(52px,12vw,120px)] leading-[0.94] font-light tracking-[-0.055em]">Let's talk.</h1>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg-muted">
        A question about a post, a mistake I should fix, or something about backend, infrastructure or work.
        Write to me.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <a
          href={`mailto:${EMAIL}`}
          className="border-b border-line text-[clamp(18px,4.6vw,34px)] tracking-[-0.03em] transition-colors hover:border-accent"
        >
          {EMAIL}
        </a>
        <button type="button" onClick={copy} className="btn min-h-8 px-4 py-1 text-[13px] md:min-h-8">
          {state === "ok" ? "Copied" : state === "fail" ? "Press ⌘C" : "Copy"}
        </button>
      </div>

      <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-2 text-[17px]">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="border-b border-transparent transition-colors hover:border-fg-muted"
            >
              {link.label} <span className="text-fg-muted">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
