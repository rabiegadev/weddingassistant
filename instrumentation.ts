/**
 * Sentry: opcjonalne — włącz, ustawiając `SENTRY_DSN` (Vercel / lokalne .env, nie w git).
 * Pełna integracja `withSentryConfig` i source map — opcjonalnie, gdy będziesz gotów na dłuższy build.
 */
export async function register() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn || !process.env.NEXT_RUNTIME) {
    return;
  }
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
    });
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({ dsn, tracesSampleRate: 0.05 });
  }
}
