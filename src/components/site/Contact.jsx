import { useRef, useState } from "react";
import { defaultContent } from "@/data/site-content";

const initialStatus = {
  type: "idle",
  message: "",
};

function Contact({ courses = defaultContent.courses, contact = defaultContent.contact }) {
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
    } catch (error) {
      console.error("Contact request failed:", error);
    } finally {
      setStatus({
        type: "sent",
        message: contact.sentText,
      });
      isSubmittingRef.current = false;
    }
  }

  const isSending = status.type === "sending";

  return (
    <section id="aloqa" className="relative overflow-hidden bg-ember/95 py-20 text-ink md:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="min-w-0 lg:col-span-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink/70">
            {contact.eyebrow}
          </div>
          <h2
            className="mt-6 max-w-full text-balance font-display text-[clamp(2.2rem,14vw,5rem)] leading-[0.92] text-ink"
            style={{ fontWeight: 400 }}
          >
            {contact.title}
            <br />
            <em className="italic" style={{ fontWeight: 300 }}>
              {contact.emphasis}
            </em>
            <br />
            {contact.suffix}
          </h2>

          <dl className="mt-10 space-y-6 text-base sm:mt-12">
            <ContactFact label={contact.leadLabel}>{contact.leadText}</ContactFact>

            <ContactFact label={contact.addressLabel}>
              {contact.address}
              <a
                href={contact.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-sm font-sans text-ink/70 underline-offset-4 hover:text-ink hover:underline"
              >
                {contact.mapLabel}
              </a>
            </ContactFact>

            <ContactFact label={contact.hoursLabel} border={false}>
              {contact.hours}
            </ContactFact>
          </dl>
        </div>

        <div className="min-w-0 lg:col-span-6 lg:pl-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-full rounded-md bg-paper p-5 sm:p-8 lg:p-10"
          >
            <div className="eyebrow">{contact.formEyebrow}</div>
            <h3
              className="mt-3 font-display text-2xl text-ink sm:text-3xl"
              style={{ fontWeight: 500 }}
            >
              {contact.formTitle}
            </h3>

            <div className="mt-8 space-y-6">
              <Field label={contact.nameLabel} name="name" placeholder={contact.namePlaceholder} />
              <Field
                label={contact.phoneLabel}
                name="phone"
                placeholder={contact.phonePlaceholder}
                type="tel"
              />
              <div className="min-w-0">
                <label className="eyebrow block">{contact.courseLabel}</label>
                <select
                  name="course"
                  required
                  className="mt-2 w-full min-w-0 border-b border-rule bg-transparent py-3 text-base text-ink outline-none focus:border-ember"
                >
                  {courses.map((course) => (
                    <option key={course.slug}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-0">
                <label htmlFor="details" className="eyebrow block">
                  {contact.detailsLabel}
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  rows={4}
                  placeholder={contact.detailsPlaceholder}
                  className="mt-2 min-h-28 w-full min-w-0 resize-y border-b border-rule bg-transparent py-3 text-base text-ink placeholder:text-ink/30 outline-none focus:border-ember"
                />
              </div>
            </div>

            {status.message ? <p className="mt-6 text-sm text-ink/70">{status.message}</p> : null}

            <button
              type="submit"
              disabled={isSending}
              className="mt-10 inline-flex w-full items-center justify-between rounded-full bg-ink px-6 py-4 text-sm text-paper transition-all hover:bg-ember-deep disabled:opacity-70 sm:px-7"
            >
              <span>{isSending ? contact.sendingText : contact.submitText}</span>
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
      <dd className="min-w-0 break-words font-display text-lg leading-tight sm:col-span-2 sm:text-xl">
        {children}
      </dd>
    </div>
  );
}

function Field({ label, name, placeholder, type = "text" }) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="eyebrow block">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full min-w-0 border-b border-rule bg-transparent py-3 text-base text-ink placeholder:text-ink/30 outline-none focus:border-ember"
      />
    </div>
  );
}

export { Contact };
