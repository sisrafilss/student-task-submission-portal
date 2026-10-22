/**
 * Extracts the first two initials from a user's full name.
 * Example: "Alex Johnson" -> "AJ"
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '??';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Formats a Date object or ISO string into a localized human-readable date and time.
 */
export function formatDateTime(date: string | Date): string {
  if (!date) return 'N/A';
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return 'N/A';

  return parsedDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Converts Next.js searchParams object into a sanitized URL query string.
 */
export function queryStringFormatter(
  searchParamsObj: Record<string, string | string[] | undefined>
): string {
  if (!searchParamsObj || typeof searchParamsObj !== 'object') return '';

  const queryArray = Object.entries(searchParamsObj).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
    } else if (value !== undefined && value !== null && value !== '') {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
    return '';
  });

  return queryArray.filter(Boolean).join('&');
}

