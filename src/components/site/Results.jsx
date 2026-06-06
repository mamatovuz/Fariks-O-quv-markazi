import { defaultContent } from "@/data/site-content";

function Results({ results = defaultContent.results }) {
  const stories = results.stories || [];

  return (
    <section id="natijalar" className="bg-paper py-20 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-3">
            <div className="eyebrow">{results.eyebrow}</div>
            <h2
              className="mt-6 text-balance font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] text-ink"
              style={{ fontWeight: 400 }}
            >
              {results.title}
              <br />
              <em className="italic" style={{ fontWeight: 300 }}>
                {results.emphasis}
              </em>{" "}
              {results.suffix}
            </h2>
          </div>

          <div className="col-span-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-9 lg:grid-cols-3">
            {stories.map((story, index) => (
              <figure
                key={`${story.name}-${index}`}
                className="relative flex min-w-0 flex-col justify-between border border-rule bg-card p-6 transition-colors hover:border-ember sm:p-7"
              >
                <span
                  className="absolute -top-4 left-5 font-display text-6xl leading-none text-ember"
                  style={{ fontWeight: 500 }}
                  aria-hidden
                >
                  &ldquo;
                </span>
                <blockquote
                  className="break-words font-display text-lg leading-snug text-ink"
                  style={{ fontWeight: 400 }}
                >
                  {story.quote}
                </blockquote>
                <figcaption className="mt-10 border-t border-rule pt-4">
                  <div className="text-sm text-ink">{story.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{story.where}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { Results };
