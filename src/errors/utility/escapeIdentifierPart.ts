/** Replaces forward-slashes (which are the path separator in identifiers) with double-underscores. */
export const escapeIdentifierPart = (part: string): string =>
  part.replace(/\//g, "__").trim();
