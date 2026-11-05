import { RSS_URL } from "./Nav";

export default function Footer() {
  return (
    <footer className="mx-auto mt-28 flex max-w-3xl items-center justify-between gap-4 border-t border-line/70 px-6 pt-6 pb-10 text-[13px] text-fg-muted">
      <p>© {new Date().getFullYear()} Meghdad Jafari</p>
      <a href={RSS_URL} className="transition-colors hover:text-fg">
        RSS
      </a>
    </footer>
  );
}
