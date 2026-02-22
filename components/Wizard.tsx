'use client'

import { useState } from 'react'
import { APP_TYPE_OPTIONS } from '@/types'
import { checklistItems } from '@/data/checklist'
import { DisclaimerBanner } from './Disclaimer'

interface WizardProps {
  onComplete: (selectedTypes: string[]) => void
  initialSelected?: string[]
}

function getFilteredCount(selectedTypes: string[]): number {
  if (selectedTypes.length === 0) return 0
  return checklistItems.filter((item) => {
    if (!item.appTypes || item.appTypes.length === 0) return true
    return item.appTypes.some((t) => selectedTypes.includes(t))
  }).length
}

const groupLabels: Record<string, string> = {
  'on-platform': 'On-Platform (Salesforce)',
  external: 'External Components',
  special: 'Special',
}

const groups = ['on-platform', 'external', 'special'] as const

export default function Wizard({ onComplete, initialSelected }: WizardProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected ?? [])

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const count = getFilteredCount(selected)

  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            What are you shipping?
          </h1>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            Select your app components — we&apos;ll build the exact checklist reviewers use.
          </p>
        </div>

        <DisclaimerBanner />

        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              What are you submitting?
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select all that apply. This tailors the checklist to your app.
            </p>
          </div>

          {groups.map((group) => (
            <div key={group}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                {groupLabels[group]}
              </h3>
              <div className="space-y-2">
                {APP_TYPE_OPTIONS.filter((o) => o.group === group).map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                      selected.includes(option.id)
                        ? 'border-amber-500/50 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option.id)}
                      onChange={() => toggle(option.id)}
                      className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => onComplete(selected)}
            disabled={selected.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-8 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Generate My Checklist
            {selected.length > 0 && (
              <span className="rounded-md bg-amber-600/30 px-2 py-0.5 text-xs">
                {count} items
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
