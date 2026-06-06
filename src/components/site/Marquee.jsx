import { defaultContent } from "@/data/site-content";

function Marquee({ items = defaultContent.marquee.items }) {
  const cleanItems = items.map((item) => String(item || "").trim()).filter(Boolean);
  if (!cleanItems.length) return null;

  const source = cleanItems;
  const repeatCount = Math.max(3, Math.ceil(8 / source.length));
  const half = Array.from({ length: repeatCount }, () => source).flat();
  const row = [...half, ...half];

  return (
    <section
      aria-label="Yo'nalishlar"
      className="overflow-hidden border-y border-rule bg-paper py-5 sm:py-6"
    >
      <div className="flex w-max animate-marquee gap-8 sm:gap-12">
        {row.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-8 whitespace-nowrap font-display text-xl italic text-ink/80 sm:gap-12 sm:text-2xl md:text-3xl"
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
