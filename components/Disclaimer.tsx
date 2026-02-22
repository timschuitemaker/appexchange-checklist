'use client'

import { useState } from 'react'
import { Warning, CaretDown } from '@phosphor-icons/react'

export function DisclaimerBanner() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-900/20">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 text-left"
      >
        <Warning size={18} weight="fill" className="shrink-0 text-amber-500" />
        <span className="flex-1 text-sm font-semibold text-amber-900 dark:text-amber-200">
          Community tool — not official Salesforce documentation.{' '}
          <span className="font-normal text-amber-800 dark:text-amber-200/80">
            Always verify against the{' '}
            <span className="underline">ISVforce Guide</span>.
          </span>
        </span>
        <CaretDown
          size={14}
          weight="bold"
          className={`shrink-0 text-amber-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-amber-200/60 pt-3 text-sm text-amber-900 dark:border-amber-800/30 dark:text-amber-200/80">
          <p>
            This checklist is a best-effort guide built by members of the Salesforce ISV community
            to help you prepare for the AppExchange Security Review.
          </p>
          <p>
            Salesforce&apos;s requirements change over time, and this tool may be out of date.
            Nothing here constitutes legal or compliance advice. Passing this checklist does not
            guarantee that your app will pass the Security Review.
          </p>
          <p className="font-medium">
            Always verify requirements against the official{' '}
            <a
              href="https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packagingGuide/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-700 dark:hover:text-amber-100"
            >
              ISVforce Guide
            </a>{' '}
            and your Salesforce Partner account manager.
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300/60">
            By using this tool you agree that the contributors accept no liability for review
            failures, commercial losses, or decisions made based on this content.
          </p>
        </div>
      )}
    </div>
  )
}

export function DisclaimerFooter() {
  return (
    <footer className="no-print border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-600">
      Community tool · Not affiliated with Salesforce · No guarantees ·{' '}
      <a
        href="https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packagingGuide/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-600 hover:text-amber-500 dark:text-amber-500 dark:hover:text-amber-400"
      >
        ISVforce Guide ↗
      </a>
    </footer>
  )
}
