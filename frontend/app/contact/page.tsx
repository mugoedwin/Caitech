"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { submitContact } from "@/lib/api/content";
import { ApiError, fieldErrors } from "@/lib/api/client";
import { instituteContact } from "@/lib/content/institute";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFields({});
    setSubmitting(true);
    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        website,
      });
      setDone(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setFields(fieldErrors(err));
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not send your message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Contact hero — centered invitation */}
      <section className="border-b border-line bg-ground">
        <Container className="flex flex-col items-center py-16 text-center md:py-20 lg:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-petrol">
            Contact · Nairobi CBD
          </p>
          <div
            className="mt-5 h-1 w-12 rounded-full bg-lime"
            aria-hidden
          />
          <h1 className="mt-6 max-w-2xl font-display text-[2.35rem] leading-[1.08] tracking-tight text-balance text-petrol sm:text-5xl md:text-[3.25rem]">
            Let&apos;s build your next step.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted md:mt-6 md:text-lg">
            Admissions, programmes, schedules, and campus visits — reach the
            CAITECH team at KTDA Plaza, Moi Avenue.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:mt-10">
            {["Admissions", "Schedules", "Campus visits"].map((label, i) => (
              <span key={label} className="flex items-center gap-3">
                {i > 0 ? (
                  <span
                    className="hidden h-1 w-1 rounded-full bg-petrol/25 sm:block"
                    aria-hidden
                  />
                ) : null}
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-petrol-muted">
                  {label}
                </span>
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-ground py-12 md:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-12">
            <div className="relative flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-[var(--shadow-sm)] md:p-8">
              {done ? (
                <div className="flex h-full flex-col justify-center">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-petrol">
                    Sent
                  </p>
                  <h2 className="mt-3 font-display text-2xl text-petrol md:text-3xl">
                    Thank you — we received your message
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                    The admissions team will respond using the contact details
                    you provided.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setDone(false)}
                    >
                      Send another message
                    </Button>
                    <Button href="/courses" variant="lime">
                      Explore courses
                    </Button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="flex h-full flex-col gap-5"
                >
                  <div>
                    <h2 className="font-display text-2xl text-petrol">
                      Send an enquiry
                    </h2>
                    <p className="mt-2 text-sm text-ink-muted">
                      Required fields help us route your message quickly.
                    </p>
                  </div>

                  <div
                    className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
                    aria-hidden
                  >
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <Input
                    id="name"
                    label="Full name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={fields.name}
                    autoComplete="name"
                    disabled={submitting}
                  />
                  <Input
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={fields.email}
                    autoComplete="email"
                    disabled={submitting}
                  />
                  <Input
                    id="phone"
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={fields.phone}
                    autoComplete="tel"
                    hint="Optional"
                    disabled={submitting}
                  />
                  <Textarea
                    id="message"
                    label="Message"
                    name="message"
                    required
                    fill
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    error={fields.message}
                    disabled={submitting}
                  />

                  {error ? (
                    <p
                      role="alert"
                      className="rounded-[var(--radius-md)] border border-danger/30 bg-[color-mix(in_oklab,var(--color-danger)_8%,var(--color-surface))] px-4 py-3 text-sm text-danger"
                    >
                      {error}
                    </p>
                  ) : null}

                  <div className="mt-auto pt-1">
                    <Button
                      type="submit"
                      variant="lime"
                      size="lg"
                      disabled={submitting}
                      className="w-full sm:w-auto"
                    >
                      {submitting ? "Sending…" : "Send message"}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            <aside className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-petrol-deep text-white shadow-[var(--shadow-md)]">
              <div className="relative h-44 shrink-0 sm:h-48">
                <Image
                  src="/images/home/discipline-building-v2.jpg"
                  alt="Built environment — Nairobi campus context"
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width:1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-deep via-petrol-deep/40 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-6 p-6 md:p-7">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-lime">
                    Campus
                  </p>
                  <h2 className="mt-2 font-display text-xl text-white">
                    CAITECH Global Institute
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    {instituteContact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                  <a
                    href={instituteContact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-sm font-semibold text-lime underline-offset-4 hover:underline"
                  >
                    Open in Maps →
                  </a>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                    Phone
                  </p>
                  <ul className="mt-2 m-0 list-none space-y-1.5 p-0">
                    {instituteContact.phones.map((p) => (
                      <li key={p}>
                        <a
                          href={`tel:${p.replace(/\s+/g, "")}`}
                          className="text-base font-semibold text-white hover:text-lime"
                        >
                          {p}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                    Email
                  </p>
                  <a
                    href={`mailto:${instituteContact.email}`}
                    className="mt-2 inline-block text-base font-semibold text-lime hover:underline"
                  >
                    {instituteContact.email}
                  </a>
                </div>

                <div className="mt-auto rounded-[var(--radius-md)] border border-white/10 bg-white/5 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                    We can help with
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    Admissions · Programme selection · Schedules · Campus visits
                    · Technical training pathways
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="section-tint-soft border-b border-line py-12 md:py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                t: "Admissions",
                d: "Entry pathways, programme fit, and what to prepare before you enrol.",
              },
              {
                t: "Schedules",
                d: "Intake timing and how technical short courses and longer tracks run.",
              },
              {
                t: "Campus visits",
                d: "See facilities at KTDA Plaza and talk through tools used in training.",
              },
            ].map((item) => (
              <div
                key={item.t}
                className="border-l-2 border-[var(--color-amber)] bg-surface px-5 py-4 shadow-[var(--shadow-sm)]"
              >
                <h3 className="font-display text-lg text-petrol">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {item.d}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-[var(--shadow-sm)] md:flex-row md:items-center md:p-8">
            <div>
              <h2 className="font-display text-2xl text-petrol">
                Prefer to browse first?
              </h2>
              <p className="mt-2 max-w-md text-sm text-ink-muted">
                Explore live courses or the full services overview before you
                write in.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/courses" variant="lime">
                Courses
              </Button>
              <Button href="/services" variant="secondary">
                Services
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
