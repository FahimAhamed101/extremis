type ApiErrorLike = {
  status?: number;
  data?: unknown;
  error?: unknown;
};

function parseStringPayload(payload: string): string | null {
  const trimmed = payload.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed) as { message?: unknown };
    if (parsed && typeof parsed.message === "string" && parsed.message.trim()) {
      return parsed.message.trim();
    }
  } catch {
    // keep raw text fallback
  }

  return trimmed;
}

export function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null) {
    const candidate = error as ApiErrorLike;
    const payload = candidate.data;

    if (typeof payload === "string") {
      const parsed = parseStringPayload(payload);
      if (parsed) {
        return parsed;
      }
    }

    if (
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof (payload as { message?: unknown }).message === "string"
    ) {
      const message = (payload as { message: string }).message.trim();
      if (message) {
        return message;
      }
    }

    if (typeof candidate.error === "string" && candidate.error.trim()) {
      return candidate.error.trim();
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
}
