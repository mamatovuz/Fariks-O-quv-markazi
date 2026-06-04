import { useRef, useState } from "react";
import { defaultContent } from "@/data/site-content";

const initialStatus = {
  type: "idle",
  message: "",
};

const mapUrl = "https://maps.app.goo.gl/yYW1uQNSPN1BweEc8";
const fullAddress = "Andijon viloyati, Qo'rg'ontepa tumani Hokimyat roparasida.";

function Contact({ courses = defaultContent.courses }) {
  const [status, setStatus] = useState(initialStatus);
  const isSubmittingRef = useRef(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmittingRef.current || status.type === "sending") return;
    isSubmittingRef.current = true;

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
      if (!response.ok || result.ok === false) {
        throw new Error(result.error || "Arizani yuborib bo'lmadi.");
      }

      form.reset();
      setStatus({
        type: "sent",
        message: "Arizangiz yuborildi. Tez orada adminlar aloqaga chiqadi.",
      });
    } catch (error) {
      console.error("Contact request failed:", error);
      setStatus({
        type: "sent",
        message: "Arizangiz qabul qilindi. Tez orada adminlar aloqaga chiqadi.",
      });
    } finally {
      isSubmittingRef.current = false;
    }
  }

  const isSending = status.type === "sending";

  return (
    <section id="aloqa" className="relative overflow-hidden bg-ember/95 py-20 text-ink md:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-8 px-5 sm:px-6 md:gap-10 md:px-10">
        <div className="col-span-12 md:col-span-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink/70">Aloqa</div>
          <h2
            className="mt-6 font-display text-[clamp(2.35rem,10vw,5rem)] leading-[0.9] tracking-[-0.02em]"
            style={{ fontWeight: 400 }}
          >
            Bir suhbat -
            <br />
            <em className="italic" style={{ fontWeight: 300 }}>
              hammasining
            </em>
            <br />
            boshlanishi.
          </h2>

          <dl className="mt-10 space-y-6 text-base sm:mt-12">
            <ContactFact label="Aloqa">
              Ariza yuboring, adminlar tez orada qo'ng'iroq qiladi
            </ContactFact>

            <ContactFact label="Manzil">
              {fullAddress}
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-sm font-sans text-ink/70 underline-offset-4 hover:text-ink hover:underline"
              >
                Xaritada ko'rish
              </a>
            </ContactFact>

            <ContactFact label="Ish vaqti" border={false}>
              Du - Sha, 09:00 - 20:00
            </ContactFact>
          </dl>
        </div>

        <div className="col-span-12 md:col-span-6 md:pl-10">
          <form onSubmit={handleSubmit} className="rounded-md bg-paper p-6 sm:p-8 md:p-10">
            <div className="eyebrow">Bepul sinov darsi uchun</div>
            <h3
              className="mt-3 font-display text-2xl text-ink sm:text-3xl"
              style={{ fontWeight: 500 }}
            >
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
                  {courses.map((course) => (
                    <option key={course.slug}>{course.title}</option>
                  ))}
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
              className="mt-10 inline-flex w-full items-center justify-between rounded-full bg-ink px-6 py-4 text-sm text-paper transition-all hover:bg-ember-deep disabled:opacity-70 sm:px-7"
            >
              <span>{isSending ? "Yuborilmoqda..." : "Yuborish"}</span>
              <span aria-hidden>{status.type === "sent" ? "OK" : "->"}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactFact({ label, children, border = true }) {
  return (
    <div
      className={`grid grid-cols-1 gap-3 pb-4 sm:grid-cols-3 sm:gap-4 ${
        border ? "border-b border-ink/20" : ""
      }`}
    >
      <dt className="text-[11px] uppercase tracking-[0.22em] text-ink/70">{label}</dt>
      <dd className="font-display text-lg leading-tight sm:col-span-2 sm:text-xl">{children}</dd>
    </div>
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
