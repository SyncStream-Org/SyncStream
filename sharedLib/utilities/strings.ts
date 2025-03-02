// Utility functions for string manipulation

export function camelize(str: string): string {
  const words = str.split(" ");
  return words
    .map((word, i) => {
      word = word.toLowerCase();
      return i > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    })
    .join("");
}
