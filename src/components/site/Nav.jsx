import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./Logo";

const links = [
  { href: "/#yonalishlar", label: "Yo'nalishlar" },
  { href: "/#metodika", label: "Metodika" },
  { href: "/#ustozlar", label: "Ustozlar" },
  { href: "/#natijalar", label: "Natijalar" },
  { href: "/#aloqa", label: "Aloqa" },
];

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const handleChange = () => {
      if (media.matches) setIsOpen(false);
    };

    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-5 pt-5 sm:px-6 md:px-10 md:pt-7">
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
          <span aria-hidden>-&gt;</span>
        </Link>

        <button
          type="button"
          aria-label={isOpen ? "Menyuni yopish" : "Menyuni ochish"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper shadow-sm transition-colors hover:bg-ember md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-0 bg-ink/35 transition-opacity duration-300 md:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div
        id="mobile-menu"
        className={`relative z-10 mx-5 mt-4 overflow-hidden rounded-md border border-rule bg-paper shadow-2xl transition-[max-height,opacity,transform] duration-300 sm:mx-6 md:hidden ${
          isOpen
            ? "max-h-[32rem] translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <nav className="px-5 py-4" aria-label="Mobil menyu">
          <div className="space-y-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={closeMenu}
                className="flex items-center justify-between border-b border-rule py-4 font-display text-2xl leading-none text-ink transition-colors last:border-b-0 hover:text-ember"
              >
                {l.label}
                <span className="text-base text-ember" aria-hidden>
                  -&gt;
                </span>
              </a>
            ))}
          </div>
          <Link
            to="/"
            hash="aloqa"
            onClick={closeMenu}
            className="mt-5 inline-flex w-full items-center justify-between rounded-full bg-ink px-5 py-3.5 text-sm text-paper transition-colors hover:bg-ember"
          >
            Sinov darsi
            <span aria-hidden>-&gt;</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export { Nav };
