export function getAvatarText(name?: string | null): string {
  if (!name) return "";

  const safeText = name.trim();
  if (!safeText) return "";

  const words = safeText.split(" ").filter(Boolean);

  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return safeText.slice(0, 2).toUpperCase();
}
