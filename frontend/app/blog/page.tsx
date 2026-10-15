import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { editorialArticles } from "@/lib/content/institute";
import { Button } from "@/components/ui/Button";
import { getBlogPosts } from "@/lib/api/content";
import { ApiError } from "@/lib/api/client";
import { mediaUrl } from "@/lib/utils/format";
import {
  DEMO_BLOG_POSTS,
  resolveBlogImage,
} from "@/lib/content/blog-images";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Technical notes from CAITECH on CAD, BIM, engineering software, ICT and digital construction practice in Kenya.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "CAITECH Insights",
    description:
      "Editorial notes on technical programmes, tools and careers from CAITECH Global Institute.",
  },
};

type Search = { page?: string; search?: string };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search?.trim() || "";

  let error: string | null = null;
  let count = 0;
  let results: Awaited<ReturnType<typeof getBlogPosts>>["results"] = [];
  let next: string | null = null;
  let previous: string | null = null;

  try {
    const data = await getBlogPosts({
      page,
      search: search || undefined,
    });
    count = data.count;
    results = data.results;
    next = data.next;
    previous = data.previous;
  } catch (e) {
    error =
      e instanceof ApiError
        ? "We couldn't load the journal. Please try again."
        : "We couldn't load the journal. Please try again.";
  }

  const usingDemo = !error && !search && results.length === 0;
  if (usingDemo) {
    results = DEMO_BLOG_POSTS;
    count = DEMO_BLOG_POSTS.length;
  }

  const topicChips = [
    "CAD",
    "BIM",
    "Engineering",
    "ICT",
    "Construction",
    "Design",
  ] as const;
  const featuredTopics = editorialArticles.slice(0, 3);
  const featuredPost = results[0] ?? null;
  const featuredImg = featuredPost
    ? resolveBlogImage(featuredPost)
    : null;

  return (
    <>
      <section className="page-hero overflow-hidden border-b border-line text-white">
        <Container className="w-full py-10 md:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-lime">
                Institute journal
              </p>
              <span
                aria-hidden
                className="mt-3 block h-0.5 w-12 rounded-full bg-lime"
              />
              <h1 className="mt-4 max-w-2xl font-display text-3xl leading-[1.1] tracking-tight text-ground text-balance md:text-4xl lg:text-[2.85rem]">
                Insights from the{" "}
                <span className="text-lime">institute</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ground/75 md:text-base">
                Notes on CAD, BIM, engineering software, ICT and digital
                construction — written for learners and practitioners building
                real technical work in Kenya.
              </p>

              <form
                role="search"
                action="/blog"
                className="mt-6 flex max-w-md gap-2"
              >
                <label htmlFor="blog-hero-q" className="sr-only">
                  Search articles
                </label>
                <input
                  id="blog-hero-q"
                  name="search"
                  type="search"
                  defaultValue={search}
                  placeholder="Search CAD, BIM, ICT…"
                  className="h-12 min-w-0 flex-1 rounded-[var(--radius-md)] border border-ground/25 bg-ground/10 px-4 text-base text-ground placeholder:text-ground/40 outline-none transition-colors focus:border-lime/50 focus:bg-ground/[0.14] focus-visible:ring-2 focus-visible:ring-lime/40"
                />
                <Button type="submit" variant="lime" size="lg">
                  Search
                </Button>
              </form>

              <ul className="mt-5 m-0 flex list-none flex-wrap gap-2 p-0">
                {topicChips.map((t) => (
                  <li key={t}>
                    <Link
                      href={`/blog?search=${encodeURIComponent(t)}`}
                      className="inline-flex rounded-full border border-ground/20 bg-ground/[0.06] px-3 py-1 font-mono text-[11px] tracking-wide text-ground/75 transition-colors hover:border-lime/45 hover:text-lime"
                    >
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              {featuredPost && featuredImg ? (
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group relative block overflow-hidden rounded-[var(--radius-lg)] border border-ground/15 bg-petrol shadow-[var(--shadow-md)]"
                >
                  <div className="relative aspect-[16/11] max-h-[min(22rem,42svh)] w-full sm:max-h-none">
                    <Image
                      src={featuredImg.src}
                      alt={featuredImg.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width:1024px) 100vw, 42vw"
                      priority
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-petrol-deep via-petrol-deep/50 to-transparent"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-lime">
                      Featured · Latest
                    </p>
                    <p className="mt-2 font-display text-xl leading-snug text-ground text-balance md:text-2xl">
                      {featuredPost.title}
                    </p>
                    {featuredPost.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ground/70">
                        {featuredPost.excerpt}
                      </p>
                    ) : null}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lime transition-transform group-hover:translate-x-0.5">
                      Read article
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="overflow-hidden rounded-[var(--radius-lg)] border border-ground/15 bg-petrol/80 p-1 shadow-[var(--shadow-md)]">
                  <ul className="m-0 list-none divide-y divide-ground/10 p-0">
                    {featuredTopics.map((a, i) => (
                      <li key={a.slug}>
                        <Link
                          href={a.href}
                          className="group flex gap-4 p-4 transition-colors hover:bg-ground/[0.06] md:p-5"
                        >
                          <span className="font-mono text-[11px] text-lime">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-base leading-snug text-ground group-hover:text-lime md:text-lg">
                              {a.title}
                            </span>
                            <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-ground/55">
                              {a.excerpt}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ground/45">
                Practice notes · tools · field methods
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container id="journal" className="scroll-mt-24 py-10 md:py-14">
        {error ? (
          <div className="border border-line bg-surface px-6 py-14 text-center">
            <h2 className="font-display text-2xl text-petrol">
              We couldn&apos;t load the journal
            </h2>
            <p className="mt-3 text-sm text-ink-muted">{error}</p>
            <div className="mt-8">
              <Button href="/blog" variant="lime">
                Retry
              </Button>
            </div>
          </div>
        ) : results.length === 0 && !usingDemo ? (
          <div className="border border-line bg-surface px-6 py-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              Journal
            </p>
            <h2 className="mt-3 font-display text-2xl text-petrol md:text-3xl">
              {search
                ? "No articles match this search"
                : "Articles are being prepared"}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
              {search
                ? "Try another term, or browse all published notes."
                : "Check back soon for technical notes on programmes, tools and practice."}
            </p>
            {search ? (
              <div className="mt-8">
                <Button href="/blog" variant="secondary">
                  Clear search
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                {count} article{count === 1 ? "" : "s"}
                {search ? (
                  <span className="text-petrol"> · matching “{search}”</span>
                ) : null}
              </p>
              {search ? (
                <Button href="/blog" variant="secondary" size="sm">
                  Clear search
                </Button>
              ) : null}
            </div>

            {usingDemo ? (
              <p className="mb-4 rounded-[var(--radius-md)] border border-line bg-[color-mix(in_oklab,var(--color-cyan)_7%,var(--color-ground))] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                Demo content — sample articles with topic imagery while CMS posts are empty
              </p>
            ) : null}
            <ul className="list-none space-y-0 divide-y divide-line border border-line bg-ground p-0 shadow-[var(--shadow-sm)]">
              {results.map((post) => {
                const resolved = resolveBlogImage(
                  post,
                  mediaUrl(post.featured_image),
                );
                const date = post.published_at || post.created_at;
                const isDemo =
                  usingDemo ||
                  (Array.isArray(post.tags) && post.tags.includes("demo"));
                return (
                  <li key={post.id}>
                    <Link
                      href={isDemo ? "/blog" : `/blog/${post.slug}`}
                      className="group blog-card grid gap-4 p-5 no-underline transition-colors hover:bg-surface sm:grid-cols-[minmax(11rem,15rem)_1fr] sm:items-start md:p-6"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-[var(--radius-md)] bg-petrol/5 ring-1 ring-[color-mix(in_oklab,var(--color-line)_75%,var(--color-petrol)_25%)] sm:aspect-[16/10]">
                        <Image
                          src={resolved.src}
                          alt={resolved.alt}
                          fill
                          sizes="(max-width:640px) 100vw, 240px"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                          {[
                            date
                              ? new Date(date).toLocaleDateString("en-KE", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : null,
                            post.categories?.[0],
                            isDemo ? "Demo" : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        <h2 className="mt-2 font-display text-xl text-petrol group-hover:text-petrol-deep md:text-2xl">
                          {post.title}
                        </h2>
                        {post.excerpt ? (
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                            {post.excerpt}
                          </p>
                        ) : null}
                        <span className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-petrol">
                          Read →
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {(next || previous) && (
              <nav
                className="mt-10 flex items-center justify-between border-t border-line pt-6"
                aria-label="Pagination"
              >
                {previous ? (
                  <Button
                    href={page > 2 ? `/blog?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}` : search ? `/blog?search=${encodeURIComponent(search)}` : "/blog"}
                    variant="secondary"
                  >
                    ← Previous
                  </Button>
                ) : (
                  <span />
                )}
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                  Page {page}
                </span>
                {next ? (
                  <Button
                    href={`/blog?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                    variant="secondary"
                  >
                    Next →
                  </Button>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </>
        )}
      </Container>
    </>
  );
}
