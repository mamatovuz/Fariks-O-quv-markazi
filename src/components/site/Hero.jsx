import hero from "@/assets/hero-student.jpg";
import { ChevronMark } from "./Logo";
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-28 sm:pt-32 md:pt-40">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {/* Left: meta column */}
          <div className="col-span-12 md:col-span-3 md:pt-6">
            <div className="eyebrow">№ 001 — Andijon</div>
            <div className="rule-line mt-4 w-16" />
            <p className="mt-6 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
              2016-yildan beri o'quvchilarni xalqaro imtihonlar va oliygohlarga tayyorlovchi
              mustaqil o'quv markazi.
            </p>
          </div>

          {/* Center: headline */}
          <div className="col-span-12 md:col-span-9">
            <h1
              className="font-display text-balance text-[clamp(2.5rem,12vw,7rem)] leading-[0.92] tracking-[-0.02em] text-ink"
              style={{ fontWeight: 400 }}
            >
              Eng yuksak
              <br />
              <em className="font-display italic" style={{ fontWeight: 300 }}>
                maqsadlar
              </em>{" "}
              <span className="underline-ember">sari</span>
              <span className="text-ember">.</span>
            </h1>

            <div className="mt-10 grid grid-cols-12 items-end gap-6">
              <p className="col-span-12 max-w-xl text-pretty text-base leading-relaxed text-ink/75 md:col-span-7">
                FARIKS — bilim olishni o'rgatadigan, o'qituvchi bilan o'quvchi o'rtasidagi masofani
                qisqartiradigan, har bir bolaning ichidagi imkoniyatni topib chiqaradigan kichik,
                izchil va talabchan maktab.
              </p>
              <div className="col-span-12 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center md:col-span-5 md:justify-end">
                <a
                  href="#aloqa"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm text-paper transition-all hover:bg-ember"
                >
                  Bepul sinov darsi
                  <ChevronMark className="h-3 w-5" />
                </a>
                <a
                  href="#yonalishlar"
                  className="inline-flex items-center justify-center gap-2 text-sm text-ink/80 underline-offset-4 hover:text-ember hover:underline sm:justify-start"
                >
                  Yo'nalishlarni ko'rish
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Big image with side stats */}
        <div className="mt-16 grid grid-cols-12 gap-6 md:mt-24 md:gap-10">
          <figure className="relative col-span-12 md:col-span-9">
            <div className="relative overflow-hidden bg-muted">
              <img
                src={hero}
                alt="FARIKS o'quv markazi o'quvchisi darsda"
                width={1536}
                height={1920}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-[46vh] min-h-[320px] w-full object-cover sm:h-[56vh] md:h-[78vh]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2 text-paper sm:flex-row sm:items-end sm:justify-between">
                <span className="text-[11px] uppercase tracking-[0.22em] opacity-90">
                  Dars · Matematika kursi
                </span>
                <span className="font-display text-sm italic opacity-90">Andijon, 2025</span>
              </div>
            </div>
          </figure>

          <aside className="col-span-12 grid grid-cols-2 gap-x-6 md:col-span-3 md:flex md:flex-col md:justify-between">
            <Stat number="1,240" label="Bitiruvchilar" />
            <Stat number="94%" label="Oliygohga kirish" />
            <Stat number="9" label="Yo'nalish" />
            <Stat number="12" label="Ustoz" last />
          </aside>
        </div>
      </div>
    </section>
  );
}
function Stat({ number, label, last }) {
  return (
    <div className={`py-6 ${last ? "" : "border-b border-rule"}`}>
      <div className="font-display text-4xl leading-none text-ink" style={{ fontWeight: 500 }}>
        {number}
      </div>
      <div className="eyebrow mt-2">{label}</div>
    </div>
  );
}
export { Hero };
