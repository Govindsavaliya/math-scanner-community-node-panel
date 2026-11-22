/** Joins truthy class names. */
export const cn = (...parts) => parts.flat().filter(Boolean).join(" ");
