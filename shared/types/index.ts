// Re-export AI types
export * from './ai'

// Auth types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  roles: string[]
  permissions: string[]
  tenantId?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Tenant types
export interface Tenant {
  id: string
  slug: string
  name: string
  domain?: string
  subdomain?: string
  branding: TenantBranding
  config: TenantConfig
}

export interface TenantBranding {
  primaryColor: string
  logoUrl?: string
  faviconUrl?: string
  appName: string
}

export interface TenantConfig {
  enabledModules: string[]
  maxUsers?: number
  features: Record<string, boolean>
}

// API types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T = unknown> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  statusCode: number
  errors?: Record<string, string[]>
}

// Table types
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface TableFilter {
  key: string
  value: string | number | boolean
  operator?: 'eq' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte'
}

export interface TableState {
  page: number
  perPage: number
  sortKey: string
  sortOrder: 'asc' | 'desc'
  filters: TableFilter[]
  search: string
}

// Navigation
export interface NavItem {
  label: string
  icon?: string
  to?: string
  href?: string
  badge?: string | number
  children?: NavItem[]
  permission?: string
}
