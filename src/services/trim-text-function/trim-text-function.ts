export function trimText(text: string, limit: number): string {
  if (text.length <= limit) return text;

  let newText: string = text.slice(0, limit);

  while (newText.length + 2 > limit) {
    newText = newText.slice(0, newText.lastIndexOf(' '));
  }

  return `${newText}…`;
}
