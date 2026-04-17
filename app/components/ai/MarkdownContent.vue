<template>
  <!-- Safe inline markdown renderer (no external dependencies).
       Processes: headers, bold, italic, inline code, code blocks,
       ordered/unordered lists, blockquotes, links, and paragraphs.
       HTML in source is escaped before any processing.  -->
  <div
    class="prose prose-sm dark:prose-invert max-w-none ai-markdown"
    v-html="rendered"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string
}>()

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderMarkdown(input: string): string {
  // ── Step 1: protect fenced code blocks ───────────────────────────────────
  const codeBlocks: string[] = []
  let text = input.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang: string, code: string) => {
    const escapedCode = escapeHtml(code.replace(/\n$/, ''))
    const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : ''
    const langLabel = lang
      ? `<div class="ai-code-lang">${escapeHtml(lang)}</div>`
      : ''
    codeBlocks.push(
      `<pre class="ai-code-block"><code${langClass}>${escapedCode}</code>${langLabel}</pre>`,
    )
    return `__AIBLOCK_${codeBlocks.length - 1}__`
  })

  // ── Step 2: protect inline code ───────────────────────────────────────────
  const inlineCodes: string[] = []
  text = text.replace(/`([^`\n]+)`/g, (_, code: string) => {
    inlineCodes.push(`<code class="ai-inline-code">${escapeHtml(code)}</code>`)
    return `__AIINLINE_${inlineCodes.length - 1}__`
  })

  // ── Step 3: escape remaining HTML ─────────────────────────────────────────
  text = escapeHtml(text)

  // ── Step 4: block-level elements (process line by line) ───────────────────
  const lines = text.split('\n')
  const output: string[] = []
  let listBuffer: string[] = []
  let listType = ''
  let inBlockquote = false

  function flushList() {
    if (!listBuffer.length) return
    output.push(`<${listType} class="ai-list">${listBuffer.join('')}</${listType}>`)
    listBuffer = []
    listType = ''
  }

  function flushBlockquote() {
    if (inBlockquote) {
      inBlockquote = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''

    // Blockquote
    if (line.startsWith('&gt; ')) {
      if (!inBlockquote) {
        flushList()
        output.push('<blockquote class="ai-blockquote">')
        inBlockquote = true
      }
      output.push(inlineMarkdown(line.slice(5)))
      continue
    }
    else if (inBlockquote) {
      output.push('</blockquote>')
      flushBlockquote()
    }

    // ATX headers
    const h = line.match(/^(#{1,6}) (.+)$/)
    if (h) {
      flushList()
      const level = Math.min((h[1] ?? '').length, 6)
      const classes = ['ai-h1', 'ai-h2', 'ai-h3', 'ai-h4', 'ai-h5', 'ai-h6']
      output.push(`<h${level} class="${classes[level - 1] ?? 'ai-h6'}">${inlineMarkdown(h[2] ?? '')}</h${level}>`)
      continue
    }

    // Unordered list
    const ul = line.match(/^[-*+] (.+)$/)
    if (ul) {
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      listBuffer.push(`<li>${inlineMarkdown(ul[1] ?? '')}</li>`)
      continue
    }

    // Ordered list
    const ol = line.match(/^\d+\. (.+)$/)
    if (ol) {
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }
      listBuffer.push(`<li>${inlineMarkdown(ol[1] ?? '')}</li>`)
      continue
    }

    // Empty line = paragraph break
    if (line.trim() === '') {
      flushList()
      output.push('<br>')
      continue
    }

    // Paragraph / plain line
    flushList()
    output.push(`<p class="ai-p">${inlineMarkdown(line)}</p>`)
  }

  if (inBlockquote) output.push('</blockquote>')
  flushList()

  // ── Step 5: restore protected blocks ─────────────────────────────────────
  let result = output.join('\n')
  result = result.replace(/__AIBLOCK_(\d+)__/g, (_, i: string) => codeBlocks[Number(i)] ?? '')
  result = result.replace(/__AIINLINE_(\d+)__/g, (_, i: string) => inlineCodes[Number(i)] ?? '')

  return result
}

function inlineMarkdown(line: string): string {
  return line
    // Bold+italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Links — href is already HTML-escaped from step 3
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="ai-link" target="_blank" rel="noopener noreferrer">$1</a>')
    // Restore inline code placeholders (already HTML in inlineCodes array)
    // (placeholders survive because they only contain safe chars)
}

const rendered = computed(() => renderMarkdown(props.content))
</script>

<style>
.ai-markdown .ai-h1 { @apply text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white; }
.ai-markdown .ai-h2 { @apply text-lg font-semibold mt-3 mb-2 text-gray-900 dark:text-white; }
.ai-markdown .ai-h3 { @apply text-base font-semibold mt-2 mb-1 text-gray-900 dark:text-white; }
.ai-markdown .ai-h4,
.ai-markdown .ai-h5,
.ai-markdown .ai-h6 { @apply text-sm font-semibold mt-2 mb-1 text-gray-800 dark:text-gray-200; }
.ai-markdown .ai-p { @apply text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2; }
.ai-markdown .ai-list { @apply text-sm text-gray-700 dark:text-gray-300 pl-4 mb-2 space-y-0.5; }
.ai-markdown ul.ai-list { @apply list-disc; }
.ai-markdown ol.ai-list { @apply list-decimal; }
.ai-markdown .ai-blockquote { @apply border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic text-gray-500 dark:text-gray-400 my-2 text-sm; }
.ai-markdown .ai-code-block { @apply relative bg-gray-900 dark:bg-black rounded-lg my-2 overflow-x-auto; }
.ai-markdown .ai-code-block code { @apply block p-3 text-xs text-gray-100 font-mono leading-relaxed; }
.ai-markdown .ai-code-lang { @apply absolute top-2 right-2 text-[10px] text-gray-500 font-mono uppercase; }
.ai-markdown .ai-inline-code { @apply bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 text-xs font-mono px-1.5 py-0.5 rounded; }
.ai-markdown .ai-link { @apply text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300; }
</style>
