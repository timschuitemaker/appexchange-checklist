'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Robot, X, Copy, Check } from '@phosphor-icons/react'
import type { ChecklistItem } from '@/types'

interface AiPromptButtonProps {
  items: ChecklistItem[]
}

const CODE_CATEGORIES = new Set(['Code Quality'])

function buildPrompt(items: ChecklistItem[]): string {
  const codeItems = items.filter((item) => CODE_CATEGORIES.has(item.category))
  const grouped = new Map<string, ChecklistItem[]>()
  for (const item of codeItems) {
    const list = grouped.get(item.category) ?? []
    list.push(item)
    grouped.set(item.category, list)
  }

  let rules = ''
  for (const [category, categoryItems] of grouped) {
    rules += `### ${category}\n\n`
    for (const item of categoryItems) {
      rules += `**${item.title}** (Severity: ${item.severity}${item.severityNote ? ` | ${item.severityNote}` : ''})\n`
      rules += `${item.subtitle}\n`
      for (const detail of item.details) {
        rules += `- ${detail}\n`
      }
      if (item.codeExamples) {
        for (const ex of item.codeExamples) {
          if (ex.bad) rules += `❌ Bad:\n\`\`\`\n${ex.bad}\n\`\`\`\n`
          if (ex.good) rules += `✅ Good:\n\`\`\`\n${ex.good}\n\`\`\`\n`
        }
      }
      rules += '\n'
    }
  }

  return `You are a Salesforce AppExchange Security Review auditor. Analyze the codebase and report every violation of the rules below.

For each violation found:
- State the rule title and severity
- Show the file path and offending code
- Show the corrected code

## Rules

${rules}---

Scan the entire codebase and list every violation grouped by category.
If no violations are found for a rule, skip it.`
}

function PromptModal({
  prompt,
  onClose,
}: {
  prompt: string
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Robot size={18} weight="bold" className="text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              AI Audit Prompt
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {copied ? (
                <>
                  <Check size={14} weight="bold" className="text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} weight="bold" />
                  Copy prompt
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4">
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Copy this prompt and paste it into your LLM along with your code to audit it against the security checklist.
          </p>
          <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {prompt}
          </pre>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function AiPromptButton({ items }: AiPromptButtonProps) {
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')

  const handleOpen = () => {
    setPrompt(buildPrompt(items))
    setOpen(true)
  }

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      <button
        onClick={handleOpen}
        className="no-print flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        <Robot size={16} weight="bold" />
        AI Audit Prompt
      </button>

      {open && <PromptModal prompt={prompt} onClose={handleClose} />}
    </>
  )
}
