/**
 * Page-level <h1> for application routes whose shell is a client component.
 *
 * The auth-gated application pages render an empty document on the server, and
 * several client components only emit <h4>/<h3> section titles — which leaves
 * the page without a top-level heading. This component guarantees exactly one
 * <h1> per route, either as a visible page title or as a screen-reader-only
 * heading when the design already carries the title visually.
 */

type PageHeadingProps = {
  title: string;
  subtitle?: string;
  /** Render for assistive tech and crawlers only — no visual change. */
  visuallyHidden?: boolean;
};

const hiddenStyle: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export default function PageHeading({
  title,
  subtitle,
  visuallyHidden = false,
}: PageHeadingProps) {
  if (visuallyHidden) {
    return <h1 style={hiddenStyle}>{title}</h1>;
  }

  return (
    <div className="container" style={{ paddingTop: "24px" }}>
      <h1
        style={{
          fontSize: "26px",
          fontWeight: 800,
          color: "#1f273f",
          margin: "0 0 6px",
          lineHeight: 1.25,
        }}
      >
        {title}
      </h1>
      {subtitle ? (
        <p style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>{subtitle}</p>
      ) : null}
    </div>
  );
}
