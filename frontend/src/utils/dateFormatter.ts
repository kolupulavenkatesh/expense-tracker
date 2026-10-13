/**
 * Formats a date string (YYYY-MM-DD) into a user-friendly display string.
 * @param dateStr - The date string in YYYY-MM-DD format.
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';

  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;

    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Returns today's date formatted as YYYY-MM-DD for form default values.
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
