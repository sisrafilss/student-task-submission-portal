/**
 * Generates exact 2-letter uppercase initials for avatar fallback.
 * Rules:
 * 1. Multiple words (e.g. "Israfil Hossen") -> 1st letter of 1st word + 1st letter of last word -> "IH"
 * 2. Single word (e.g. "Anik") -> First 2 letters of word -> "AN"
 * 3. Single character (e.g. "A") -> "A"
 * 4. Empty or invalid string -> "U"
 */
export const getAvatarInitials = (name?: string | null): string => {
  if (!name || typeof name !== 'string') return 'U';
  const trimmed = name.trim();
  if (!trimmed) return 'U';

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const firstInitial = parts[0][0];
    const lastInitial = parts[parts.length - 1][0];
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  // Single word
  const single = parts[0];
  if (single.length >= 2) {
    return single.slice(0, 2).toUpperCase();
  }
  return single.toUpperCase();
};

