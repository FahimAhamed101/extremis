import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteUrl } from "@/lib/utils/getSiteUrl";
import {
  fetchJson,
  normalizePost,
  toMetaDescription,
  type PostRecord,
  type PublicPost,
} from "@/lib/server/api";

export const revalidate = 300;

type PageProps = { params: Promise<{ id: string }> };

async function getPost(id: string): Promise<PublicPost | null> {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  const data = await fetchJson<PostRecord | { post?: PostRecord }>(`/posts/${id}`, 300);
  if (!data) return null;

  const raw = "_id" in data || "id" in data ? (data as PostRecord) : (data as { post?: PostRecord }).post;
  if (!raw) return null;

  const post = normalizePost(raw);
  return post._id ? post : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: "Post not found",
      robots: { index: false, follow: true },
    };
  }

  const siteUrl = getSiteUrl();
  const author = post.authorName;
  const title = post.title?.trim() || `Post by ${author}`;
  const description = toMetaDescription(
    post.content,
    `${author} shared an update on Updates – the social media network to connect with friends and family.`
  );
  const image = post.image || "/images/og-image.png";

  return {
    title,
    description,
    alternates: { canonical: `/post/${post._id}` },
    openGraph: {
      type: "article",
      url: `${siteUrl}/post/${post._id}`,
      title: `${title} | Updates`,
      description,
      images: [{ url: image, alt: title }],
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      authors: [author],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Updates`,
      description,
      images: [image],
    },
  };
}

const wrap: React.CSSProperties = {
  maxWidth: "680px",
  margin: "0 auto",
  padding: "20px 16px 64px",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  color: "#0f172a",
};

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "18px",
  marginBottom: "16px",
};

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  const siteUrl = getSiteUrl();
  const author = post.authorName;
  const image = post.image;
  const heading = post.title?.trim() || `Post by ${author}`;
  const likeCount = post.likeCount;
  const commentCount = post.commentCount;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    "@id": `${siteUrl}/post/${post._id}#post`,
    headline: heading,
    articleBody: toMetaDescription(post.content, heading, 400),
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    url: `${siteUrl}/post/${post._id}`,
    image,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: likeCount,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: commentCount,
      },
    ],
    author: {
      "@type": "Person",
      name: author,
      ...(post.authorUsername ? { url: `${siteUrl}/u/${post.authorUsername}` } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "Updates",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/icons/icon-512.png` },
    },
    isPartOf: { "@type": "WebSite", "@id": `${siteUrl}/#website` },
  };

  return (
    <main style={wrap}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" style={{ fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>
        <Link href="/" style={{ color: "#0369a1", textDecoration: "none" }}>
          Updates
        </Link>
        <span aria-hidden="true"> › </span>
        <Link href="/videos" style={{ color: "#0369a1", textDecoration: "none" }}>
          Feed
        </Link>
        <span aria-hidden="true"> › </span>
        <span>Post</span>
      </nav>

      <article style={card}>
        <header style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          <div
            aria-hidden="true"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#075985,#0284c7)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {author.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: "15px" }}>{author}</div>
            {post.createdAt ? (
              <time
                dateTime={post.createdAt}
                style={{ fontSize: "12px", color: "#64748b" }}
              >
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            ) : null}
          </div>
        </header>

        <h1 style={{ fontSize: "22px", lineHeight: 1.3, margin: "0 0 10px" }}>{heading}</h1>

        {post.content ? (
          <div style={{ fontSize: "16px", lineHeight: 1.7, color: "#334155", whiteSpace: "pre-wrap" }}>
            {post.content}
          </div>
        ) : null}

        {image ? (
          <img
            src={image}
            alt={heading}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              marginTop: "14px",
              display: "block",
            }}
          />
        ) : null}

        <footer
          style={{
            marginTop: "16px",
            paddingTop: "12px",
            borderTop: "1px solid #e2e8f0",
            fontSize: "13px",
            color: "#64748b",
            display: "flex",
            gap: "16px",
          }}
        >
          <span>{likeCount} likes</span>
          <span>{commentCount} comments</span>
          {typeof post.shareCount === "number" ? <span>{post.shareCount} shares</span> : null}
        </footer>
      </article>

      <aside
        style={{
          ...card,
          background: "linear-gradient(135deg,#075985,#0284c7)",
          border: "none",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "18px", margin: "0 0 6px", color: "#fff" }}>
          Join Updates — The Social Media Network
        </h2>
        <p style={{ margin: "0 0 14px", fontSize: "14px", color: "#e0f2fe" }}>
          Share posts, photos, videos and stories, join groups, and chat with friends and
          family on the open, privacy-friendly Facebook alternative.
        </p>
        <Link
          href="/signup"
          style={{
            display: "inline-block",
            background: "#fff",
            color: "#0369a1",
            padding: "12px 26px",
            borderRadius: "999px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Create your free account
        </Link>
      </aside>
    </main>
  );
}
