import type { PromptTemplate } from '~~/shared/types/ai'
import { promptGroups } from '~/ai/prompts'

/**
 * usePrompts — prompt template management composable
 *
 * Provides access to the prompt registry with search, filtering,
 * and variable interpolation helpers.
 */
export function usePrompts() {
  const allGroups = promptGroups

  /** Flat list of all available prompt templates */
  const allPrompts = computed<PromptTemplate[]>(() =>
    allGroups.flatMap(g => g.prompts),
  )

  /** Prompts marked as suggested starters */
  const suggestedPrompts = computed<PromptTemplate[]>(() =>
    allPrompts.value.filter(p => p.isSuggested),
  )

  /** Filter prompts by search query (label, description, category) */
  function searchPrompts(query: string): PromptTemplate[] {
    if (!query.trim()) return allPrompts.value
    const q = query.toLowerCase()
    return allPrompts.value.filter(
      p =>
        p.label.toLowerCase().includes(q)
        || p.description?.toLowerCase().includes(q)
        || p.category.toLowerCase().includes(q),
    )
  }

  /** Get a single prompt by ID */
  function getPromptById(id: string): PromptTemplate | undefined {
    return allPrompts.value.find(p => p.id === id)
  }

  /** Get all prompts in a category */
  function getPromptsByCategory(category: string): PromptTemplate[] {
    return allPrompts.value.filter(p => p.category === category)
  }

  /**
   * Interpolate a prompt template with variable values.
   *
   * @example
   * interpolate('Hello {{name}}!', { name: 'World' }) → 'Hello World!'
   */
  function interpolate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? `{{${key}}}`)
  }

  /**
   * Build the final prompt string from a template and its variable values,
   * applying any default values for missing variables.
   */
  function buildPrompt(
    prompt: PromptTemplate,
    values: Record<string, string> = {},
  ): string {
    const merged: Record<string, string> = {}
    for (const variable of prompt.variables ?? []) {
      merged[variable.key] = values[variable.key] ?? variable.defaultValue ?? ''
    }
    return interpolate(prompt.template, merged)
  }

  /**
   * Validate that all required variables have values.
   * Returns an array of missing variable keys.
   */
  function validateVariables(
    prompt: PromptTemplate,
    values: Record<string, string>,
  ): string[] {
    return (prompt.variables ?? [])
      .filter(v => v.required && !values[v.key]?.trim())
      .map(v => v.key)
  }

  return {
    allGroups,
    allPrompts,
    suggestedPrompts,
    searchPrompts,
    getPromptById,
    getPromptsByCategory,
    interpolate,
    buildPrompt,
    validateVariables,
  }
}
