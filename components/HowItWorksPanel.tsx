'use client'

import { useState } from 'react'
import { CaretDown, Info } from '@phosphor-icons/react'

const stages = [
  { step: '1', title: 'Pre-Queue Checks', time: 'Days', desc: 'Package type, versioning, credentials, and org setup are validated. Fails here get rapid feedback.' },
  { step: '2', title: 'Automated Scanning', time: '6–9 weeks', desc: 'Static analysis, dependency scanning, SOQL injection patterns, CSP violations, and hardcoded secrets.' },
  { step: '3', title: 'Manual Pen Testing', time: 'Hours', desc: 'CRUD/FLS, XSS/CSRF, external endpoint security, auth flows. They go wide, not deep.' },
  { step: '4', title: 'Results', time: 'Pass / Fail', desc: 'Fail reports list vulnerability types, not every instance. Resubmissions skip the main queue.' },
]

export default function HowItWorksPanel() {
  const [open, setOpen] = useState(false)

  return (
    <div className="no-print overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <div className="flex items-center gap-2">
          <Info size={16} weight="fill" className="text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            How the review works
          </span>
        </div>
        <CaretDown
          size={14}
          weight="bold"
          className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="category-content border-t border-slate-200 px-4 py-4 dark:border-slate-700/50">
          <div className="grid gap-3 sm:grid-cols-2">
            {stages.map((stage) => (
              <div key={stage.step} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-xs font-bold text-amber-500">{stage.step}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {stage.title}
                  </span>
                  <span className="text-xs text-slate-400">{stage.time}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            Most packages pass on the second attempt. First-time failures are normal. Budget 4–9 weeks total.
          </p>
        </div>
      )}
    </div>
  )
}
