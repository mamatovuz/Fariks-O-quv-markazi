import { Wordmark } from "./Logo";

const mapUrl = "https://maps.app.goo.gl/yYW1uQNSPN1BweEc8";
const fullAddress = "Andijon viloyati, Qo'rg'ontepa tumani Hokimyat roparasida.";

function Footer() {
  return (
    <footer className="bg-ink py-16 text-paper">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-8 px-5 sm:px-6 md:gap-10 md:px-10">
        <div className="col-span-12 md:col-span-5">
          <Wordmark invert />
          <p className="mt-6 max-w-xs text-sm text-paper/60">
            FARIKS o'quv markazi. Andijon viloyatida xalqaro imtihonlar va oliygohlarga tayyorlaydi.
          </p>
        </div>

        <div className="col-span-12 sm:col-span-6 md:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.22em] text-paper/40">Sayt</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/#yonalishlar" className="hover:text-ember">
                Yo'nalishlar
              </a>
            </li>
            <li>
              <a href="/#metodika" className="hover:text-ember">
                Metodika
              </a>
            </li>
            <li>
              <a href="/#ustozlar" className="hover:text-ember">
                Ustozlar
              </a>
            </li>
            <li>
              <a href="/#natijalar" className="hover:text-ember">
                Natijalar
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-12 sm:col-span-6 md:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.22em] text-paper/40">Aloqa</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/#aloqa" className="hover:text-ember">
                Ariza qoldirish
              </a>
            </li>
            <li>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="hover:text-ember">
                Xaritada ko'rish
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="text-[10px] uppercase tracking-[0.22em] text-paper/40">Manzil</div>
          <p className="mt-4 font-display text-lg leading-tight">{fullAddress}</p>
        </div>

        <div className="col-span-12 mt-10 flex flex-col gap-3 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <span>
            © {/* @__PURE__ */ new Date().getFullYear()} FARIKS. Barcha huquqlar himoyalangan.
          </span>
          <span className="font-display italic">«Eng yuksak maqsadlar sari.»</span>
        </div>
      </div>
    </footer>
  );
}
export { Footer };
