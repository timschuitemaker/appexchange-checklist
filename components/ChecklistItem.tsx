'use client'

import { useState } from 'react'
import { CheckCircle, Circle, ArrowSquareOut, Info, CaretDown } from '@phosphor-icons/react'
import type { ChecklistItem as ChecklistItemType } from '@/types'

interface ChecklistItemProps {
  item: ChecklistItemType
  checked: boolean
  onToggle: () => void
}

function renderLinkedText(text: string, className?: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/)
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (match) {
          return (
            <a
              key={i}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-blue-400/50 underline-offset-2 hover:decoration-blue-400"
            >
              {match[1]}
            </a>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

const severityConfig = {
  critical: {
    label: 'Critical',
    border: 'border-l-red-500',
    pillBg: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
  important: {
    label: 'Important',
    border: 'border-l-amber-500',
    pillBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  recommended: {
    label: 'Recommended',
    border: 'border-l-blue-400 dark:border-l-blue-500',
    pillBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  nice: {
    label: 'Nice',
    border: 'border-l-slate-300 dark:border-l-slate-600',
    pillBg: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
  },
}

export default function ChecklistItem({ item, checked, onToggle }: ChecklistItemProps) {
  const [expanded, setExpanded] = useState(false)
  const severity = severityConfig[item.severity]

  return (
    <div
      className={`border-l-4 ${severity.border} transition-checked ${
        checked ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <button
          onClick={onToggle}
          className="mt-0.5 shrink-0"
          aria-label={checked ? 'Uncheck item' : 'Check item'}
        >
          {checked ? (
            <CheckCircle size={20} weight="fill" className="text-emerald-500" />
          ) : (
            <Circle size={20} weight="bold" className="text-slate-300 dark:text-slate-600" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="flex w-full items-start justify-between gap-2 text-left"
          >
            <div className="min-w-0">
              <span className="text-sm font-medium leading-snug text-slate-900 dark:text-slate-100">
                {item.title}
              </span>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {item.subtitle}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-2">
              <span className={`severity-pill rounded-full px-2 py-0.5 text-[10px] font-semibold ${severity.pillBg}`}>
                {item.severityNote || severity.label}
              </span>
              <CaretDown
                size={14}
                weight="bold"
                className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </span>
          </button>

          {expanded && (
            <div className="item-details mt-3 space-y-3">
              {/* Bullet list */}
              {item.details.length > 0 && (
                <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* How to do it — stepper card */}
              {item.howTo && item.howTo.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    How to do it
                  </div>
                  <div className="relative ml-0.5">
                    {item.howTo.map((step, i) => {
                      const isLast = i === item.howTo!.length - 1
                      return (
                        <div key={i} className="flex gap-3">
                          {/* Timeline column */}
                          <div className="flex flex-col items-center">
                            <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                              isLast
                                ? 'border-2 border-slate-300 bg-transparent dark:border-slate-600'
                                : 'bg-slate-300 dark:bg-slate-600'
                            }`} />
                            {!isLast && (
                              <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700" />
                            )}
                          </div>
                          {/* Step text */}
                          <div className={`${isLast ? 'pb-0' : 'pb-3'} text-sm leading-relaxed text-slate-600 dark:text-slate-400`}>
                            {renderLinkedText(step)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Tip box */}
              {item.tip && (
                <div className="flex gap-2 rounded-md bg-amber-500/10 p-3">
                  <Info size={16} weight="fill" className="mt-0.5 shrink-0 text-amber-500" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">{item.tip}</p>
                </div>
              )}

              {/* Code examples */}
              {item.codeExamples && item.codeExamples.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Code examples
                  </div>
                  <div className="space-y-3">
                    {item.codeExamples.map((example, i) => (
                      <div key={i}>
                        {example.label && (
                          <p className="mb-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {example.label}
                          </p>
                        )}
                        <div className={`grid gap-2 ${example.bad ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                          {example.bad && (
                            <div>
                              <div className="mb-1 flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-red-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                                  Wrong
                                </span>
                              </div>
                              <pre className="overflow-x-auto rounded-md bg-red-950/50 p-3 font-mono text-xs text-red-200 dark:bg-red-950/30">
                                <code>{example.bad}</code>
                              </pre>
                            </div>
                          )}
                          <div>
                            {example.bad && (
                              <div className="mb-1 flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                                  Right
                                </span>
                              </div>
                            )}
                            <pre className="overflow-x-auto rounded-md bg-slate-900 p-3 font-mono text-xs text-slate-300 dark:bg-slate-950">
                              <code>{example.good}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Doc link */}
              {item.docUrl && (
                <a
                  href={item.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
                >
                  <ArrowSquareOut size={14} weight="bold" />
                  {item.docLabel || 'Documentation'}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
