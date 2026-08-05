/**
 * Single source of truth for the metadata separator.
 *
 * Rendered as a bullet (U+2022). Using a literal character instead of a JS
 * unicode escape means it also renders correctly inside JSX text nodes, where
 * escape sequences like `\u00B7` would appear literally on screen.
 */
export const METADATA_SEPARATOR = "•";
