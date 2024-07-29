export function removeHTMLTags(str: string) {
  return str.replace(/<[^>]*>/g, "");
}
