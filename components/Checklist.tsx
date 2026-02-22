'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { PencilSimple, LinkSimple, Check } from '@phosphor-icons/react'
import { checklistItems, categories, categoryMeta } from '@/data/checklist'
import type { ChecklistItem } from '@/types'
import ProgressBar from './ProgressBar'
import ExportButton from './ExportButton'
import AiPromptButton from './AiPromptButton'
import CategorySection from './CategorySection'
import HowItWorksPanel from './HowItWorksPanel'
import { DisclaimerFooter } from './Disclaimer'

const STORAGE_KEY = 'appexchange-checklist-v1'

function encodeChecked(ids: string[]): string {
  return btoa(ids.join(','))
}

function decodeChecked(encoded: string): string[] {
  try {
    return atob(encoded).split(',').filter(Boolean)
  } catch {
    return []
  }
}

function getCheckedFromUrl(): Record<string, boolean> | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('c')
  if (!encoded) return null
  const ids = decodeChecked(encoded)
  if (ids.length === 0) return null
  const result: Record<string, boolean> = {}
  ids.forEach((id) => (result[id] = true))
  return result
}

function updateCheckedUrl(checked: Record<string, boolean>) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  const ids = Object.entries(checked)
    .filter(([, v]) => v)
    .map(([k]) => k)
  if (ids.length > 0) {
    url.searchParams.set('c', encodeChecked(ids))
  } else {
    url.searchParams.delete('c')
  }
  window.history.replaceState({}, '', url.toString())
}

interface ChecklistProps {
  selectedAppTypes: string[]
  onEditAppTypes: () => void
}

interface SavedState {
  checkedItems: Record<string, boolean>
  expandedSections: Record<string, boolean>
}

export default function Checklist({ selectedAppTypes, onEditAppTypes }: ChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    categories.forEach((c) => (initial[c] = true))
    return initial
  })
  const [loaded, setLoaded] = useState(false)

  const filteredItems = useMemo(() => {
    return checklistItems.filter((item) => {
      if (!item.appTypes || item.appTypes.length === 0) return true
      return item.appTypes.some((t) => selectedAppTypes.includes(t))
    })
  }, [selectedAppTypes])

  const groupedItems = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>()
    categories.forEach((c) => map.set(c, []))
    filteredItems.forEach((item) => {
      const list = map.get(item.category)
      if (list) list.push(item)
    })
    const result: [string, ChecklistItem[]][] = []
    map.forEach((items, cat) => {
      if (items.length > 0) result.push([cat, items])
    })
    return result
  }, [filteredItems])

  useEffect(() => {
    // URL params take priority over localStorage for checked items
    const urlChecked = getCheckedFromUrl()
    if (urlChecked) {
      setCheckedItems(urlChecked)
      setLoaded(true)
      return
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved: SavedState = JSON.parse(raw)
        if (saved.checkedItems) setCheckedItems(saved.checkedItems)
        if (saved.expandedSections) setExpandedSections(saved.expandedSections)
      }
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  const save = useCallback(
    (checked: Record<string, boolean>, expanded: Record<string, boolean>) => {
      // Defer URL update to avoid calling replaceState during React render
      setTimeout(() => updateCheckedUrl(checked), 0)
      try {
        const data: SavedState = { checkedItems: checked, expandedSections: expanded }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch {
        // ignore
      }
    },
    []
  )

  const toggleItem = useCallback(
    (id: string) => {
      setCheckedItems((prev) => {
        const next = { ...prev, [id]: !prev[id] }
        save(next, expandedSections)
        return next
      })
    },
    [expandedSections, save]
  )

  const toggleSection = useCallback(
    (category: string) => {
      setExpandedSections((prev) => {
        const next = { ...prev, [category]: !prev[category] }
        save(checkedItems, next)
        return next
      })
    },
    [checkedItems, save]
  )

  const [linkCopied, setLinkCopied] = useState(false)

  const handleShareLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }, [])

  const completed = filteredItems.filter((item) => checkedItems[item.id]).length
  const total = filteredItems.length

  if (!loaded) {
    return (
      <div className="flex min-h-[calc(100vh-48px)] items-center justify-center">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Sticky progress header */}
      <div className="sticky top-12 z-20 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto max-w-3xl px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            <ProgressBar completed={completed} total={total} />
            <div className="no-print flex shrink-0 gap-2">
              <button
                onClick={handleShareLink}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                {linkCopied ? (
                  <>
                    <Check size={14} weight="bold" className="text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <LinkSimple size={14} weight="bold" />
                    Share
                  </>
                )}
              </button>
              <button
                onClick={onEditAppTypes}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <PencilSimple size={14} weight="bold" />
                Edit
              </button>
              <AiPromptButton items={filteredItems} />
              <ExportButton />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* How it works */}
        <div className="mb-6">
          <HowItWorksPanel />
        </div>

        {/* Checklist categories */}
        <div className="space-y-4">
          {groupedItems.map(([category, items]) => (
            <CategorySection
              key={category}
              category={category}
              items={items}
              checkedItems={checkedItems}
              expanded={expandedSections[category] ?? true}
              onToggleExpand={() => toggleSection(category)}
              onToggleItem={toggleItem}
              meta={categoryMeta[category]}
            />
          ))}
        </div>

        <div className="mt-8">
          <DisclaimerFooter />
        </div>
      </div>
    </div>
  )
}
