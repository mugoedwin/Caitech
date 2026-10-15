import type { BlogPost } from "@/types/api";

/**
 * Unique, topic-specific thumbnails per demo slug + keyword rules.
 * Prefer CMS featured_image when present; otherwise map by slug/title.
 * Mix of verified local assets and Unsplash (remotePatterns already allow images.unsplash.com).
 */
const U = {
  autocad:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  bimModel:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  coordination:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
  drawings:
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
  survey:
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
  cyber:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
  portfolio:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  electronics:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  data:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  campus:
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
} as const;

const LOCAL = {
  bim: "/images/home/blog-bim.jpg",
  cad: "/images/home/discipline-cad-v2.jpg",
  architecture: "/images/home/programme-architecture.jpg",
  civil: "/images/home/programme-civil.jpg",
  construction: "/images/home/discipline-building-v2.jpg",
  engineering: "/images/home/discipline-engineering-v2.jpg",
  design: "/images/home/discipline-design-v2.jpg",
  electronics: "/images/home/discipline-electronics-v2.jpg",
  data: "/images/home/programme-data.jpg",
  ict: "/images/home/programme-ict.jpg",
  hero: "/images/home/hero-technical-practice.jpg",
  workshop: "/images/home/hero-electronics-workshop-v3.jpg",
} as const;

export type BlogImageRef = { src: string; alt: string };

/** Explicit one-to-one demo slug → image (guarantees uniqueness). */
const BY_SLUG: Record<string, BlogImageRef> = {
  "autocad-revit-workflows": {
    src: U.autocad,
    alt: "Architectural drawings and CAD documentation",
  },
  "bim-without-buzzwords": {
    src: LOCAL.bim,
    alt: "Building information model on screen",
  },
  "bim-coordination-clashes": {
    src: U.coordination,
    alt: "Engineers reviewing coordinated building model",
  },
  "cad-standards-on-site": {
    src: U.drawings,
    alt: "Construction drawings and site documentation",
  },
  "surveying-workflows": {
    src: U.survey,
    alt: "Surveying equipment in the field",
  },
  "cybersecurity-digital-hygiene": {
    src: U.cyber,
    alt: "Cybersecurity and network systems",
  },
  "student-portfolios-presentation": {
    src: U.portfolio,
    alt: "Professional project portfolio review",
  },
};

const RULES: Array<{ test: RegExp; src: string; alt: string }> = [
  {
    test: /revit|autocad|cad\b|drafting/i,
    src: LOCAL.cad,
    alt: "CAD drafting workstation",
  },
  {
    test: /bim coordination|clash|coordination/i,
    src: U.coordination,
    alt: "BIM coordination review",
  },
  {
    test: /\bbim\b|building information/i,
    src: LOCAL.bim,
    alt: "Building information modeling",
  },
  {
    test: /construction|site standard|site cad/i,
    src: LOCAL.construction,
    alt: "Construction documentation",
  },
  {
    test: /survey|geospatial|gis/i,
    src: U.survey,
    alt: "Field surveying practice",
  },
  {
    test: /cyber|security|digital hygiene|phish/i,
    src: U.cyber,
    alt: "Digital security systems",
  },
  {
    test: /portfolio|presentation|career|student/i,
    src: U.portfolio,
    alt: "Learner portfolio presentation",
  },
  {
    test: /data|python|analytics|ai\b/i,
    src: U.data,
    alt: "Data analytics workspace",
  },
  {
    test: /architect|design studio/i,
    src: LOCAL.architecture,
    alt: "Architectural design practice",
  },
  {
    test: /civil|structur|road/i,
    src: LOCAL.civil,
    alt: "Civil engineering practice",
  },
  {
    test: /electronic|pcb|embedded/i,
    src: LOCAL.electronics,
    alt: "Electronics lab work",
  },
  {
    test: /engineer|mechanical|workshop/i,
    src: LOCAL.engineering,
    alt: "Engineering workshop",
  },
];

/** Rotating unique pool so API posts without covers still differ. */
const UNIQUE_POOL: BlogImageRef[] = [
  { src: LOCAL.architecture, alt: "Architecture studio work" },
  { src: LOCAL.civil, alt: "Civil engineering context" },
  { src: LOCAL.engineering, alt: "Engineering technology" },
  { src: LOCAL.ict, alt: "ICT and software practice" },
  { src: LOCAL.data, alt: "Data and analytics" },
  { src: LOCAL.design, alt: "Design and creative tech" },
  { src: LOCAL.electronics, alt: "Electronics systems" },
  { src: LOCAL.workshop, alt: "Technical workshop" },
  { src: U.campus, alt: "Technical campus learning" },
  { src: U.electronics, alt: "Circuit and hardware systems" },
];

export function resolveBlogImage(
  post: Pick<BlogPost, "title" | "slug" | "excerpt" | "categories"> & {
    featured_image?: BlogPost["featured_image"];
  },
  mediaResolved?: string | null,
): BlogImageRef {
  if (mediaResolved) {
    return {
      src: mediaResolved,
      alt: post.title ? `${post.title} — cover` : "Article cover",
    };
  }

  if (post.slug && BY_SLUG[post.slug]) {
    return BY_SLUG[post.slug]!;
  }

  const haystack = [
    post.title,
    post.slug,
    post.excerpt,
    ...(post.categories ?? []),
  ]
    .filter(Boolean)
    .join(" ");

  for (const rule of RULES) {
    if (rule.test.test(haystack)) {
      return { src: rule.src, alt: rule.alt };
    }
  }

  let hash = 0;
  const key = post.slug || post.title || "x";
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return UNIQUE_POOL[hash % UNIQUE_POOL.length]!;
}

export const DEMO_BLOG_POSTS: BlogPost[] = [
  {
    id: -1,
    title: "AutoCAD and Revit workflows for faster documentation",
    slug: "autocad-revit-workflows",
    excerpt:
      "Practical CAD standards and Revit habits that keep drawing sets clean across multidisciplinary teams.",
    body: "",
    featured_image: null,
    categories: ["CAD", "BIM"],
    tags: ["demo"],
    status: "published",
    published_at: "2025-11-12T08:00:00Z",
    created_at: "2025-11-12T08:00:00Z",
    updated_at: "2025-11-12T08:00:00Z",
  },
  {
    id: -2,
    title: "Building Information Modeling (BIM) without the buzzwords",
    slug: "bim-without-buzzwords",
    excerpt:
      "What BIM actually changes on Kenyan projects — models, responsibilities, and handover quality.",
    body: "",
    featured_image: null,
    categories: ["BIM"],
    tags: ["demo"],
    status: "published",
    published_at: "2025-10-28T08:00:00Z",
    created_at: "2025-10-28T08:00:00Z",
    updated_at: "2025-10-28T08:00:00Z",
  },
  {
    id: -3,
    title: "BIM coordination: fewer clashes, clearer site instructions",
    slug: "bim-coordination-clashes",
    excerpt:
      "A field-ready coordination loop for architects, engineers, and contractors sharing one model.",
    body: "",
    featured_image: null,
    categories: ["BIM", "Coordination"],
    tags: ["demo"],
    status: "published",
    published_at: "2025-10-04T08:00:00Z",
    created_at: "2025-10-04T08:00:00Z",
    updated_at: "2025-10-04T08:00:00Z",
  },
  {
    id: -4,
    title: "CAD standards that survive the construction site",
    slug: "cad-standards-on-site",
    excerpt:
      "Layers, naming, and plot styles that still make sense when drawings leave the office.",
    body: "",
    featured_image: null,
    categories: ["CAD", "Construction"],
    tags: ["demo"],
    status: "published",
    published_at: "2025-09-18T08:00:00Z",
    created_at: "2025-09-18T08:00:00Z",
    updated_at: "2025-09-18T08:00:00Z",
  },
  {
    id: -5,
    title: "Surveying workflows from field capture to base drawings",
    slug: "surveying-workflows",
    excerpt:
      "How modern survey teams move points into CAD/BIM without losing accuracy or context.",
    body: "",
    featured_image: null,
    categories: ["Surveying"],
    tags: ["demo"],
    status: "published",
    published_at: "2025-08-30T08:00:00Z",
    created_at: "2025-08-30T08:00:00Z",
    updated_at: "2025-08-30T08:00:00Z",
  },
  {
    id: -6,
    title: "Cybersecurity and digital hygiene for technical professionals",
    slug: "cybersecurity-digital-hygiene",
    excerpt:
      "Password discipline, safe file exchange, and device hygiene for CAD/BIM workstations.",
    body: "",
    featured_image: null,
    categories: ["ICT", "Security"],
    tags: ["demo"],
    status: "published",
    published_at: "2025-08-08T08:00:00Z",
    created_at: "2025-08-08T08:00:00Z",
    updated_at: "2025-08-08T08:00:00Z",
  },
  {
    id: -7,
    title: "Student portfolios that read as professional work",
    slug: "student-portfolios-presentation",
    excerpt:
      "Structure, visuals, and narrative that help employers see competence — not just software screenshots.",
    body: "",
    featured_image: null,
    categories: ["Careers"],
    tags: ["demo"],
    status: "published",
    published_at: "2025-07-22T08:00:00Z",
    created_at: "2025-07-22T08:00:00Z",
    updated_at: "2025-07-22T08:00:00Z",
  },
];
