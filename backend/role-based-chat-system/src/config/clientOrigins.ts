const DEFAULT_CLIENT_ORIGIN = "http://localhost:3000";

export const getAllowedOrigins = (): string[] => {
  const configuredOrigins = process.env.FRONTEND_URL || DEFAULT_CLIENT_ORIGIN;

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

