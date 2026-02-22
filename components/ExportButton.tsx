'use client'

import { Printer } from '@phosphor-icons/react'

export default function ExportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      <Printer size={16} weight="bold" />
      Export / Print
    </button>
  )
}
