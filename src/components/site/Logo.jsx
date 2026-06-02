import { Link } from "@tanstack/react-router";

const logoSrc = "/FARIKS_LOGO-removebg-preview.png";

function ChevronMark({ className = "", title }) {
  return (
    <svg
      viewBox="0 0 92 60"
      className={className}
      role={title ? "img" : void 0}
      aria-label={title}
      aria-hidden={title ? void 0 : true}
      fill="none"
      stroke="var(--color-ember)"
      strokeWidth="6"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {[0, 24, 48].map((x) => (
        <g key={x}>
          <path d={`M${x + 2} 6 L${x + 26} 30`} />
          <path d={`M${x + 26} 30 L${x + 2} 54`} />
          <path d={`M${x + 2} 6 L${x + 8} 6`} strokeWidth="6" />
          <path d={`M${x + 2} 54 L${x + 8} 54`} strokeWidth="6" />
        </g>
      ))}
    </svg>
  );
}

function Wordmark({ small = false, invert = false }) {
  return (
    <Link
      to="/"
      aria-label="FARIKS - bosh sahifa"
      className={`inline-flex items-center transition-opacity hover:opacity-90 ${
        invert ? "rounded bg-paper/95 px-2 py-1" : ""
      }`}
    >
      <img
        src={logoSrc}
        alt="FARIKS"
        width={512}
        height={512}
        className={`${small ? "h-10 w-36" : "h-12 w-40 sm:h-14 sm:w-48 md:h-16 md:w-56"} object-cover object-center`}
      />
    </Link>
  );
}

export { ChevronMark, Wordmark };
