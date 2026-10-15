/**
 * Canonical course cover images — single source for every course surface.
 * Prefer API media when present; otherwise resolve by slug, then category.
 * All Unsplash URLs verified HTTP 200.
 */

const U = {
  architecture:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  bim: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
  surveying:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
  construction:
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80",
  engineering:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  coding:
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
  cybersecurity:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  web: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  networking:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  design:
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
  business:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  education:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  default:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
} as const;

/** Exact slug → cover (CAITECH catalogue + demo programmes). */
export const COURSE_IMAGE_BY_SLUG: Record<string, string> = {
  "certificate-architectural-draughtsmanship": U.architecture,
  "diploma-architecture-technology": U.architecture,
  "diploma-building-information-modelling": U.bim,
  "diploma-quantity-surveying": U.surveying,
  "advanced-diploma-project-management": U.construction,
  "certificate-autocad-fundamentals": U.engineering,
  "demo-revit-arch": U.bim,
  "demo-surveying-intro": U.surveying,
};

const CATEGORY_RULES: Array<{ test: RegExp; image: string }> = [
  { test: /bim|revit|building information/i, image: U.bim },
  { test: /architect|draught|draft/i, image: U.architecture },
  { test: /survey|quantity|qs\b/i, image: U.surveying },
  { test: /construct|project manag|site/i, image: U.construction },
  { test: /cad|autocad|solidworks|engineer/i, image: U.engineering },
  { test: /cyber|security|ethical hack/i, image: U.cybersecurity },
  { test: /\bai\b|machine learning|artificial intel/i, image: U.ai },
  { test: /data scien|analytics|visuali/i, image: U.data },
  { test: /web dev|frontend|backend|full.?stack/i, image: U.web },
  { test: /network|cisco|cloud infra/i, image: U.networking },
  { test: /program|coding|software|python|java/i, image: U.coding },
  { test: /design|ui\/ux|graphic/i, image: U.design },
  { test: /business|market|finance/i, image: U.business },
  { test: /educat|teach|train/i, image: U.education },
];

export const DEFAULT_COURSE_IMAGE = U.default;

/** Resolve the canonical cover for a course (API first, then slug/category). */
export function resolveCourseImage(opts: {
  slug?: string | null;
  title?: string | null;
  categoryName?: string | null;
  apiImageUrl?: string | null;
}): string {
  const fromApi = opts.apiImageUrl?.trim();
  if (fromApi) return fromApi;

  const slug = (opts.slug || "").trim().toLowerCase();
  if (slug && COURSE_IMAGE_BY_SLUG[slug]) return COURSE_IMAGE_BY_SLUG[slug];

  const hay = `${opts.categoryName || ""} ${opts.title || ""} ${slug}`;
  for (const rule of CATEGORY_RULES) {
    if (rule.test.test(hay)) return rule.image;
  }

  return DEFAULT_COURSE_IMAGE;
}
