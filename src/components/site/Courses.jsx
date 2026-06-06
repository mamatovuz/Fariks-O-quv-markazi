import { Link } from "@tanstack/react-router";
import { defaultContent } from "@/data/site-content";

function Courses({ courses = defaultContent.courses, intro = defaultContent.coursesIntro }) {
  return (
    <section id="yonalishlar" className="bg-paper py-20 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-4">
            <div className="eyebrow">{intro.eyebrow}</div>
            <h2
              className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.02em] text-ink"
              style={{ fontWeight: 400 }}
            >
              {intro.title}
              <br />
              <em className="italic" style={{ fontWeight: 300 }}>
                {intro.emphasis}
              </em>
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
              {intro.body}
            </p>
          </div>

          <ul className="col-span-12 md:col-span-8">
            {courses.map((c, i) => (
              <li
                key={c.slug}
                className={`group ${i === 0 ? "border-y" : "border-b"} border-rule transition-colors hover:bg-accent/30`}
              >
                <Link
                  to="/kurslar/$slug"
                  params={{ slug: c.slug }}
                  className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr] md:grid-cols-12 md:gap-6 md:py-10"
                  aria-label={`${c.title} haqida batafsil`}
                >
                  <div className="md:col-span-1">
                    <span className="font-display text-sm text-ember">{c.no}</span>
                  </div>
                  <div className="min-w-0 md:col-span-6">
                    <h3
                      className="text-balance font-display text-2xl leading-tight text-ink md:text-3xl"
                      style={{ fontWeight: 500 }}
                    >
                      {c.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {c.blurb}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:col-start-2 md:col-span-4 md:col-start-auto">
                    <div className="min-w-0">
                      <div className="eyebrow">Davomiyligi</div>
                      <div className="mt-2 break-words text-sm text-ink">{c.duration}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="eyebrow">Daraja</div>
                      <div className="mt-2 break-words text-sm text-ink">{c.level}</div>
                    </div>
                  </div>
                  <div className="sm:col-start-2 md:col-span-1 md:col-start-auto md:text-right">
                    <span
                      className="font-display text-xl text-ink transition-all group-hover:text-ember"
                      aria-hidden
                    >
                      -&gt;
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export { Courses };
