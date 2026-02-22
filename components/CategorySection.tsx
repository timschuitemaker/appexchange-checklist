'use client'

import { CaretDown } from '@phosphor-icons/react'
import ChecklistItemComponent from './ChecklistItem'
import type { ChecklistItem, CategoryMeta } from '@/types'

interface CategorySectionProps {
  category: string
  items: ChecklistItem[]
  checkedItems: Record<string, boolean>
  expanded: boolean
  onToggleExpand: () => void
  onToggleItem: (id: string) => void
  meta?: CategoryMeta
}

export default function CategorySection({
  category,
  items,
  checkedItems,
  expanded,
  onToggleExpand,
  onToggleItem,
  meta,
}: CategorySectionProps) {
  const completed = items.filter((item) => checkedItems[item.id]).length
  const total = items.length
  const allDone = completed === total && total > 0

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50">
      <button
        onClick={onToggleExpand}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <div className="flex items-center gap-3">
          <CaretDown
            size={14}
            weight="bold"
            className={`text-slate-400 transition-transform ${expanded ? 'rotate-0' : '-rotate-90'}`}
          />
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {category}
            </h2>
            {meta?.description && (
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                {meta.description}
              </p>
            )}
          </div>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${
            allDone
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-slate-100 text-slate-400 dark:bg-slate-700/50 dark:text-slate-500'
          }`}
        >
          {completed}/{total}
        </span>
      </button>

      {expanded && (
        <div className="category-content border-t border-slate-200 dark:border-slate-700/50">
          {items.map((item, i) => (
            <div key={item.id}>
              {i > 0 && <div className="mx-4 border-t border-slate-100 dark:border-slate-700/30" />}
              <ChecklistItemComponent
                item={item}
                checked={!!checkedItems[item.id]}
                onToggle={() => onToggleItem(item.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
