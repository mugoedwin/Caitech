import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { positioning, site } from "@/lib/content/stub-copy";
import { homeImages, instituteContact } from "@/lib/content/institute";

export const metadata: Metadata = {
  title: "About",
  description:
    "CAITECH Global Institute — practical technical education in ICT, engineering, design technology, and related disciplines in Nairobi.",
};

const APPROACH = [
  {
    number: "01",
    title: "Practical competence",
    body: "Developing the ability to apply technical knowledge in real working contexts — tools, standards, and project constraints included.",
  },
  {
    number: "02",
    title: "Creative thinking",
    body: "Encouraging thoughtful approaches to technical and design challenges, not only step-by-step procedure.",
  },
  {
    number: "03",
    title: "Professional readiness",
    body: "Building familiarity with workflows, documentation habits, and collaboration patterns used in professional environments.",
  },
] as const;

/** Local institutional photography already used on the homepage. */
const IMG = {
  ict: "/images/home/programme-ict.jpg",
  architecture: "/images/home/programme-architecture.jpg",
  engineering: "/images/home/discipline-engineering.jpg",
} as const;

/** Grammar-polished institutional statements (meaning unchanged). */
const VISION =
  "To be a world-class institutional hub of ICT, arts, and design.";
const MISSION =
  "To educate a diverse student population to become creative thinkers who contribute through creative professional work.";

export default function AboutPage() {
  return (
    <>
      {/* —— Hero —— */}
      <section className="relative isolate overflow-hidden border-b border-line bg-petrol-deep text-white">
        <div className="absolute inset-0">
          <Image
            src={homeImages.hero.src}
            alt={homeImages.hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(105deg,rgb(12_36_41/0.94)_0%,rgb(12_36_41/0.82)_48%,rgb(12_36_41/0.5)_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-petrol-deep/90 to-transparent"
          />
        </div>

        <Container className="relative py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <Eyebrow className="text-lime/90">About CAITECH</Eyebrow>
            <h1 className="mt-5 font-display text-[clamp(2.35rem,5.5vw,4rem)] leading-[1.05] tracking-tight text-white">
              Building skills.
              <span className="block text-lime">Shaping technical futures.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              CAITECH Global Institute prepares learners for the realities of
              modern technical work through practical education in ICT,
              engineering, design technology, and related disciplines.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="/courses" variant="lime" size="lg">
                Explore programmes
              </Button>
              <Button
                href="/contact"
                variant="ghost"
                size="lg"
                className="border border-white/25 text-white hover:bg-white/10 hover:text-white"
              >
                Contact the institute
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* —— Who we are —— */}
      <Section tone="ground">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Eyebrow>{positioning.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight text-petrol md:text-4xl">
              A technical institute focused on applied learning
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-muted md:text-[1.05rem]">
              {positioning.body.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
              <p>
                Based in Nairobi CBD, study is organised around tools,
                professional workflows, standards, and the discipline of
                finishing real work — not only theory on a page.
              </p>
            </div>
            <p className="mt-8 border-l-2 border-lime pl-4 font-display text-lg leading-snug text-petrol">
              {site.tagline}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden border border-line bg-petrol/5 sm:row-span-2 sm:aspect-auto sm:min-h-[28rem]">
              <Image
                src={homeImages.outcomes.src}
                alt={homeImages.outcomes.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-line bg-petrol/5">
              <Image
                src={IMG.ict}
                alt="ICT and digital skills learning environment"
                fill
                sizes="(max-width: 1024px) 50vw, 28vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-line bg-petrol/5">
              <Image
                src={IMG.engineering}
                alt="Engineering and technical practice"
                fill
                sizes="(max-width: 1024px) 50vw, 28vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* —— Learning through practice —— */}
      <Section
        tone="surface"
        eyebrow="Learning through practice"
        title="Competence grows where tools meet real problems"
        lede="Programmes are structured so learners move from concepts into applied tasks: digital production, technical drawing and modelling, systems work, and project delivery."
      >
        <div className="grid gap-6 lg:grid-cols-12">
          <figure className="relative aspect-[16/10] overflow-hidden border border-line bg-petrol/5 lg:col-span-7 lg:aspect-auto lg:min-h-[22rem]">
            <Image
              src={IMG.architecture}
              alt="Design technology and architectural production workflows"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-petrol-deep/85 to-transparent px-5 pb-4 pt-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-lime/90">
                Applied practice
              </p>
              <p className="mt-1 max-w-md text-sm text-white/90">
                Documentation, models, and production habits that transfer into
                workplace settings.
              </p>
            </figcaption>
          </figure>

          <div className="flex flex-col justify-between gap-6 border border-line bg-ground p-6 md:p-8 lg:col-span-5">
            <div>
              <Eyebrow>How study is framed</Eyebrow>
              <ul className="mt-6 space-y-5">
                {[
                  {
                    t: "Tools in context",
                    d: "Software and equipment are taught inside realistic tasks, not as isolated feature tours.",
                  },
                  {
                    t: "Workflows & standards",
                    d: "Learners encounter naming, layering, documentation, and quality checks that professional teams rely on.",
                  },
                  {
                    t: "Project-shaped progress",
                    d: "Milestones, critique, and revision build the habit of shipping work that can be reviewed.",
                  },
                ].map((item) => (
                  <li
                    key={item.t}
                    className="border-t border-line pt-5 first:border-t-0 first:pt-0"
                  >
                    <h3 className="font-display text-lg text-petrol">{item.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                      {item.d}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <Button href="/courses" variant="secondary" className="self-start">
              View programme catalogue
            </Button>
          </div>
        </div>
      </Section>

      {/* —— Vision & mission —— */}
      <Section tone="petrol">
        <div className="max-w-2xl">
          <Eyebrow className="text-lime/90">Direction</Eyebrow>
          <h2 className="mt-3 font-display text-3xl leading-tight text-white md:text-4xl">
            Vision and mission
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ground/75">
            The statements that guide how CAITECH positions its teaching and
            institutional focus.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <blockquote className="relative border border-white/15 bg-white/[0.04] p-7 md:p-9">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-lime">
              Vision
            </p>
            <p className="mt-5 font-display text-2xl leading-snug text-white md:text-[1.65rem]">
              {VISION}
            </p>
          </blockquote>
          <blockquote className="relative border border-white/15 bg-white/[0.04] p-7 md:p-9">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-lime">
              Mission
            </p>
            <p className="mt-5 font-display text-2xl leading-snug text-white md:text-[1.65rem]">
              {MISSION}
            </p>
          </blockquote>
        </div>
      </Section>

      {/* —— Approach —— */}
      <Section
        tone="ground"
        eyebrow="Our approach"
        title="Three principles behind the curriculum"
        lede="Explanatory pillars drawn from CAITECH’s positioning — not a separate certification framework."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {APPROACH.map((item) => (
            <article
              key={item.number}
              className="group flex h-full flex-col border border-line bg-surface p-6 transition-colors duration-200 hover:border-petrol/35 md:p-7"
            >
              <span className="font-mono text-[11px] tracking-[0.14em] text-ink-muted transition-colors group-hover:text-petrol">
                {item.number}
              </span>
              <h3 className="mt-6 font-display text-xl text-petrol md:text-[1.35rem]">
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
              <span
                aria-hidden
                className="mt-8 block h-px w-10 bg-lime transition-all duration-300 group-hover:w-16"
              />
            </article>
          ))}
        </div>
      </Section>

      {/* —— Location & contact —— */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="relative aspect-[16/11] overflow-hidden border border-line bg-petrol/5 lg:col-span-6 lg:aspect-auto lg:min-h-[22rem]">
            <Image
              src={homeImages.nairobi.src}
              alt={homeImages.nairobi.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(18_52_59/0.35),transparent_50%)]"
            />
          </div>

          <div className="flex flex-col justify-center lg:col-span-6">
            <Eyebrow>Visit & contact</Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight text-petrol md:text-4xl">
              {site.name}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">{site.shortName}</p>

            <address className="mt-8 not-italic">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                Location
              </p>
              <p className="mt-2 text-base leading-relaxed text-petrol">
                {instituteContact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                Email
              </p>
              <a
                href={`mailto:${instituteContact.email}`}
                className="mt-2 inline-block text-base text-petrol underline decoration-line underline-offset-4 transition-colors hover:text-petrol-deep hover:decoration-lime"
              >
                {instituteContact.email}
              </a>
              {instituteContact.phones.length > 0 ? (
                <>
                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                    Phone
                  </p>
                  <ul className="mt-2 space-y-1 text-base text-petrol">
                    {instituteContact.phones.map((phone) => (
                      <li key={phone}>
                        <a
                          href={`tel:${phone.replace(/\s+/g, "")}`}
                          className="underline decoration-line underline-offset-4 transition-colors hover:decoration-lime"
                        >
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </address>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/contact" variant="primary">
                Open contact page
              </Button>
              <Button
                href={instituteContact.mapsUrl}
                variant="secondary"
                external
              >
                Open in Maps
              </Button>
              <Button href="/courses" variant="ghost">
                Browse programmes
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* —— Closing CTA —— */}
      <section className="border-t border-line bg-petrol-deep">
        <Container className="flex flex-col items-start justify-between gap-8 py-14 md:flex-row md:items-center md:py-16">
          <div className="max-w-xl">
            <Eyebrow className="text-lime/90">Next step</Eyebrow>
            <h2 className="mt-3 font-display text-2xl leading-tight text-white md:text-3xl">
              Ready to explore what you can study?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
              Review the current programme catalogue, or write to the institute
              with a specific question about admissions and study pathways.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/courses" variant="lime" size="lg">
              Explore programmes
            </Button>
            <Button
              href={`mailto:${instituteContact.email}`}
              variant="ghost"
              size="lg"
              className="border border-white/25 text-white hover:bg-white/10 hover:text-white"
            >
              Email the institute
            </Button>
          </div>
        </Container>
      </section>

      <div className="border-t border-line bg-ground">
        <Container className="py-4">
          <p className="max-w-3xl font-mono text-[10px] leading-relaxed tracking-wide text-ink-muted">
            Photography illustrates technical learning themes and Nairobi urban
            context used across the CAITECH site. For a visit or facilities
            briefing,{" "}
            <Link
              href="/contact"
              className="underline decoration-line underline-offset-2 hover:text-petrol"
            >
              contact the institute
            </Link>
            .
          </p>
        </Container>
      </div>
    </>
  );
}
