import { RSS_URL } from "./Nav";

const links = [
  { label: "Portfolio", href: "https://meghdadjafari.dev" },
  { label: "GitHub", href: "https://github.com/Megjafari" },
  { label: "LinkedIn", href: "https://linkedin.com/in/meghdad-jafari" },
  { label: "RSS", href: RSS_URL },
];

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Meghdad Jafari</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="transition-colors hover:text-fg">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
