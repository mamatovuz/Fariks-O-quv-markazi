import desk from "@/assets/desk.jpg";
const steps = [
  {
    n: "I",
    title: "Diagnostika",
    body: "Birinchi suhbatda o'quvchining hozirgi darajasi, maqsadi va vaqt resursi aniqlanadi. Yo'nalish shu yerda tanlanadi.",
  },
  {
    n: "II",
    title: "Shaxsiy yo'l xaritasi",
    body: "Har bir o'quvchiga 1, 3 va 6 oylik mo'ljallar yoziladi. Mentor bilan haftalik yakun chiqariladi.",
  },
  {
    n: "III",
    title: "Kichik guruh",
    body: "10 kishigacha. Ustoz har bir o'quvchiga yetadi, suhbat ma'ruzaga aylanmaydi.",
  },
  {
    n: "IV",
    title: "Mock va tahlil",
    body: "Haftalik sinov imtihonlari va xato daftari. Bilim emas, xato ustida ishlanadi.",
  },
];
function Method() {
  return (
    <section id="metodika" className="relative bg-ink py-20 text-paper md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-paper/60">Metodika</div>
            <h2
              className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ fontWeight: 400 }}
            >
              Sirimiz yo'q.
              <br />
              <em className="italic" style={{ fontWeight: 300 }}>
                Faqat to'rt qadam
              </em>{" "}
              <span className="text-ember">va</span> izchillik.
            </h2>

            <figure className="mt-12 overflow-hidden">
              <img
                src={desk}
                alt="Daftar va qalam — o'quvchi stoli"
                loading="lazy"
                decoding="async"
                width={1280}
                height={960}
                className="h-64 w-full object-cover grayscale sm:h-72 md:h-96"
              />
              <figcaption className="mt-3 text-xs text-paper/60">
                «Yaxshi yozilgan xato — yangi bilimning kalitidir.»
              </figcaption>
            </figure>
          </div>

          <ol className="col-span-12 md:col-span-7 md:pl-10">
            {steps.map((s, i) => (
              <li
                key={s.n}
                className={`grid grid-cols-12 gap-4 py-7 md:py-10 ${i === 0 ? "border-y" : "border-b"} border-paper/15`}
              >
                <div className="col-span-2">
                  <span className="font-display text-3xl text-ember" style={{ fontWeight: 500 }}>
                    {s.n}
                  </span>
                </div>
                <div className="col-span-10">
                  <h3 className="font-display text-2xl md:text-3xl" style={{ fontWeight: 500 }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-paper/70">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
export { Method };
