const DEFAULT_SITE_URL = "https://www.extremis.top";

export function getSiteUrl(): string {
  const rawValue = String(process.env.NEXT_PUBLIC_SITE_URL || "")
    .trim()
    .replace(/\/+$/, "");

  const normalizedValue = rawValue
    ? /^https?:\/\//i.test(rawValue)
      ? rawValue
      : `https://${rawValue}`
    : DEFAULT_SITE_URL;

  try {
    return new URL(normalizedValue).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

