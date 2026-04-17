// ─────────────────────────────────────────────────────────────────────────────
// AI / LLM types
// ─────────────────────────────────────────────────────────────────────────────

// ── Messages & Conversations ──────────────────────────────────────────────────

export type AiRole = 'user' | 'assistant' | 'system' | 'tool'

export interface AiFile {
  id: string
  name: string
  size: number
  type: string
  /** Data URL or object-URL for preview */
  previewUrl?: string
}

export interface AiCitation {
  id: string
  title: string
  url?: string
  snippet?: string
  source?: string
}

export interface AiToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
}

export interface AiToolResult {
  toolCallId: string
  name: string
  result: unknown
  error?: string
  /** If true, the result should be rendered as markdown */
  isMarkdown?: boolean
}

export interface AiMessage {
  id: string
  role: AiRole
  content: string
  /** Partial content accumulated during streaming */
  streamingContent?: string
  isStreaming?: boolean
  createdAt: number
  files?: AiFile[]
  citations?: AiCitation[]
  toolCalls?: AiToolCall[]
  toolResult?: AiToolResult
  error?: string
  /** Raw model name used to generate this response */
  model?: string
}

export interface AiConversation {
  id: string
  title: string
  messages: AiMessage[]
  createdAt: number
  updatedAt: number
  /** Which prompt template (if any) was used to start this conversation */
  promptTemplateId?: string
  metadata?: Record<string, unknown>
}

// ── Provider / Model config ───────────────────────────────────────────────────

export type AiProviderKind = 'openai' | 'anthropic' | 'azure-openai' | 'custom'

export interface AiModel {
  id: string
  name: string
  contextWindow?: number
  supportsVision?: boolean
  supportsTools?: boolean
}

export interface AiProviderConfig {
  kind: AiProviderKind
  /** Base URL for the AI gateway (never hard-code keys here — use env vars) */
  baseUrl: string
  /** Selected model id */
  modelId: string
  /** Max tokens to generate */
  maxTokens?: number
  /** Temperature (0–2) */
  temperature?: number
  /** Top-p sampling */
  topP?: number
}

// ── Prompt templates ─────────────────────────────────────────────────────────

export type PromptCategory
  = | 'general'
    | 'analysis'
    | 'writing'
    | 'coding'
    | 'data'
    | 'summarization'
    | 'translation'
    | 'custom'

export interface PromptVariable {
  key: string
  label: string
  placeholder?: string
  required?: boolean
  defaultValue?: string
}

export interface PromptTemplate {
  id: string
  label: string
  description?: string
  category: PromptCategory
  /** The prompt text; supports {{variable}} interpolation */
  template: string
  /** Variables that will be filled in by the user before sending */
  variables?: PromptVariable[]
  /** Whether to show this as a "suggested starter" in empty state */
  isSuggested?: boolean
  icon?: string
  /** Version string for changelog tracking */
  version?: string
  /** Whether this is a system prompt that prepends to the conversation */
  isSystem?: boolean
}

export interface PromptGroup {
  id: string
  label: string
  category: PromptCategory
  icon: string
  prompts: PromptTemplate[]
}

// ── AI settings ───────────────────────────────────────────────────────────────

export interface AiSettings {
  provider: AiProviderConfig
  /** Whether the AI panel is enabled at all */
  enabled: boolean
  /** Whether to stream responses (false = wait for complete response) */
  streamingEnabled: boolean
  /** Whether to show citations/sources when available */
  showCitations: boolean
  /** Max number of stored conversations */
  maxConversations: number
  /** System prompt override (overrides the default system prompt) */
  systemPromptOverride?: string
}

// ── MCP (Model Context Protocol) ─────────────────────────────────────────────

export interface McpServerConfig {
  id: string
  name: string
  url: string
  /** Optional bearer token for the MCP server */
  authToken?: string
  enabled: boolean
}

export interface McpTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  serverId: string
}

export interface McpResource {
  uri: string
  name: string
  description?: string
  mimeType?: string
  serverId: string
}

export interface McpPrompt {
  name: string
  description?: string
  arguments?: Array<{ name: string, description?: string, required?: boolean }>
  serverId: string
}
