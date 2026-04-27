/**
 * Escapes a part of an identifier by replacing certain characters and trimming whitespace.
 *
 * @param {string} part - The part of the identifier to escape.
 * @returns {string} The escaped identifier part.
 */
export const escapeIdentifierPart = (part: string) => {
  return part.replace("///g", "__").trim();
};
