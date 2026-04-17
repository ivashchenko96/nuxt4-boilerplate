import type { PromptGroup } from '~~/shared/types/ai'

/**
 * Prompt groups and templates shown in the prompt picker UI.
 *
 * Organization:
 *  - Each group has a category and a set of related templates.
 *  - Templates with `isSuggested: true` appear in the empty state.
 *  - Templates with `variables` get an interpolation step before sending.
 *
 * To add a new prompt:
 *  1. Add a PromptTemplate entry in the relevant group.
 *  2. Bump the version string if modifying an existing template.
 *  3. The UI picks up the change automatically — no code changes needed.
 */
export const promptGroups: PromptGroup[] = [
  {
    id: 'general',
    label: 'General',
    category: 'general',
    icon: 'i-heroicons-chat-bubble-left-right',
    prompts: [
      {
        id: 'general.summarize',
        label: 'Summarize',
        description: 'Summarize the provided text concisely.',
        category: 'general',
        icon: 'i-heroicons-document-text',
        isSuggested: true,
        version: '1.0.0',
        template: 'Please summarize the following:\n\n{{text}}',
        variables: [
          { key: 'text', label: 'Text to summarize', placeholder: 'Paste text here…', required: true },
        ],
      },
      {
        id: 'general.explain',
        label: 'Explain',
        description: 'Explain a concept in plain language.',
        category: 'general',
        icon: 'i-heroicons-light-bulb',
        isSuggested: true,
        version: '1.0.0',
        template: 'Explain the following in plain language suitable for a business audience:\n\n{{concept}}',
        variables: [
          { key: 'concept', label: 'Concept', placeholder: 'e.g. "machine learning"', required: true },
        ],
      },
      {
        id: 'general.action-items',
        label: 'Extract Action Items',
        description: 'Pull actionable tasks from a meeting note or document.',
        category: 'general',
        icon: 'i-heroicons-clipboard-document-check',
        isSuggested: true,
        version: '1.0.0',
        template: 'Extract all action items from the following text. Format them as a numbered list with owner and deadline if mentioned:\n\n{{text}}',
        variables: [
          { key: 'text', label: 'Document or meeting notes', placeholder: 'Paste content here…', required: true },
        ],
      },
    ],
  },

  {
    id: 'analysis',
    label: 'Analysis',
    category: 'analysis',
    icon: 'i-heroicons-magnifying-glass-circle',
    prompts: [
      {
        id: 'analysis.swot',
        label: 'SWOT Analysis',
        description: 'Generate a SWOT analysis for a topic or initiative.',
        category: 'analysis',
        icon: 'i-heroicons-squares-2x2',
        version: '1.0.0',
        template: 'Perform a SWOT analysis for the following:\n\n**Subject:** {{subject}}\n**Context:** {{context}}\n\nFormat as a 4-quadrant table (Strengths, Weaknesses, Opportunities, Threats).',
        variables: [
          { key: 'subject', label: 'Subject', placeholder: 'e.g. "new product launch"', required: true },
          { key: 'context', label: 'Additional context', placeholder: 'Industry, market, constraints…', required: false },
        ],
      },
      {
        id: 'analysis.compare',
        label: 'Compare Options',
        description: 'Compare two or more options across defined criteria.',
        category: 'analysis',
        icon: 'i-heroicons-scale',
        version: '1.0.0',
        template: 'Compare the following options:\n\n{{options}}\n\nCriteria to evaluate: {{criteria}}\n\nFormat as a comparison table.',
        variables: [
          { key: 'options', label: 'Options (comma-separated)', placeholder: 'Option A, Option B, Option C', required: true },
          { key: 'criteria', label: 'Criteria', placeholder: 'cost, speed, reliability', required: true },
        ],
      },
      {
        id: 'analysis.metrics',
        label: 'Analyse Metrics',
        description: 'Interpret a set of metrics and provide insights.',
        category: 'analysis',
        icon: 'i-heroicons-chart-bar',
        isSuggested: true,
        version: '1.0.0',
        template: 'Analyse the following metrics and highlight key trends, anomalies, and recommendations:\n\n{{metrics}}',
        variables: [
          { key: 'metrics', label: 'Metrics or data', placeholder: 'Paste your data or describe the metrics…', required: true },
        ],
      },
    ],
  },

  {
    id: 'coding',
    label: 'Coding',
    category: 'coding',
    icon: 'i-heroicons-code-bracket',
    prompts: [
      {
        id: 'coding.review',
        label: 'Code Review',
        description: 'Review code for bugs, style, and improvements.',
        category: 'coding',
        icon: 'i-heroicons-bug-ant',
        version: '1.0.0',
        template: 'Please review the following {{language}} code for correctness, security issues, style, and potential improvements:\n\n```{{language}}\n{{code}}\n```',
        variables: [
          { key: 'language', label: 'Language', placeholder: 'TypeScript', required: true, defaultValue: 'TypeScript' },
          { key: 'code', label: 'Code', placeholder: 'Paste your code here…', required: true },
        ],
      },
      {
        id: 'coding.explain',
        label: 'Explain Code',
        description: 'Get a plain-language explanation of a code block.',
        category: 'coding',
        icon: 'i-heroicons-chat-bubble-oval-left',
        version: '1.0.0',
        template: 'Explain what the following code does in plain language, step by step:\n\n```\n{{code}}\n```',
        variables: [
          { key: 'code', label: 'Code', placeholder: 'Paste your code here…', required: true },
        ],
      },
      {
        id: 'coding.refactor',
        label: 'Refactor',
        description: 'Suggest a cleaner or more efficient implementation.',
        category: 'coding',
        icon: 'i-heroicons-arrow-path',
        version: '1.0.0',
        template: 'Refactor the following code to be cleaner, more efficient, and easier to maintain. Explain your changes:\n\n```\n{{code}}\n```',
        variables: [
          { key: 'code', label: 'Code', placeholder: 'Paste your code here…', required: true },
        ],
      },
    ],
  },

  {
    id: 'writing',
    label: 'Writing',
    category: 'writing',
    icon: 'i-heroicons-pencil-square',
    prompts: [
      {
        id: 'writing.draft',
        label: 'Draft Email',
        description: 'Draft a professional email for any situation.',
        category: 'writing',
        icon: 'i-heroicons-envelope',
        version: '1.0.0',
        template: 'Draft a professional email for the following situation:\n\n**Purpose:** {{purpose}}\n**Tone:** {{tone}}\n**Key points to include:** {{points}}',
        variables: [
          { key: 'purpose', label: 'Purpose', placeholder: 'e.g. "follow up on proposal"', required: true },
          { key: 'tone', label: 'Tone', placeholder: 'formal / friendly / urgent', required: false, defaultValue: 'formal' },
          { key: 'points', label: 'Key points', placeholder: 'List the main things to mention', required: false },
        ],
      },
      {
        id: 'writing.improve',
        label: 'Improve Writing',
        description: 'Polish and improve any piece of text.',
        category: 'writing',
        icon: 'i-heroicons-sparkles',
        version: '1.0.0',
        template: 'Improve the following text for clarity, grammar, and professional tone. Show the revised version:\n\n{{text}}',
        variables: [
          { key: 'text', label: 'Text to improve', placeholder: 'Paste your draft here…', required: true },
        ],
      },
    ],
  },

  {
    id: 'data',
    label: 'Data',
    category: 'data',
    icon: 'i-heroicons-table-cells',
    prompts: [
      {
        id: 'data.sql',
        label: 'Write SQL Query',
        description: 'Generate a SQL query from a natural language request.',
        category: 'data',
        icon: 'i-heroicons-circle-stack',
        version: '1.0.0',
        template: 'Write a SQL query for the following request:\n\n**Database type:** {{db}}\n**Schema/tables:** {{schema}}\n**Request:** {{request}}',
        variables: [
          { key: 'db', label: 'Database type', placeholder: 'PostgreSQL', required: false, defaultValue: 'PostgreSQL' },
          { key: 'schema', label: 'Schema / tables', placeholder: 'users(id, name, email), orders(id, user_id, total)', required: true },
          { key: 'request', label: 'What you need', placeholder: 'Get all orders above $100 from the last 30 days', required: true },
        ],
      },
      {
        id: 'data.transform',
        label: 'Transform Data',
        description: 'Describe a transformation and get code to do it.',
        category: 'data',
        icon: 'i-heroicons-arrow-path-rounded-square',
        version: '1.0.0',
        template: 'Write code to transform the following data:\n\n**Input format:** {{input}}\n**Desired output:** {{output}}\n**Language:** {{language}}',
        variables: [
          { key: 'input', label: 'Input format / sample', placeholder: 'CSV with columns: name, date, amount', required: true },
          { key: 'output', label: 'Desired output', placeholder: 'JSON array with totals grouped by month', required: true },
          { key: 'language', label: 'Language', placeholder: 'TypeScript', required: false, defaultValue: 'TypeScript' },
        ],
      },
    ],
  },
]
