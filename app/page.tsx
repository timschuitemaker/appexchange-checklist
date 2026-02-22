'use client'

import { useState, useEffect, useRef } from 'react'
import Wizard from '@/components/Wizard'
import Checklist from '@/components/Checklist'
import ThemeToggle from '@/components/ThemeToggle'

const STORAGE_KEY = 'appexchange-checklist-v1'

interface SavedData {
  selectedAppTypes?: string[]
  checkedItems?: Record<string, boolean>
  expandedSections?: Record<string, boolean>
}

function getTypesFromUrl(): string[] | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const types = params.get('types')
  if (!types) return null
  const parsed = types.split(',').filter(Boolean)
  return parsed.length > 0 ? parsed : null
}

function updateUrl(types: string[] | null) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (types && types.length > 0) {
    url.searchParams.set('types', types.join(','))
  } else {
    url.searchParams.delete('types')
  }
  window.history.replaceState({}, '', url.toString())
}

export default function Home() {
  const [selectedAppTypes, setSelectedAppTypes] = useState<string[] | null>(null)
  const lastSelectedRef = useRef<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // URL params take priority over localStorage
    const urlTypes = getTypesFromUrl()
    if (urlTypes) {
      setSelectedAppTypes(urlTypes)
      lastSelectedRef.current = urlTypes
      setLoaded(true)
      return
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved: SavedData = JSON.parse(raw)
        if (saved.selectedAppTypes && saved.selectedAppTypes.length > 0) {
          setSelectedAppTypes(saved.selectedAppTypes)
          lastSelectedRef.current = saved.selectedAppTypes
        }
      }
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  const handleWizardComplete = (types: string[]) => {
    setSelectedAppTypes(types)
    lastSelectedRef.current = types
    updateUrl(types)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const existing = raw ? JSON.parse(raw) : {}
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...existing, selectedAppTypes: types })
      )
    } catch {
      // ignore
    }
  }

  const handleEditAppTypes = () => {
    setSelectedAppTypes(null)
    updateUrl(null)
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Persistent topbar */}
      <header className="no-print sticky top-0 z-30 flex h-12 items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-4 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          <img src="/icon.svg" alt="" width={20} height={20} className="shrink-0" />
          AppExchange Security Review
        </span>
        <ThemeToggle />
      </header>

      {!selectedAppTypes ? (
        <Wizard onComplete={handleWizardComplete} initialSelected={lastSelectedRef.current} />
      ) : (
        <Checklist
          selectedAppTypes={selectedAppTypes}
          onEditAppTypes={handleEditAppTypes}
        />
      )}
    </div>
  )
}
