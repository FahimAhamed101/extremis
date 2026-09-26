/**
 * Server-side data access for SEO-critical pages.
 *
 * The app renders all of its content client-side through RTK Query, which means
 * the HTML Googlebot receives is an empty shell. These helpers let Server
 * Components fetch the same data at request time so real content ends up in the
 * initial HTML (and therefore in the index).
 */

/** Absolute API root reachable from the Node server (not the browser). */
export function getServerApiBase(): string {
  const raw = String(
    process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || ""
  ).trim();

  if (!raw) return "http://localhost:4000/api";

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const trimmed = withProtocol.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

/** Fetch JSON server-side with a short timeout so a slow API can't block a render. */
export async function fetchJson<T>(
  path: string,
  revalidateSeconds = 300
): Promise<T | null> {
  const url = `${getServerApiBase()}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
      headers: { Accept: "application/json" },
    });

    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // SEO pages must never 500 because the API is briefly unavailable.
    return null;
  }
}

export type PublicPostAuthor = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  profilePicture?: string;
  headline?: string;
};

/**
 * The API returns two different post shapes:
 *   GET /posts      -> { _id, author: {...}, createdAt, ... }
 *   GET /posts/:id  -> { id, authorName, authorHandle, published, ... }
 * `PostRecord` covers both and `normalizePost` flattens them into one shape.
 */
export type PostRecord = {
  _id?: string;
  id?: string;
  title?: string;
  content?: string;
  description?: string;
  author?: PublicPostAuthor;
  authorName?: string;
  authorHandle?: string;
  authorImage?: string;
  image?: string;
  images?: string[];
  group?: { name?: string } | string | null;
  attachmentUrl?: string;
  displayImageUrl?: string;
  videoUrl?: string;
  href?: string;
  likes?: number | unknown[];
  comments?: unknown[];
  shareCount?: number;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  published?: string;
};

export type PublicPost = {
  _id: string;
  title?: string;
  content?: string;
  authorName: string;
  authorUsername?: string;
  image?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt?: string;
  updatedAt?: string;
};

/** Flatten either API post shape into a single canonical record. */
export function normalizePost(raw: PostRecord): PublicPost {
  const a = raw.author;
  const fromAuthor = a
    ? [a.firstName, a.lastName].filter(Boolean).join(" ").trim()
    : "";

  return {
    _id: String(raw._id || raw.id || ""),
    title: raw.title,
    content: raw.content || raw.description,
    authorName: fromAuthor || raw.authorName || a?.username || "Updates member",
    authorUsername: a?.username || raw.authorHandle,
    image: raw.displayImageUrl || raw.image || raw.attachmentUrl || raw.images?.[0],
    likeCount: Array.isArray(raw.likes) ? raw.likes.length : Number(raw.likes || 0),
    commentCount: Array.isArray(raw.comments) ? raw.comments.length : 0,
    shareCount: Number(raw.shareCount || 0),
    createdAt: raw.createdAt || raw.published,
    updatedAt: raw.updatedAt || raw.createdAt || raw.published,
  };
}

/** Strip markup/emoji noise and collapse whitespace into a meta-description. */
export function toMetaDescription(input: string | undefined, fallback: string, max = 155): string {
  const text = String(input || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return fallback;
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Fetch every public post (paged) for the sitemap. */
export async function getAllPublicPosts(): Promise<PublicPost[]> {
  const all: PublicPost[] = [];
  const pageSize = 100;

  for (let page = 1; page <= 10; page += 1) {
    const data = await fetchJson<PostRecord[] | { posts?: PostRecord[] }>(
      `/posts?limit=${pageSize}&page=${page}`,
      600
    );
    if (!data) break;

    const batch = Array.isArray(data) ? data : data.posts || [];
    if (batch.length === 0) break;

    all.push(...batch.map(normalizePost).filter((p) => p._id));
    if (batch.length < pageSize) break;
  }

  return all;
}
