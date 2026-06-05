const items = [
  "IELTS 7.5+",
  "SAT 1400+",
  "Matematika",
  "Ingliz tili",
  "Rus tili",
  "Ona tili va Adabiyot",
  "Informatika",
  "Prezident maktabiga tayyorlov",
  "DTM",
];
function Marquee() {
  const row = [...items, ...items];
  return (
    <section
      aria-label="Yo'nalishlar"
      className="border-y border-rule bg-paper py-6 overflow-hidden"
    >
      <div className="flex w-max animate-marquee gap-12">
        {row.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-12 font-display text-2xl italic text-ink/80"
            style={{ fontWeight: 400 }}
          >
            <span>{t}</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
          </div>
        ))}
      </div>
    </section>
  );
}
export { Marquee };
