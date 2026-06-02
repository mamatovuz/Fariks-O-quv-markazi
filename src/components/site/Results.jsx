const stories = [
  {
    quote:
      "Birinchi yarim yilda IELTS 6.0 dan 7.5 ga ko'tarildim. Mock-imtihonlar haqiqiy testdan ham qiyinroq edi \u2014 shuning uchun test kuni xotirjam o'tirdim.",
    name: "Nodira A.",
    where: "Westminster International University",
  },
  {
    quote:
      "Matematika menga doim qiyin tuyulardi. Ustoz xato qilishdan qo'rqishni olib tashladi. Olimpiyadada birinchi joyni oldim.",
    name: "Sardor T.",
    where: "Prezident maktabi, 9-sinf",
  },
  {
    quote:
      "Bir yil ichida SAT'da 1190 dan 1480 ga keldim. Application essayni FARIKS jamoasi bilan birga yozdim.",
    name: "Diyora M.",
    where: "NYU Abu Dhabi \xB7 2024",
  },
];
function Results() {
  return (
    <section id="natijalar" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-3">
            <div className="eyebrow">Natijalar</div>
            <h2
              className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.02em] text-ink"
              style={{ fontWeight: 400 }}
            >
              O'quvchilar
              <br />
              <em className="italic" style={{ fontWeight: 300 }}>
                o'z so'zlari
              </em>{" "}
              bilan.
            </h2>
          </div>

          <div className="col-span-12 grid grid-cols-1 gap-6 md:col-span-9 md:grid-cols-3">
            {stories.map((s, i) => (
              <figure
                key={i}
                className="relative flex flex-col justify-between border border-rule bg-card p-7 transition-colors hover:border-ember"
              >
                <span
                  className="absolute -top-4 left-5 font-display text-6xl leading-none text-ember"
                  style={{ fontWeight: 500 }}
                  aria-hidden
                >
                  &ldquo;
                </span>
                <blockquote
                  className="font-display text-lg leading-snug text-ink"
                  style={{ fontWeight: 400 }}
                >
                  {s.quote}
                </blockquote>
                <figcaption className="mt-10 border-t border-rule pt-4">
                  <div className="text-sm text-ink">{s.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.where}</div>
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
