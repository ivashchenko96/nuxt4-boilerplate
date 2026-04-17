import type { McpTool, McpResource, McpPrompt, McpServerConfig } from '~~/shared/types/ai'

/**
 * useMcp — Model Context Protocol (MCP) integration composable
 *
 * Provides frontend hooks for consuming resources, tools, and prompts
 * from external MCP servers.  The actual intelligence stays on the
 * external server; this composable is only the frontend client layer.
 *
 * Configuration:
 *   MCP server URLs are set via NUXT_PUBLIC_MCP_SERVER_URL (primary) or
 *   configured at runtime through the AI Settings page.
 *
 * MCP Spec Reference: https://spec.modelcontextprotocol.io
 *
 * Extension points:
 *   - Add more servers via `servers` ref (from AI settings or env).
 *   - Tool results flow back through AiMessage.toolResult.
 *   - Prompt completions flow through useAiChat.sendMessage().
 */
export function useMcp() {
  const config = useRuntimeConfig()
  const aiStore = useAiStore()

  // ── Server registry ───────────────────────────────────────────────────────

  /** Configured MCP servers (from runtime config + AI settings) */
  const servers = computed<McpServerConfig[]>(() => {
    const envUrl = config.public.mcpServerUrl as string | undefined
    const servers: McpServerConfig[] = []
    if (envUrl) {
      servers.push({ id: 'default', name: 'Default MCP Server', url: envUrl, enabled: true })
    }
    return servers
  })

  const hasServers = computed(() => servers.value.length > 0)

  // ── State ─────────────────────────────────────────────────────────────────

  const tools = ref<McpTool[]>([])
  const resources = ref<McpResource[]>([])
  const prompts = ref<McpPrompt[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ── Core request helper ───────────────────────────────────────────────────

  async function mcpRequest<T>(
    server: McpServerConfig,
    method: string,
    params?: unknown,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (server.authToken) {
      headers['Authorization'] = `Bearer ${server.authToken}`
    }

    const response = await fetch(server.url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: crypto.randomUUID(),
        method,
        params: params ?? {},
      }),
    })

    if (!response.ok) {
      throw new Error(`MCP request failed: HTTP ${response.status}`)
    }

    const json = await response.json() as { result?: T, error?: { message?: string } }
    if (json.error) throw new Error(json.error.message ?? 'MCP error')
    return json.result as T
  }

  // ── Tools ─────────────────────────────────────────────────────────────────

  /** Load available tools from all enabled MCP servers */
  async function loadTools() {
    isLoading.value = true
    error.value = null
    const loaded: McpTool[] = []
    for (const server of servers.value.filter(s => s.enabled)) {
      try {
        const result = await mcpRequest<{ tools: Array<Omit<McpTool, 'serverId'>> }>(
          server,
          'tools/list',
        )
        for (const tool of result.tools ?? []) {
          loaded.push({ ...tool, serverId: server.id })
        }
      }
      catch (e) {
        console.warn(`[mcp] Failed to load tools from ${server.name}:`, e)
      }
    }
    tools.value = loaded
    isLoading.value = false
  }

  /** Call a tool on the MCP server */
  async function callTool(
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    const tool = tools.value.find(t => t.name === toolName)
    if (!tool) throw new Error(`Tool ${toolName} not found`)
    const server = servers.value.find(s => s.id === tool.serverId)
    if (!server) throw new Error(`Server for tool ${toolName} not found`)

    return mcpRequest(server, 'tools/call', { name: toolName, arguments: args })
  }

  // ── Resources ─────────────────────────────────────────────────────────────

  /** Load available resources from all enabled MCP servers */
  async function loadResources() {
    isLoading.value = true
    error.value = null
    const loaded: McpResource[] = []
    for (const server of servers.value.filter(s => s.enabled)) {
      try {
        const result = await mcpRequest<{ resources: Array<Omit<McpResource, 'serverId'>> }>(
          server,
          'resources/list',
        )
        for (const resource of result.resources ?? []) {
          loaded.push({ ...resource, serverId: server.id })
        }
      }
      catch (e) {
        console.warn(`[mcp] Failed to load resources from ${server.name}:`, e)
      }
    }
    resources.value = loaded
    isLoading.value = false
  }

  /** Fetch the contents of a resource */
  async function getResource(uri: string): Promise<string> {
    const resource = resources.value.find(r => r.uri === uri)
    if (!resource) throw new Error(`Resource ${uri} not found`)
    const server = servers.value.find(s => s.id === resource.serverId)
    if (!server) throw new Error(`Server for resource ${uri} not found`)

    const result = await mcpRequest<{
      contents: Array<{ text?: string, blob?: string }>
    }>(server, 'resources/read', { uri })

    return result.contents?.[0]?.text ?? ''
  }

  // ── Prompts ───────────────────────────────────────────────────────────────

  /** Load available prompts from all enabled MCP servers */
  async function loadPrompts() {
    isLoading.value = true
    const loaded: McpPrompt[] = []
    for (const server of servers.value.filter(s => s.enabled)) {
      try {
        const result = await mcpRequest<{ prompts: Array<Omit<McpPrompt, 'serverId'>> }>(
          server,
          'prompts/list',
        )
        for (const prompt of result.prompts ?? []) {
          loaded.push({ ...prompt, serverId: server.id })
        }
      }
      catch (e) {
        console.warn(`[mcp] Failed to load prompts from ${server.name}:`, e)
      }
    }
    prompts.value = loaded
    isLoading.value = false
  }

  /** Get a rendered MCP prompt */
  async function getMcpPrompt(
    name: string,
    args: Record<string, string> = {},
  ): Promise<string> {
    const prompt = prompts.value.find(p => p.name === name)
    if (!prompt) throw new Error(`MCP prompt ${name} not found`)
    const server = servers.value.find(s => s.id === prompt.serverId)
    if (!server) throw new Error(`Server for prompt ${name} not found`)

    const result = await mcpRequest<{
      messages: Array<{ role: string, content: { type: string, text?: string } }>
    }>(server, 'prompts/get', { name, arguments: args })

    return result.messages?.map(m => m.content.text ?? '').join('\n') ?? ''
  }

  // ── Injects tool results into an active AI conversation ──────────────────

  async function runToolAndInjectResult(
    toolName: string,
    args: Record<string, unknown>,
    conversationId?: string,
  ) {
    const convId = conversationId ?? aiStore.activeConversationId
    if (!convId) return

    try {
      const result = await callTool(toolName, args)
      aiStore.addMessage(convId, {
        role: 'tool',
        content: JSON.stringify(result, null, 2),
        toolResult: {
          toolCallId: crypto.randomUUID(),
          name: toolName,
          result,
          isMarkdown: false,
        },
      })
    }
    catch (e) {
      const msg = e instanceof Error ? e.message : 'Tool call failed'
      aiStore.addMessage(convId, {
        role: 'tool',
        content: msg,
        toolResult: {
          toolCallId: crypto.randomUUID(),
          name: toolName,
          result: null,
          error: msg,
        },
      })
    }
  }

  return {
    servers,
    hasServers,
    tools,
    resources,
    prompts,
    isLoading,
    error,
    loadTools,
    callTool,
    loadResources,
    getResource,
    loadPrompts,
    getMcpPrompt,
    runToolAndInjectResult,
  }
}
