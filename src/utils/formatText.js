export const formatTextWithWordLimit = (text, wordsPerLine = 12, maxLines = 2) => {
  if (!text) return [];
  const words = text.split(" ");
  const maxWords = wordsPerLine * maxLines;
  const limitedWords = words.slice(0, maxWords);
  const lines = [];
  for (let i = 0; i < limitedWords.length; i += wordsPerLine) {
    lines.push(limitedWords.slice(i, i + wordsPerLine).join(" "));
  }
  if (words.length > maxWords && lines.length > 0) {
    lines[lines.length - 1] += "...";
  }
  return lines;
};
