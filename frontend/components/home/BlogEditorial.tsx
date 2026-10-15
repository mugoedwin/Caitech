import Link from "next/link";
import Image from "next/image";
import { getRecentPosts } from "@/lib/api/content";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { mediaUrl } from "@/lib/utils/format";
import {
  DEMO_BLOG_POSTS,
  resolveBlogImage,
} from "@/lib/content/blog-images";
import { blogTeaser } from "@/lib/content/stub-copy";

/** Homepage journal — live posts, or demo samples with real thumbnails. */
export async function BlogEditorial() {
  let posts = await getRecentPosts(3);
  if (posts.length === 0) {
    posts = DEMO_BLOG_POSTS.slice(0, 3);
  }

  return (
    <Section
      id="insights"
      className="section-tint-soft"
      eyebrow={blogTeaser.eyebrow}
      title={blogTeaser.title}
      lede={blogTeaser.emptyBody}
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-0 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface p-0 shadow-[var(--shadow-sm)] md:grid-cols-3">
        {posts.map((post, i) => {
          const resolved = resolveBlogImage(
            post,
            mediaUrl(post.featured_image),
          );
          const date = post.published_at || post.created_at;
          const isDemo =
            Array.isArray(post.tags) && post.tags.includes("demo");
          return (
            <li
              key={post.id}
              className={
                i > 0
                  ? "border-t border-line md:border-t-0 md:border-l"
                  : undefined
              }
            >
              <Link
                href={isDemo ? "/blog" : `/blog/${post.slug}`}
                className="group flex h-full flex-col no-underline outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-petrol/5">
                  <Image
                    src={resolved.src}
                    alt={resolved.alt}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                    {[
                      date
                        ? new Date(date).toLocaleDateString("en-KE", {
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
                  <h3 className="font-display text-lg leading-snug text-petrol group-hover:text-petrol-deep md:text-xl">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <span className="mt-auto pt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-petrol">
                    Read →
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-10">
        <Button href={blogTeaser.ctaHref} variant="lime">
          {blogTeaser.ctaLabel} →
        </Button>
      </div>
    </Section>
  );
}
