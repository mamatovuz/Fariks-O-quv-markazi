import { Link } from "@tanstack/react-router";
import { Wordmark } from "./Logo";
const links = [
  { href: "/#yonalishlar", label: "Yo'nalishlar" },
  { href: "/#metodika", label: "Metodika" },
  { href: "/#ustozlar", label: "Ustozlar" },
  { href: "/#natijalar", label: "Natijalar" },
  { href: "/#aloqa", label: "Aloqa" },
];
function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 pt-7 md:px-10">
        <Wordmark />
        <nav className="hidden items-center gap-9 md:flex" aria-label="Asosiy">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm text-ink/80 transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <Link
          to="/"
          hash="aloqa"
          className="hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-all hover:bg-ember md:inline-flex"
        >
          Sinov darsi
          <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
export { Nav };
