export const normalizeImageUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;

  try {
    // Local backend often runs on HTTP, but some APIs may return HTTPS by mistake.
    // This prevents SSL errors like net::ERR_SSL_PROTOCOL_ERROR on localhost.
    if (url.startsWith("https://localhost")) {
      return url.replace("https://", "http://");
    }

    return url;
  } catch {
    return url ?? undefined;
  }
};


