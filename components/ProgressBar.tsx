'use client'

interface ProgressBarProps {
  completed: number
  total: number
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  const allDone = pct === 100 && total > 0

  const barColor =
    pct >= 80
      ? 'bg-emerald-500'
      : pct >= 40
        ? 'bg-amber-500'
        : 'bg-red-500'

  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-xs tabular-nums text-slate-500 dark:text-slate-400">
        {allDone ? 'Ready to submit' : `${completed} / ${total} complete`}
      </span>
      <div
        className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Checklist progress: ${completed} of ${total} items complete`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-100">
        {pct}%
      </span>
    </div>
  )
}
