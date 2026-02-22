'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from '@phosphor-icons/react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('appexchange-theme')
    if (stored) {
      setDark(stored === 'dark')
    } else {
      setDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('appexchange-theme', dark ? 'dark' : 'light')
  }, [dark, mounted])

  if (!mounted) return <div className="h-9 w-9" />

  return (
    <button
      onClick={() => setDark(!dark)}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
    </button>
  )
}
