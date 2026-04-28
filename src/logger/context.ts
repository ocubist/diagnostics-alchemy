/**
 * Builds a dot-separated context path by appending `child` to `parent`.
 *
 * Rules:
 * - Dots inside a segment are replaced with underscores to avoid ambiguity.
 * - Surrounding whitespace is trimmed.
 * - Empty/undefined segments are ignored.
 *
 * @example
 * buildContextPath("app", "auth")    // → "app.auth"
 * buildContextPath("app.auth", "login") // → "app.auth.login"
 * buildContextPath(undefined, "auth") // → "auth"
 * buildContextPath("app", undefined) // → "app"
 * buildContextPath(undefined, undefined) // → undefined
 */
export const buildContextPath = (
  parent: string | undefined,
  child: string | undefined
): string | undefined => {
  const sanitize = (s: string) => s.replace(/\./g, "_").trim();

  const p = parent?.trim() ? parent.trim() : undefined;
  const c = child?.trim() ? sanitize(child) : undefined;

  if (!p && !c) return undefined;
  if (!p) return c;
  if (!c) return p;
  return `${p}.${c}`;
};
