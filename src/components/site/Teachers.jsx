import t1Color from "@/assets/teacher-1-color.jpg";
import t2Color from "@/assets/teacher-2-color.jpg";
import t3Color from "@/assets/teacher-3-color.jpg";
const teachers = [
  {
    img: t1Color,
    name: "Sherzod Karimov",
    role: "Bosh ustoz \xB7 Matematika",
    note: "20 yillik tajriba. Olimpiada g'oliblari ustozi.",
  },
  {
    img: t2Color,
    name: "Madina Rashidova",
    role: "IELTS \xB7 Speaking & Writing",
    note: "British Council sertifikati. Cambridge bitiruvchisi.",
  },
  {
    img: t3Color,
    name: "Bekzod Yusupov",
    role: "SAT \xB7 Math & Informatika",
    note: "MIT mock-kurs muallifi. 12 yillik mentorlik.",
  },
];
function Teachers() {
  return (
    <section id="ustozlar" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between">
          <div>
            <div className="eyebrow">Ustozlar</div>
            <h2
              className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.02em] text-ink"
              style={{ fontWeight: 400 }}
            >
              Bilimni emas —
              <br />
              <em className="italic" style={{ fontWeight: 300 }}>
                o'qishni o'rgatadigan
              </em>{" "}
              odamlar.
            </h2>
          </div>
          <a
            href="#aloqa"
            className="hidden text-sm text-muted-foreground underline-offset-4 hover:text-ember hover:underline md:inline"
          >
            Barcha jamoa →
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {teachers.map((t, i) => (
            <article key={t.name} className={i === 1 ? "md:mt-20" : ""}>
              <div className="group/image relative overflow-hidden bg-muted">
                <img
                  src={t.img}
                  alt={t.name}
                  width={800}
                  height={1024}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover/image:scale-[1.03] group-hover/image:grayscale-0 motion-reduce:transition-none"
                />
                <span className="absolute left-3 top-3 text-[10px] uppercase tracking-[0.22em] text-paper mix-blend-difference">
                  0{i + 1}
                </span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-ink" style={{ fontWeight: 500 }}>
                    {t.name}
                  </h3>
                  <div className="mt-1 text-sm text-muted-foreground">{t.role}</div>
                </div>
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ember" />
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/70">{t.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export { Teachers };
