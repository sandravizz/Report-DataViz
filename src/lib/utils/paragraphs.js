// A figure's `description` may be a single string or an array of strings, one
// per paragraph. Everything that renders a description runs it through this so
// both spellings come out the same on the page.
//
// Note: Svelte escapes interpolated text, so HTML in the string (`<br>`, `<p>`)
// prints literally instead of breaking the line. Split the copy into an array
// instead of reaching for markup.
export function toParagraphs(description) {
  if (Array.isArray(description)) return description.filter(Boolean);
  return description ? [description] : [];
}
