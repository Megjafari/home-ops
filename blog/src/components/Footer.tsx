import { EMAIL, PORTFOLIO_URL, RSS_URL } from "./Nav";

const links = [
  { label: "Portfolio", href: PORTFOLIO_URL },
  { label: "GitHub", href: "https://github.com/Megjafari" },
  { label: "LinkedIn", href: "https://linkedin.com/in/meghdad-jafari" },
  { label: "RSS", href: RSS_URL },
];

export default function Footer() {
  return (
    <footer className="mx-auto mt-28 max-w-3xl border-t border-line/70 px-6 pt-20 pb-9">
      <h2 className="text-[clamp(44px,10vw,96px)] leading-[0.98] font-normal tracking-[-0.05em]">
        Let's talk.
      </h2>
      <a
        href={`mailto:${EMAIL}`}
        className="mt-7 inline-block border-b border-line text-[clamp(17px,4.4vw,32px)] tracking-[-0.03em] transition-colors hover:border-accent"
      >
        {EMAIL}
      </a>
      <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="transition-colors hover:text-fg">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-20 border-t border-line/70 pt-5 text-[13px] text-fg-muted/80">
        © {new Date().getFullYear()} Meghdad Jafari
      </p>
    </footer>
  );
}
