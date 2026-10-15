import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { CourseCard } from "@/components/courses/CourseCard";
import { CatalogueControls } from "@/components/courses/CatalogueControls";
import { Button } from "@/components/ui/Button";
import {
  getCategories,
  getCourses,
  toCourseCard,
} from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";
import {
  disciplines,
  instituteMetrics,
  toolsBehindWork,
} from "@/lib/content/institute";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Browse CAITECH technical programmes across CAD, engineering, ICT, electronics, construction, and design.",
  alternates: { canonical: "/courses" },
};

type Search = {
  search?: string;
  category?: string;
  ordering?: string;
  page?: string;
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const search = sp.search?.trim() || "";
  const category = sp.category || "";
  const ordering = sp.ordering || "";
  const page = Math.max(1, Number(sp.page) || 1);

  const heroMetrics = [
    instituteMetrics[2], // 34+ Courses
    instituteMetrics[0], // 512+ Active students
    instituteMetrics[1], // 25+ Lecturers
  ];
  const toolStrip = toolsBehindWork.slice(0, 6);
  const schoolStrip = disciplines.slice(0, 4);

  return (
    <>
      <section className="page-hero overflow-hidden border-b border-line text-white">
        <Container className="w-full py-10 md:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-lime">
                Course catalogue
              </p>
              <span
                aria-hidden
                className="mt-3 block h-0.5 w-12 rounded-full bg-lime"
              />
              <h1 className="mt-4 max-w-2xl font-display text-3xl leading-[1.1] tracking-tight text-ground text-balance md:text-4xl lg:text-[2.85rem]">
                Technical programmes{" "}
                <span className="text-lime">built for practical work</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ground/75 md:text-base">
                Browse CAITECH programmes across CAD, engineering, ICT,
                electronics, construction and design — industry tools and
                pathways into real technical roles.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button href="#catalogue" variant="lime" size="lg">
                  Browse catalogue
                </Button>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] border-2 border-ground/55 bg-transparent px-5 text-base font-semibold tracking-wide text-ground transition-[color,background-color,border-color] duration-160 hover:border-ground hover:bg-ground/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cyan)]"
                >
                  Ask admissions
                </Link>
              </div>

              <dl className="mt-8 grid max-w-md grid-cols-3 gap-3 border-t border-ground/15 pt-5">
                {heroMetrics.map((m) => (
                  <div key={m.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ground/50">
                      {m.label}
                    </dt>
                    <dd className="mt-1 font-display text-2xl text-lime md:text-[1.75rem]">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-6 m-0 flex list-none flex-wrap gap-1.5 p-0">
                {toolStrip.map((t) => (
                  <li
                    key={t.name}
                    className="rounded-full border border-ground/18 bg-ground/[0.06] px-2.5 py-1 font-mono text-[10px] tracking-wide text-ground/80"
                  >
                    <span className="text-lime">{t.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative hidden sm:block">
              <div className="grid grid-cols-2 gap-3">
                {schoolStrip.map((d, i) => (
                  <Link
                    key={d.id}
                    href="#catalogue"
                    className="group relative aspect-[5/3.6] overflow-hidden rounded-[var(--radius-md)] border border-ground/15 bg-petrol shadow-[var(--shadow-sm)] transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-lime/40"
                  >
                    <Image
                      src={d.image}
                      alt={d.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width:1024px) 40vw, 20vw"
                      priority={i < 2}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-petrol-deep/95 via-petrol-deep/30 to-transparent"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-lime">
                        {d.number}
                      </p>
                      <p className="mt-0.5 font-display text-sm leading-snug text-ground">
                        {d.shortName}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ground/45">
                Six schools · industry-aligned pathways
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container id="catalogue" className="scroll-mt-24 py-10 md:py-14">
        <Suspense fallback={<ControlsSkeleton />}>
          <CatalogueShell
            search={search}
            category={category}
            ordering={ordering}
            page={page}
          />
        </Suspense>
      </Container>
    </>
  );
}

async function CatalogueShell({
  search,
  category,
  ordering,
  page,
}: {
  search: string;
  category: string;
  ordering: string;
  page: number;
}) {
  const categories = await getCategories();

  let errorMessage: string | null = null;
  let count = 0;
  let results: ReturnType<typeof toCourseCard>[] = [];
  let next: string | null = null;
  let previous: string | null = null;

  try {
    const data = await getCourses({
      page,
      search: search || undefined,
      category: category || undefined,
      ordering: ordering || undefined,
    });
    count = data.count;
    next = data.next;
    previous = data.previous;
    results = data.results.map(toCourseCard);
  } catch (e) {
    errorMessage =
      e instanceof ApiError
        ? "We couldn't load the programmes. Please try again."
        : "We couldn't load the programmes. Please try again.";
  }

  return (
    <div className="flex flex-col gap-10">
      <CatalogueControls
        categories={categories}
        activeCategory={category}
        activeSearch={search}
        activeOrdering={ordering}
      />

      {errorMessage ? (
        <ErrorState message={errorMessage} />
      ) : results.length === 0 ? (
        <EmptyState filtered={Boolean(search || category)} />
      ) : (
        <>
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
              {count} programme{count === 1 ? "" : "s"}
            </p>
          </div>

          <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((c) => (
              <li key={c.id} className="min-w-0">
                <CourseCard course={c} />
              </li>
            ))}
          </ul>

          <Pagination
            page={page}
            hasNext={Boolean(next)}
            hasPrev={Boolean(previous)}
            search={search}
            category={category}
            ordering={ordering}
          />
        </>
      )}
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="border border-line bg-surface px-6 py-16 text-center md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        Courses
      </p>
      <h2 className="mt-3 font-display text-2xl text-petrol md:text-3xl">
        {filtered
          ? "No programmes match these filters"
          : "The programme catalogue is being prepared"}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
        {filtered
          ? "Try another category or clear search to see all published programmes."
          : "Check back soon for current CAITECH programmes across CAD, engineering, ICT, and construction technology."}
      </p>
      {filtered ? (
        <div className="mt-8">
          <Button href="/courses" variant="secondary">
            Clear filters
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="border border-line bg-surface px-6 py-16 text-center md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        Unavailable
      </p>
      <h2 className="mt-3 font-display text-2xl text-petrol md:text-3xl">
        We couldn&apos;t load the programmes
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
        {message}
      </p>
      <div className="mt-8">
        <Button href="/courses" variant="lime">
          Retry
        </Button>
      </div>
    </div>
  );
}

function Pagination({
  page,
  hasNext,
  hasPrev,
  search,
  category,
  ordering,
}: {
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
  search: string;
  category: string;
  ordering: string;
}) {
  if (!hasNext && !hasPrev) return null;

  function href(p: number) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (category) sp.set("category", category);
    if (ordering) sp.set("ordering", ordering);
    if (p > 1) sp.set("page", String(p));
    const q = sp.toString();
    return q ? `/courses?${q}` : "/courses";
  }

  return (
    <nav
      className="flex items-center justify-between gap-4 border-t border-line pt-6"
      aria-label="Pagination"
    >
      {hasPrev ? (
        <Button href={href(page - 1)} variant="secondary">
          ← Previous
        </Button>
      ) : (
        <span />
      )}
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
        Page {page}
      </span>
      {hasNext ? (
        <Button href={href(page + 1)} variant="secondary">
          Next →
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}

function ControlsSkeleton() {
  return (
    <div className="flex flex-col gap-10" aria-hidden>
      <div className="h-10 max-w-md animate-pulse bg-line/60" />
      <div className="flex gap-2">
        <div className="h-8 w-16 animate-pulse bg-line/60" />
        <div className="h-8 w-20 animate-pulse bg-line/60" />
        <div className="h-8 w-24 animate-pulse bg-line/60" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border border-line">
            <div className="aspect-[16/10] animate-pulse bg-line/50" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-24 animate-pulse bg-line/60" />
              <div className="h-6 w-4/5 animate-pulse bg-line/60" />
              <div className="h-4 w-full animate-pulse bg-line/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
