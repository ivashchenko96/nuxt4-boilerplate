import type { AiMessage } from '~~/shared/types/ai'
import { defaultSystemPrompt } from '~/ai/prompts'

/**
 * useAiChat — core AI chat composable
 *
 * Sends messages to the configured AI provider gateway and streams the
 * response token-by-token using the Fetch ReadableStream API.
 *
 * Provider contract (OpenAI-compatible chat completions endpoint):
 *   POST {baseUrl}/chat/completions
 *   Body: { model, messages, stream: true, max_tokens, temperature }
 *   Response: SSE stream — each event is `data: {...}` or `data: [DONE]`
 *
 * The actual `baseUrl` comes from `NUXT_PUBLIC_AI_BASE_URL` (runtime config),
 * ensuring no key is baked into the image.  The api key / auth token is
 * injected server-side through the configured gateway or via the
 * `NUXT_AI_GATEWAY_TOKEN` environment variable on the server proxy.
 */
export function useAiChat() {
  const aiStore = useAiStore()
  const config = useRuntimeConfig()

  const baseUrl = computed(() => {
    const stored = aiStore.settings.provider.baseUrl
    return stored || (config.public.aiBaseUrl as string) || ''
  })

  /**
   * Send a user message and stream the assistant reply.
   *
   * @param content  The user's message text
   * @param files    Optional attached files (currently used to include file names in context)
   * @param conversationId  Conversation to add the message to; creates one if absent
   */
  async function sendMessage(
    content: string,
    files?: AiMessage['files'],
    conversationId?: string,
  ): Promise<void> {
    if (!content.trim() && !files?.length) return

    // Ensure an active conversation exists
    const convId = conversationId ?? aiStore.activeConversationId ?? aiStore.createConversation().id
    if (!aiStore.activeConversationId) aiStore.setActiveConversation(convId)

    // Add user message
    aiStore.addMessage(convId, {
      role: 'user',
      content: content.trim(),
      files,
    })

    // Placeholder assistant message (will be filled by streaming)
    const assistantMsg = aiStore.addMessage(convId, {
      role: 'assistant',
      content: '',
      isStreaming: true,
      model: aiStore.settings.provider.modelId,
    })

    const abortController = aiStore.startStreaming()

    try {
      const systemPrompt = aiStore.settings.systemPromptOverride
        ?? defaultSystemPrompt.template

      // Build messages for the API (include system prompt)
      const historyMessages = (aiStore.activeConversation?.messages ?? [])
        .filter(m => m.id !== assistantMsg.id && m.role !== 'system')
        .map(m => ({ role: m.role, content: buildMessageContent(m) }))

      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...historyMessages,
      ]

      const url = `${baseUrl.value}/chat/completions`

      if (aiStore.settings.streamingEnabled) {
        await streamResponse(url, apiMessages, convId, assistantMsg.id, abortController)
      }
      else {
        await fetchFullResponse(url, apiMessages, convId, assistantMsg.id, abortController)
      }
    }
    catch (err: unknown) {
      const isAbort = err instanceof DOMException && err.name === 'AbortError'
      aiStore.updateMessage(convId, assistantMsg.id, {
        isStreaming: false,
        error: isAbort ? undefined : (err instanceof Error ? err.message : 'An error occurred'),
      })
    }
    finally {
      aiStore.stopStreaming()
    }
  }

  async function streamResponse(
    url: string,
    messages: Array<{ role: string, content: string }>,
    convId: string,
    msgId: string,
    abortController: AbortController,
  ) {
    const { modelId, maxTokens, temperature, topP } = aiStore.settings.provider

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        stream: true,
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
      }),
      signal: abortController.signal,
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({})) as { error?: { message?: string } }
      throw new Error(errData?.error?.message ?? `HTTP ${response.status}`)
    }

    if (!response.body) throw new Error('No response body')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let accumulated = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (data === '[DONE]') break

        try {
          const parsed = JSON.parse(data) as {
            choices?: Array<{ delta?: { content?: string } }>
          }
          const delta = parsed.choices?.[0]?.delta?.content ?? ''
          if (delta) {
            accumulated += delta
            aiStore.updateMessage(convId, msgId, {
              content: accumulated,
              isStreaming: true,
            })
          }
        }
        catch {
          // Malformed SSE chunk — skip
        }
      }
    }

    // Finalize
    aiStore.updateMessage(convId, msgId, { isStreaming: false })
  }

  async function fetchFullResponse(
    url: string,
    messages: Array<{ role: string, content: string }>,
    convId: string,
    msgId: string,
    abortController: AbortController,
  ) {
    const { modelId, maxTokens, temperature, topP } = aiStore.settings.provider

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelId,
        messages,
        stream: false,
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
      }),
      signal: abortController.signal,
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({})) as { error?: { message?: string } }
      throw new Error(errData?.error?.message ?? `HTTP ${response.status}`)
    }

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = data.choices?.[0]?.message?.content ?? ''
    aiStore.updateMessage(convId, msgId, { content, isStreaming: false })
  }

  /** Abort the current streaming request */
  function abort() {
    aiStore.stopStreaming()
  }

  /** Retry the last assistant message by removing it and resending the last user message */
  async function retry() {
    const conv = aiStore.activeConversation
    if (!conv || !conv.id) return

    const messages = conv.messages
    // Remove last assistant message
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')
    if (lastAssistant) {
      aiStore.updateMessage(conv.id, lastAssistant.id, { content: '', isStreaming: false, error: undefined })
      aiStore.removeLastMessage(conv.id)
    }

    // Find last user message and re-send
    const lastUser = [...conv.messages].reverse().find(m => m.role === 'user')
    if (lastUser) {
      aiStore.removeLastMessage(conv.id) // remove user msg too so it gets re-added cleanly
      await sendMessage(lastUser.content, lastUser.files, conv.id)
    }
  }

  return {
    sendMessage,
    abort,
    retry,
    isStreaming: computed(() => aiStore.isStreaming),
    baseUrl,
  }
}

/** Build the text content for the API from an AiMessage (handles files) */
function buildMessageContent(msg: AiMessage): string {
  let text = msg.content
  if (msg.files?.length) {
    const fileNames = msg.files.map(f => f.name).join(', ')
    text += `\n\n[Attached files: ${fileNames}]`
  }
  return text
}
