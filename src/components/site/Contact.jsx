import { useState } from "react";

const initialStatus = {
  type: "idle",
  message: "",
};
const mapUrl = "https://maps.app.goo.gl/yYW1uQNSPN1BweEc8";
const fullAddress = "Andijon viloyati, Qo'rg'ontepa tumani Hokimyat roparasida.";

function Contact() {
  const [status, setStatus] = useState(initialStatus);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    setStatus({ type: "sending", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Arizani yuborib bo'lmadi.");
      }

      form.reset();
      setStatus({
        type: "sent",
        message: "Arizangiz yuborildi. Tez orada adminlar aloqaga chiqadi.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
      });
    }
  }

  const isSending = status.type === "sending";

  return (
    <section id="aloqa" className="relative overflow-hidden bg-ember/95 py-24 text-ink md:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-6 px-6 md:gap-10 md:px-10">
        <div className="col-span-12 md:col-span-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink/70">Aloqa</div>
          <h2
            className="mt-6 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-[-0.02em]"
            style={{ fontWeight: 400 }}
          >
            Bir suhbat —
            <br />
            <em className="italic" style={{ fontWeight: 300 }}>
              hammasining
            </em>
            <br />
            boshlanishi.
          </h2>

          <dl className="mt-12 space-y-6 text-base">
            <div className="grid grid-cols-3 gap-4 border-b border-ink/20 pb-4">
              <dt className="text-[11px] uppercase tracking-[0.22em] text-ink/70">Aloqa</dt>
              <dd className="col-span-2 font-display text-xl">
                Ariza yuboring, adminlar tez orada qo'ng'iroq qiladi
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b border-ink/20 pb-4">
              <dt className="text-[11px] uppercase tracking-[0.22em] text-ink/70">Manzil</dt>
              <dd className="col-span-2 font-display text-xl">
                {fullAddress}
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block text-sm font-sans text-ink/70 underline-offset-4 hover:text-ink hover:underline"
                >
                  Xaritada ko'rish
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-[11px] uppercase tracking-[0.22em] text-ink/70">Ish vaqti</dt>
              <dd className="col-span-2 font-display text-xl">Du — Sha · 09:00 — 20:00</dd>
            </div>
          </dl>
        </div>

        <div className="col-span-12 md:col-span-6 md:pl-10">
          <form onSubmit={handleSubmit} className="rounded-md bg-paper p-8 md:p-10">
            <div className="eyebrow">Bepul sinov darsi uchun</div>
            <h3 className="mt-3 font-display text-3xl text-ink" style={{ fontWeight: 500 }}>
              Ariza qoldiring
            </h3>

            <div className="mt-8 space-y-6">
              <Field label="Ism" name="name" placeholder="Ism Familiya" />
              <Field label="Telefon" name="phone" placeholder="+998 __ ___ __ __" type="tel" />
              <div>
                <label className="eyebrow block">Yo'nalish</label>
                <select
                  name="course"
                  required
                  className="mt-2 w-full border-b border-rule bg-transparent py-3 text-base text-ink outline-none focus:border-ember"
                >
                  <option>IELTS</option>
                  <option>SAT</option>
                  <option>Ingliz tili — Foundation</option>
                  <option>Matematika</option>
                  <option>Prezident maktabi</option>
                  <option>Informatika</option>
                </select>
              </div>
              <div>
                <label htmlFor="details" className="eyebrow block">
                  Batafsil so'rov
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  rows={4}
                  placeholder="Qaysi kurs, darajangiz, qulay vaqt va qo'shimcha savollaringizni yozing"
                  className="mt-2 min-h-28 w-full resize-y border-b border-rule bg-transparent py-3 text-base text-ink placeholder:text-ink/30 outline-none focus:border-ember"
                />
              </div>
            </div>

            {status.message ? (
              <p
                className={`mt-6 text-sm ${
                  status.type === "error" ? "text-red-700" : "text-ink/70"
                }`}
              >
                {status.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSending}
              className="mt-10 inline-flex w-full items-center justify-between rounded-full bg-ink px-7 py-4 text-sm text-paper transition-all hover:bg-ember-deep disabled:opacity-70"
            >
              <span>{isSending ? "Yuborilmoqda..." : "Yuborish"}</span>
              <span aria-hidden>{status.type === "sent" ? "\u2713" : "\u2192"}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
function Field({ label, name, placeholder, type = "text" }) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow block">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full border-b border-rule bg-transparent py-3 text-base text-ink placeholder:text-ink/30 outline-none focus:border-ember"
      />
    </div>
  );
}
export { Contact };
