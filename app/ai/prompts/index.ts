/**
 * Prompt registry entry point.
 *
 * Import from here in composables and components — never import
 * `groups.ts` or `system.ts` directly from UI code.
 */
export { promptGroups } from './groups'
export { systemPrompts, defaultSystemPrompt, dataAnalystSystemPrompt } from './system'

// Re-export types for convenience
export type { PromptTemplate, PromptGroup, PromptCategory } from '~~/shared/types/ai'
