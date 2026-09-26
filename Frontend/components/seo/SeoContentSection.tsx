import Link from "next/link";
import { getSiteUrl } from "@/lib/utils/getSiteUrl";

/**
 * Server-rendered, crawlable content block for public marketing/discovery pages.
 *
 * Those pages are client components that fetch through RTK Query, so their HTML
 * arrives as an empty shell. This block is a Server Component, so its copy,
 * headings and internal links are present in the initial response and are
 * therefore indexable — without touching the auth-gated application shell.
 */

export type SeoFaq = { q: string; a: string };

type SeoContentSectionProps = {
  /** Page heading. Rendered as the page's single <h1> — these routes had none. */
  heading: string;
  intro: string;
  /** Short feature bullets rendered as a real list. */
  features?: { title: string; body: string }[];
  faqs?: SeoFaq[];
  /** Internal links to related public pages. */
  related?: { href: string; label: string }[];
};

const wrap: React.CSSProperties = {
  maxWidth: "960px",
  margin: "40px auto 0",
  padding: "0 16px 48px",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  color: "#0f172a",
};

export default function SeoContentSection({
  heading,
  intro,
  features = [],
  faqs = [],
  related = [],
}: SeoContentSectionProps) {
  const siteUrl = getSiteUrl();

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Updates",
        item: siteUrl,
      },
      { "@type": "ListItem", position: 2, name: heading },
    ],
  };

  return (
    <section style={wrap} aria-labelledby="seo-section-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <h1 id="seo-section-heading" style={{ fontSize: "26px", lineHeight: 1.3, margin: "0 0 12px" }}>
        {heading}
      </h1>
      <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#334155", margin: "0 0 24px" }}>
        {intro}
      </p>

      {features.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 28px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px",
          }}
        >
          {features.map((f) => (
            <li
              key={f.title}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <h3 style={{ fontSize: "16px", margin: "0 0 6px", color: "#0f172a" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#475569", margin: 0 }}>
                {f.body}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {faqs.length > 0 ? (
        <>
          <h3 style={{ fontSize: "19px", margin: "0 0 12px" }}>Frequently asked questions</h3>
          <div style={{ margin: "0 0 28px" }}>
            {faqs.map((f) => (
              <details
                key={f.q}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  marginBottom: "10px",
                  background: "#fff",
                }}
              >
                <summary style={{ fontWeight: 600, fontSize: "15px", cursor: "pointer" }}>{f.q}</summary>
                <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: 1.65, color: "#475569" }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </>
      ) : null}

      {related.length > 0 ? (
        <>
          <h3 style={{ fontSize: "19px", margin: "0 0 12px" }}>Explore more on Updates</h3>
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "10px", listStyle: "none", padding: 0, margin: 0 }}>
            {related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  style={{
                    display: "inline-block",
                    padding: "10px 18px",
                    borderRadius: "999px",
                    background: "#eff6ff",
                    color: "#0369a1",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
