export function truncateText(text: string, maxWords: number = 50): { text: string; isTruncated: boolean } {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) {
    return { text, isTruncated: false };
  }
  
  return {
    text: words.slice(0, maxWords).join(' ') + '...',
    isTruncated: true
  };
}
