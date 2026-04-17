import type { PromptTemplate } from '~~/shared/types/ai'

/**
 * System-level prompt templates.
 *
 * These are NOT shown to the user in the prompt picker; they are prepended
 * to every conversation as a system message.  Override via AI Settings.
 */
export const defaultSystemPrompt: PromptTemplate = {
  id: 'system.default',
  label: 'Default Assistant',
  category: 'general',
  isSystem: true,
  version: '1.0.0',
  template: `You are a helpful, accurate, and concise AI assistant integrated into an enterprise dashboard.
- Always format code with markdown code blocks.
- When referencing data, prefer structured lists or tables.
- If you are unsure, say so clearly rather than guessing.
- Keep answers focused and actionable for a business context.`,
}

export const dataAnalystSystemPrompt: PromptTemplate = {
  id: 'system.data-analyst',
  label: 'Data Analyst',
  category: 'data',
  isSystem: true,
  version: '1.0.0',
  template: `You are an expert data analyst assistant integrated into an enterprise dashboard.
- Interpret data requests precisely and highlight key insights.
- Suggest relevant visualizations or reports when appropriate.
- Format numerical results clearly with units and context.
- Flag data anomalies or outliers proactively.`,
}

export const systemPrompts: PromptTemplate[] = [
  defaultSystemPrompt,
  dataAnalystSystemPrompt,
]
