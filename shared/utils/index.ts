/**
 * Format a date to a localized string
 */
export function formatDate(date: Date | string | number, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Resolve tenant from hostname
 */
export function resolveTenantFromHostname(hostname: string): string {
  // Strip port number if present
  const host = hostname.split(':')[0] ?? ''
  const parts = host.split('.')
  if (parts.length < 2 || host === 'localhost') return 'default'
  if (parts.length >= 3) return parts[0] || 'default'
  return 'default'
}

/**
 * Check if a string is a valid JWT (basic check)
 */
export function isValidJwt(token: string): boolean {
  const parts = token.split('.')
  return parts.length === 3
}

/**
 * Parse JWT payload (no verification - only for client-side display)
 */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1]
    if (!base64) return null
    const payload = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(payload) as Record<string, unknown>
  }
  catch {
    return null
  }
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return structuredClone(obj)
}

/**
 * Create debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
