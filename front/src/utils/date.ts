/**
 * Formats a date string into a medium date style (e.g., 23 févr. 2026).
 */
export function formatDate(value: string | null): string {
    if (!value) return '-'
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value))
}
