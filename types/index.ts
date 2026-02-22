export interface CodeExample {
  label?: string
  bad?: string
  good: string
}

export interface ChecklistItem {
  id: string
  category: string
  title: string
  subtitle: string
  details: string[]
  severity: 'critical' | 'important' | 'recommended' | 'nice'
  severityNote?: string
  docUrl?: string
  docLabel?: string
  tip?: string
  appTypes?: string[]
  codeExamples?: CodeExample[]
  howTo?: string[]
}

export interface CategoryMeta {
  description: string
  orderHint?: string
}

export interface AppTypeOption {
  id: string
  label: string
  group: 'on-platform' | 'external' | 'special'
}

export interface ChecklistState {
  selectedAppTypes: string[]
  checkedItems: Record<string, boolean>
  expandedSections: Record<string, boolean>
}

export const APP_TYPE_OPTIONS: AppTypeOption[] = [
  { id: 'managed_package_1gp', label: 'Managed Package — 1GP', group: 'on-platform' },
  { id: 'managed_package_2gp', label: 'Managed Package — 2GP', group: 'on-platform' },
  { id: 'lightning_components', label: 'Lightning Components (LWC / Aura)', group: 'on-platform' },
  { id: 'base_extension', label: 'Base + Extension Packages', group: 'on-platform' },
  { id: 'apex_callouts', label: 'Apex Callouts to External Services', group: 'on-platform' },
  { id: 'external_web_app', label: 'External Web App', group: 'external' },
  { id: 'api_endpoints', label: 'REST API / Web Services', group: 'external' },
  { id: 'mobile_ios', label: 'Mobile App — iOS', group: 'external' },
  { id: 'mobile_android', label: 'Mobile App — Android', group: 'external' },
  { id: 'desktop_app', label: 'Desktop / Client App', group: 'external' },
  { id: 'browser_extension', label: 'Browser Extension', group: 'external' },
  { id: 'marketing_cloud', label: 'Marketing Cloud App', group: 'special' },
  { id: 'quip_app', label: 'Quip App', group: 'special' },
  { id: 'paid_listing', label: 'Paid listing ($999/attempt fee)', group: 'special' },
]
